//     // CameraScreen.js
// import * as ImagePicker from 'expo-image-picker';
// import { User, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
// import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
// import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
// import React, { useState } from 'react';
// import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import { auth, db, storage } from '../firebaseConfig'; // Updated import path

// const API_URL = 'https://open-ai-image-test.vercel.app/api/analyze?image=https://mindscheq.com/wp-content/uploads/2023/10/body-img-blog.jpg';

// export default function CameraScreen() {
//   const [image, setImage] = useState<string | null>(null);
//   const [uploading, setUploading] = useState<boolean>(false);
//   const [user, setUser] = useState<User | null>(null);
//   const [email, setEmail] = useState<string>('');
//   const [password, setPassword] = useState<string>('');
//   const [uploadHistory, setUploadHistory] = useState<Array<{ imageUrl: string; timestamp: Date }>>([]);
//   const [apiTesting, setApiTesting] = useState<boolean>(false);

//   const handleLogout = () => {
//     auth.signOut().then(() => setUser(null));
//   };

//   const pickImage = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
//       return;
//     }
  
//     try {
//       let result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 0.7,
//       });
  
//       if (!result.canceled && result.assets && result.assets.length > 0) {
//         const selectedAsset = result.assets[0];
//         setImage(selectedAsset.uri);
//       }
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         Alert.alert('Image Picker Error', error.message);
//         console.error('ImagePicker Error:', error);
//       } else {
//         Alert.alert('Image Picker Error', 'An unexpected error occurred.');
//         console.error('ImagePicker Error:', error);
//       }
//     }
//   };
  
//   const handleEmailRegister = async () => {
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       setUser(userCredential.user);
//       Alert.alert('Registration Successful', 'You have been registered successfully!');
//     } catch (error: any) {
//       Alert.alert('Registration Error', error.message);
//       console.error('Registration Error:', error);
//     }
//   };

//   const handleEmailLogin = async () => {
//     if (!auth) {
//       console.error('Auth is not initialized');
//       Alert.alert('Error', 'Authentication is not initialized. Please check your Firebase configuration.');
//       return;
//     }

//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       setUser(userCredential.user);
//       Alert.alert('Login Successful', 'You have been logged in successfully!');
//       fetchUploadHistory(userCredential.user.uid);
//     } catch (error: any) {
//       Alert.alert('Login Error', error.message);
//       console.error('Login Error:', error);
//     }
//   };

//   const fetchUploadHistory = async (uid: string) => {
//     try {
//       const q = query(collection(db, 'uploads'), where('userId', '==', uid));
//       const querySnapshot = await getDocs(q);
//       const history = querySnapshot.docs.map(doc => ({
//         imageUrl: doc.data().imageUrl,
//         timestamp: doc.data().timestamp.toDate(),
//       }));
//       setUploadHistory(history);
//     } catch (error: any) {
//       Alert.alert('Error', 'Failed to fetch upload history.');
//       console.error('Fetch History Error:', error);
//     }
//   };

//   const uploadImage = async () => {
//     if (!image) {
//       Alert.alert('No Image Selected', 'Please select an image first.');
//       return;
//     }

//     setUploading(true);

//     try {
//       const filename = image.substring(image.lastIndexOf('/') + 1);
//       const storageRef = ref(storage, `images/${filename}`);

//       const response = await fetch(image);
//       const blob = await response.blob();

//       await uploadBytes(storageRef, blob);

//       const downloadURL = await getDownloadURL(storageRef);

//       if (user) {
//         await addDoc(collection(db, 'uploads'), {
//           userId: user.uid,
//           imageUrl: downloadURL,
//           timestamp: new Date(),
//         });
//         fetchUploadHistory(user.uid);
//       }

//       Alert.alert('Upload Successful', `Image has been uploaded successfully!\n\nURL: ${downloadURL}`);

//       setImage(null);
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         Alert.alert('Error', error.message);
//         console.error('Error uploading image:', error);
//       } else {
//         Alert.alert('Error', 'An unexpected error occurred.');
//         console.error('Error uploading image:', error);
//       }
//     } finally {
//       setUploading(false);
//     }
//   };

//   const testApi = async () => {
//     setApiTesting(true);

//     try {
//       const response = await fetch(API_URL);
      
//       if (!response.ok) {
//         throw new Error(`API request failed with status ${response.status}`);
//       }

//       const result = await response.json();
//       Alert.alert('API Test Result', JSON.stringify(result, null, 2));
//     } catch (error: unknown) {
//       console.error('Error testing API:', error);
//       if (error instanceof Error) {
//         Alert.alert('API Test Error', `Failed to test the API. Error: ${error.message}`);
//       } else {
//         Alert.alert('API Test Error', 'An unknown error occurred');
//       }
//     } finally {
//       setApiTesting(false);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {/* Test API Button */}
//       <TouchableOpacity style={styles.button} onPress={testApi} disabled={apiTesting}>
//         <Text style={styles.buttonText}>
//           {apiTesting ? 'Testing API...' : 'Test API'}
//         </Text>
//       </TouchableOpacity>

//       {/* Image Selection and Upload Section */}
//       <TouchableOpacity style={styles.button} onPress={pickImage}>
//         <Text style={styles.buttonText}>Select Image</Text>
//       </TouchableOpacity>

//       {image && <Image source={{ uri: image }} style={styles.image} />}

//       {uploading ? (
//         <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
//       ) : (
//         image && (
//           <TouchableOpacity style={styles.button} onPress={uploadImage}>
//             <Text style={styles.buttonText}>Upload Image</Text>
//           </TouchableOpacity>
//         )
//       )}

//       {!user ? (
//         <>
//           {/* Email Registration */}
//           <Text style={styles.sectionTitle}>Register with Email</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Email"
//             value={email}
//             onChangeText={setEmail}
//             keyboardType="email-address"
//             autoCapitalize="none"
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Password"
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry
//           />
//           <TouchableOpacity style={styles.button} onPress={handleEmailRegister}>
//             <Text style={styles.buttonText}>Register</Text>
//           </TouchableOpacity>

//           {/* Email Login */}
//           <Text style={styles.sectionTitle}>Login with Email</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Email"
//             value={email}
//             onChangeText={setEmail}
//             keyboardType="email-address"
//             autoCapitalize="none"
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Password"
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry
//           />
//           <TouchableOpacity style={styles.button} onPress={handleEmailLogin}>
//             <Text style={styles.buttonText}>Login</Text>
//           </TouchableOpacity>
//         </>
//       ) : (
//         <>
//           {/* User Details */}
//           <Text style={styles.welcomeText}>Welcome, {user.displayName || user.email}</Text>
//           <TouchableOpacity style={styles.button} onPress={handleLogout}>
//             <Text style={styles.buttonText}>Logout</Text>
//           </TouchableOpacity>

//           {/* Upload History */}
//           <Text style={styles.sectionTitle}>Upload History</Text>
//           {uploadHistory.length > 0 ? (
//             uploadHistory.map((upload, index) => (
//               <View key={index} style={styles.historyItem}>
//                 <Image source={{ uri: upload.imageUrl }} style={styles.historyImage} />
//                 <Text style={styles.historyText}>{upload.timestamp.toLocaleString()}</Text>
//               </View>
//             ))
//           ) : (
//             <Text style={styles.noHistoryText}>No uploads yet.</Text>
//           )}
//         </>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//     backgroundColor: '#FFFFFF',
//   },
//   button: {
//     backgroundColor: '#007AFF',
//     paddingVertical: 15,
//     paddingHorizontal: 25,
//     borderRadius: 8,
//     marginVertical: 10,
//     width: '80%',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5, // For Android shadow
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   image: {
//     width: 300,
//     height: 300,
//     resizeMode: 'contain',
//     marginVertical: 20,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   welcomeText: {
//     fontSize: 18,
//     marginBottom: 20,
//     color: '#333',
//   },
//   input: {
//     width: '80%',
//     height: 50,
//     backgroundColor: '#f2f2f2',
//     borderRadius: 8,
//     paddingHorizontal: 15,
//     marginVertical: 10,
//     fontSize: 16,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     marginTop: 20,
//     marginBottom: 10,
//     color: '#333',
//   },
//   historyItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   historyImage: {
//     width: 100,
//     height: 100,
//     resizeMode: 'cover',
//     marginVertical: 5,
//     borderRadius: 8,
//   },
//   historyText: {
//     fontSize: 14,
//     color: '#555',
//   },
//   noHistoryText: {
//     fontSize: 14,
//     color: '#999',
//   },
// });
