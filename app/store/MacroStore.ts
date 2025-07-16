import { doc, setDoc } from 'firebase/firestore';
import { makeAutoObservable } from 'mobx';
import { auth, db } from "../firebase/firebaseConfig";

export class MacroStore {
  calories = 0;
  protein = 0;
  carbs = 0;
  fat = 0;

  constructor() {
    makeAutoObservable(this);
  }

  addMacros({ calories, protein, carbs, fat }: { calories: number; protein: number; carbs: number; fat: number }) {
    console.log("Adding macros... protein : " + protein + " carbs " + carbs + " fats " + fat + " calories " + calories)
    console.log("To existing...  protein : " + this.protein + " carbs " +  this.carbs + " fats " +  this.fat + " calories " +  this.calories);
    this.calories += calories;
    this.protein += protein;
    this.carbs += carbs;
    this.fat += fat;
    saveMacrosToFirestore({calories:calories, protein:protein, carbs:carbs, fat:fat})
  }

  reset() {
    this.calories = 0;
    this.protein = 0;
    this.carbs = 0;
    this.fat = 0;
  }
}

export const saveMacrosToFirestore = async (macros: {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}) => {
  if (!auth.currentUser) return;
const userId = auth.currentUser?.uid;
const dateKey = new Date().toISOString().split("T")[0];

const dailyDocRef = doc(db, 'users', userId, 'macros', dateKey);

await setDoc(dailyDocRef, {
  ...macros,
});

  console.log("Macros saved to Firestore");
};

export const macroStore = new MacroStore();
