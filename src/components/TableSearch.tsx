import Image from "next/image";
import { useState } from "react";

const TableSearch = ({ onSearch }:any) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event:any) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
      <Image src="/search.png" alt="OfferBoat Admin Panel" width={14} height={14} />
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search..."
        className="w-[200px] p-2 bg-transparent outline-none"
      />
    </div>
  );
};

export default TableSearch;
