import { Food } from './Food';

export interface EditedFood {
  _id?: String;
  editedBy: String;
  originalFood?: Food;
  editedFood?: Food;
  deleted?: boolean;
}
