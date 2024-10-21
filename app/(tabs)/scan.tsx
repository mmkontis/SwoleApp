import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { createDay, updateDayWithImage, uploadImage } from '../../lib/supabase-functions';

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
  const [fullName, setFullName] = useState<string | null>(null);
  const [scannedParts, setScannedParts] = useState<{ [key: string]: boolean }>({
    full: false,
    upper: false,
    lower: false,
  });
  const [scannedPhotos, setScannedPhotos] = useState<{ [key: string]: string }>({
    full: '',
    upper: '',
    lower: '',
  });
  const params = useLocalSearchParams();
  const [fileExists, setFileExists] = useState<{ [key: string]: boolean }>({
    full: false,
    upper: false,
    lower: false,
  });

  console.log('ScanScreen rendered', { photoUri, scannedPhotos, params });

  const fetchUserFullName = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.user_metadata?.full_name) {
      setFullName(user.user_metadata.full_name);
    }
  }, []);

  const analyzeImage = useCallback(async (imageUri: string) => {
    try {
      const response = await fetch(`https://open-ai-image-test.vercel.app/api/analyze?image=${encodeURIComponent(imageUri)}`);
      const data = await response.json();
      Alert.alert('Image Analysis Result', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error analyzing image:', error);
      Alert.alert('Error', 'Failed to analyze the image');
    }
  }, []);

  useEffect(() => {
    console.log('ScanScreen useEffect - route params changed', route.params);
    const routeParams = route.params;
    if (routeParams?.photoUri) {
      setPhotoUri(routeParams.photoUri);
      analyzeImage(routeParams.photoUri);
    }
    fetchUserFullName();
  }, [route.params, analyzeImage, fetchUserFullName]);

  const scrollToNextEmptyScan = useCallback(() => {
    const nextEmptyIndex = bodyScanItems.findIndex(item => !scannedPhotos[item.type]);
    if (nextEmptyIndex !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: nextEmptyIndex, animated: true });
    }
  }, [scannedPhotos]);

  useEffect(() => {
    console.log('ScanScreen useEffect - params changed', params);
    const newScannedPhotos = { ...scannedPhotos };
    let hasChanges = false;

    if (params.full && params.full !== scannedPhotos.full) {
      newScannedPhotos.full = params.full as string;
      hasChanges = true;
    }
    if (params.upper && params.upper !== scannedPhotos.upper) {
      newScannedPhotos.upper = params.upper as string;
      hasChanges = true;
    }
    if (params.lower && params.lower !== scannedPhotos.lower) {
      newScannedPhotos.lower = params.lower as string;
      hasChanges = true;
    }

    if (hasChanges) {
      setScannedPhotos(newScannedPhotos);
      // Scroll to the next empty scan after updating scannedPhotos
      setTimeout(scrollToNextEmptyScan, 500); // Add a small delay to ensure the state has updated
    }

    // Remove this part to allow free scrolling
    /*
    if (params.lastScannedType) {
      const index = bodyScanItems.findIndex(item => item.type === params.lastScannedType);
      if (index !== -1 && flatListRef.current) {
        flatListRef.current.scrollToIndex({ index, animated: true });
      }
    }
    */
  }, [params, scrollToNextEmptyScan]);

  useEffect(() => {
    console.log('scannedPhotos updated:', scannedPhotos);
  }, [scannedPhotos]);

  useEffect(() => {
    async function checkFiles() {
      const newFileExists = { ...fileExists };
      for (const [key, uri] of Object.entries(scannedPhotos)) {
        if (uri) {
          const fileInfo = await FileSystem.getInfoAsync(uri);
          newFileExists[key] = fileInfo.exists;
          console.log(`File exists for ${key}:`, fileInfo.exists);
        } else {
          newFileExists[key] = false;
        }
      }
      setFileExists(newFileExists);
    }
    checkFiles();
  }, [scannedPhotos]);

  const bodyScanItems = [
    { id: 1, colors: ['#4c669f', '#3b5998', '#192f6a'], title: 'Full Body Scan', type: 'full' },
    { id: 2, colors: ['#ff9966', '#ff5e62'], title: 'Upper Body Scan', type: 'upper' },
    { id: 3, colors: ['#56ab2f', '#a8e063'], title: 'Lower Body Scan', type: 'lower' },
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

  const deleteScanPhoto = (type: string) => {
    Alert.alert(
      "Delete Scan",
      "Are you sure you want to delete this scan?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: () => {
            setScannedPhotos(prev => ({ ...prev, [type]: '' }));
            setScannedParts(prev => ({ ...prev, [type]: false }));
          }
        }
      ]
    );
  };

  const handleImageCapture = useCallback(async (capturedImage: string, scanType: string) => {
    try {
      console.log('handleImageCapture called with:', { capturedImage, scanType });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('User not authenticated');
        return;
      }
      console.log('User authenticated:', user.id);

      // Create or fetch the day entry
      const today = new Date();
      const dayData = await createDay(today, user.id);
      if (!dayData) {
        console.error('Failed to create or fetch day data');
        return;
      }
      console.log('Day data created/fetched:', dayData);

      // Upload the image
      console.log('Uploading image...');
      let imageUrl;
      try {
        imageUrl = await uploadImage(user.id, capturedImage, scanType);
        console.log('Image uploaded, URL:', imageUrl);
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw uploadError;
      }

      // Update the day entry with the image URL
      console.log('Updating day with image URL...');
      try {
        await updateDayWithImage(dayData.id, scanType, imageUrl as string);
        console.log('Day updated with image URL');
      } catch (updateError) {
        console.error('Error updating day with image:', updateError);
        throw updateError;
      }

      // Update the local state
      console.log('Updating local state...');
      setScannedPhotos(prev => {
        const newState = { ...prev, [scanType]: capturedImage };
        console.log('New scannedPhotos state:', newState);
        return newState;
      });
      setScannedParts(prev => {
        const newState = { ...prev, [scanType]: true };
        console.log('New scannedParts state:', newState);
        return newState;
      });

      // Analyze the image (if needed)
      await analyzeImage(capturedImage);

      console.log('Image capture process completed successfully');
    } catch (error) {
      console.error('Error handling image capture:', error);
      Alert.alert('Error', 'Failed to process the captured image: ' + (error as Error).message);
    }
  }, [analyzeImage]);

  const renderBodyScanItem = ({ item }: { item: { id: number; colors: string[]; title: string; type: string } }) => {
    const photoUri = scannedPhotos[item.type];
    const exists = fileExists[item.type];

    console.log(`Rendering ${item.type} scan, photoUri:`, photoUri, 'exists:', exists);

    return (
      <View style={styles.bodyScanItem}>
        <LinearGradient
          colors={item.colors}
          style={styles.gradient}
        >
          <Text style={styles.scanItemTitle}>{item.title}</Text>
          <Text style={styles.scanItemSubtitle}>Get your ratings and recommendations</Text>
          {!photoUri ? (
            <TouchableOpacity 
              style={styles.button}
              onPress={() => {
                router.push({
                  pathname: "/full-screen/CameraScreen",
                  params: { 
                    scanType: item.type,
                    onCapture: JSON.stringify((capturedImage: string) => handleImageCapture(capturedImage, item.type))
                  }
                });
              }}
            >
              <Text style={styles.buttonText}>Begin scan</Text>
            </TouchableOpacity>
          ) : null}
          {photoUri && exists && (
            <View style={styles.photoContainer}>
              <Image 
                source={{ uri: photoUri }} 
                style={styles.photo} 
                resizeMode="cover"
                onLoad={() => console.log(`Image loaded for ${item.type}`)}
                onError={(error) => {
                  console.error(`Error loading image for ${item.type}:`, error);
                  Alert.alert('Image Load Error', `Failed to load image for ${item.type}. URI: ${photoUri}`);
                }}
              />
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => deleteScanPhoto(item.type)}
              >
                <Ionicons name="trash-outline" size={18} color="white" />
              </TouchableOpacity>
            </View>
          )}
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

  const handleManualScroll = useCallback((event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const index = Math.round(contentOffset.x / screenWidth);
    setActivePage(index);
  }, []);

  const renderCarousel = useCallback((data: any[], renderItem: any) => (
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
        onScroll={handleManualScroll}
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
  ), [activePage, handleManualScroll]);

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
      
      {activeTab === 'Body scan' && fullName && (
        <Text style={styles.greeting}>Hey {fullName}</Text>
      )}
      
      {activeTab === 'Body scan'
        ? renderCarousel(bodyScanItems, renderBodyScanItem)
        : renderCarousel(youAs10Items, renderYouAs10Item)
      }
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
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  carouselContainer: {
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
    justifyContent: 'space-between', // Changed from 'flex-start' to 'space-between'
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
    marginBottom: 20, // Added margin to separate button from photo
  },
  buttonDisabled: {
    backgroundColor: '#666',
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
  embeddedPhoto: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3, // Adjust this value to change the photo's transparency
  },
  completedText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  nextScanButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#8A2BE2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  nextScanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  photoContainer: {
    width: '100%',
    height: 150,
    aspectRatio: 3/4, // Ensures 16:9 aspect ratio
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 20, // Add some margin at the top
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 5,
  },
  photoUriText: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    fontSize: 10,
  },
});
