/* eslint-disable */

import axios from 'axios'
import Moment from 'moment'
import Vue from 'vue'
import {ToastPlugin, AlertPlugin, ConfirmPlugin, LoadingPlugin} from 'vux'
import _ from 'lodash'
import LocalForage from 'localforage'
import 'vue2-animate/src/vue2-animate.less'
import './assets/sass/screen.scss'
import App from './App'
import router from './router'
import store from './vuex/store'
import fnMixin from './assets/js/fn-mixins'
import Config from './assets/config/arguments.config'
import ConsoleTrigger from './assets/config/consoleTrigger'

import AV from 'leancloud-storage';
import {Realtime} from 'leancloud-realtime';
import {TypedMessagesPlugin} from 'leancloud-realtime-plugin-typed-messages';
import {GroupchatReceiptsPlugin} from 'leancloud-realtime-plugin-groupchat-receipts';
import {TypingIndicatorPlugin} from './typing-indicator';
import StickerMessage from './sticker-message';


const appId = 'bwx------自己应用的appId-------Hsz';
const appKey = 'eTVr-----自己应用的appKey--------tQp';
AV.init({appId, appKey});
const realtime = new Realtime({
  appId,
  appKey,
  plugins: [TypedMessagesPlugin, GroupchatReceiptsPlugin, TypingIndicatorPlugin],
  region: 'cn' // 美国节点为 "us"
});
realtime.register([StickerMessage]);

const currentEnv = Config.dev

Moment.locale('zh-CN')
LocalForage.setDriver(LocalForage.LOCALSTORAGE)
if (currentEnv.DEBUG || fnMixin.methods.urlParam('console') === 'true') {
  if ((/micromessenger/i).test(navigator.userAgent)) {
    require('vconsole/dist/vconsole.min')
  }
  Vue.config.devtools = true
} else {
  Vue.config.devtools = false
  ConsoleTrigger(false)
}

_.assign(Vue.prototype, {
  _,
  Moment,
  currentEnv,
  realtime
})

_.assign(window, {
  _,
  Vue,
  store,
  Moment,
  axios,
  LocalForage,
  currentEnv,
  realtime
})

axios.defaults.baseURL = currentEnv.wxServer
Vue.use(ToastPlugin)
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.use(LoadingPlugin)
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: {App},
})

router.beforeEach((to, from, next) => {
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
  next()
})

