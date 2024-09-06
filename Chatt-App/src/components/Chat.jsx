import React, { useEffect, useState, useRef } from 'react'; // Import React and hooks
import axios from 'axios'; // Import axios for HTTP requests
import '../Styling/Chat.css'; // Import CSS for styling
import DOMPurify from 'dompurify'; // Import DOMPurify for sanitizing user input
import { useAuth } from './AuthContext'; // Import AuthContext for user information

const Chat = () => {
  const { user } = useAuth(); // Get user information from AuthContext
  const [messages, setMessages] = useState([]); // State for storing messages
  const [newMessage, setNewMessage] = useState(''); // State for new message
  const inputRef = useRef(null); // Ref for input field

  // Fake chat messages for demonstration
  const [fakeChat] = useState([
    {
      text: "Tja",
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
  ]);

  const token = localStorage.getItem('jwtToken'); // Get JWT token from localStorage

  useEffect(() => {
    // Fetch messages from server
    const fetchMessages = async () => {
      const url = `https://chatify-api.up.railway.app/messages`; // Server URL

      try {
        const response = await axios.get(url, { // GET request to server
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

  // send a new message
  const sendMessage = async () => {
    if (newMessage.trim().length === 0) return; // Check if message is not empty

    const sanitizedMessage = DOMPurify.sanitize(newMessage); // Sanitize message

    const conversationId = '12345'; // Define conversationId

    const url = `https://chatify-api.up.railway.app/messages?conversationId=${conversationId}`; // Server URL

    try {
      const response = await axios.post(
        url,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send JWT token in header
            'Content-Type': 'application/json', // Specify content type
          },
        },
        {
          text: sanitizedMessage, // Message text
          avatar: user.avatar || 'https://i.pravatar.cc', // User avatar from AuthContext
          username: user.username, // User name from AuthContext
          conversationId : conversationId
        },
       
      );

      // Add new message to messages list
      setMessages((prevMessages) => [...prevMessages, response.data]);
      setNewMessage(''); // Clear input field after sending
    } catch (error) {
      console.error('Failed to send message:', error.response ? error.response.data : error.message); // Log error if request fails
    }
  };

  return (
    <div className="chat-container"> {/* Main container for chat */}
        
        <div className="messages"> {/* Container for displaying messages */}
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.username === user.username ? 'my-message' : 'other-message'}`}>

              <div className="message-header"> {/* Header for each message */}
                <img className="avatar" src={msg.avatar} alt={msg.username} /> {/* Display avatar */}

                <p className='username'>{msg.username}</p> {/* Display username */}
              </div>

              <div className='msgText'><p>{msg.text}</p></div> {/* Display message text */}
            </div>



          ))}
        </div>

        <div className="message-form"> {/* Form for composing new messages */}
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)} // Update state on input change
            placeholder="Skriv ett meddelande..."
            ref={inputRef}
          />
          <button onClick={sendMessage}>Skicka</button> {/* Button to send message */}
        </div>
      </div>
  );
};

export default Chat; // Export Chat component for use in other parts of the app
