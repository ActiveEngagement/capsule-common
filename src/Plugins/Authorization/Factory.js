export default class Factory {

    constructor() {
        this.$before = [];
        this.$rules = new Map;
        this.$aliases = new Map;
    }
    
    get aliases() {
        return this.$aliases;
    }

    set aliases(values) {
        this.$aliases = new Map(values);
    }
    
    get rules() {
        return this.$rules;
    }

    set rules(values) {
        this.$rules = new Map(values);
    }

    get policies() {
        return this.$policies;
    }

    set policies(values) {
        this.$policies = new Map(values);
    }

    alias(key, value) {
        this.aliases.set(key, value);
    }
    
    before(fn) {        
        if(!(fn instanceof Function)) {
            throw Error('Must be a Function.');
        }

        this.$before.push(fn);
    }

    rule(key, fn) {
        if(!(fn instanceof Function)) {
            throw Error('Rule must be a Function that returns a boolean value.');
        }

        this.rules.set(key, fn);

        return this;
    }

    policy(subject, policy) {
        if(!(policy instanceof Object)) {
            throw Error('Policy must be instance of an object.');
        }

        this.rules.set(subject, policy);

        return this;
    }

    can(user, verb, subject, ...args) {
        if(this.aliases.get(subject)) {
            subject = this.aliases.get(subject);
        }

        if(this.passesBeforeCheck(user, verb, subject, ...args)) {
            return true;
        }

        const rule = this.rules.get(subject) || this.rules.get(verb);

        if(typeof rule === 'object') {
            return this.validate(user, rule[verb], ...args);
        }

        return this.validate(user, rule, ...args);
    }

    passesBeforeCheck(user, verb, subject, ...args) {
        for(const i in this.$before) {
            if(this.$before[i](user, verb, subject, ...args)) {
                return true;
            }
        }

        return false;
    }

    validate(user, fn, ...args) {
        if(typeof fn === 'undefined') {
            return false;
        }

        if(typeof fn === 'boolean') {
            return fn;
        }

        if(!(fn instanceof Function)) {
            throw Error('Rule validator must be instance of a function');
        }

        return !!fn(user, ...args);
    }
}