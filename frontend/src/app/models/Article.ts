export interface Article {
  _id?: String;
  username?: String;
  title: String;
  origTitle?: String;
  body: String;
  origBody?: String;
  img?: File;
  tags: String[];
  pointsTotal?: Number;
  createdAt?: Date;
  updatedAt?: Date;
}
