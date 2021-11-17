<script>
import { plugins, modules, promise } from '..';

export default {

    props: {
        directives: {
            type: Object,
            default: () => ({})
        },
        filters: {
            type: Object,
            default: () => ({})
        },
        initialize: {
            type: Function,
            default: async() => {}
        },
        plugins: {
            type: Array,
            default: () => ([])
        },
        promises: {
            type: Array,
            default: () => ([])
        },
        render: Function,
        Vue: Function
    },

    data: () => ({
        initialized: false
    }),

    async mounted() {
        await this.initializer();
    },

    methods: {

        async initializer() {
            await this.initialize();

            for(let initializer of [
                this.initializePromises,
                this.initializePlugins,
                this.initializeDirectives,
                this.initializeFilters,
            ]) {
                await initializer();
            }

            this.initialized = true;
            this.$root.$emit('initialized');
        },

        initializePlugins() {
            return plugins(this.plugins).then(plugins => {
                plugins.forEach(([ plugin, options ]) => {
                    this.Vue.use(plugin, options);
                });
            });
        },

        initializeDirectives() {
            return Promise.all(modules(this.directives)).then(modules => {
                modules.forEach(([key, directive]) => {
                    this.Vue.directive(key, directive);
                });
            });
        },

        initializeFilters() {
            return Promise.all(modules(this.filters || [])).then(modules => {
                modules.forEach(([key, filter]) => {
                    this.Vue.filter(key, filter);
                });
            });
        },

        initializePromises() {
            return Promise.all((this.promises || []).map(value => {
                return promise(value);
            }));
        }      
    },

    render(...args) {
        return this.render(...args);
    }
};
</script>