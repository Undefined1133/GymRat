import { observer } from 'mobx-react-lite'
import React from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { macroStore } from '../store/MacroStore'

const MacroSummaryPage = observer(() => {
  const { calories, protein, carbs, fat, reset } = macroStore

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Intake</Text>
      <Text>Calories: {calories.toFixed(2)}</Text>
      <Text>Protein: {protein.toFixed(2)} g</Text>
      <Text>Carbs: {carbs.toFixed(2)} g</Text>
      <Text>Fat: {fat.toFixed(2)} g</Text>
      <Button title="Reset" onPress={() => reset()} />
    </View>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
})

export default MacroSummaryPage