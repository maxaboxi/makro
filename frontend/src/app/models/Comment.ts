export interface Comment {
  _id?: String;
  username: String;
  userId: String;
  comment: String;
  postId: String;
  replyTo?: String;
}
