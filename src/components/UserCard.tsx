import React from 'react';

interface UserCardProps {
  type: string;
  count: number | null; 
  bgColor: string;  
}

const UserCard = ({ type , count, bgColor}: UserCardProps) => {
  // Get the current date
  const today = new Date();
  const formattedDate = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;

  return (
    <div className="rounded-2xl p-4 flex-1 min-w-[130px]" style={{ backgroundColor: bgColor }}>
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          {formattedDate}
        </span>
      </div>
      <h1 className="text-2xl font-semibold my-4">{count}</h1>
      <h2 className="capitalize text-sm font-medium ">{type}s</h2>
    </div>
  );
};

export default UserCard;
