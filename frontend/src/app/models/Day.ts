import { Meal } from './Meal';

export interface Day {
  _id?: String;
  name: String;
  meals: Meal[];
  username: String;
}
