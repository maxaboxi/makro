export interface Comment {
  uuid?: string;
  username: string;
  userId: string;
  body: string;
  answerUUID?: string;
  articleUUID?: string;
  replyToUUID?: string;
  replyToUser?: string;
  totalPoints?: number;
  userLike?: number;
  commentReplyCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
