<template>
    <audio ref="audio" autoplay volume/>
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
      const pc = new RTCPeerConnection();
      audioStream.value.getTracks().forEach(track => pc.addTrack(track));

      const offer = async () => {
        const description = await pc.createOffer();
        await pc.setLocalDescription(description);
        socket.emit('sendSDP', description);
        console.log('offer!');
      };

      const answer = async (remoteDescription) => {
        console.log(remoteDescription);
        await pc.setRemoteDescription(remoteDescription);

        if (remoteDescription.type !== 'offer') {
          return;
        }

        const description = await pc.createAnswer();
        await pc.setLocalDescription(description);
        socket.emit('sendSDP', description);
        console.log('answer!');
      };

      const sendICE = ({candidate}) => {
        socket.emit('sendICE', candidate);
      };

      const receiveICE = ({candidate}) => {
        pc.addIceCandidate(new RTCIceCandidate(candidate));
      };

      const receiveTrack = ({track}) => {
        const stream = new MediaStream([track]);
        audio.value.srcObject = stream;
        audio.value.load();
        audio.value.play();
      };

      pc.onicecandidate = sendICE;
      pc.ontrack = receiveTrack;

      socket.on('callNeeded', offer);
      socket.on('receiveSDP', answer);
      socket.on('receiveICE', receiveICE);

      socket.emit('callNeeded');
    };

    onMounted(async () => {
      audioStream.value = await navigator.mediaDevices.getUserMedia({audio: true});
      createPeerConnection();
    });

    return { audio };
  }
};
</script>

<style>

</style>
