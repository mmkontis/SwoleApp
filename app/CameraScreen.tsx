import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BlurView } from 'expo-blur';
import { CameraType, CameraView, FlashMode, useCameraPermissions } from 'expo-camera';
import React, { useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Import the type for the route parameters
import { RootStackParamList } from './(tabs)/scan'; // Adjust the import path as necessary

type CameraScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CameraScreen'>;

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [image, setImage] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const navigation = useNavigation<CameraScreenNavigationProp>();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <BlurView intensity={80} style={styles.blurContainer}>
          <Ionicons name="camera-outline" size={48} color="white" />
          <Ionicons name="arrow-forward" size={48} color="white" onPress={requestPermission} />
        </BlurView>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  function toggleFlash() {
    setFlash(current => (current === 'off' ? 'on' : 'off'));
  }

  async function takePicture() {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo) {
          setImage(photo.uri);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function savePicture() {
    if (image) {
      navigation.navigate('ScanScreen', { photoUri: image });
    }
  }

  return (
    <View style={styles.container}>
      {!image ? (
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          flash={flash}
        >
          <View style={styles.controlsContainer}>
            <View style={styles.topControls}>
              <BlurView intensity={80} tint="dark" style={styles.buttonBlur}>
                <TouchableOpacity onPress={toggleCameraFacing}>
                  <Ionicons name="camera-reverse" size={24} color="white" />
                </TouchableOpacity>
              </BlurView>
              <BlurView intensity={80} tint="dark" style={styles.buttonBlur}>
                <TouchableOpacity onPress={toggleFlash}>
                  <Ionicons name={flash === 'on' ? "flash" : "flash-off"} size={24} color="white" />
                </TouchableOpacity>
              </BlurView>
            </View>
            <View style={styles.bottomControls}>
              <BlurView intensity={80} tint="dark" style={styles.captureButtonBlur}>
                <TouchableOpacity onPress={takePicture}>
                  <Ionicons name="camera" size={36} color="white" />
                </TouchableOpacity>
              </BlurView>
            </View>
          </View>
        </CameraView>
      ) : (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          <View style={styles.imageControls}>
            <BlurView intensity={80} tint="dark" style={styles.imageButtonBlur}>
              <TouchableOpacity onPress={() => setImage(null)} style={styles.imageButton}>
                <Ionicons name="refresh" size={24} color="white" />
                <Text style={styles.buttonText}>Retake</Text>
              </TouchableOpacity>
            </BlurView>
            <BlurView intensity={80} tint="dark" style={styles.imageButtonBlur}>
              <TouchableOpacity onPress={savePicture} style={styles.imageButton}>
                <Ionicons name="save" size={24} color="white" />
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </BlurView>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  controlsContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomControls: {
    alignItems: 'center',
  },
  buttonBlur: {
    borderRadius: 25,
    overflow: 'hidden',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonBlur: {
    borderRadius: 35,
    overflow: 'hidden',
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  imageControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
  },
  imageButtonBlur: {
    borderRadius: 25,
    overflow: 'hidden',
    padding: 15,
    minWidth: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  blurContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});