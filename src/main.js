import Vue from 'vue';
import Axios from 'axios';
import { AxiosDefaults } from './Plugins';

Vue.use(AxiosDefaults, Axios, {
    id: 'capsule-common'
});