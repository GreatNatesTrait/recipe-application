// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// `.env.ts` is generated by the `npm run env` command
import env from './.env';
import {dynamo_api_url} from '../../../server/env_vars'

export const environment = {
  production: false,
  version: env.npm_package_version + '-dev',
  serverUrl: '/api',
  envName: 'DEV',
  dynamoAPI : dynamo_api_url,
  API_URL: 'http://127.0.0.1:8000',
  cognito: {
    region: 'us-east-1',
    //userPoolId: 'us-east-1_64NAjcj4f',
    //userPoolWebClientId: '1b2lvdp11tr97e1uvai8vorhk5',
    userPoolId: 'us-east-1_9v5QC3TYm',
    userPoolWebClientId: '32bp6c4jtkinrilp4hqjsel7bk',
  },
};


/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
