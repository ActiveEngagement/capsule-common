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

export default function install(Vue, data, options = {}) {
    Vue.directive('can', (el, binding, vnode) => {
        const { verb, subject } = extract(binding);
        
        const uncommment = commentNode(el, vnode);

        promise(data).then(data => {
            if(factory.can(data, verb, subject)) {
                uncommment();
            }
        });
    });

    Vue.directive('cant', (el, binding, vnode) => {
        const { verb, subject } = extract(binding);
        
        const uncommment = commentNode(el, vnode);

        promise(data).then(data => {
            if(!factory.can(data, verb, subject)) {
                uncommment();
            }
        });
    });
    
    if(typeof options.install === 'function') {
        options.install(factory, data, options);
    }
}