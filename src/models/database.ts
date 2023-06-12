export type Score = {
  id: string | null;
  name: string;
  country: string;
  score: number;
  createdAt?: Date;
  queryable?: string;
};
