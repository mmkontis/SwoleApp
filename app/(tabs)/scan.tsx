import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Define the type for the route parameters
export type RootStackParamList = {
  ScanScreen: { photoUri?: string };
  CameraScreen: undefined;
};

type ScanScreenRouteProp = RouteProp<RootStackParamList, 'ScanScreen'>;

const { width: screenWidth } = Dimensions.get('window');
const itemWidth = screenWidth * 0.7;
const sideMargin = screenWidth * 0.15;

export default function ScanScreen() {
  const navigation = useNavigation();
  const route = useRoute<ScanScreenRouteProp>();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Body scan');
  const [activePage, setActivePage] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const params = route.params;
    if (params?.photoUri) {
      setPhotoUri(params.photoUri);
    }
  }, [route]);

  const bodyScanItems = [
    { id: 1, colors: ['#4c669f', '#3b5998', '#192f6a'], title: 'Full Body Scan' },
    { id: 2, colors: ['#ff9966', '#ff5e62'], title: 'Upper Body Scan' },
    { id: 3, colors: ['#56ab2f', '#a8e063'], title: 'Lower Body Scan' },
  ];

  const youAs10Items = [
    { id: 1, title: 'Future Image 1' },
    { id: 2, title: 'Future Image 2' },
    { id: 3, title: 'Future Image 3' },
    { id: 4, title: 'Future Image 4' },
    { id: 5, title: 'scan' },
    { id: 6, title: 'daily' },
    { id: 7, title: 'coach' },
    { id: 8, title: '!' },
  ];

  const renderBodyScanItem = ({ item }: { item: { id: number; colors: string[]; title: string } }) => {
    return (
      <View style={styles.bodyScanItem}>
        <LinearGradient
          colors={item.colors}
          style={styles.gradient}
        >
          <Text style={styles.scanItemTitle}>{item.title}</Text>
          <Text style={styles.scanItemSubtitle}>Get your ratings and recommendations</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CameraScreen' as never)}>
            <Text style={styles.buttonText}>Begin scan</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  };

  const renderYouAs10Item = ({ item }: { item: { id: number; title: string } }) => {
    return (
      <View style={styles.youAs10Item}>
        {item.title.includes('Future Image') ? (
          <Ionicons name="image-outline" size={36} color="#666" />
        ) : null}
        <Text style={styles.youAs10Text}>{item.title}</Text>
      </View>
    );
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const index = Math.round(contentOffset.x / screenWidth);
    setActivePage(index);
  };

  const renderCarousel = (data: any[], renderItem: any) => (
    <View style={styles.carouselContainer}>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={screenWidth}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.carousel}
        getItemLayout={(data, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
      />
      <View style={styles.pagination}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activePage && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Body scan' && styles.activeTab]}
          onPress={() => setActiveTab('Body scan')}
        >
          <Text style={[styles.tabText, activeTab === 'Body scan' && styles.activeTabText]}>Body scan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'You as a 10' && styles.activeTab]}
          onPress={() => setActiveTab('You as a 10')}
        >
          <Text style={[styles.tabText, activeTab === 'You as a 10' && styles.activeTabText]}>You as a 10</Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'Body scan'
        ? renderCarousel(bodyScanItems, renderBodyScanItem)
        : renderCarousel(youAs10Items, renderYouAs10Item)
      }

      {photoUri && (
        <View style={styles.photoContainer}>
          <Image source={{ uri: photoUri }} style={styles.photo} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20,
    width: '100%',
  },
  tab: {
    marginHorizontal: 10,
    paddingBottom: 5,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
  },
  tabText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  carouselContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  carousel: {
    // Remove horizontal padding
  },
  carouselItemContainer: {
    width: itemWidth,
    marginRight: 10, // Replace itemSpacing with a fixed value
  },
  bodyScanItem: {
    width: itemWidth,
    height: itemWidth * 1.2,
    marginHorizontal: sideMargin,
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scanItemTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  scanItemSubtitle: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  youAs10Item: {
    width: itemWidth,
    height: itemWidth, // Make it square
    marginHorizontal: sideMargin, // Add 15% margin on each side
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 20,
  },
  youAs10Text: {
    color: '#fff',
    fontSize: 16, // Further reduced font size
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#666',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#fff',
  },
  photoContainer: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: '-50%' }],
    width: 100,
    height: 100,
    borderRadius: 10,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
});