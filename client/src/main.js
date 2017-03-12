import 'bootstrap';
import $ from 'jquery';

export function configure(aurelia) {
    $.noConflict();
    aurelia.use
        .standardConfiguration()
        .developmentLogging();

    aurelia.start().then(() => aurelia.setRoot());
}