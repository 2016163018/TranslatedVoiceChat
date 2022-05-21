import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/components/Index';
import ChatRoom from '@/components/ChatRoom';
import PageNotFound from '@/components/PageNotFound';

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
      path: '/chat/:roomId',
      name: 'ChatRoom',
      component: ChatRoom
    },
    {
      path: '*',
      name: 'PageNotFound',
      component: PageNotFound
    }
  ]
});
