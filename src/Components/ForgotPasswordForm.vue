<template>
    <form @submit.prevent="onSubmit">
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
        <btn-activity indicator="spinner" :activity="activity" :size="size" block>
            Send Reset Email
        </btn-activity>
        <slot />
    </form>
</template>

<script>
import { forgotPassword } from '../Auth';
import BtnActivity from '@vue-interface/btn-activity';
import InputField from '@vue-interface/input-field';
import Sizeable from '@vue-interface/sizeable';

export default {

    name: 'ForgotPasswordForm',

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
            form: {},
            errors: {},
            error: null,
            activity: false
        };
    },

    methods: {

        onSubmit(e) {
            this.errors = {};
            this.activity = true;
            
            forgotPassword(this.form)
                .then(data => {
                    this.$emit('success', data);
                    this.redirect && this.$router.push(this.redirect);
                }, e => {
                    if(e.response) {
                        this.errors = e.response.data.errors;
                    }
                    else {
                        this.error = e;
                        this.$emit('error', e);
                    }
                })
                .finally(() => {
                    this.activity = false;
                });
        }

    }
};
</script>
