import Factory from './Factory';
import { promise, commentNode } from '../../Functions';

export const factory = new Factory;

export function extract(binding) {
    let verb = binding.arg, subject = binding.value;

    if(!verb && Array.isArray(subject)) {
        [verb, subject] = subject;
    }

    return { verb, subject };
}

export default function install(Vue, data, fn, options = {}) {
    if(typeof fn === 'function') {
        Object.assign(options, fn(factory, options));
    }

    Vue.prototype.$can = (verb, subject, ...args) => {
        return factory.can(data, verb, subject, ...args);
    };

    Vue.directive('can', (el, binding, vnode) => {
        const { verb, subject } = extract(binding);

        if(!factory.can(data, verb, subject)) {
            commentNode(el, vnode);
        }
    });

    factory.install = () => {
        return promise(data).then(user => {
            data = user;

            if(typeof options.install === 'function') {
                options.install(Vue, data, options);
            }

            return data;
        });
    };

    factory.install();
}