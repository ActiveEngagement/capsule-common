<script>
import { plugins, modules } from '..';

export default {

    props: {
        directives: {
            type: Object,
            default: () => {}
        },
        filters: {
            type: Object,
            default: () => {}
        },
        plugins: {
            type: Array,
            default: () => []
        },
        promises: {
            type: Array,
            default: () => []
        },
        render: Function,
        vue: Function
    },

    data: () => ({
        initialized: false
    }),

    mounted() {
        this.initialize();
    },

    methods: {

        initialize() {
            return Promise.all([
                this.initializePlugins(),
                this.initializeDirectives(),
                this.initializeFilters(),
                this.initializePromises()
            ]).finally(() => {
                this.initialized = true;
                this.$root.$emit('initialized');
            });
        },

        initializePlugins() {
            return plugins(this.plugins).then(plugins => {
                plugins.forEach(([ plugin, options ]) => {
                    this.vue.use(plugin, options);
                });
            });
        },

        initializeDirectives() {
            return Promise.all(modules(this.directives)).then(modules => {
                modules.forEach(([key, directive]) => {
                    this.vue.directive(key, directive);
                });
            });
        },

        initializeFilters() {
            return Promise.all(modules(this.filters)).then(modules => {
                modules.forEach(([key, filter]) => {
                    this.vue.filter(key, filter);
                });
            });
        },

        initializePromises() {
            return Promise.all(this.promises);
        }      
    },

    render(...args) {
        return this.render(...args);
    }
};
</script>