import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Session } from '@supabase/supabase-js';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import BottomSheet from '../../components/BottomSheet';
import { supabase } from '../../lib/supabase';
import {
  checkAdjacentDays,
  checkDayExists,
  createDay,
  formatDate,
  getDayId,
  getSession
} from '../../lib/supabase-functions';

const goalData = {
  arms: { score: 85, explanation: "Well-defined and muscular arms." },
  chest: { score: 80, explanation: "Good chest definition, though can be fuller." },
  abs: { score: 90, explanation: "Excellent abdominal definition and low body fat." },
  legs: { score: 75, explanation: "Strong, but could use more definition." },
  back: { score: null, explanation: "Not visible." },
  fat: { score: 90, explanation: "Low body fat percentage." },
  potential: { score: 85, explanation: "High potential for further development." },
  genetics: { score: 80, explanation: "Good genetics evident in muscle shape and low fat." },
  wellbeing: { score: 85, explanation: "Appears healthy and fit." },
  symmetry: { score: 80, explanation: "Good symmetry between different body parts." },
  muscleDefinition: { score: 90, explanation: "Excellent muscle definition overall." },
  posture: { score: 85, explanation: "Good posture visible." },
  flexibility: { score: null, explanation: "Not visible." },
  proportions: { score: 80, explanation: "Good proportions, could improve leg-to-upper-body ratio." },
  vascularity: { score: 85, explanation: "Visible vascularity indicating low body fat." },
  muscleMass: { score: 80, explanation: "Good muscle mass, but room for growth in some areas." },
  bodyComposition: { score: 90, explanation: "Excellent body composition with lean muscle." },
};

const windowWidth = Dimensions.get('window').width;
const boxWidth = (windowWidth - 60) / 2; // 60 is the total horizontal padding

// Define the type for the metric
type Metric = {
  key: string;
  value: {
    score: number | null;
    explanation: string;
  };
};

// Define the RootStackParamList type
type RootStackParamList = {
  Onboarding: undefined;
  // Add other screen names and their params here
};

// Update the type of navigation
type NavigationProp = StackNavigationProp<RootStackParamList>;

type SortOption = 'alphabetical' | 'score';

// Mock data for the chart
const mockChartData = {
  labels: ['1 Jun', '8 Jun', '15 Jun', '22 Jun', '29 Jun', '6 Jul'],
  datasets: [
    {
      data: [65, 70, 75, 72, 80, 85],
    },
  ],
};

export default function DailyScreen() {
  const navigation = useNavigation<NavigationProp>();
  const router = useRouter(); // Added router
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [session, setSession] = useState<Session | null>(null);
  const [dayId, setDayId] = useState<string | null>(null);
  const [hasPreviousDay, setHasPreviousDay] = useState(false);
  const [hasNextDay, setHasNextDay] = useState(false);
  const [dayData, setDayData] = useState<{ id: string, created_at: string } | null>(null);

  const goalEntries = Object.entries(goalData);
  const [sortOption, setSortOption] = useState<SortOption>('alphabetical');

  const sortedGoalEntries = useMemo(() => {
    return Object.entries(goalData).sort((a, b) => {
      if (sortOption === 'alphabetical') {
        return a[0].localeCompare(b[0]);
      } else {
        return (b[1].score || 0) - (a[1].score || 0);
      }
    });
  }, [goalData, sortOption]);

  const handleOpenBottomSheet = (metric: Metric | 'settings') => {
    if (metric === 'settings') {
      // Handle settings
    } else {
      setSelectedMetric(metric);
      setBottomSheetVisible(true);
    }
  };

  const handleCloseBottomSheet = () => {
    setBottomSheetVisible(false);
  };

  const toggleSortOption = () => {
    setSortOption(prev => prev === 'alphabetical' ? 'score' : 'alphabetical');
  };

  const handleDateChange = async (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);

    await fetchOrCreateDayData(newDate);
    const { hasPreviousDay, hasNextDay } = await checkAdjacentDays(newDate);
    setHasPreviousDay(hasPreviousDay);
    setHasNextDay(hasNextDay);
  };

  const fetchOrCreateDayData = async (date: Date) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const newDayData = await createDay(date, user.id);
      if (newDayData) {
        setDayData(newDayData);
        setDayId(newDayData.id);
      } else {
        console.error('Failed to fetch or create day data');
        setDayData(null);
        setDayId(null);
      }
    } else {
      console.error('User not authenticated');
      setDayData(null);
      setDayId(null);
    }
  };

  const checkAndFetchDayData = async (date: Date) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const dayExists = await checkDayExists(date, user.id);
      if (dayExists) {
        const fetchedDayData = await getDayId(date);
        if (fetchedDayData) {
          setDayData(fetchedDayData);
          setDayId(fetchedDayData.id);
        }
      } else {
        setDayData(null);
        setDayId(null);
      }
    } else {
      console.error('User not authenticated');
    }
  };

  const createTodayDay = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const today = new Date();
      const newDayData = await createDay(today, user.id);
      if (newDayData) {
        setDayData(newDayData);
        setDayId(newDayData.id);
        setCurrentDate(today);
        const { hasPreviousDay, hasNextDay } = await checkAdjacentDays(today);
        setHasPreviousDay(hasPreviousDay);
        setHasNextDay(hasNextDay);
      }
    } else {
      console.error('User not authenticated');
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      const fetchedSession = await getSession();
      setSession(fetchedSession);
    };

    fetchSession();
  }, []);

  useEffect(() => {
    fetchOrCreateDayData(currentDate);
  }, [currentDate]);

  useEffect(() => {
    const checkSessionAndDay = async () => {
      const fetchedSession = await getSession();
      setSession(fetchedSession);

      if (fetchedSession?.user.id) {
        const today = new Date();
        await fetchOrCreateDayData(today);
        const { hasPreviousDay, hasNextDay } = await checkAdjacentDays(today);
        setHasPreviousDay(hasPreviousDay);
        setHasNextDay(hasNextDay);
      }
    };

    checkSessionAndDay();
  }, []);

  useEffect(() => {
    checkAdjacentDays(currentDate);
  }, [currentDate]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await checkAndFetchDayData(currentDate);
      } else {
        console.error('User not authenticated');
      }
    };

    fetchData();
  }, [currentDate]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.streakContainer}>
            <Text style={styles.streakText}>
              <Text style={styles.streakNumber}>1</Text>
              <Text style={styles.fireEmoji}>🔥</Text> day streak
            </Text>
          </View>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => handleOpenBottomSheet('settings')}
          >
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <LinearGradient
          colors={['#8A2BE2', '#9400D3']}
          style={styles.progressCard}
        >
          <Text style={styles.progressTitle}>Your progress</Text>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }}
            style={styles.profileImage}
          />
        </LinearGradient>

        <Text style={styles.routineTitle}>Your routine</Text>
        <TouchableOpacity style={styles.routineCard}>
          <Text style={styles.routineText}>
            Scan to get your daily glow up routine
          </Text>
          <Link href="../CameraScreen" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>
          </Link>
        </TouchableOpacity>

        <View style={styles.metricsHeader}>
          <Text style={styles.metricsTitle}>Your Metrics</Text>
          <View style={styles.dateContainer}>
            {hasPreviousDay && (
              <TouchableOpacity onPress={() => handleDateChange('prev')}>
                <Ionicons name="chevron-back" size={20} color="white" />
              </TouchableOpacity>
            )}
            <Text style={styles.dateText}>
              {dayData ? formatDate(dayData.created_at) : 'No data'}
            </Text>
            {hasNextDay && (
              <TouchableOpacity onPress={() => handleDateChange('next')}>
                <Ionicons name="chevron-forward" size={20} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {!dayData && (
          <Button
            title="Create Today's Entry"
            onPress={createTodayDay}
            color="#8A2BE2"
          />
        )}
        <View style={styles.metricsContainer}>
          {dayData ? (
            Object.entries(goalData).map(([key, value]) => (
              <TouchableOpacity
                key={key}
                style={styles.metricItem}
                onPress={() => handleOpenBottomSheet({ key, value })}
              >
                <Text style={styles.metricTitle}>{key}</Text>
                <Text style={styles.metricScore}>{value.score !== null ? value.score : '-'}</Text>
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { width: value.score !== null ? `${value.score}%` : '0%' }
                    ]} 
                  />
                </View>
                <Text style={styles.metricExplanation}>{value.explanation}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noDataText}>No data available for this date.</Text>
          )}
        </View>
      </ScrollView>
      <BottomSheet
        isVisible={isBottomSheetVisible}
        onClose={handleCloseBottomSheet}
      >
        {selectedMetric && (
          <ScrollView style={styles.metricDetailContainer}>
            <Text style={styles.metricDetailTitle}>{selectedMetric.key}</Text>
            <View style={styles.scoreContainer}>
              <Text style={styles.metricDetailScore}>
                {selectedMetric.value.score !== null ? selectedMetric.value.score : 'N/A'}
              </Text>
              <View style={styles.progressBarWrapper}>
                <View style={styles.progressBarContainerLarge}>
                  <LinearGradient
                    colors={['#8A2BE2', '#9400D3']}
                    style={[
                      styles.progressBarLarge,
                      { width: selectedMetric.value.score !== null ? `${selectedMetric.value.score}%` : '0%' }
                    ]}
                  />
                </View>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressLabel}>0</Text>
                  <Text style={styles.progressLabel}>100</Text>
                </View>
              </View>
            </View>
            <Text style={styles.metricDetailExplanation}>{selectedMetric.value.explanation}</Text>
            <Text style={styles.chartTitle}>Progress Over Time</Text>
            <LineChart
              data={mockChartData}
              width={Dimensions.get('window').width - 40} // 40 for padding
              height={220}
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: '#1A1A1A',
                backgroundGradientFrom: '#1A1A1A',
                backgroundGradientTo: '#1A1A1A',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(138, 43, 226, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#9400D3',
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>Tips</Text>
              <TouchableOpacity style={styles.tipsCard}>
                <Text style={styles.tipsText}>
                  Tap to get personalized tips for improvement
                </Text>
                <TouchableOpacity style={styles.tipsButton}>
                  <Text style={styles.tipsButtonText}>View Tips</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.improveButton}>
              <Text style={styles.improveButtonText}>How to Improve</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10, // Reduced margin
    marginTop: 20,
  },
  streakContainer: {
    flex: 1,
  },
  streakText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  streakNumber: {
    fontSize: 28,
  },
  fireEmoji: {
    fontSize: 24,
  },
  progressCard: {
    borderRadius: 20,
    padding: 20,
    height: 150,
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  viewButton: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  viewButtonText: {
    color: '#8A2BE2',
    fontWeight: 'bold',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  routineTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  routineCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  routineText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  metricsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -7.5, // Increased negative margin
  },
  metricItem: {
    width: (windowWidth - 55) / 2, // 55 = 20 (scrollView padding) + 15 (gap between items)
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15, // Increased bottom margin
    marginHorizontal: 7.5, // Increased horizontal margin
  },
  metricTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textTransform: 'capitalize',
    color: 'white',
  },
  metricScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#333',
    borderRadius: 5,
    marginBottom: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#8A2BE2',
    borderRadius: 5,
  },
  metricExplanation: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  settingsButton: {
    padding: 5,
  },
  metricDetailContainer: {
    padding: 20,
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: Dimensions.get('window').height * 0.8, // Limit the height to 80% of screen height
  },
  metricDetailTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textTransform: 'capitalize',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  metricDetailScore: {
    fontSize: 36, // Reduced from 48
    fontWeight: 'bold',
    color: 'white', // Changed from '#8A2BE2' to white
    marginRight: 20,
    width: 60, // Reduced from 80
    textAlign: 'center',
  },
  progressBarWrapper: {
    flex: 1,
  },
  progressBarContainerLarge: {
    height: 20,
    backgroundColor: '#333',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBarLarge: {
    height: '100%',
    borderRadius: 10,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  progressLabel: {
    color: '#999',
    fontSize: 12,
  },
  metricDetailExplanation: {
    fontSize: 18,
    color: '#CCCCCC',
    marginBottom: 20,
    lineHeight: 24,
  },
  improveButton: {
    backgroundColor: '#8A2BE2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  improveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#8A2BE2',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  metricsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sortButton: {
    padding: 5,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
    padding: 5,
  },
  dateText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    marginHorizontal: 10,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 10,
  },
  tipsContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  tipsCard: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
  },
  tipsText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 10,
  },
  tipsButton: {
    backgroundColor: '#8A2BE2',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  tipsButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noDataText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
});
