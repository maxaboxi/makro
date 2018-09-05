import { Meal } from './Meal';

export interface User {
  username: String;
  password: String;
  email?: String;
  age?: Number;
  height?: Number;
  weight?: Number;
  activity?: Number;
  sex?: String;
  dailyExpenditure?: Number;
  userAddedExpenditure?: Number;
  userAddedProteinTarget?: Number;
  userAddedCarbTarget?: Number;
  userAddedFatTarget?: Number;
  meals?: Meal[];
}
