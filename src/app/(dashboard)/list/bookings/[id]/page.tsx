"use client";
import { useEffect, useState } from "react";
import ImageSlider from "@/components/ImageSlider";
import List from "@/components/List";
import Review from "@/components/Review";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Performance from "@/components/Performance";
import Loader from "@/components/Loader";

const SingleBookingPage = ({ params }: any) => {
  const [bookingData, setBookingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await axios.get(`https://www.offerboats.com/booking/bookings/${id}`);
        setBookingData(response.data); // Store fetched booking data in state
        setIsLoading(false);
      } catch (err:any) {
        console.error("Error fetching booking data", err);
        setError(err);
        setIsLoading(false);
      }
    };

    fetchBookingData();
  }, [id]);

  if (isLoading) return <Loader state={isLoading} />;
  if (error) return <div className="flex-1 p-4 flex flex-col gap-4 items-center">Error fetching data</div>;

  // Destructure necessary data
  const { booking, ownerReviews } = bookingData || {};
  const { userId, listingId, date, time, status, packages , ownerId} = booking || {};
  const { title, description, images, features, rules, location, } = listingId || {};
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
                src={userId?.profilePicture}
                alt="OfferBoat Admin Panel"
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <h1 className="text-xl font-semibold">{userId?.firstName} {userId?.lastName}</h1>
              <div className="flex items-center gap-2">
                <Image src="/mail.png" alt="OfferBoat Admin Panel" width={14} height={14} />
                <span>
                  {userId?.email.length > 17 ? `${userId?.email.slice(0, 17)}...` : userId?.email}
                  </span>
              </div>
              <div className="flex items-center gap-2">
                <Image src="/phone.png" alt="OfferBoat Admin Panel" width={14} height={14} />
                <span>{userId?.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Image src="/location.png" alt="OfferBoat Admin Panel" width={14} height={14} />
                <span>{userId?.location}</span>
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
                <h1 className="text-l font-semibold">Status</h1>
                <span className="text-sm text-gray-400">{status}</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/clock.png"
                alt="OfferBoat Admin Panel"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-l font-semibold">Time</h1>
                <span className="text-sm text-gray-400">{time}</span>
              </div>
            </div>
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
                <h1 className="text-l font-semibold">Date</h1>
                <span className="text-xs text-gray-400">{date}</span>
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
                <h1 className="text-l font-semibold">Package</h1>
                <span className="text-sm text-gray-400">{packages?.[0]?.price}</span>
                <span className="text-sm text-gray-400">{`\n`}Hours: {packages?.[0]?.hours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 ">
          <div className="flex-1 flex gap-4 items-center mb-1">
            <div className="w-1/1">
              <Image
                src={ ownerId?.profilePicture}
                alt="OfferBoat Admin Panel"
                width={40}
                height={40}
                className="w-20 h-20 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col">
                <h1 className="text-xl font-semibold">{ownerId?.firstName} {ownerId?.lastName}</h1>
                <p className="text-sm font-semibold">{ownerId?.email}</p>
            </div>
          </div>
          {listingId === null ? (
              <h1 className="text-xl font-semibold text-center mt-4">This listing is deleted!</h1>
          ) : (
            <>
            <h1 className="text-xl font-semibold text-center">{title}</h1>
            <h1 className="text-sm font-semibold text-center">{location}</h1>
            <p className="text-sm text-justify p-4">{description}</p>
            <ImageSlider images={images} />
            </>
          )}
        </div>
        {listingId !== null && (
          <>
        <div className="bg-white p-4 rounded-md mt-4">
          <h1 className="text-xl font-semibold">Features</h1>
          <List items={features} />
        </div>

        <div className="bg-white p-4 rounded-md mt-4">
          <h1 className="text-xl font-semibold">Rules</h1>
          <List items={rules} />
        </div> 
        </>
      )}
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
      <Performance data={[{ name: "Group A", value: userId?.rating, fill: "#C3EBFA" }]} ratingValue={userId?.rating} />
        <div className="bg-white rounded-md p-4">
          <h1 className="text-xl font-semibold text-center">Packages</h1>
          <div className="mt-3">
            {packages?.map((pkg: any) => (
              <div className="bg-lamaSkyLight flex items-center justify-between p-4 m-2" key={pkg.id}>
                <p>Price: {pkg.price}</p>
                <p>Hours: {pkg.hours}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-md">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Reviews</h1>
            {ownerReviews.length > 0 && (
           <Link
           href={{
             pathname: '/list/reviews',
             query: { reviews: encodeURIComponent(JSON.stringify(ownerReviews)) },
           }}
         >
           <span className="text-xs text-gray-400">View All</span>
         </Link>
       )}
          </div>
          <div className="mt-4">
          {ownerReviews.length === 0 ? (
            <p className="text-gray-500 mt-4">This user has no reviews yet!</p>
          ) : (
            ownerReviews.map((review: any) => (
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

export default SingleBookingPage;
