import Image from "next/image";
import { useState } from "react";

type SortProps = {
  onSort: (field: string, direction: "asc" | "desc") => void; // Callback to notify parent of sort changes
};

const Sort = ({onSort}: SortProps) => {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSortChange = (field: string) => {
    const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
    onSort(field, newDirection); // Notify parent component of the sort change
  };

  return (
    <div className="flex items-center gap-4">

      {/* Sort Button */}
      <button
        className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow"
        onClick={() => handleSortChange("username")}
      >
        <Image src="/sort.png" alt="OfferBoat Admin Panel" width={14} height={14} />
      </button>
    </div>
  );
};

export default Sort;
