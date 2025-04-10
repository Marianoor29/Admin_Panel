"use client";
import ImageSlider from "@/components/ImageSlider";
import List from "@/components/List";
import Loader from "@/components/Loader";
import Performance from "@/components/Performance";
import Review from "@/components/Review";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

type Listing = {
  ownerId: {
    firstName: string;
    lastName: string;
    profilePicture: string;
    email: string;
    phoneNumber: string;
    location: string;
    rating: number;
  };
  _id: string;
  title: string;
  location: string;
  description: string;
  images: string[];
  features: string[];
  rules: string[];
  packages: { price: number; hours: number }[];
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const SingleListingPage = ({ params }: any) => {
  const router = useRouter();
  const { id } = params;
  const baseURL = "https://www.offerboats.com";
  const [loading, setIsLoading] = useState(false);

      // Use SWR to fetch the listing
      const { data, error, isLoading, mutate } = useSWR
      (`${baseURL}/listing/listings/${id}`, fetcher);

 
  // Extract listing data, booking stats, and reviews
  const listingData: Listing | undefined = data?.listing;
  const bookingStats = data?.bookingStatistics || {
    totalCompletedBookings: 0,
    totalAcceptedBookings: 0,
    totalRejectedBookings: 0,
    totalPendingBookings: 0,
  };
  const reviews = data?.ownerReviews || [];


  if (isLoading || !listingData) {
    return <Loader state={true} />;
  }
  if (error) {
    return <div>Error loading data</div>;
  }

  const latestReviews = reviews
  .sort((a: { createdAt: string }, b: { createdAt: string }) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  .slice(0, 5);

// Handle image deletion
const handleDeleteImage = async (imageIndex: number) => {
  try {
    const response = await fetch(`${baseURL}/listing/listings/${id}/remove-image`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageIndex }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete image");
    }

    // Mutate SWR cache after deleting the image
    const updatedData = await response.json();
    mutate({
      ...data,
      listing: {
        ...listingData,
        images: updatedData.images,
      },
    });
  } catch (error) {
    console.error("Error deleting image", error);
  }
};

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      <Loader state={isLoading} />
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
                src={listingData.ownerId.profilePicture}
                alt="OfferBoat Admin Panel"
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <h1 className="text-xl font-semibold"> {listingData.ownerId.firstName} {listingData.ownerId.lastName}</h1>
              <div className="flex items-center gap-2">
                <Image src="/mail.png" alt="OfferBoat Admin Panel" width={14} height={14} />
                <span>
                  {listingData.ownerId.email.length > 17 ? `${listingData.ownerId.email.slice(0, 17)}...` : listingData.ownerId.email}
                  </span>
              </div>
              <div className="flex items-center gap-2">
                <Image src="/phone.png" alt="OfferBoat Admin Panel" width={14} height={14} />
                <span>{listingData.ownerId.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Image src="/type.png" alt="OfferBoat Admin Panel" width={14} height={14} color="black" />
                <span>Boat Owner</span>
              </div>
              <div className="flex items-center gap-2">
                <Image src="/location.png" alt="OfferBoat Admin Panel" width={14} height={14} />
                <span>{listingData.ownerId.location}</span>
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
                <h1 className="text-xl font-semibold">{bookingStats.totalAcceptedBookings}</h1>
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
                <h1 className="text-xl font-semibold">{bookingStats.totalRejectedBookings}</h1>
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
                <h1 className="text-xl font-semibold">{bookingStats.totalCompletedBookings}</h1>
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
                <h1 className="text-xl font-semibold">{bookingStats.totalPendingBookings}</h1>
                <span className="text-sm text-gray-400">Pending</span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4">
          <h1 className="text-xl font-semibold text-center">{listingData.title}</h1>
          <h1 className="text-sm font-semibold text-center">{listingData.location}</h1>
          <p className="text-sm text-justify p-4">{listingData.description}</p>
          {listingData?.images?.length > 0 ? (
            <ImageSlider images={listingData.images} showDeleteButton={true} onDelete={handleDeleteImage} />
          ) : (
            <p>No images available</p> 
          )}
        </div>
        <div className="bg-white p-4 rounded-md mt-4">
          <h1 className="text-xl font-semibold">Features</h1>
          <List items={listingData.features} />
        </div>
        <div className="bg-white p-4 rounded-md mt-4">
          <h1 className="text-xl font-semibold">Rules</h1>
          <List items={listingData.rules} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <Performance data={[{ name: "Group A", value: listingData.ownerId?.rating, fill: "#C3EBFA" }]} ratingValue={listingData.ownerId?.rating} />
        <div className="bg-white rounded-md p-4">
          <h1 className="text-xl font-semibold text-center">Packages</h1>
          <div className=" mt-3 ">
            {listingData.packages?.map((item: any) => (
              <div className="bg-lamaSkyLight flex items-center justify-between p-4 m-2">
                <p>Price: {item.price}</p>
                <p>Hours: {item.hours}</p>
              </div>
            ))}
          </div>
        </div>
        {/* <Performance data={data} ratingValue={4} /> */}
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
                  firstName={review.renterId.firstName}
                  lastName={review.renterId.lastName}
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

export default SingleListingPage;
