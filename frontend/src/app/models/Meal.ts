import { Food } from './Food';

export interface Meal {
  username?: String;
  name: String;
  info?: String;
  foods: Food[];
  createdAt?: Date;
  updatedAt?: Date;
}
