"use client";
import Image from 'next/image';
import { useState } from 'react';
import Loader from './Loader';

type ReviewProps = {
  reviewText: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  rating: number;
  ratingId: string;
};

const Review = ({ reviewText, createdAt, firstName, lastName, rating, ratingId }: ReviewProps) => {
  const [isDeleted, setIsDeleted] = useState(false); // State to track if the review is deleted
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  // Array to hold the star images (yellow and grey)
  const renderStars = () => {
    const totalStars = 5;
    const filledStars = rating; // Number of yellow stars (based on rating)
    const emptyStars = totalStars - filledStars; // Number of grey stars

    return (
      <div className="flex gap-1">
        {/* Render yellow stars */}
        {Array.from({ length: filledStars }, (_, index) => (
          <Image
            key={index}
            src="/filledStar.png"
            alt="OfferBoat Admin Panel"
            width={16} // You can adjust the size as needed
            height={16}
            className="w-4 h-4"
          />
        ))}

        {/* Render grey stars */}
        {Array.from({ length: emptyStars }, (_, index) => (
          <Image
            key={index + filledStars}
            src="/emptyStar.png"
            alt="OfferBoat Admin Panel"
            width={16} // You can adjust the size as needed
            height={16}
            className="w-4 h-4"
          />
        ))}
      </div>
    );
  };

  const onPressButton = async () => {
    setLoading(true);
    setIsDeleting(true); // Set loading state
    try {
      const response = await fetch(`https://www.offerboats.com/user/deleteReview/${ratingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      alert("Review deleted successfully!");
      setIsDeleted(true);
    } catch (error) {
      console.error(error);
      // Optionally show an error message to the user
    } finally {
      setLoading(false);
      setIsDeleting(false); // Reset loading state
    }
  };

  if (isDeleted) {
    return null;
  }

  return (
    // <div className="bg-white p-4 rounded-md">
    <div className="flex flex-col gap-4 mt-4">
          <Loader state={loading} />
      <div className="bg-lamaSkyLight rounded-md p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">
            {firstName} {lastName}
          </h2>
          <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
            {new Date(createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Star Rating */}
        <div className="mt-2">
          {renderStars()}
        </div>

        <p className="text-sm text-gray-400 mt-2">{reviewText}</p>
        <div className="w-full flex justify-end"> {/* Add flex and justify-end */}
          <button
            onClick={onPressButton} 
            className="focus:outline-none p-1 rounded-md"
            disabled={isDeleting}
          >
            <Image src="/trash.png" alt="OfferBoat Admin Panel" width={18} height={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Review;
