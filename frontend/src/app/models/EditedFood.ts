import { Food } from './Food';

export interface EditedFood {
  originalFood?: Food;
  editedFood?: Food;
  deleted?: boolean;
}
