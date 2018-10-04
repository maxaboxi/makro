import { Comment } from './Comment';

export interface Answer {
  _id?: String;
  questionId: String;
  username: String;
  answer: String;
  votes?: Number;
  comments?: Comment[];
  updatedAt?: Date;
  createdAt?: Date;
}
