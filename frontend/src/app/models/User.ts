import { Meal } from './Meal';

export interface User {
  username: String;
  password?: String;
  email?: String;
  age?: number;
  height?: number;
  weight?: number;
  activity?: number;
  sex?: String;
  dailyExpenditure?: number;
  userAddedExpenditure?: number;
  userAddedProteinTarget?: number;
  userAddedCarbTarget?: number;
  userAddedFatTarget?: number;
  meals?: Meal[];
}
