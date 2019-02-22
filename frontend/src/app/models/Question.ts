export interface Question {
  uuid?: String;
  username: String;
  question: String;
  info?: String;
  tags: String[];
  updatedAt?: Date;
  createdAt?: Date;
}
