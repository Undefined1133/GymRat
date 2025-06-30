import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import React, { useState } from 'react';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BarcodeScanner = () => {
    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [productInfo, setProductInfo] = useState(null);

    if (!permission) {
        return <View />;
      }

      if (!permission.granted) {
        return (
          <View style={styles.container}>
            <Text style={{ textAlign: 'center' }}>  We need your permission to show the camera</Text>
            <Button onPress={requestPermission} title="grant permission" />
          </View>
        );
      }

      const handleBarCodeScanned = async ({ type, data }: BarcodeScanningResult) => {
        setScanned(true);
        try {
          const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${data}.json`);
          const result = await response.json();
          setProductInfo(result.product);
          alert(`Product calories: ${result.product.nutriments['energy-kcal_100g']}`);
            } catch (error) {
          alert('Error fetching product data');
        }
      };
     function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }


  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}>
      <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                        <Text style={styles.text}>Flip Camera</Text>
                    </TouchableOpacity>
                    {scanned && (
                        <TouchableOpacity style={styles.button} onPress={() => setScanned(false)}>
                            <Text style={styles.text}>Tap to Scan Again</Text>
                        </TouchableOpacity>
                    )}
                </View>
      </CameraView>
      {productInfo && (
        <View style={styles.productInfo}>
          <Text>Product Name: {productInfo.product_name}</Text>
          <Text>Brand: {productInfo.brands}</Text>
          <Text>Categories: {productInfo.categories}</Text>
          <Image
                source={{ uri: productInfo.image_url }}
                style={styles.productImage} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    camera: {
      flex: 1,
    },
    buttonContainer: {
      flex: 2,
      flexDirection: 'row',
      backgroundColor: 'transparent',
      margin: 64,
    },
    button: {
      flex: 1,
      alignSelf: 'flex-end',
      alignItems: 'center',
    },
    text: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
    },
    productInfo: {
      padding: 20,
      backgroundColor: '#fff',
      alignItems: 'center',
    },
    productImage: {
        width: 200,
        height: 100, 
        marginTop: 10
    },
  });

export default BarcodeScanner;
