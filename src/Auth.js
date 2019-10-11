import Axios from 'axios';
import { isExpired } from './Functions';
import { authorize } from './Plugins/AxiosDefaults';
import { purge, cache, get} from 'vuex-persistent-plugin';

export function is(user, ...roles) {
    return roles.filter(subject => {
        return !!user.teams.find(team => {
            return team.roles && team.roles.find(role => {
                return subject === role.slug ||
                    subject === role.name ||
                    subject === role.id;
            });
        });
    }).length > 0;
}

export async function preflight(length = 60) {
    return cache('preflight', () => {
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
    authorize(null);

    await purge('user');
}

export async function user() {
    let doc = await get('user');

    doc && authorize(doc.data);

    if(!doc) {
        return await cache('user', async () => {
            const { data } = Axios.get('auth/user');
            
            return data && Object.assign(authorize(data), {
                is: (...roles) => is(data, ...roles)
            });
        });
    }
    else {
        const { $cachedAt, data } = doc;
        const { client, updated_at } = await preflight();

        if(isExpired($cachedAt, updated_at)) {
            await purge('user');

            return await user();
        }
        
        return Object.assign(data, {
            client, is: (...roles) => is(data, roles)
        });
    }
}
