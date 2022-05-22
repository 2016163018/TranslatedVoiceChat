<template>
  <div v-if="isJoined">
    <VoiceChat :socket="socket"/>
    <MessageContainer :messages="messages"/>
  </div>
  <div v-else>The room is not available</div>
</template>

<script>
import { io } from 'socket.io-client';

import { onMounted, onUnmounted, reactive, ref } from '@vue/composition-api';
import router from '../router';
import MessageContainer from './MessageContainer.vue';
import VoiceChat from './VoiceChat.vue';

export default {
  name: 'ChatRoom',
  components: {MessageContainer, VoiceChat},
  setup () {
    const isJoined = ref(false);
    const socket = ref();
    const messages = reactive([]);
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
      socket.value.on('receiveMessage', (message) => messages.push(message));
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

    return {isJoined, messages, socket};
  }
};
</script>

<style></style>
