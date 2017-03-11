import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import AppRouterConfig from './router-config';

// Using Aurelia's dependency injection, we inject Aurelia's router,
// the aurelia-auth http client config, and our own router config
// with the @inject decorator.
@inject(Router, AppRouterConfig)

export class App {

    constructor(router, appRouterConfig) {
        // config.title = 'Aurelia';
        this.router = router;

        console.log(appRouterConfig);

        // The application's configuration, including the
        // route definitions that we've declared in router-config.js
        this.appRouterConfig = appRouterConfig;
    }

    // Here, we run the configuration when the app loads
    activate() {
        this.appRouterConfig.configure();
    }
}
