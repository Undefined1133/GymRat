import { BarcodeScanningResult, CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import React, { useRef, useState } from 'react';
import { Button, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { ProductInfo } from '../model/ProductInfo';
import { macroStore } from '../store/MacroStore';

const BarcodeScanner = () => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [amountConsumed, setAmountConsumed] = useState('');
  const isHandlingScan = useRef(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}> We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }: BarcodeScanningResult) => {
    if (isHandlingScan.current) {
      return;
    }
    isHandlingScan.current = true;
    setScanned(true);

    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${data}.json`);
      const result = await response.json();

      setProductInfo(result.product);
      setModalVisible(true);
    } catch (error) {
      alert('Error fetching product data' + error);
    } finally {
      isHandlingScan.current = false;
    }
  };

  const confirmConsumption = () => {
    if (!productInfo) {
      return;
    }
    const consumed = parseFloat(amountConsumed);
    const totalQuantity =
      parseNumber(productInfo.product_quantity) > 0
        ? parseNumber(productInfo.product_quantity)
        : parseNumber(productInfo.serving_size);
    
    const factor =
      !isNaN(consumed) && consumed > 0 && totalQuantity > 0
        ? consumed / totalQuantity
        : 1;

        console.log("Consumed: " + consumed + " totalQuantity: " + totalQuantity + " factor: " + factor);
        const proteinPerProduct = parseNumber(productInfo.nutriments['proteins_100g']) * (totalQuantity / 100);
const carbsPerProduct = parseNumber(productInfo.nutriments['carbohydrates_100g']) * (totalQuantity / 100);
const fatPerProduct = parseNumber(productInfo.nutriments['fat_100g']) * (totalQuantity / 100);
const caloriesPerProduct = calculateTotalCalories(productInfo);

    macroStore.addMacros({
      calories: caloriesPerProduct * factor,
      protein: proteinPerProduct * factor,
      carbs: carbsPerProduct * factor,
      fat: fatPerProduct * factor,
    });

    setModalVisible(false);
    setAmountConsumed('');
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const getProductName = (product: ProductInfo): string => {
    return product.product_name && product.product_name.trim() !== ''
      ? product.product_name
      : product.product_name_en || 'Unknown Product';
  };

  const parseNumber = (value: any): number => {
    const parsed = parseFloat(String(value));

    return isNaN(parsed) ? 0 : parsed;
  };

  const calculateTotalCalories = (product: ProductInfo): number => {
    const caloriesPer100g = parseNumber(product.nutriments['energy-kcal_100g']);
    console.log("Calories per 100g = " + caloriesPer100g);
    const quantity =
    parseNumber(product.product_quantity) > 0
      ? parseNumber(product.product_quantity)
      : parseNumber(product.serving_size);   
    console.log("Product quantity = " + quantity)
    const bob = parseFloat(((caloriesPer100g * quantity) / 100).toFixed(2));
    console.log("Calories per product = " + bob)
    return bob;
  };

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

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Enter amount consumed (g):</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={amountConsumed}
              onChangeText={setAmountConsumed}
            />
            <Button title="Confirm" onPress={confirmConsumption} />
          </View>
        </View>
      </Modal>
      {productInfo && (
  <View style={styles.productInfo}>
    <Text>Product Name: {getProductName(productInfo)}</Text>
    <Text>Calories per 100g: {productInfo.nutriments["energy-kcal_100g"]}</Text>
    <Text>Total Calories in Product: {calculateTotalCalories(productInfo)}</Text>
    <Text>Product quantity: {productInfo.product_quantity}g</Text>
    <Text>Proteins per 100g: {productInfo.nutriments["proteins_100g"]}g</Text>
    <Text>Carbs per 100g: {productInfo.nutriments["carbohydrates_100g"]}g</Text>
    <Text>Fats per 100g: {productInfo.nutriments["fat_100g"]}g</Text>
    <Image
      source={{ uri: productInfo.image_url }}
      style={styles.productImage}
    />
  </View>
)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  camera: { flex: 1 },
  buttonContainer: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: { flex: 1, alignSelf: 'flex-end', alignItems: 'center' },
  text: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  productInfo: { padding: 20, backgroundColor: '#fff', alignItems: 'center' },
  productImage: { width: 200, height: 100, marginTop: 10 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginVertical: 10, width: 100, textAlign: 'center' },
});

export default BarcodeScanner;
