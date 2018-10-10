export interface Comment {
  _id?: String;
  username: String;
  userId: String;
  comment: String;
  postId: String;
  questionId: String;
  replyTo?: String;
  origPost: String;
  pointsTotal?: Number;
  createdAt?: Date;
  updatedAt?: Date;
}
