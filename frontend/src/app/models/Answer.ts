export interface Answer {
  _id?: String;
  questionId: String;
  username: String;
  answer: String;
  votes?: Number;
  updatedAt?: Date;
  createdAt?: Date;
}
