import { Food } from './Food';

export interface Meal {
  _id?: String;
  username?: String;
  name: String;
  info?: String;
  recipe?: String;
  foods: Food[];
  tags?: String[];
  pointsTotal?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
