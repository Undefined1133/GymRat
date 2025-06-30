import { observer } from 'mobx-react-lite'
import React from 'react'
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { ProgressBar } from 'react-native-paper'
import { macroStore } from '../store/MacroStore'

const TARGETS = {
  protein: 103,
  carbs: 258,
  fat: 68,
}

const MacroSummaryPage = observer(() => {
  const { calories, protein, carbs, fat, reset } = macroStore

  const renderMacro = (label: string, value: number, target: number) => (
    <View style={styles.macroRow}>
      <Text style={styles.macroLabel}>{label}</Text>
      <ProgressBar
        progress={Math.min(value / target, 1)}
        color="#00BFFF"
        style={styles.progressBar}
      />
      <Text style={styles.macroAmount}>{`${value.toFixed(0)} / ${target} g`}</Text>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Today's Intake</Text>
      <View style={styles.card}>
        {renderMacro('Carbs', carbs, TARGETS.carbs)}
        {renderMacro('Protein', protein, TARGETS.protein)}
        {renderMacro('Fat', fat, TARGETS.fat)}
      </View>
      <Button title="Reset" onPress={() => reset()} />
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  macroRow: { marginBottom: 20 },
  macroLabel: { fontSize: 16, marginBottom: 4 },
  progressBar: { height: 8, borderRadius: 4 },
  macroAmount: { fontSize: 14, marginTop: 4, fontWeight: '500' },
})

export default MacroSummaryPage