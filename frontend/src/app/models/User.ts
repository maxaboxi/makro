import { Meal } from './Meal';

export interface User {
  uuid?: string;
  username: string;
  password?: string;
  email?: string;
  age?: number;
  height?: number;
  weight?: number;
  activity?: number;
  sex?: string;
  dailyExpenditure?: number;
  userAddedExpenditure?: number;
  userAddedProteinTarget?: number;
  userAddedCarbTarget?: number;
  userAddedFatTarget?: number;
  meals?: Meal[];
  lastLogin?: Date;
  showTargets?: boolean;
  lang?: string;
}
