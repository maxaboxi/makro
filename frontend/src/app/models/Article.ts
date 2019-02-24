import { Comment } from './Comment';

export interface Article {
  uuid?: string;
  userId?: string;
  username?: string;
  title: string;
  body: string;
  tags: string[];
  images?: File[];
  comments?: Comment[];
  totalPoints?: number;
  userLike?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
