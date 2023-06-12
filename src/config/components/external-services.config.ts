import joi from 'joi';
import { ExternalServicesConfig } from '../../models/config';

const envSchema = joi
  .object({
    COUNTRY_SERVICE: joi.string().uri().required(),
  })
  .unknown()
  .required();

const { error, value: envVars } = envSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const externalServices: ExternalServicesConfig = {
  countryService: envVars.COUNTRY_SERVICE,
};
