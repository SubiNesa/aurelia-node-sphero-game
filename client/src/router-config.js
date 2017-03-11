import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

// Using Aurelia's dependency injection, we inject Router
// with the @inject decorator
@inject(Router)

export default class {

    constructor(router) {
        this.router = router;
    }

    configure() {
        let appRouterConfig = function (config) {
            config.title = 'Aurelia Node Sphero';

            // Here, we describe the routes we want along with information about them
            // such as which they are accessible at, which module they use, and whether
            // they should be placed in the navigation bar
            config.map([
                { route: ['', 'home'], name: 'home', moduleId: 'components/dashboard/home', nav: true, title: 'Dashboard', settings: { name: 'home', faicon: 'fa-home'} },
                { route: 'settings', name: 'settings', moduleId: 'components/settings/settings', nav: true, title: 'Settings', settings: { name: 'settings', faicon: 'fa-cogs'} },
                { route: 'math', name: 'math', moduleId: 'components/games/math', nav: false, title: 'Math', settings: { name: 'math', faicon: 'fa-calculator'} }
            ]);
        };

        // The router is configured with what we specify in the appRouterConfig
        this.router.configure(appRouterConfig);
    };
}
