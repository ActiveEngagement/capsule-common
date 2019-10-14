let Axios = require('axios');

import deepExtend from 'deep-extend';
import Request from 'vue-interface/src/Http/Request';

export function defaults(...args) {
    if(args.length) {
        Request.defaults = deepExtend(Axios.defaults, ...args);
    }

    return Axios.defaults;
}

export function headers(...args) {
    if(args.length) {
        defaults({
            headers: Object.assign(...args)
        });
    }
    
    return Axios.defaults.headers;
}

export function header(key, value) {
    if(typeof value === 'undefined') {
        return Axios.defaults.headers[key];
    }

    return headers({
        [key]: value
    });
}

export function authorize(key) {
    if(typeof key === 'object') {
        authorize(key.secret_key);
        
        return key;
    }

    return header('Authorization', key ? `Bearer ${key}` : null);
}

export default async function(vue, options = {}) {
    vue.$http = Axios;
    
    if(!options.id) {
        throw new Error('AxiosDefaults plugin requires options.id to be set.');
    }

    Axios.defaults.baseURL = process.env.NODE_ENV === 'development' ?
        'http://api.thecapsule.test/v1' :
        'http://api.thecapsule.email/v1';

    Axios.interceptors.response.use(response => response, error => {
        if(typeof options.error === 'function') {
            options.error(vue);
        }

        throw error;
    });

    headers({
        'Accept': 'application/json',
        'Capsule-Client-Id': options.id,
        'Capsule-Client-Version': options.version,
        'Capsule-Client-Platform': options.platform || 'chrome',
    });

    console.log(Axios.defaults.baseURL);
}