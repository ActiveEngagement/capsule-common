let axios;

export {
    axios
};

export function headers(...args) {
    return Object.assign(axios.defaults.headers, ...args);
}

export function header(key, value) {
    if(typeof value === 'undefined') {
        return axios.defaults.headers[key];
    }

    return headers({
        [key]: value
    });
}

export function isAuthorized() {
    return !!header('Authorization');
}

export function authorize(key) {
    if(key && typeof key === 'object') {
        key = key.secret_key || key.public_key;
    }

    return header('Authorization', key ? `Bearer ${key}` : null);
}

export default function(vue, options = {}) {
    if(!options.id) {
        throw new Error('AxiosDefaults plugin requires options.id.');
    }

    if(!options.axios) {
        throw new Error('AxiosDefaults plugin requires options.axios.');
    }

    axios = vue.prototype.$http = options.axios;
    axios.defaults.baseURL = options.baseURL || process.env.VUE_APP_BASE_URL;

    if(!axios.defaults.baseURL) {
        throw new Error('process.env.VUE_APP_BASE_URL is not defined.');
    }

    axios.interceptors.response.use(response => response, error => {
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