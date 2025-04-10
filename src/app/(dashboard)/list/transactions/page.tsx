"use client";
import Loader from "@/components/Loader";
import Pagination from "@/components/Pagination";
import Sort from "@/components/Sort";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import { useEffect, useState } from "react";

// Define your Transaction type based on the data structure
type Transaction = {
  paymentDetails: any;
  user: any;
  _id: string;
  id: number;
  amount: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  profilePicture: string;
  created: string;
};

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  { header: "Status", accessor: "status", className: "hidden md:table-cell" },
  { header: "Amount", accessor: "amount", className: "hidden md:table-cell" },
  { header: "Date & Time", accessor: "created", className: "hidden md:table-cell" },
];

const Transactions = () => {
  const baseURL = "https://www.offerboats.com";
  const itemsPerPage = 30; 
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null); 

  // Fetch the transaction data from the backend API
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${baseURL}/booking/fetch-all-transactions`); // Adjust URL if necessary

        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data = await response.json();
        setTransactions(data)
        setFilteredTransactions(data); // Update the state with fetched transactions
      } catch (err) {
        setError((err as Error).message); // Capture and set the error message
      } finally {
        setLoading(false); // Turn off the loading state
      }
    };

    fetchTransactions(); // Call the function when component mounts
  }, []);

    // Calculate start and end indices for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
  
    // Get the paginated items for the current page
    const currentItems = filteredTransactions.slice(startIndex, endIndex);  

  // Handle search functionality
  const handleSearch = (searchTerm: string) => {
    const lowercasedTerm = searchTerm.toLowerCase();
    const newFilteredTransactions = transactions?.filter(transaction =>
      transaction?.paymentDetails?.status?.toLowerCase().includes(lowercasedTerm) ||
      transaction?.paymentDetails?.amount.toString().includes(lowercasedTerm) ||
      transaction?.user?.firstName.toLowerCase().includes(lowercasedTerm) ||
      transaction?.user?.lastName.toLowerCase().includes(lowercasedTerm) ||
      transaction?.user?.email.toLowerCase().includes(lowercasedTerm) 
    );
    setFilteredTransactions(newFilteredTransactions);
    
  };

    // Handle sorting updates from Sort component
    const handleSort = (field: string, direction: "asc" | "desc") => {
      const sorted = [...filteredTransactions].sort((a, b) => {
        if (field === "username") {
          const nameA = `${a.user.firstName} ${a.user.lastName}`.toLowerCase();
          const nameB = `${b.user.firstName} ${b.user.lastName}`.toLowerCase();
          if (nameA < nameB) return direction === "asc" ? -1 : 1;
          if (nameA > nameB) return direction === "asc" ? 1 : -1;
        }
        return 0;
      });
      setFilteredTransactions(sorted)
    };


  const renderRow = (item: Transaction) => {
    const createdTimestamp = item.paymentDetails?.created;
    const formattedDate = createdTimestamp
      ? new Date(createdTimestamp * 1000).toLocaleString() // Adjust to your preferred format
      : "N/A";
      return (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={item.user.profilePicture}
          alt="OfferBoat Admin Panel"
          width={40}
          height={40}
          className="hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">
            {item.user?.firstName} {item.user?.lastName}
          </h3>
          <h6 className="text-xs text-gray-500">
            {item?.user?.email.length > 17 ? `${item?.user?.email.slice(0, 17)}...` : item?.user?.email}
            </h6>
        </div>
      </td>
      <td className="md:table-cell">{item.paymentDetails?.status}</td>
      <td className="md:table-cell">${item.paymentDetails?.amount}</td>
      <td className="hidden md:table-cell">{formattedDate}</td>
    </tr>
  )};
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
       {loading && (
      <Loader state={loading} />
      )}
      {error && (
       <div>Failed to load users</div>
      )}
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          Transactions (Stripe)
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
        <TableSearch onSearch={handleSearch} />
        <Sort onSort={handleSort} />
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={currentItems} />
      {/* PAGINATION */}
      <Pagination
        totalItems={filteredTransactions.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage} // Function to update the current page
      />
    </div>
  );
};

export default Transactions;
