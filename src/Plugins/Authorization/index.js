import Factory from './Factory';
import { promise, commentNode } from '../../Functions';

function extract(binding) {
    let verb = binding.arg, subject = binding.value;

    if(!verb && Array.isArray(subject)) {
        [verb, subject] = subject;
    }

    return {
        verb,
        subject
    };
}

export const factory = new Factory;

export default function install(Vue, user, fn, options = {}) {
    if(fn instanceof Function) {
        fn(factory, options);
    }

    Vue.prototype.$can = (verb, subject, ...args) => {
        return factory.can(user, verb, subject, ...args);
    };

    Vue.directive('can', (el, binding, vnode) => {
        promise(user).then(user => {
            const { verb, subject } = extract(binding);

            if(!factory.can(user, verb, subject)) {
                commentNode(el, vnode);
            }
        });
    });
}