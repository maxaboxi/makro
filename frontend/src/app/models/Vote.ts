export interface Vote {
  _id?: String;
  username: String;
  userId: String;
  vote: number;
  postId: String;
  category?: String;
  content: String;
}
