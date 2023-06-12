import { FilterRequestParams, Service } from '../models/common';
import { PostScoreRequestBody, GetScoreResponseBody } from '../models/http';
import scoresRepository from '../repositories/scores.repository';
import countryService from './country.service';

type ScoresService = Service<PostScoreRequestBody, GetScoreResponseBody>;

const create = async (score: PostScoreRequestBody) => {
  const { country } = await countryService.getCountry(score.ip);
  return await scoresRepository.create({ ...score, id: null, country });
};

const update = async (id: string, score: PostScoreRequestBody) => {
  const { country } = await countryService.getCountry(score.ip);
  return await scoresRepository.update({ ...score, id, country });
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
  create,
  read,
  readAll,
  update,
  remove,
} as ScoresService;
