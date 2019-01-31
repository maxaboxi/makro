import { Food } from './Food';

export interface EditedFood {
  editedBy: String;
  originalFood?: Food;
  editedFood?: Food;
  deleted?: boolean;
}
