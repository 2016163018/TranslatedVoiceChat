<template>
  <div>
    <div>This is main page</div>
    <button @click="fetchRoomId">Create new room</button>
  </div>
</template>

<script>
import ChatRoom from './ChatRoom.vue';
import router from '../router';

export default {
  name: 'Index',
  components: { ChatRoom },
  setup () {
    const fetchRoomId = async () => {
      const res = await fetch('/chat/new');
      const {roomId} = await res.json();

      if (roomId) {
        router.push('/chat/' + roomId);
      } else {
        console.log('error!');
      }
    };

    return { fetchRoomId };
  }
};
</script>

<style></style>
