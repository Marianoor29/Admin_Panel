"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Messages = {
    date: any;
    userId: any;
    _id: string;
    messageText: [{sender: string, message: string}];
    id: number;
    createdAt: string;
    firstName: string;
    lastName: string;
    time?: string;
    location: string;
    profilePicture: string;
    userType: string;
    email: string;
  };

const MessagesList = () => {
    const router = useRouter();
    const baseURL = "https://www.offerboats.com";
    const [messages, setMessages] = useState<Messages[]>([]); // Initialize messages as an array of Messages objects
 console.log(messages, 'messages')
    useEffect(() => {
        const fetchMessages = async () => {
          try {
            const response = await fetch(`${baseURL}/message/helpMessages`); // Adjust the API endpoint if needed
            if (!response.ok) {
              throw new Error('Failed to fetch messages');
            }
            const data = await response.json();
            // Assuming the data returned matches the Messages type
            setMessages(data);
          } catch (error) {
            console.error('Error fetching messages:', error);
          } 
        };
    
        fetchMessages();
      }, []); 

        // Function to handle navigation
  const handleMessageClick = (id: string) => {
    router.push(`/list/messages/${id}`); // Navigate to the desired route
  };

  const handleViewAllClick = () => {
    router.push(`/list/messages`); // Navigate to the full messages list
};

// Get the latest 4 messages
const latestMessages = messages.slice(0, 4);

  return (
    <div className="bg-white p-7 rounded-lg shadow-md ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Latest Messages</h2>
          <button
            className="text-blue-500 text-sm hover:underline"
            onClick={handleViewAllClick}
          >
            View All
          </button>
        </div>
      <ul className="space-y-4">
        {latestMessages.map((message) => (
          <li
            key={message.id}
            className="flex items-center bg-white p-4 shadow-md rounded-lg cursor-pointer hover:bg-gray-50 transition-all"
            onClick={() => handleMessageClick(message._id)}
          >
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <Image
                src={message.userId.profilePicture}
                alt="OfferBoat Admin Panel"
                width={50}
                height={50}
                className="rounded-full object-cover"
              />
            </div>

            {/* User Details */}
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {message.userId.firstName} {message.userId.lastName}
              </p>
              <p className="text-xs text-gray-500">{message.userId.email}</p>
              <p className="text-sm text-gray-700 mt-1">
                {message.messageText.length > 0 ? message.messageText[message.messageText.length - 1].message : 'No messages yet'}
              </p>
            </div>

            {/* Arrow Icon */}
            <div className="ml-auto">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessagesList;
