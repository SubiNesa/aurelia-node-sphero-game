import { bindable } from 'aurelia-framework';
import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(Router, EventAggregator)

export class NavBar {

    constructor(router, eventAggregator) {
        this.eventAggregator = eventAggregator;

        this.sphero_status = 'fa-circle-o';
        console.log('test!!!');
        console.log(this.eventAggregator);

        this.eventAggregator.subscribe('onLoadingConnection', x => {
            this.sphero_status = 'fa-circle-o-notch fa-spin';
        });

        this.eventAggregator.subscribe('onSpheroConnected', color => {
            this.sphero_status = 'fa-circle';
        });
    }

    onLoadingConnection() {
        this.eventAggregator.publish('onLoadingConnection', 'test');
    }

    onSpheroConnected(color) {
        this.eventAggregator.publish('onSpheroConnected', color);
    }
}