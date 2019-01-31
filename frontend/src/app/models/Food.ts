export interface Food {
  _id?: String;
  name: String;
  energia: number;
  hh: number;
  proteiini: number;
  rasva: number;
  kuitu?: number;
  sokeri?: number;
  username?: String;
  amount?: number;
  servingSize?: number;
  packageSize?: number;
  editing?: boolean;
  reasonForEditing?: string;
  en?: string;
  waitingForApproval?: boolean;
}
