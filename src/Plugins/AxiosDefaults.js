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
    
    Object.keys(Axios.defaults.headers).forEach(key => {
        if(Axios.defaults.headers[key] === undefined) {
            delete Axios.defaults.headers[key];
        }
    });

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
    if(key && key.secret_key) {
        authorize(key.secret_key);
        
        return key;
    }

    return header('Authorization', key ? `Bearer ${key}` : null);
}

export default function(vue, options = {}) {
    if(!options.id) {
        throw new Error('AxiosDefaults plugin requires options.id to be set.');
    }
    
    if(vue && typeof vue === 'object') {
        vue.$http = Axios;
    }

    Axios.defaults.baseURL = process.env.NODE_ENV === 'development' ?
        'http://api.thecapsule.test/v1' :
        'https://api.thecapsule.email/v1';

    Axios.interceptors.response.use(response => response, error => {
        if(typeof options.error === 'function') {
            options.error(vue, error);
        }

        throw error;
    });

    headers({
        'Accept': 'application/json',
        'Capsule-Client-Id': options.id,
        'Capsule-Client-Version': options.version,
        'Capsule-Client-Platform': options.platform || 'chrome',
    });
}