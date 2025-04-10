"use client";
import Pagination from "@/components/Pagination";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from 'next/navigation';

const ReviewList = () => {
  const searchParams = useSearchParams();
  const itemsPerPage = 5; // Number of reviews per page
  const [reviewData, setReviewData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0); // Total number of reviews
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Access reviews query parameter
    const reviewsParam = searchParams.get('reviews');
    const pageParam = searchParams.get('page'); 
    if (reviewsParam) {
      try {
        // Decode and parse the reviews query parameter
        const parsedReviews = JSON.parse(decodeURIComponent(reviewsParam));
        setReviewData(parsedReviews);
        setTotalItems(parsedReviews.length); // Set total items based on the length of the reviews array
        setLoading(false);
          // Update current page from URL if available
          if (pageParam) {
            const page = parseInt(pageParam, 10);
            if (!isNaN(page)) {
              setCurrentPage(page);
            }
          }
        } catch (error) {
          console.error('Failed to decode reviews:', error);
          setError('Failed to load reviews.');
          setLoading(false);
        }
    } else {
      // Handle case where reviews are not available
      setLoading(false);
    }
  }, [searchParams]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReviews = reviewData.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Update URL with the new page number
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('page', newPage.toString());
    router.replace(`?${newSearchParams.toString()}`); // Update URL without refreshing the page
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <button
        className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg shadow-md"
        onClick={() => router.back()}
      >
        &#8592; Back
      </button>
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Reviews</h1>
      </div>

      {/* LOADING OR ERROR MESSAGE */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* REVIEWS LIST */}
      <div className="mt-4 space-y-4">
        {currentReviews.length > 0 ? (
          currentReviews.map((review: any) => (
            <div key={review._id} className="border rounded-md p-4">
              <div className="flex items-center gap-2 mb-2">
                {review?.renterId?.firstName ? (
                  <h2 className="text-lg font-semibold">
                    {review?.renterId?.firstName} {review?.renterId?.lastName}
                  </h2>
                ) : (
                  <h2 className="text-lg font-semibold">
                    {review?.ownerId?.firstName} {review?.ownerId?.lastName}
                  </h2>
                )}
                <span className={`text-sm ${review.rating >= 4 ? 'text-green-500' : review.rating >= 2 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {review.rating} / 5
                </span>
              </div>
              <p className="text-sm text-gray-600">{review.reviewText}</p>
              <div className="mt-2 text-xs text-gray-400">
                {new Date(review.createdAt).toLocaleDateString()}
              </div>

              {/* REPLIES */}
              {review.replies && review.replies.length > 0 && (
                <div className="mt-4 border-t pt-2 border-gray-200">
                  <h3 className="text-sm font-semibold">Replies:</h3>
                  <div className="space-y-2 mt-2">
                    {review.replies.map((reply: any) => (
                      <div key={reply._id} className="bg-gray-100 p-2 rounded-md">
                        <div className="font-semibold">{reply.replierName}</div>
                        <p className="text-sm text-gray-600">{reply.replyText}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No reviews found.</p>
        )}
      </div>

      {/* PAGINATION */}
      <div className="mt-4">
        <Pagination
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
         onPageChange={handlePageChange} 
        />
      </div>
    </div>
  );
};

export default function PageWrapper() {
  return (
    <Suspense fallback={<div>Loading reviews...</div>}>
      <ReviewList />
    </Suspense>
  );
}

// export default ReviewList;
