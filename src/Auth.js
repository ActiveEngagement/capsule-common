import Axios from 'axios';
import { isExpired } from './Functions';
import { authorize } from './Plugins/AxiosDefaults';
import { purge, cache, get, config } from 'vuex-persistent-plugin';

export function merge(data, ...args) {
    return Object.assign(data || {}, {
        is: (...roles) => is(data, roles)
    }, ...args);
}

export function is(user, ...roles) {
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

export function preflight(length = 60) {
    return cache('user.preflight', () => {
        return Axios.options('auth/user').then(({ data }) => data);
    }, length);
}

export async function forgotPassword(email) {
    const { data } = await Axios.post('auth/forgot-password', (
        typeof email === 'object' ? email : { email } 
    ));

    return data;
}

export async function authenticate(email, password) {
    const { data } = await Axios.post('auth/user', (
        typeof email === 'object' ? email : {
            email: email,
            password: password
        })
    );

    await purge('user');
    await cache('user', authorize(data));

    return data;
}

export async function logout() {
    const user = await config('user');

    authorize(null);

    await purge('user');

    return user;
}

export async function user() {
    const doc = await get('user').catch(e => undefined);

    if(doc) {
        const { $cachedAt, data } = doc;

        authorize(data);

        const { client, updated_at } = await preflight();

        if(isExpired($cachedAt, updated_at)) {
            purge('user');
            
            return await user();
        }

        return merge(data, {
            client
        });
    }

    return await cache('user', async() => {
        const { data } = await Axios.get('auth/user');

        return merge(authorize(data));
    });
}
