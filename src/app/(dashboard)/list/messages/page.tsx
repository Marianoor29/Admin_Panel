"use client";
import { useState, useEffect } from "react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Link from "next/link";
import Sort from "@/components/Sort";
import { role } from "@/lib/data";
import FormModal from "@/components/FormModal";
import Loader from "@/components/Loader";

type Message = {
  sender: string;
  message: string;
};

type Messages = {
  date: any;
  userId: any;
  _id: string | undefined;
  messageText: Message[]; // Update type to reflect the new structure
  createdAt: string;
  firstName: string;
  lastName: string;
  location: string;
  profilePicture: string;
  sender: string;
  email: string;
};

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Sender",
    accessor: "sender",
    className: "hidden md:table-cell",
  },
  {
    header: "Date",
    accessor: "createdAt",
    className: "hidden md:table-cell",
  },
  {
    header: "Message",
    accessor: "messageText",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const MessagesList = () => {
  const baseURL = "https://www.offerboats.com";
  const itemsPerPage = 20; 
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredMessages, setFilteredMessages] = useState<Messages[]>([]);
  const [messages, setMessages] = useState<Messages[]>([]); // Initialize messages as an array of Messages objects
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${baseURL}/message/helpMessages`); // Adjust the API endpoint if needed
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const data = await response.json();
        // Assuming the data returned matches the Messages type
        setMessages(data);
        setFilteredMessages(data); // Initialize filteredMessages with all the fetched messages
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchMessages();
  }, []); // Empty dependency array to ensure this runs only once on mount

  // Calculate start and end indices for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get the paginated items for the current page
  const currentItems = filteredMessages.slice(startIndex, endIndex);

  const handleSearch = (searchTerm: string) => {
    const lowercasedTerm = searchTerm.toLowerCase();
    const newFilteredMessages = messages.filter(message =>
      message?.userId?.firstName.toLowerCase().includes(lowercasedTerm) ||
      message?.userId?.lastName.toLowerCase().includes(lowercasedTerm) ||
      message?.sender.toLowerCase().includes(lowercasedTerm) ||
      message?.createdAt?.toString().includes(lowercasedTerm) ||
      message?.userId?.email.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredMessages(newFilteredMessages);
  };

  const handleSort = (field: string, direction: "asc" | "desc") => {
    const sorted = [...filteredMessages].sort((a, b) => {
      if (field === "username") {
        const nameA = `${a?.userId.firstName} ${a?.userId.lastName}`.toLowerCase();
        const nameB = `${b?.userId.firstName} ${b?.userId.lastName}`.toLowerCase();
        if (nameA < nameB) return direction === "asc" ? -1 : 1;
        if (nameA > nameB) return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    setFilteredMessages(sorted);
  };

  const renderRow = (item: Messages) => {
    const lastMessage = item.messageText[item.messageText.length - 1]; // Get the last message object

    return (
      <tr
        key={item._id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
      >
        <td className="flex items-center gap-4 p-4">
          <Image
            src={item.userId.profilePicture}
            alt="OfferBoat Admin Panel"
            width={40}
            height={40}
            className="hidden xl:block w-10 h-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <h3 className="font-semibold">
              {item.userId.firstName} {item.userId.lastName}
            </h3>
            <p className="text-xs text-gray-500">
              {item.userId.email.length > 17 ? `${item.userId.email.slice(0, 17)}...` : item.userId.email}
              </p>
          </div>
        </td>
        <td className="hidden md:table-cell">{item.sender}</td>
        <td className="hidden md:table-cell">{new Date(item.createdAt).toLocaleDateString()}</td>
        <td className="hidden md:table-cell">
          {lastMessage ? (
            lastMessage.message.length > 12
              ? `${lastMessage.message.slice(0, 12)}...`
              : lastMessage.message
          ) : "No messages"}
        </td>
        <td>
          <div className="flex items-center gap-2">
            <Link href={`/list/messages/${item._id}`}>
              <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
                <Image src="/view.png" alt="OfferBoat Admin Panel" width={16} height={16} />
              </button>
            </Link>
            {role === "admin" && (
              <FormModal table="booking" type="delete" id={item._id} />
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <Loader state={loading} />
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          Messages
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch onSearch={handleSearch} />
          <div className="flex items-center gap-4 self-end">
            <Sort onSort={handleSort} />
          </div>
        </div>
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={currentItems} />

      {/* PAGINATION */}
      <Pagination
        totalItems={filteredMessages.length} // Use filteredMessages for pagination
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage} // Function to update the current page
      />
    </div>
  );
};

export default MessagesList;
