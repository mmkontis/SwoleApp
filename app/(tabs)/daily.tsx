import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomSheet from '../../components/BottomSheet';
// import BottomSheetContent from '../../components/BottomSheetContent'; // Removed as it's not needed
import OnboardingScreen from '../../components/OnboardingScreen'; // Ensure this path is correct
import SubscriptionPopup from '../../components/SubscriptionPopup'; // Ensure this path is correct

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

export default function DailyScreen() {
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [bottomSheetContent, setBottomSheetContent] = useState<'settings' | 'other' | 'onboarding' | 'subscription'>('settings');
  const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);
  const goalEntries = Object.entries(goalData);

  const handleOpenBottomSheet = (type: 'settings' | 'other' | 'onboarding' | 'subscription', metric: Metric | null = null) => {
    setBottomSheetContent(type);
    setSelectedMetric(metric);
    setBottomSheetVisible(true);
  };

  const handleCloseBottomSheet = () => {
    setBottomSheetVisible(false);
  };

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
        </TouchableOpacity>

        <Text style={styles.metricsTitle}>Your Metrics</Text>
        <View style={styles.metricsContainer}>
          {goalEntries.map(([key, value]) => (
            <TouchableOpacity
              key={key}
              style={styles.metricItem}
              onPress={() => handleOpenBottomSheet('other', { key, value })}
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
          ))}
        </View>

        {/* Add buttons for OnboardingScreen and SubscriptionPopup */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleOpenBottomSheet('onboarding')}
        >
          <Text style={styles.buttonText}>Open Onboarding</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleOpenBottomSheet('subscription')}
        >
          <Text style={styles.buttonText}>Open Subscription</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomSheet
        isVisible={isBottomSheetVisible}
        onClose={handleCloseBottomSheet}
      >
        {bottomSheetContent === 'settings' ? (
          // <BottomSheetContent type="settings" onClose={handleCloseBottomSheet} /> // Removed as it's not needed
          <View style={styles.metricDetailContainer}>
            <Text style={styles.metricDetailTitle}>Settings</Text>
            {/* Add your settings content here */}
          </View>
        ) : bottomSheetContent === 'onboarding' ? (
          <OnboardingScreen />
        ) : bottomSheetContent === 'subscription' ? (
          <SubscriptionPopup />
        ) : (
          selectedMetric && (
            <View style={styles.metricDetailContainer}>
              <Text style={styles.metricDetailTitle}>{selectedMetric.key}</Text>
              <Text style={styles.metricDetailScore}>{selectedMetric.value.score !== null ? selectedMetric.value.score : '-'}</Text>
              <Text style={styles.metricDetailExplanation}>{selectedMetric.value.explanation}</Text>
            </View>
          )
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
    marginBottom: 20,
    marginTop: 20, // Added top margin

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
  },
  metricsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricItem: {
    width: boxWidth,
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
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
  },
  metricDetailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  metricDetailScore: {
    fontSize: 20,
    color: 'white',
    marginBottom: 10,
  },
  metricDetailExplanation: {
    fontSize: 16,
    color: 'white',
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
});