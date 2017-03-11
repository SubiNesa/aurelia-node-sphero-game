import { HttpClient } from 'aurelia-http-client';
import { inject } from 'aurelia-framework';

@inject(HttpClient)

export class ApiService {

    constructor(httpClient) {
        this.http = httpClient.configure(config => {
            config.withBaseUrl('http://localhost:9000/api');
        });
    };


    get(options) {
        return new Promise((resolve, reject) => {
            this.http.createRequest(options.path)
                .asGet()
                .withParams(options.params)
                .send()
                .then(httpResponse => {
                    resolve(httpResponse.response);
                })
                .catch((err) => {
                    return reject(err);
                });
        });
    }

    // save new
    post(options) {
        return new Promise((resolve, reject) => {
            this.http.createRequest(options.path)
                .asPost()
                .withContent(options.params)
                .send()
                .then(httpResponse => {
                    if (httpResponse.statusCode >= 200 && httpResponse.statusCode < 300) {
                        resolve(httpResponse.response);
                    } else {
                        reject(httpResponse);
                    }
                })
                .catch((err) => {
                    return reject(err);
                });
        });
    }

    // save edit
    put(options) {
        return new Promise((resolve, reject) => {
            this.http.createRequest(options.path)
                .asPut()
                .withParams(options.params)
                .withContent(options.params)
                .send()
                .then(httpResponse => {
                    resolve(httpResponse.response);
                })
                .catch((err) => {
                    return reject(err);
                });
        });
    }
}
