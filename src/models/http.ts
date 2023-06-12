import Joi from 'joi';
import { Response } from './common';

// Country

export type CountryResponse = {
  ip: string;
  country: string;
};

// Score

export type ScoreResponse = {
  id: string;
  name: string;
  score: number;
  country: string;
  createdAt: Date;
};

export type GetScoreResponseBody = ScoreResponse | Response<ScoreResponse>;

export type PostScoreRequestBody = {
  id: string;
  ip: string;
  name: string;
  score: number;
};
