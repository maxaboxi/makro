import { Food } from './Food';

export interface EditedFood {
  uuid?: string;
  editedBy: string;
  originalFood?: Food;
  editedFood?: Food;
  deleted?: boolean;
}
