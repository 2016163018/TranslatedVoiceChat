<template>
    <audio ref="audio" autoplay controls volume />
</template>

<script>
import { onMounted, ref } from '@vue/composition-api';

export default {
  name: 'VoiceChat',
  props: {
    socket: Object
  },
  setup ({socket}) {
    const audioStream = ref();
    const audio = ref();

    const createPeerConnection = () => {
      const pc = new RTCPeerConnection({ iceServers: [{urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302', 'stun:stun3.l.google.com:19302']}] });
      audioStream.value.getTracks().forEach(track => pc.addTrack(track));

      const offer = async () => {
        const description = await pc.createOffer();
        await pc.setLocalDescription(description);
        socket.emit('sendSDP', description);
      };

      const answer = async (remoteDescription) => {
        await pc.setRemoteDescription(remoteDescription);

        if (remoteDescription.type !== 'offer') {
          return;
        }

        const description = await pc.createAnswer();
        await pc.setLocalDescription(description);
        socket.emit('sendSDP', description);
      };

      const sendICE = ({candidate}) => {
        if (!candidate) {
          return;
        }
        socket.emit('sendICE', candidate);
      };

      const receiveICE = ({candidate}) => {
        pc.addIceCandidate(candidate);
      };

      const receiveTrack = ({track}) => {
        const stream = new MediaStream([track]);
        audio.value.srcObject = stream;
      };

      pc.onicecandidate = sendICE;
      pc.ontrack = receiveTrack;

      socket.on('receiveSDP', answer);
      socket.on('receiveICE', receiveICE);
      socket.on('callNeeded', offer);
    };

    onMounted(async () => {
      audioStream.value = await navigator.mediaDevices.getUserMedia({audio: true});
      createPeerConnection();
      socket.emit('callNeeded');
    });

    return { audio };
  }
};
</script>

<style>

</style>
