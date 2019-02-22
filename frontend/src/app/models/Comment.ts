export interface Comment {
  uuid?: String;
  username: String;
  userId: String;
  comment: String;
  postId: String;
  questionId?: String;
  articleId?: String;
  replyTo?: String;
  origPost: String;
  pointsTotal?: Number;
  createdAt?: Date;
  updatedAt?: Date;
}
