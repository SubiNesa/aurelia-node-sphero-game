import { ApiService } from './api';
import { inject } from 'aurelia-framework';

@inject(ApiService)

export class BattleService {

    constructor(apiService) {
        this.api = apiService;
    };

    init() {
        return new Promise((resolve, reject) => {
            this.api.post({ path: '/battle/init/' })
                .then(httpResponse => {
                    var data = JSON.parse(httpResponse);
                    resolve(data);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }

    move(params) {
        return new Promise((resolve, reject) => {
            this.api.put({ path: '/battle/move/', params: params})
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