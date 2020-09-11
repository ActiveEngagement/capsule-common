<script>
import { plugins, user, modules, promise } from '..';
import { sequence } from '@vue-interface/utils';

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
        indicators: {
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
        vue: Function
    },

    data: () => ({
        initialized: false,
        showActivity: false
    }),

    mounted() {
        this.initialize();
    },

    created() {
        this.$root.$on('activity', value => this.showActivity = value);
    },

    methods: {

        initialize() {
            this.initialized = false;

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

    render(h) {
        if(!this.$slots.default || !this.initialized || this.showActivity) {
            return this.$scopedSlots.indicator;
        }

        return this.$slots.default[0];
    }
};
</script>