import client from '../utils/http-client';
import config from '../config';
import { CountryResponse } from '../models/http';

export const getCountry = async (ip: string) => {
  const response = await client.get<CountryResponse>(
    config.externalServices.countryService + ip,
  );
  return { ...response, country: response.country.toLowerCase() };
};

export default {
  getCountry,
};
