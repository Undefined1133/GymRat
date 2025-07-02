import { makeAutoObservable } from 'mobx';

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
  }

  reset() {
    this.calories = 0;
    this.protein = 0;
    this.carbs = 0;
    this.fat = 0;
  }
}

export const macroStore = new MacroStore();
