import { BarcodeScanningResult, CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import React, { useRef, useState } from 'react';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProductInfo } from '../model/ProductInfo';

const BarcodeScanner = () => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
    const isHandlingScan = useRef(false);

    if (!permission) {return <View />;}

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}> We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    const handleBarCodeScanned = async ({ type, data }: BarcodeScanningResult) => {
        if (isHandlingScan.current) return;
        isHandlingScan.current = true;
        setScanned(true);

        try {
            const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${data}.json`);
            const result = await response.json();
            setProductInfo(result.product);
            alert(`Product calories: ${result.product.nutriments['energy-kcal_100g']}`);
        } catch (error) {
            alert('Error fetching product data' + error);
        } finally {
            isHandlingScan.current = false;
        }
    };

    const toggleCameraFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    
const getProductName = (product: ProductInfo): string => {
  return product.product_name && product.product_name.trim() !== ''
      ? product.product_name
      : product.product_name_en || 'Unknown Product';
};

const parseNumber = (value: any): number => {
  const parsed = parseFloat(String(value));
  return isNaN(parsed) ? 0 : parsed;
};

const calculateTotalCalories = (product: ProductInfo): string => {
  const caloriesPer100g = parseNumber(product.nutriments['energy-kcal_100g']);
  const quantity = parseNumber(product.product_quantity);
  return ((caloriesPer100g * quantity) / 100).toFixed(2);
};

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing={facing}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            >
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
                    <Text>Product Name: {getProductName(productInfo)}</Text>
                    <Text>Calories per 100g: {productInfo.nutriments['energy-kcal_100g']}</Text>
                    <Text>Total Calories in Product: {calculateTotalCalories(productInfo)}</Text>
                    <Text>Product quantity: {productInfo.product_quantity}g</Text>
                    <Text>Proteins per 100g: {productInfo.nutriments['proteins_100g']}g</Text>
                    <Text>Carbs per 100g: {productInfo.nutriments['carbohydrates_100g']}g</Text>
                    <Text>Fats per 100g: {productInfo.nutriments['fat_100g']}g</Text>
                    <Image source={{ uri: productInfo.image_url }} style={styles.productImage} />
                </View>
            )}
        </View>
    );
  }

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  camera: { flex: 1 },
  buttonContainer: { flex: 2, flexDirection: 'row', backgroundColor: 'transparent', margin: 64 },
  button: { flex: 1, alignSelf: 'flex-end', alignItems: 'center' },
  text: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  productInfo: { padding: 20, backgroundColor: '#fff', alignItems: 'center' },
  productImage: { width: 200, height: 100, marginTop: 10 },
});

export default BarcodeScanner;
