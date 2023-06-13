// // This file is required by karma.conf.js and loads recursively all the .spec and framework files

// import 'zone.js/testing';
// import { getTestBed } from '@angular/core/testing';
// import {
//   BrowserDynamicTestingModule,
//   platformBrowserDynamicTesting
// } from '@angular/platform-browser-dynamic/testing';

// declare const require: any;

// // First, initialize the Angular testing environment.
// getTestBed().initTestEnvironment(
//   BrowserDynamicTestingModule,
//   platformBrowserDynamicTesting(), {
//     teardown: { destroyAfterEach: false }
// }
// );
// // Then we find all the tests.
// const context = require.context('./', true, /\.spec\.ts$/);
// // And load the modules.
// context.keys().map(context);

import 'jest-preset-angular';
import './polyfills';

// This is optional if you want to use Jest's global setup/teardown hooks
import './jest-setup.ts';

// ...

// Add the following configuration to enable Jest's test environment
// and configure it to use Angular's testing module
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

declare const require: {
  context(
    path: string,
    deep?: boolean,
    filter?: RegExp
  ): {
    keys(): string[];
    <T>(id: string): T;
  };
};

// First, initialize the Angular testing environment
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// Then, find all the test files and run them
const context = require.context('./', true, /\.spec\.ts$/);
context.keys().map(context);
