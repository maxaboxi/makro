import { Day } from './Day';

export interface TrackedPeriod {
  uuid?: string;
  name?: string;
  userId?: string;
  username?: string;
  days?: Day[];
  totalCalories?: number;
  averageCaloriesPerDay?: number;
  smallestCalorieCount?: number;
  biggestCalorieCount?: number;
  totalProtein?: number;
  totalCarbs?: number;
  totalFat?: number;
  totalFiber?: number;
  totalSugar?: number;
  totalFoodWeight?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
