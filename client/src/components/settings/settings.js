import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { SettingsService } from 'services/settings';
import { NavBar } from './../nav-bar';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(Router, SettingsService, NavBar, EventAggregator)

export class Settings {
    heading = 'Settings';

    constructor(router, settingsService, navBar, eventAggregator) {
        this.srvSettings = settingsService;
        this.eventAggregator = eventAggregator;
        this.navBar = navBar;
    }

    activate() {
        console.log('activate');

        console.log(this.srvSettings);

        this.srvSettings.getDevices()
            .then(data => {
                console.log(data);
                this.devices = data;

            })
            .catch(error => {
                console.warn(error);
            });
    }

    attached() {
        console.log('attached');

    }

    onClickConnect() {
        this._connectSphero();
    }

    _connectSphero() {
        let _this = this;

        this.navBar.onLoadingConnection();

        this.srvSettings.connectSphero()
            .then(data => {
                console.log(data);
                _this.navBar.onSpheroConnected(data.color);
            })
            .catch(error => {
                console.warn(error);
            });
    }
}
