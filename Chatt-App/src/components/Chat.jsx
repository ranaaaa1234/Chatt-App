import React, { useState } from 'react';
import '../Styling/Chat.css';
import DOMPurify from 'dompurify';

// Fake chat messages
const fakeChat = [
  {
    text: "Tja tja, hur mår du?",
    avatar: "https://i.pravatar.cc/100?img=14",
    username: "Johnny",
    conversationId: null
  },
  {
    text: "Hallå!! Svara då!!",
    avatar: "https://i.pravatar.cc/100?img=14",
    username: "Johnny",
    conversationId: null
  },
  {
    text: "Sover du eller?! 😴",
    avatar: "https://i.pravatar.cc/100?img=14",
    username: "Johnny",
    conversationId: null
  }
];


const Chat = () => {
  const [messages, setMessages] = useState([]); // State to store chat messages
  const [newMessage, setNewMessage] = useState(''); // State to store the new message input
  const [fakeResponseIndex, setFakeResponseIndex] = useState(0); // State to track the current index of the fake chat response

  const loggedInUser = JSON.parse(localStorage.getItem('user')); // Retrieve logged-in user's data
  if (!loggedInUser) {
    console.error('User not logged in');
    return null; // or redirect to login
  }
  
  // Function to send a new message
  const handleSendMessage = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const sanitizedMessage = DOMPurify.sanitize(newMessage);


    const newMessageObj = {
      text: sanitizedMessage, // Set the new message text
      avatar: loggedInUser.avatar || "https://i.pravatar.cc/100?img=1", // Set the user's avatar or a default one
      username: loggedInUser.username, // Set the logged-in user's username
      conversationId: null // Set to null as it's a fake chat
    };


    // Add the user's message to the messages state
    setMessages((prevMessages) => [...prevMessages, newMessageObj]);
    setNewMessage(''); // Clear the input field after sending the message


    // Simulate a response from the fake chat after a short delay
    setTimeout(() => {
      if (fakeResponseIndex < fakeChat.length) {
        const fakeResponse = fakeChat[fakeResponseIndex]; // Get the next fake chat message in order
        setMessages((prevMessages) => [...prevMessages, fakeResponse]); // Add fake response to messages
        setFakeResponseIndex(fakeResponseIndex + 1); // Move to the next fake chat message
      }
    }, 1000); // 1-second delay for the fake response
  };


  // Function to delete a message
  const handleDeleteMessage = (id) => {
    if (messages[id].username === loggedInUser.username) {
    setMessages(messages.filter((_, index) => index !== id)); // Filter out the deleted message
    }
  };

  return (
  
  <div className='chat-app'>

    <div className="chat-container">
     
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.username === loggedInUser.username ? 'my-message' : 'other-message'}>
            <div className="message-header">
              <img src={msg.avatar} alt={`${msg.username}'s avatar`} className="avatar" />
              <p className="username">{msg.username}</p>
            </div>
            <p>{msg.text}</p>


            {msg.username === loggedInUser.username && (


            <button id='deleteBtn' onClick={() => handleDeleteMessage(index)}><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="red" className="bi bi-trash3" viewBox="0 0 16 16">
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
              </svg></button>
             )}
          </div>
        ))}
      </div>
     
      <form onSubmit={handleSendMessage} className="message-form">
        <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} required /> {/* Input field for the new message */}
        <button type="submit">Send</button>
      </form>
    </div>
    </div>
  );
};


export default Chat;



