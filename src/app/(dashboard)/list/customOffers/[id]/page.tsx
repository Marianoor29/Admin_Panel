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
import Table from "@/components/Table";
import FormModal from "@/components/FormModal";

const columns = [
  { header: "Info", accessor: "info" },
  { header: "Title", accessor: "title", className: "hidden md:table-cell" },
  { header: "Location", accessor: "location", className: "hidden md:table-cell" },
  { header: "Actions", accessor: "action" },
];

const SingleOfferPage = ({ params }: any) => {
  const [OffersData, setOffersData] = useState<any>(null);
  const [SendOffers, setSendOffersData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchOffersData = async () => {
      setIsLoading(true); // Start loading before fetching
      try {
        // Fetch the main offers data
        const response = await axios.get(`https://www.offerboats.com/booking/customOffers/${id}`);
        setOffersData(response.data);
  
        // // Fetch the send offers data
        const sendOffersResponse = await axios.get(`https://www.offerboats.com/OwnerListingOnCustomOffers/${id}`);
        
        // Check if sendOffersResponse data exists
        if (sendOffersResponse.data && sendOffersResponse.data.length > 0) {
          setSendOffersData(sendOffersResponse.data); // Set to fetched data if exists
        } else {
          setSendOffersData([]); // Set to an empty array if no data
        }
        
      } catch (err: any) {
        console.error("Error fetching booking data", err);
        setError(err);
        setSendOffersData([]); // Optionally set to an empty array on error
      } finally {
        setIsLoading(false); // End loading in both success and error cases
      }
    };
  
    fetchOffersData();
  }, [id]);
  
console.log(OffersData, 'OffersData')
console.log(SendOffers, 'SendOffers')
  if (isLoading) return <Loader state={isLoading} />;
  // if (error) return <div className="flex-1 p-4 flex flex-col gap-4 items-center">Error fetching data</div>;

  // Destructure necessary data
  const { offers, renterReviews } = OffersData || {};
  const { userId, date, time, captain, price, hours, tripInstructions } = offers || {};

  const renderRow = (item: any) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="flex items-center gap-4 p-4">
        <Image
          src={item.ownerId.profilePicture}
          alt="OfferBoat Admin Panel"
          width={40}
          height={40}
          className="hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">
            {item.ownerId.firstName} {item.ownerId.lastName}
          </h3>
          <p className="text-xs text-gray-500">{item.ownerId.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item?.title?.length > 20 ? `${item?.title.slice(0, 20)}...` : item?.title}</td>
      <td className="hidden md:table-cell">{item.location}</td>
      <td>
        <div className="flex items-center gap-2">
        <Link
                href={{
                  pathname: '/list/customOffers/listingDetails',
                  query: { listing: encodeURIComponent(JSON.stringify(item)) },
                }}
              >
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="OfferBoat Admin Panel" width={16} height={16} />
            </button>
          </Link>
          <FormModal table="listing" type="delete" id={item.id} />
        </div>
      </td>
    </tr>
  );

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
                src="/captain.png"
                alt="OfferBoat Admin Panel"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-l font-semibold">Captain</h1>
                <span className="text-sm text-gray-400">{captain === true ? 'Yes' : 'No'}</span>
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
                <span className="text-sm text-gray-400">{price}</span>
                <span className="text-sm text-gray-400">{`\n`}Hours: {hours}</span>
              </div>
            </div>
          </div>
        </div>
        {SendOffers.length > 0 ? (
          <>
        <div className="mt-4 bg-white rounded-md p-4 ">
          <h1 className="text-l font-semibold text-center">Owners Listings On This Custom Offer</h1>
        </div>
      
          <div className="mt-0 bg-white rounded-md p-4">
            <Table columns={columns} renderRow={renderRow} data={SendOffers} />
          </div>
          </>
        ) : (
          <div className="mt-4 bg-white rounded-md p-4 ">
          <h1 className="text-s font-semibold text-center">No Listing Requests On This Offer</h1>
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <Performance data={[{ name: "Group A", value: userId?.rating, fill: "#C3EBFA" }]} ratingValue={userId?.rating} />
        <div className="bg-white rounded-md p-4">
          <h1 className="text-xl font-semibold text-center">Trip Instructions</h1>
          <div className="mt-3">
              <div className="bg-lamaSkyLight flex items-center justify-between p-4 m-2">
                <p>{tripInstructions}</p>
              </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-md">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Reviews</h1>
            {renterReviews.length > 0 && (
              <Link
                href={{
                  pathname: '/list/reviews',
                  query: { reviews: encodeURIComponent(JSON.stringify(renterReviews)) },
                }}
              >
                <span className="text-xs text-gray-400">View All</span>
              </Link>
            )}
          </div>
          <div className="mt-4">
            {renterReviews.length === 0 ? (
              <p className="text-gray-500 mt-4">This user has no reviews yet!</p>
            ) : (
              renterReviews.map((review: any) => (
                <Review
                  key={review._id}
                  firstName={review.ownerId.firstName}
                  lastName={review.ownerId.lastName}
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

export default SingleOfferPage;
