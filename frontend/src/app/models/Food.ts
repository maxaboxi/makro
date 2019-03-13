export interface Food {
  uuid?: string;
  name: string;
  energy: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  username?: string;
  amount?: number;
  servingSize?: number;
  packageSize?: number;
  editing?: boolean;
  reasonForEditing?: string;
  en?: string;
  waitingForApproval?: boolean;
}
