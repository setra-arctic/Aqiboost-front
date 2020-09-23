// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:4001/aqiboost-back',
  payment: {
    stripe: {
      publishableKey:
        'pk_test_51HK23RBSZ5Z8mEDFtus2xBRRwuEQI8hC8A5YQD3y9aLFdzmNx1e8dwThxihFOcG1QBzD7zULz0mTm0cMfiGm86Kg00fQhnqoAg',
      tarifMois: 5,
      tarifAnnee: 50,
    },
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
