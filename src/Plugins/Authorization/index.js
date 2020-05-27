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
    factory.install = data => {
        return promise(data).then(data => {
            Vue.directive('can', (el, binding, vnode) => {
                const { verb, subject } = extract(binding);
        
                if(!factory.can(data, verb, subject)) {
                    commentNode(el, vnode);
                }
            });
            
            Vue.prototype.$can = (verb, subject, ...args) => {
                return factory.can(data, verb, subject, ...args);
            };
    
            if(typeof options.install === 'function') {
                options.install(factory, data, options);
            }
            
            return data;
        });
    };

    factory.install(data);
}