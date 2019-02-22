export interface Comment {
  uuid?: string;
  username: string;
  userId: string;
  body: string;
  answerUUID?: string;
  articleUUID?: string;
  replyToUUID?: string;
  replyToUsername?: string;
  totalPoints?: number;
  commentReplyCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
