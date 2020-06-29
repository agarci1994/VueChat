import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify, {
    theme: {
        primary: '#3C63BD',
        secondary: '#6963B9',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAf50',
        warning: '#FFc100'
    },
    customProperties: true,
    iconfont: 'md'
});

export default new Vuetify({});