"use client";
import ImageSlider from "@/components/ImageSlider";
import List from "@/components/List";
import Loader from "@/components/Loader";
import Performance from "@/components/Performance";
import Review from "@/components/Review";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from "react";

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

const ListingDetails = () => {
    const searchParams = useSearchParams();
  const router = useRouter();
  const listing = searchParams.get('listing');
  const [reviews, setReviews] = useState<any[]>([]);

   let listingData = null;
   if (listing) {
     // Decode and parse the item
     listingData = JSON.parse(decodeURIComponent(listing));
   }
console.log(listingData, 'listingData')
  const baseURL = "https://www.offerboats.com";
  const [loading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await axios.get(`${baseURL}/rating/getReviews`, {
          params: { userId :listingData.ownerId._id , userType: 'BoatOwner' }
        });
        if (response.status === 200) {
          setReviews(response.data);
        } else {
         console.log('Error', 'Failed to fetch reviews.');
        } 
        setIsLoading(false);
      } catch (err:any) {
        console.error("Error fetching booking data", err);
        setIsLoading(false);
      }
    };

    fetchBookingData();
  }, [listingData.ownerId._id]);


  const latestReviews = reviews
  ? reviews
      .sort((a: { createdAt: string }, b: { createdAt: string }) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5)
  : []; 

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      <Loader state={loading} />
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
                alt="owner Profile"
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <h1 className="text-xl font-semibold"> {listingData.ownerId.firstName} {listingData.ownerId.lastName}</h1>
              <div className="flex items-center gap-2">
                <Image src="/mail.png" alt="" width={14} height={14} />
                <span>
                  {listingData.ownerId.email.length > 17 ? `${listingData.ownerId.email.slice(0, 17)}...` : listingData.ownerId.email}
                  </span>
              </div>
              <div className="flex items-center gap-2">
                <Image src="/phone.png" alt="" width={14} height={14} />
                <span>{listingData.ownerId.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Image src="/type.png" alt="" width={14} height={14} color="black" />
                <span>Boat Owner</span>
              </div>
              <div className="flex items-center gap-2">
                <Image src="/location.png" alt="" width={14} height={14} />
                <span>{listingData.ownerId.location}</span>
              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/location.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-l font-semibold">{listingData.location}</h1>
                <span className="text-sm text-gray-400">Location</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                 src="/singleAttendance.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-l font-semibold">{listingData.date}</h1>
                <span className="text-sm text-gray-400">Date</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                 src="/clock.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-l font-semibold">{listingData.time}</h1>
                <span className="text-sm text-gray-400">Time</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
              src="/singleBranch.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
             <div className="">
                <h1 className="text-l font-semibold">Package</h1>
                <span className="text-sm text-gray-400">{listingData.packages?.[0]?.price}</span>
                <span className="text-sm text-gray-400">{`\n`}Hours: {listingData.packages?.[0]?.hours}</span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 ">
          <h1 className="text-xl font-semibold text-center">{listingData.title}</h1>
          <h1 className="text-sm font-semibold text-center">{listingData.location}</h1>
          <p className="text-sm text-justify p-4">{listingData.description}</p>
          {listingData?.images?.length > 0 ? (
            <ImageSlider images={listingData.images} />
          ) : (
            <p>No images available</p> // Or a placeholder image
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

export default function PageWrapper() {
    return (
      <Suspense fallback={<div>Loading listing...</div>}>
        <ListingDetails />
      </Suspense>
    );
  }