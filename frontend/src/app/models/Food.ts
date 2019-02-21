export interface Food {
  uuid?: String;
  name: String;
  energy: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  username?: String;
  amount?: number;
  servingSize?: number;
  packageSize?: number;
  editing?: boolean;
  reasonForEditing?: string;
  en?: string;
  waitingForApproval?: boolean;
}
