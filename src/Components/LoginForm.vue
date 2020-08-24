<template>
    <form class="login-form" @submit.prevent="onSubmit">
        <slot name="header" />
        <input-field
            id="email"
            v-model="form.email"
            type="email"
            :errors="errors"
            :size="size"
            name="email"
            label="Email"
            placeholder="Email"
            custom />
        <input-field
            id="password"
            v-model="form.password"
            :errors="errors"
            type="password"
            :size="size"
            name="password"
            label="Password"
            placeholder="Password"
            custom />
        <btn-activity indicator="spinner" :activity="activity" :size="size" block>
            Login
        </btn-activity>
        <slot />
    </form>
</template>

<script>
import { authenticate } from '../Auth';
import BtnActivity from '@vue-interface/btn-activity';
import InputField from '@vue-interface/input-field';
import Sizeable from '@vue-interface/sizeable';

export default {

    name: 'LoginForm',

    components: {
        InputField,
        BtnActivity,
    },

    mixins: [
        Sizeable
    ],

    props: {

        size: {
            type: String,
            default: 'lg'
        },

        redirect: [Object, String]

    },

    data() {
        return {
            test: 'test',
            form: {},
            errors: {},
            activity: false
        };
    },

    methods: {
        onSubmit(e) {
            this.$emit('submit', e);
            this.activity = true;

            authenticate(this.form)
                .then(user => {
                    this.$emit('authenticate', user);
                    this.redirect && this.$router.push(this.redirect);
                }, error => {
                    this.errors = error.response && error.response.data && error.response.data.errors;
                    this.$emit('error', this.errors);
                })
                .finally(() => {
                    this.activity = false;
                });
        }

    }
};
</script>
