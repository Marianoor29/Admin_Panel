"use client";
import FormModal from "@/components/FormModal";
import Loader from "@/components/Loader";
import Modal from "@/components/Modal";
import Pagination from "@/components/Pagination";
import Sort from "@/components/Sort";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import { useState } from "react";
import useSWR from "swr";

type Document = {
  _id: string | undefined;
  user?: any;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  frontImage: string;
  backImage: string;
};

const columns = [
  {
    header: "Profile",
    accessor: "profile",
  },
  {
    header: "Front Image",
    accessor: "frontImage",
  },
  {
    header: "Back Image",
    accessor: "backImage",
  },
  {
    header: "Action",
    accessor: "action",
  },
];
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const DocumentList = () => {
  const baseURL = "https://www.offerboats.com";
  const itemsPerPage = 30;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

   // Use SWR to fetch the user
   const { data: allDocument, error, isLoading, mutate } = useSWR<Document[]>(
    `${baseURL}/user/documents`,
    fetcher
  );
console.log(allDocument,"allDocument")
  // Handle search functionality
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page after search
  };

 // Filter users based on the search term
 const filteredDocuments = allDocument?.filter(doc =>
  doc?.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  doc?.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  doc?.email?.toLowerCase().includes(searchTerm.toLowerCase()) 
) || [];

  const totalItems = filteredDocuments.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredDocuments.slice(startIndex, endIndex);

  const handleSort = (field: string, direction: "asc" | "desc") => {
    const sorted = [...filteredDocuments].sort((a, b) => {
      let comparison = 0;
      if (field === "username") {
        const nameA = `${a.user?.firstName} ${a.user?.lastName}`.toLowerCase();
        const nameB = `${b.user?.firstName} ${b.user?.lastName}`.toLowerCase();
        comparison = nameA.localeCompare(nameB);
      }
      return direction === "asc" ? comparison : -comparison;
    });
    mutate(sorted, false); 
  };

 
  const handleSuccess = () => {
    mutate(); 
  };

  const renderRow = (item: Document) => (
    <tr
      key={item.email}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={item.user?.profilePicture}
          alt="OfferBoat Admin Panel"
          width={40}
          height={40}
          className="hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">
            {item.user?.firstName} {item.user?.lastName}
          </h3>
          <p className="text-xs text-gray-500">
            {item?.email.length > 16 ? `${item?.email.slice(0, 16)}...` : item?.email}
          </p>
        </div>
      </td>
      <td>
        <button
         onClick={() => {
          setSelectedImage(item?.frontImage);
          setShowModal(true);
        }}
      >
          <Image 
          src={item?.frontImage}
          alt="OfferBoat Admin Panel" width={50} height={50} className="cursor-pointer" />
        </button>
      </td>
      <td>
        <button
            onClick={() => {
              setSelectedImage(item?.backImage);
              setShowModal(true);
            }}
          >
          <Image 
            src={item?.backImage}
           alt="OfferBoat Admin Panel" width={50} height={50} className="cursor-pointer" />
        </button>
      </td>
      <td>
      <div className="flex items-center gap-2">
        <FormModal table="document" type="update" id={item?._id} data={item} onSuccess={handleSuccess}/>
      </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
       <Loader state={isLoading} /> 
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          All Documents
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
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {/* IMAGE MODAL */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          {selectedImage && (
            <>
            <Image
              src={selectedImage}
              alt="OfferBoat Admin Panel"
              width={800}
              height={600}
              className="object-cover"
            />
            <div className="mt-5 ">
             <h1 className="md:block text-xs font-semibold text-gray-500 mb-2">
          To Download this image , copy image link and paste it on your browser and press enter, your image will download
        </h1>
            <p className="md:block text-xs font-semibold text-blue-600">{selectedImage}</p>
            </div>
            </>
          )}
        </Modal>
      )}
    </div>
  );
};

export default DocumentList;
