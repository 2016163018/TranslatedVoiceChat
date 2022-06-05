<template>
<div class="chatroom-container">
  <div v-if="isJoined">
    <VoiceChat :socket="socket" @newMessage="handleNewMessage" />
    <MessageContainer :messages="messages" :message="message"/>
  </div>
  <div v-else>The room is not available</div>
</div>
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
    const message = ref('');

    const useSocket = () => {
      socket.value = io('/', {
        query: { roomId, locale: window.navigator.language }
      });

      const isSocketConnected = new Promise((resolve) => {
        socket.value.on('connect', () => {
          resolve();
        });
      });

      socket.value.on('joined', () => { isJoined.value = true; });
      socket.value.on('disconnect', () => { isJoined.value = false; });
      socket.value.on('receiveMessage', (message) => {
        const isMe = socket.value.id === message.id;
        messages.push({ isMe, ...message });
      });

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

    const handleNewMessage = (value) => {
      message.value = value;
    };

    return {isJoined, messages, socket, message, handleNewMessage};
  }
};
</script>

<style scoped>
.chatroom-container {
  max-width: 1200px;
  min-width: 500px;
  background-color: #ccd5ae;
  padding: 50px 30px;
  height: 100vh;
  box-sizing: border-box;
}

div {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
</style>
