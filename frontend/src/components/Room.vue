<template>
  <div>
    <div>This is Room</div>
  </div>
</template>

<script>
import { io } from 'socket.io-client';

export default {
  name: 'Room',
  setup () {
    const socket = io('/');

    socket.on('connect', () => console.log('connected!!'));
    socket.on('chat', (param) => console.log(param));

    return { socket };
  }
};
</script>

<style></style>
