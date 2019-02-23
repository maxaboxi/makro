import { Meal } from './Meal';

export interface Day {
  _id?: string;
  name: string;
  meals: Meal[];
  username: string;
}
