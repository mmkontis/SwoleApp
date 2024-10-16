    import { Ionicons } from '@expo/vector-icons';
import { GLView } from 'expo-gl';
import { Link } from 'expo-router';
import { Renderer, THREE } from 'expo-three';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
            
    const { width, height } = Dimensions.get('window');

    const WelcomeScreen: React.FC = () => {
      const onContextCreate = async (gl: any) => {
        const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        const renderer = new Renderer({ gl });
        renderer.setSize(width, height);

        const geometry = new THREE.TorusKnotGeometry(1, 0.4, 100, 16);
        const material = new THREE.MeshStandardMaterial({ color: 0x8a2be2 });
        const torusKnot = new THREE.Mesh(geometry, material);
        scene.add(torusKnot);

        const light = new THREE.PointLight(0xffffff, 1);
        light.position.set(10, 10, 10);
        scene.add(light);

        camera.position.z = 5;

        const animate = () => {
          requestAnimationFrame(animate);
          torusKnot.rotation.x += 0.01;
          torusKnot.rotation.y += 0.01;
          renderer.render(scene, camera);
          gl.endFrameEXP();
        };
        animate();
      };

      return (
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="scan-outline" size={150} color="#8a2be2" style={styles.scanIcon} />
              <GLView style={styles.glView} onContextCreate={onContextCreate} />
            </View>
            <Text style={styles.title}>Welcome to SwoleApp!</Text>
            <Text style={styles.subtitle}>Track your progress with AI-powered body scanning</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Link href="/full-screen/OnboardingScreen" asChild>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Start</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/full-screen/OnboardingScreen" asChild>
              <TouchableOpacity style={styles.link}>
                <Text style={styles.linkText}>Onboarding</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#000000',
        padding: 20,
      },
      contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      iconContainer: {
        position: 'relative',
        width: width * 0.8,
        height: width * 0.8,
        marginBottom: 50,
        justifyContent: 'center',
        alignItems: 'center',
      },
      scanIcon: {
        position: 'absolute',
        zIndex: 1,
      },
      glView: {
        width: '100%',
        height: '100%',
      },
      title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 20,
        textAlign: 'center',
      },
      subtitle: {
        fontSize: 18,
        color: '#cccccc',
        marginBottom: 40,
        textAlign: 'center',
      },
      buttonContainer: {
        width: '100%',
        alignItems: 'center',
      },
      button: {
        backgroundColor: '#8A2BE2',
        padding: 15,
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
      },
      buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
      },
      link: {
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
      },
      linkText: {
        color: '#8A2BE2',
        fontSize: 16,
      },
    });
    
    export default WelcomeScreen;
