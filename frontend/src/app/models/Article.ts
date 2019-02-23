export interface Article {
  uuid?: string;
  username?: string;
  title: string;
  origTitle?: string;
  body: string;
  origBody?: string;
  headerImgId?: string;
  tags: string[];
  pointsTotal?: Number;
  createdAt?: Date;
  updatedAt?: Date;
}
