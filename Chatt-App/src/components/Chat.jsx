import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Styling/Chat.css';
import DOMPurify from 'dompurify';

const Chat = () => {
  const [messages, setMessages] = useState([]); // Array för att lagra meddelanden
  const [newMessage, setNewMessage] = useState(''); // För att skriva nya meddelanden
  
  const [fakeChat] = useState([
    {
      text: "Tja",
      avatar: "https://i.pravatar.cc/100?img=14",
      username: "Johnny",
      id: 1
    },
    {
      text: "Hallå!! Svara då!!",
      avatar: "https://i.pravatar.cc/100?img=14",
      username: "Johnny",
      id: 2
    },
    {
      text: "Sover du eller?! 😴",
      avatar: "https://i.pravatar.cc/100?img=14",
      username: "Johnny",
      id: 3
    }
  ]);

  const loggedInUser = JSON.parse(localStorage.getItem('user')); // Retrieve logged-in user's data
  if (!loggedInUser) {
    return null; // or redirect to login
  }

  // Hämta JWT-token från localStorage
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    // Funktion för att hämta alla meddelanden
    const fetchMessages = async () => {
      const url = `https://chatify-api.up.railway.app/messages`;

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`, // Använd JWT-token för att autentisera
          },
        });

        // Lägg till både dina och fejkmeddelandena i meddelandelistan
        setMessages([...fakeChat, ...response.data,]);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages(); // Kör funktionen vid komponentens första render
  }, [token, fakeChat]);

  // Funktion för att skicka ett nytt meddelande
  const sendMessage = async (e) => {
    e.preventDefault();
    const sanitizedMessage = DOMPurify.sanitize(newMessage);

        //const conversationId = '550e8400-e29b-41d4-a716-446655440000'; // Definiera conversationId
        const url = `https://chatify-api.up.railway.app/messages`;
        //console.log('Sending message with conversationId:', conversationId);

   

    try {
      const response = await axios.post(
        url,
        {
          text: sanitizedMessage,
          avatar: 'https://i.pravatar.cc/100', // Användarens avatar (exempel)
          username: loggedInUser.username, // Användarnamn (exempel)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Lägg till det nya meddelandet i listan
      setMessages((newMessages) => [...newMessages, response.data]);
      setNewMessage(''); // Rensa input-fältet efter att meddelandet skickats
    } catch (error) {
      console.error('Failed to send message:', error.response ? error.response.data : error.message);
    }
  };

  // Funktion för att radera ett meddelande
  const deleteMessage = async (msgId) => {
    const url = `https://chatify-api.up.railway.app/messages/${msgId}`;

    try {
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Filtrera bort det raderade meddelandet från listan
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== msgId));
    } catch (error) {
      console.error('Failed to delete message:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-app">
        <div className="messages">
          {/* Visa alla meddelanden */}
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.username === loggedInUser.username ? 'my-message' : 'other-message'}`}>
              <div className="message-header">
                <img src={msg.avatar} alt={msg.username} className="avatar" />
                <span className="username"><p>{msg.username}</p></span>
              </div>
              <div><p>{msg.text}</p></div>
              
              {msg.username === loggedInUser.username && (
                <button className="delete-button" onClick={() => deleteMessage(msg.id)}>
                  Radera
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Formulär för att skriva nya meddelanden */}
        <div className="message-form">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Skriv ett meddelande..."
          />
          <button onClick={sendMessage}>Skicka</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
