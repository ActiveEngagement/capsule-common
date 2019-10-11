<template>
    <form @submit.prevent="onSubmit">
        <input-field id="email" v-model="form.email" type="email" :errors="errors" :size="size" name="email" label="Email" placeholder="Email" custom />
        <btn-activity :activity="activity" :size="size" block>
            Reset Password
        </btn-activity>
        <slot />
    </form>
</template>

<script>
import { forgotPassword } from '../Auth';
import Sizeable from 'vue-interface/src/Mixins/Sizeable';
import InputField from 'vue-interface/src/Components/InputField';
import BtnActivity from 'vue-interface/src/Components/BtnActivity';

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
