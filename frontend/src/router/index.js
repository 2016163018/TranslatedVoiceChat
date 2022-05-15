import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/components/Index';
import ChatRoom from '@/components/ChatRoom';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/chat',
      name: 'ChatRoom',
      component: ChatRoom
    }
  ]
});
