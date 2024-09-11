import React, { useEffect, useState, useRef } from 'react'; // Import React and hooks
import axios from 'axios'; // Import axios for HTTP requests
import '../Styling/Chat.css'; // Import CSS for styling
import DOMPurify from 'dompurify'; // Import DOMPurify for sanitizing user input
import { useAuth } from './AuthContext'; // Import AuthContext for user information

const Chat = () => {
  const { user } = useAuth(); // Get user and token information from AuthContext
  const [messages, setMessages] = useState([]); // State for storing messages
  const [newMessage, setNewMessage] = useState(''); // State for new message
  const inputRef = useRef(null); // Ref for input field

  // Fake chat messages for demonstration with added conversationId
  const [fakeChat] = useState([
    {
      text: "Tja",
      avatar: "https://i.pravatar.cc/100?img=14",
      username: "Johnny",
      conversationID: 'fake-conversation-id-1' // Static conversationId for fake chat
    },
    {
      text: "Hallå!! Svara då!!",
      avatar: "https://i.pravatar.cc/100?img=14",
      username: "Johnny",
      conversationID: 'fake-conversation-id-1' // Static conversationId for fake chat
    },
    {
      text: "Sover du eller?! 😴",
      avatar: "https://i.pravatar.cc/100?img=14",
      username: "Johnny",
      conversationID: 'fake-conversation-id-1' // Static conversationId for fake chat
    }
  ]);

  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    // Fetch messages from server
    const fetchMessages = async () => {
      const url = `https://chatify-api.up.railway.app/messages`; // Server URL

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`, // Send JWT token in header
          },
        });

        // Update messages state with fetched messages and fake chat messages
        setMessages([...fakeChat, ...response.data]);
      } catch (error) {
        console.error('Failed to fetch messages:', error); // Log error if request fails
      }
    };

    fetchMessages(); // Call fetchMessages on component mount
  }, [token, fakeChat]); // Run effect when token or fakeChat changes

  // Send a new message
  const sendMessage = async (conversationID, newMessage) => {
    if (newMessage.trim().length === 0) return; // Check if message is not empty

    const sanitizedMessage = DOMPurify.sanitize(newMessage); // Sanitize message

    console.log('Sending message to conversation Id:', conversationID);

    const url = `https://chatify-api.up.railway.app/messages?conversationID=${conversationID}`; // Server URL

    try {
      const response = await axios.post(
        url,
        {
          text: sanitizedMessage, // Message text
          avatar: user.avatar, // User avatar from AuthContext
          username: user.username, // User name from AuthContext
          //id: user.id,
          conversationID: conversationID // conversationId (dynamic or static)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send JWT token in header
            'Content-Type': 'application/json', // Specify content type
          },
        }
      );

      // Log response for sent message
      console.log('Message sent successfully:', response);

      // Optionally update local state to reflect sent message
      setMessages(prevMessages => 
        [...prevMessages, {
        text: sanitizedMessage,
        avatar: user.avatar,
        username: user.username,
        id: user.id, // Ensure userId is saved locally too
        conversationID: conversationID
      }]);
      setNewMessage('')
    } catch (error) {
      console.error('Failed to send message:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.userId === user.id ? 'my-message' : 'other-message'}`}>
            <div className="message-header">
              <img className="avatar" src={msg.avatar} alt={msg.username} />
              <p className="username">{user.username}</p>
            </div>
            <div className="msgText"><p>{msg.text}</p></div>
          </div>
        ))}
      </div>

      <div className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type here..."
          ref={inputRef}
        />
        <button onClick={() => sendMessage('fake-conversation-id-1', newMessage)}>Skicka</button> {/* Use the static conversationId */}
      </div>
    </div>
  );
};

export default Chat;
