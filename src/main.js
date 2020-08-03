import Vue from 'vue';
import { user } from './index';
import Axios from 'axios';
import { authenticate } from './Auth';
import { AxiosDefaults } from './Plugins';
import { authorize } from './Plugins/AxiosDefaults';
import { get, save, post, put, cache, purge } from 'vuex-persistent-plugin';

Vue.use(AxiosDefaults, Axios, {
    id: 'capsule-common'
});