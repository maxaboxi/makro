import { Food } from './Food';

export interface Meal {
  uuid?: String;
  username?: String;
  name: String;
  info?: String;
  recipe?: String;
  foods: Food[];
  tags?: String[];
  totalPoints?: number;
  userLike?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
