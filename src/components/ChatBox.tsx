import React, { useState } from 'react';

interface Message {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  messageText: { sender: string; message: string }[];
  userType: string;
  createdAt: string;
}

interface ChatMessage {
  sender: string;
  message: string;
  createdAt: string; 
}

interface ChatBoxProps {
  messages: Message[];
  messageText: ChatMessage[]; 
  createdAt: string;
  onSendMessage: (message: { sender: string; message: string }) => Promise<void>; 
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages, messageText, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState<{ sender: string; message: string }[]>([]);
  const [chatMessages, setChatMessages] = useState<{ sender: string; message: string; createdAt: string }[]>([]); // Local state for chat messages
  const [loading, setLoading] = useState<boolean>(false);

  const handleSend = async () => {
    if (newMessage.length && newMessage[0].message.trim()) {
      const newMessageObject = {
        sender: 'support',
        message: newMessage[0].message,
        createdAt: new Date().toISOString(),
      };

      setChatMessages([...chatMessages, newMessageObject]); // Update local state
      setNewMessage([{ sender: 'support', message: '' }]); // Reset the input

      setLoading(true);
      try {
        await onSendMessage({ sender: 'support', message: newMessageObject.message }); // Call the prop function instead of making an API call
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg h-full p-4 flex flex-col">
      <div className="flex-grow overflow-y-auto space-y-3 p-2">
        {/* Render the first message */}
        {messageText?.map((msg, index) => (
          <div key={index} 
          className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}
          >
            <div 
              className={`max-w-xs p-3 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-blue-500'}`}
              >
              <p>{msg.message}</p>
              <span className="text-xs text-gray-300 float-right mt-1">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
              </span>
            </div>
          </div>
        ))}

        {/* Render all chat messages */}
        {chatMessages.map((message, index) => (
          <div key={index} 
          className={`flex ${message.sender === 'user' ? 'justify-start' : 'justify-end'}`}
          >
            <div 
              className={`max-w-xs p-3 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-blue-500'}`}
              >
              <p>{message.message}</p>
              <span className="text-xs text-gray-300 float-right mt-1">
                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="border-t pt-4 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-grow p-2 border rounded-lg focus:outline-none"
          value={newMessage.length ? newMessage[0].message : ''}
          onChange={(e) => setNewMessage([{ sender: 'support', message: e.target.value }])}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Sending' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
