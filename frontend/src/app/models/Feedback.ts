export interface Feedback {
  uuid?: string;
  feedbackBody: string;
  answer?: string;
  userId?: string;
  username?: string;
  createdAt?: Date;
  updatedAt?: Date;
  answeredAt?: Date;
  answeredBy?: string;
}
