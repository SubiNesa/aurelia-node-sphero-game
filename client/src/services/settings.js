import { ApiService } from './api';
import { inject } from 'aurelia-framework';

@inject(ApiService)

export class SettingsService {

    constructor(apiService) {
        this.api = apiService;

        console.log('SettingsService');
    };

    getDevices() {
        return new Promise((resolve, reject) => {
            this.api.get({ path: '/devices/' })
                .then(httpResponse => {
                    var data = JSON.parse(httpResponse);
                    resolve(data);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }

    connectSphero() {
        return new Promise((resolve, reject) => {
            this.api.post({ path: '/connect/' })
                .then(httpResponse => {
                    var data = JSON.parse(httpResponse);
                    resolve(data);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }
}