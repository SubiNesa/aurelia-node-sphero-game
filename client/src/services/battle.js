import { ApiService } from './api';
import { inject } from 'aurelia-framework';

@inject(ApiService)

export class BattleService {

    constructor(apiService) {
        this.api = apiService;
    };

    start() {
        return new Promise((resolve, reject) => {
            this.api.post({ path: '/battle/start/' })
                .then(httpResponse => {
                    var data = JSON.parse(httpResponse);
                    resolve(data);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }

    checkpoint(params) {
        return new Promise((resolve, reject) => {
            this.api.put({ path: '/battle/checkpoint/', params: params})
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