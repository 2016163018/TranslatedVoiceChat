<template>
<div>
    <audio ref="audio" autoplay controls volume />
    <div>{{ lastResult.text }}</div>
</div>

</template>

<script>
import { onMounted, ref, watch } from '@vue/composition-api';

export default {
  name: 'VoiceChat',
  props: {
    socket: Object
  },
  setup ({socket}) {
    const audioStream = ref();
    const audio = ref();
    const lastResult = ref({text: ''});
    const recognition = ref();

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

    const useSpeechRecognition = () => {
      const handleResult = ({ results }) => {
        const last = Array.from(results[results.length - 1]);
        lastResult.value = {
          text: last.reduce((prev, curr) => prev + curr.transcript, '').trim(),
          isFinal: results[results.length - 1].isFinal
        };
      };

      const makeNewRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const newRecognition = new SpeechRecognition();

        newRecognition.continuous = true;
        newRecognition.interimResults = true;

        newRecognition.onresult = handleResult;
        newRecognition.onaudioend = () => {
          makeNewRecognition();
        };

        newRecognition.start();

        if (recognition.value) {
          recognition.value.onaudioend = null;
        }

        recognition.value = newRecognition;
      };

      makeNewRecognition();
    };

    onMounted(async () => {
      audioStream.value = await navigator.mediaDevices.getUserMedia({audio: true});
      createPeerConnection();
      socket.emit('callNeeded');
      useSpeechRecognition();
    });

    watch(lastResult, () => {
      if (lastResult.value.isFinal) {
        socket.emit('sendMessage', lastResult.value.text);
      }
    });

    return { audio, audioStream, lastResult };
  }
};
</script>

<style>

</style>
