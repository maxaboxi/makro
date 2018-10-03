import { Food } from './Food';

export interface Meal {
  _id?: String;
  username?: String;
  name: String;
  info?: String;
  foods: Food[];
  tags?: String[];
  createdAt?: Date;
  updatedAt?: Date;
}
