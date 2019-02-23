import { Food } from './Food';

export interface Meal {
  uuid?: string;
  username?: string;
  name: string;
  info?: string;
  recipe?: string;
  foods: Food[];
  tags?: string[];
  totalPoints?: number;
  userLike?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
