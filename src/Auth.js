import { isExpired } from './Functions';
import { axios, authorize, isAuthorized } from './Plugins/AxiosDefaults';
import { cache, config, removeConfig } from 'vuex-persistent-plugin';


export function merge(data, ...args) {
    return Object.assign(data || {},  ...args, {
        is: (...roles) => is(data, roles)
    });
}

export function is(user, roles) {
    if(!Array.isArray(roles)) {
        roles = [roles];
    }
    
    return roles.filter(subject => {
        return user && user.teams && !!user.teams.find(team => {
            return team.roles && team.roles.find(role => {
                return subject === role.slug ||
                    subject === role.name ||
                    subject === role.id;
            });
        });
    }).length > 0;
}

export async function preflight(length = 300) {
    return cache('user.preflight', async() => {
        return await axios.options('auth/user').then(({ data }) => data);
    }, length);
}

export async function forgotPassword(email) {
    const { data } = await axios.post('auth/forgot-password', (
        typeof email === 'object' ? email : { email } 
    ));

    return data;
}

export async function redirect(redirect_uri) {
    if(typeof redirect_uri === 'function') {
        redirect_uri = redirect_uri();
    }

    const { data } = await axios.get('saml2/redirect', {
        params: {
            redirect_uri
        }
    });

    return data;
}

export async function authenticate(email) {
    const { data } = await axios.post('auth/user', (
        typeof email === 'object' ? email : {
            email: email,
            password: password
        })
    );

    await config('user', data);

    authorize(data);

    return data;
}

export async function logout() {
    const user = await config('user');

    authorize(null);

    await removeConfig('user');

    return user;
}

export async function user() {
    const doc = await config('user');

    if(doc) {
        const { $cachedAt, data } = doc;
        
        // Merge the saved data.
        merge(data);

        // Authorize from the stored doc.
        if(!isAuthorized()) {
            authorize(await config('user.token'));
        }

        // Fetch the latest user with a preflight request.
        const user = await preflight();

        // If the user has not been updated since the authentication,
        // then proceed and resolve the promise.
        if(isExpired($cachedAt, user.updated_at)) {
            await config('set', merge(user));
        }

        return user;
    }

    // Throw a session expired error.
    throw new Error('Session has expired!');
}
