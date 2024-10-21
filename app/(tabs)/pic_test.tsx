import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { updateDayWithImage, uploadImage } from '../../lib/supabase-functions';

export default function PicTestScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Compress the image
      const manipResult = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [
            
        ], // Resize to width of 1000px, height will adjust automatically
        { 
          compress: 0.6, // 0 = max compression (lowest quality), 1 = no compression (highest quality)
          format: ImageManipulator.SaveFormat.JPEG 
        }
      );
      setImage(manipResult.uri);
    }
  };

  const uploadToSupabase = async () => {
    if (!image || !user) return;

    setUploading(true);
    try {
      const publicUrl = await uploadImage(user.id, image, 'TEST');
      console.log('Image uploaded successfully:', publicUrl);

      // Get the current date
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];
      // Update the day's entry with the image URL
      await updateDayWithImage(formattedDate, 'fullbody', publicUrl as string);

      console.log('Day updated with image URL');
      alert('Image uploaded and day updated successfully!');
    } catch (error) {
      console.error('Error uploading image or updating day:', error);
      alert('Failed to upload image or update day');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pic Test Upload Screen</Text>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button
        title="Upload to Supabase"
        onPress={uploadToSupabase}
        disabled={!image || uploading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginVertical: 20,
  },
});
