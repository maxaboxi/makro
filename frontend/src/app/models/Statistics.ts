import { TopFood } from './TopFood';

export interface Statistics {
  users: number;
  userLoggedInTheLastSevenDays: number;
  foods: number;
  days: number;
  pdf: number;
  maleCount: number;
  femaleCount: number;
  averageAge: number;
  averageHeight: number;
  averageWeight: number;
  topFoods: TopFood[];
}
