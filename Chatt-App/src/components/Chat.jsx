import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const fetchMessages = async () => {
    const response = await axios.get('https://chatify-api.up.railway.app/messages', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    setMessages(response.data);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    await axios.post('https://chatify-api.up.railway.app/messages', { content: newMessage }, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    setNewMessage('');
    fetchMessages();
  };

  const handleDeleteMessage = async (id) => {
    await axios.delete(`https://chatify-api.up.railway.app/messages/${id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    fetchMessages();
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className={msg.userId === JSON.parse(localStorage.getItem('user')).id ? 'my-message' : 'other-message'}>
            <p>{msg.content}</p>
            <button onClick={() => handleDeleteMessage(msg.id)}>Delete</button>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} required />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
