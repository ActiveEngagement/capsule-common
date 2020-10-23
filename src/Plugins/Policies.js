import { promise, commentNode, user, Guard } from '..';

export const guard = new Guard;

export function extract(binding) {
    let verb = binding.arg, subject = binding.value;

    if(!verb && Array.isArray(subject)) {
        [verb, subject] = subject;
    }
    else if(binding.modifiers) {
        [ subject ] = Object.keys(binding.modifiers);
    }

    return { verb, subject };
}

export default function install(Vue, options = {}) {
    if(!options.user && typeof options.user === 'function') {
        throw new Error('You must define options.user()');
    }

    Vue.directive('can', async (el, binding, vnode) => {
        const { verb, subject } = extract(binding);
        
        const uncommment = commentNode(el, vnode);
    
        if(guard.can(options.user(), verb, subject)) {
            uncommment();
        }
    });

    Vue.directive('cant', (el, binding, vnode) => {
        const { verb, subject } = extract(binding);
        
        const uncommment = commentNode(el, vnode);
    
        if(!guard.can(options.user(), verb, subject)) {
            uncommment();
        }
    });
    
    if(typeof options.install === 'function') {
        options.install(guard, options);
    }
}