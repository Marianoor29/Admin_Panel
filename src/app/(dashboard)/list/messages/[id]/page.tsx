"use client";
import { useState, useEffect } from "react";
import ChatBox from "@/components/ChatBox";
import Performance from "@/components/Performance";
import Review from "@/components/Review";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from 'axios';

const SingleMessagePage = ({ params }: any) => {
  const router = useRouter();
  const { id } = params;
  const baseURL = "https://www.offerboats.com";
  const [messageDetails, setMessageDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessageDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${baseURL}/message/messageDetails/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch message details.");
        }
        const data = await res.json();
        setMessageDetails(data); // Store the fetched data
      } catch (error:any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessageDetails();
  }, [id]);

  // Loading and error handling
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Destructure data from the fetched message details
  const { message, reviews, bookingStatistics } = messageDetails;
  // Display the latest 3 reviews
  const latestReviews = reviews
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

    const handleSendMessage = async (message: { sender: string; message: string }) => {
      try {
            await axios.post(`${baseURL}/message/sendHelpMessage`, {
              userId: messageDetails.message.userId._id,
              sender: messageDetails.message.sender,
              messageText: {
                sender: 'support',
                message: message.message, 
              },
            });
          }
            catch (error) {
              console.log('Error sending message:', error);
            }
    };

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          <button
            className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg shadow-md"
            onClick={() => router.back()}
          >
            &#8592; Back
          </button>
          {/* USER INFO CARD */}
          <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              <Image
                src={message.userId.profilePicture}
                alt="OfferBoat Admin Panel"
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
                <h1 className="text-xl font-semibold">
                  {message.userId.firstName} {message.userId.lastName}
                </h1>
                <div className="flex items-center gap-2">
                  <Image src="/mail.png" alt="OfferBoat Admin Panel" width={14} height={14} />
                  <span>
                    {message.userId.email.length > 17 ? `${message.userId.email.slice(0, 17)}...` : message.userId.email}
                    </span>
                </div>
                  <div className="flex items-center gap-2">
                  <Image src="/phone.png" alt="OfferBoat Admin Panel" width={14} height={14} />
                  <span>{message.userId.phoneNumber || "N/A"}</span>
                </div>
                  <div className="flex items-center gap-2">
                  <Image src="/type.png" alt="OfferBoat Admin Panel" width={14} height={14} />
                  <span>{message.userId.userType || "N/A"}</span>
                </div>
                  <div className="flex items-center gap-2">
                  <Image src="/location.png" alt="OfferBoat Admin Panel" width={14} height={14} />
                  <span>{message.userId.location || "N/A"}</span>
                </div>
              </div>
            </div>
          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleAttendance.png"
                alt="OfferBoat Admin Panel"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">{bookingStatistics.totalAcceptedBookings}</h1>
                <span className="text-sm text-gray-400">Accepted</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/rejected.png"
                alt="OfferBoat Admin Panel"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">{bookingStatistics.totalRejectedBookings}</h1>
                <span className="text-sm text-gray-400">Rejected</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleBranch.png"
                alt="OfferBoat Admin Panel"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">{bookingStatistics.totalCompletedBookings}</h1>
                <span className="text-sm text-gray-400">Completed</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/pending.png"
                alt="OfferBoat Admin Panel"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">{bookingStatistics.totalPendingBookings}</h1>
                <span className="text-sm text-gray-400">Pending</span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-[600px]">
          <ChatBox messages={message?.message} createdAt={new Date().toISOString()} messageText={message.messageText}  onSendMessage={handleSendMessage}/>
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <Performance data={[{ name: "Group A", value: message.userId.rating, fill: "#C3EBFA" }]} ratingValue={message.userId.rating} />
        <div className="bg-white p-4 rounded-md">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Reviews</h1>
            {latestReviews.length > 0 && (
                 <Link
                 href={{
                   pathname: '/list/reviews',
                   query: { reviews: encodeURIComponent(JSON.stringify(latestReviews)) },
                 }}
               >
                 <span className="text-xs text-gray-400">View All</span>
               </Link>
             )}
          </div>
          <div className="mt-4">
          {latestReviews.length === 0 ? (
            <p className="text-gray-500 mt-4">This user has no reviews yet!</p>
          ) : (
            latestReviews.map((review: any) => (
              <Review
                key={review._id}
                firstName={message.sender === "BoatOwner" ? review.renterId.firstName : review.ownerId.firstName}
                lastName={message.sender === "BoatOwner" ? review.renterId.lastName : review.ownerId.lastName}
                rating={review.rating}
                reviewText={review.reviewText}
                createdAt={review.createdAt}
                ratingId={review._id}
              />
            ))
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleMessagePage;
