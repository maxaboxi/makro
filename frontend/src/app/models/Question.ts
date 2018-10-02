export interface Question {
  _id?: String;
  username: String;
  question: String;
  info?: String;
  tags: String[];
  updatedAt?: Date;
  createdAt?: Date;
}
