import { Comment } from './Comment';

export interface Answer {
  uuid?: string;
  questionUUID: string;
  username: string;
  userId: string;
  answerBody: string;
  totalPoints?: number;
  comments?: Comment[];
  updatedAt?: Date;
  createdAt?: Date;
}
