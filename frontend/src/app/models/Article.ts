export interface Article {
  uuid?: String;
  username?: String;
  title: String;
  origTitle?: String;
  body: String;
  origBody?: String;
  headerImgId?: String;
  tags: String[];
  pointsTotal?: Number;
  createdAt?: Date;
  updatedAt?: Date;
}
