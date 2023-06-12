import { FilterRequestParams, Service } from '../models/common';
import { PostScoreRequestBody, GetScoreResponseBody } from '../models/http';
import scoresRepository from '../repositories/scores.repository';
import countryService from './country.service';

type ScoresService = Omit<
  Service<PostScoreRequestBody, GetScoreResponseBody>,
  'create' | 'update'
> & {
  upsert: (dto: PostScoreRequestBody) => Promise<GetScoreResponseBody>;
};

const upsert = async (score: PostScoreRequestBody) => {
  const { country } = await countryService.getCountry(score.ip);
  const existingScore = await scoresRepository.read(score.id);
  const operation = existingScore
    ? scoresRepository.update
    : scoresRepository.create;
  return await operation({ ...score, country });
};

const read = async (id: string) => {
  return await scoresRepository.read(id);
};

const readAll = async (filter: FilterRequestParams) => {
  return await scoresRepository.readAll(filter);
};

const remove = async (id: string) => {
  return await scoresRepository.remove(id);
};

export default {
  upsert,
  read,
  readAll,
  remove,
} as ScoresService;
