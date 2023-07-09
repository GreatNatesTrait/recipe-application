// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// `.env.ts` is generated by the `npm run env` command
import env from './.env';
import apiConfig from './dynamo-api-config.json'
import loggerApiConfig from './logger-api-config.json'

export const environment = {
  production: false,
  version: env.npm_package_version + '-dev',
  envName: 'DEV',
  dynamoAPI : apiConfig.dynamo_api_url.value,
  localData: 'assets/recipes.json' ,
  loggerAPI : loggerApiConfig.logger_api_endpoint.value,
  cognito: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_9v5QC3TYm',
    userPoolWebClientId: '32bp6c4jtkinrilp4hqjsel7bk',
  },
};
