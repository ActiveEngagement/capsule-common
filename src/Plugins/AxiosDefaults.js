let Axios;

export {
    Axios
};

export function headers(...args) {
    return Object.assign(Axios.defaults.headers, ...args);
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
    if(key && (key.secret_key || key.public_key)) {
        return authorize(key.secret_key || key.public_key);
    }

    return header('Authorization', key ? `Bearer ${key}` : null);
}

export default function(vue, options = {}) {
    if(!options.id) {
        throw new Error('AxiosDefaults plugin requires options.id.');
    }

    if(!options.Axios) {
        throw new Error('AxiosDefaults plugin requires options.Axios.');
    }

    Axios = vue.prototype.$http = options.Axios;
    Axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;

    if(!Axios.defaults.baseURL) {
        throw new Error('process.env.VUE_APP_BASE_URL is not defined.');
    }

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