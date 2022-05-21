<template>
  <div v-if="isJoined">
    <input @keydown="sendMessage"/>
    <MessageContainer :messages="messages"/>
    <VoiceChat :socket="socket"/>
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

    const sendMessage = (event) => {
      if (event.isComposing || event.key !== 'Enter') {
        return true;
      }

      socket.value.emit('sendMessage', event.target.value);
      event.target.value = '';
    };

    onMounted(async () => {
      const {isSocketConnected} = useSocket();
      await isSocketConnected;

      console.log('socket connected! :', socket.value.id);
    });

    onUnmounted(() => {
      socket.value.disconnect();
    });

    return {isJoined, sendMessage, messages, socket};
  }
};
</script>

<style></style>
