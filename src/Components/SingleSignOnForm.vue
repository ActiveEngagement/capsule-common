<template>
    <form class="redirect-form" @submit.prevent="onSubmit">
        <slot name="header" />

        <div class="bg-light p-3 mb-3 rounded d-flex">
            <font-awesome-icon :icon="['fab', 'salesforce']" size="4x" class="mr-3" style="color: #449AD6" />

            <div class="font-lg">You must have a Salesforce account with Active Engagement to login. Clicking the login button will redirect you to Salesforce.</div>
        </div>

        <alert v-if="errors && Object.entries(errors).length" variant="danger" class="mt-3">
            <div v-for="error in errors" :key="error.join('.')" v-html="error.join('<br>')" />
        </alert>

        <btn-activity
            ref="button"
            indicator="spinner"
            :activity="activity"
            :size="size"
            block>
            <font-awesome-icon :icon="['fab', 'salesforce']" class="mr-2"/> Login with Salesforce
        </btn-activity>

        <slot />
    </form>
</template>

<script>
import { Alert } from '@vue-interface/alert';
import BtnActivity from '@vue-interface/btn-activity';
import InputField from '@vue-interface/input-field';
import Sizeable from '@vue-interface/sizeable';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSalesforce } from '@fortawesome/free-brands-svg-icons';

library.add(faSalesforce);

export default {

    components: {
        Alert,
        InputField,
        BtnActivity,
        FontAwesomeIcon,
    },

    mixins: [
        Sizeable
    ],

    props: {
        errors: Object
    },

    data() {
        return {
            activity: false
        };
    },

    methods: {
        onSubmit(e) {
            this.$emit('submit', this, e);
        }

    }
};
</script>
