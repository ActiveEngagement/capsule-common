import { promise, commentNode, user, Guard } from '..';

export const guard = new Guard;

export function extract(binding) {
    let verb = binding.arg, subject = binding.value;

    if(!verb && Array.isArray(subject)) {
        [verb, subject] = subject;
    }
    else if(binding.modifiers) {
        subject = Object.keys(binding.modifiers);
    }

    return { verb, subject };
}

export default function install(Vue, options = {}) {
    Vue.directive('can', (el, binding, vnode) => {
        const { verb, subject } = extract(binding);
        
        const uncommment = commentNode(el, vnode);

        promise(options.user || user).then(data => {
            if(guard.can(data, verb, subject)) {
                uncommment();
            }
        });
    });

    Vue.directive('cant', (el, binding, vnode) => {
        const { verb, subject } = extract(binding);
        
        const uncommment = commentNode(el, vnode);

        promise(options.user || user).then(data => {
            if(!guard.can(data, verb, subject)) {
                uncommment();
            }
        });
    });
    
    if(typeof options.install === 'function') {
        options.install(guard, options);
    }
}