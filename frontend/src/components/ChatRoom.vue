<template>
  <div>
    <div v-if="isJoined">This is Room</div>
    <div v-else>The room is not available</div>
  </div>
</template>

<script>
import { io } from 'socket.io-client';

import { onMounted, onUnmounted, ref } from '@vue/composition-api';
import router from '../router';

export default {
  name: 'ChatRoom',
  setup () {
    const isJoined = ref(false);
    const socket = ref();
    const roomId = router.currentRoute.params.roomId;

    const useSocket = () => {
      socket.value = io('/', {
        query: { roomId }
      });

      const isSocketConnected = new Promise((resolve) => {
        socket.value.on('connect', () => {
          resolve();
        });
      });

      socket.value.on('joined', () => { isJoined.value = true; });
      socket.value.on('chat', (param) => console.log(param));
      socket.value.on('disconnect', () => { isJoined.value = false; });

      return { isSocketConnected };
    };

    onMounted(async () => {
      const {isSocketConnected} = useSocket();
      await isSocketConnected;

      console.log('socket connected! :', socket.value.id);
    });

    onUnmounted(() => {
      socket.value.disconnect();
    });

    return {isJoined};
  }
};
</script>

<style></style>
