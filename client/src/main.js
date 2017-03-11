import 'bootstrap';
import $ from 'jquery';

export function configure(aurelia) {
    $.noConflict();
    aurelia.use
        .standardConfiguration()
        .developmentLogging()
        .plugin('aurelia-dialog');

    aurelia.start().then(() => aurelia.setRoot());
}