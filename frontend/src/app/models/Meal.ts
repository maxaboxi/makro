import { Food } from './Food';

export interface Meal {
  uuid?: string;
  username?: string;
  addedByName?: string;
  index?: number;
  name: string;
  info?: string;
  recipe?: string;
  foods: Food[];
  tags?: string[];
  totalPoints?: number;
  userLike?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
  shared?: boolean;
  portionSize?: number;
  portions?: number;
}
