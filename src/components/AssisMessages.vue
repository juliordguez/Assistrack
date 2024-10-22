<template>
    <div class="messages">
      <h2>Messages</h2>
      <ul>
        <li v-for="message in messages" :key="message.id">
          <strong>{{ message.sender }}:</strong> {{ message.content }}
        </li>
      </ul>
      <form @submit.prevent="sendMessage">
        <input v-model="newMessage" type="text" placeholder="Type your message..." />
        <button type="submit">Send</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AssisMessages',
    data() {
      return {
        messages: [
          { id: 1, sender: 'John', content: 'Hello there!' },
          { id: 2, sender: 'Jane', content: 'Hi! How are you?' }
        ],
        newMessage: ''
      };
    },
    methods: {
      sendMessage() {
        if (this.newMessage.trim() !== '') {
          this.messages.push({
            id: this.messages.length + 1,
            sender: 'You',
            content: this.newMessage
          });
          this.newMessage = '';
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .messages {
    max-width: 600px;
    margin: 0 auto;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }
  form {
    display: flex;
    margin-top: 20px;
  }
  input[type="text"] {
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  button {
    padding: 10px;
    margin-left: 10px;
    background-color: #3498db;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  button:hover {
    background-color: #2980b9;
  }
  </style>
  