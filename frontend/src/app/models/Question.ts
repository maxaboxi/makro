import { Answer } from './Answer';

export interface Question {
  uuid?: string;
  userId?: string;
  username: string;
  questionBody: string;
  questionInformation?: string;
  tags: string[];
  updatedAt?: Date;
  createdAt?: Date;
  answers?: Answer[];
}
