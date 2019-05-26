import { Meal } from './Meal';

export interface Day {
  uuid?: string;
  name?: string;
  allMeals: Meal[];
  userId: string;
  date?: Date;
}
