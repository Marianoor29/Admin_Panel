import React from 'react';

interface ListProps {
  items: string[];
  // Optionally, you can add more props if needed, such as colors or styles
}

const colors = [
    'bg-lamaSkyLight',
    'bg-lamaPurpleLight',
    'bg-lamaYellowLight',
    'bg-pink-50',
  ];

const List = ({ items }: ListProps) => {
  return (
    <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
      {items?.map((item, index) => (
        <p
          key={index}
          className={`p-3 rounded-md ${colors[index % colors.length]}`}
        >
          {item}
        </p>
      ))}
    </div>
  );
};

export default List;
