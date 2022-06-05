<template>
    <audio ref="audio" autoplay controls volume />
</template>

<script>
import { onMounted, ref, watch } from '@vue/composition-api';

export default {
  name: 'VoiceChat',
  props: {
    socket: Object
  },
  setup ({socket}, {emit}) {
    const audio = ref();
    const lastResult = ref({text: '', isFinal: false});
    const recognition = ref();

    const createPeerConnection = async () => {
      const makePC = async () => {
        const pc = new RTCPeerConnection({ iceServers: [{urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302', 'stun:stun3.l.google.com:19302']}] });
        const audioStream = await navigator.mediaDevices.getUserMedia({audio: true});
        audioStream.getTracks().forEach(track => pc.addTrack(track));

        return pc;
      };

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

      const pc = await makePC();

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
        emit('newMessage', lastResult.value.text);
      };

      const makeNewRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const newRecognition = new SpeechRecognition();

        newRecognition.lang = navigator.language;
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
      useSpeechRecognition();
      await createPeerConnection();
      socket.emit('callNeeded');
    });

    watch(() => lastResult.value, () => {
      if (lastResult.value.isFinal) {
        socket.emit('sendMessage', {text: lastResult.value.text});
      }
    });

    return { audio, lastResult, createPeerConnection };
  }
};
</script>

<style>

</style>
