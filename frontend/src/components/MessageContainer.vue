<template>
<div class="message-container">
  <div class="message-title">채팅 내역</div>
    <div class="message-wrapper">
      <div class="message" v-for="(message, index) in messages" :key="index">
        <span class="message-sender">{{message.isMe ? "나" : "상대"}}</span>
        <span class="message-content">{{!message.isMe && message.translatedText ? `${message.translatedText} (${message.text})`: message.text }}</span>
      </div>
  </div>
  <div class="message-writing">{{message}}</div>
</div>

</template>

<script>
export default {
  name: 'MessageContainer',
  props: {
    messages: Array,
    message: String
  }
};
</script>

<style scoped>
  .message-container {
    width: 80%;
    min-width: 500px;
    margin-top: 50px;
  }
  .message-wrapper {
    width: 100%;
    background-color: #fefae0;
    height: 65vh;
    align-items: flex-start;
    overflow-y: scroll;
    box-shadow: 0px 10px 13px -2px rgba(0,0,0,0.3);
    box-sizing: border-box;
    padding: 20px;
  }
  .message-wrapper::-webkit-scrollbar {
    width: 10px;
  }
  .message-wrapper::-webkit-scrollbar-thumb {
    background-color: #D4A373;
    border-radius: 10px;
  }
  .message-title {
    font-size: 20px;
    font-weight: bold;
    color: #d4a373;
    background-color: #FAEDCD;
    padding: 20px 0;
    border-radius: 20px 20px 0 0;
    width: 100%;
  }
  .message{
    display: flex;
    align-items: center;
    margin: 10px 20px;
  }
  .message-sender{
    width: 50px;
    font-weight: bold;
    color: #D4A373;
  }
  .message-content {
    display: flex;
    padding: 10px 40px;
    background-color: #E9EDC9;
    border-radius: 10px;
    max-width: 80%;
    word-break: break-all;
  }
  .message-writing {
    background-color: #FAEDCD;
    width: 100%;
    padding: 25px 50px;
    box-sizing: border-box;
    border-radius: 0 0 20px 20px;
    text-align: left;
  }
</style>
