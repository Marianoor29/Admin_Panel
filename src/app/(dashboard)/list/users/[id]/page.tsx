"use client";
import Calender from "@/components/Calender";
import FormModal from "@/components/FormModal";
import Loader from "@/components/Loader";
import Pagination from "@/components/Pagination";
import Performance from "@/components/Performance";
import Review from "@/components/Review";
import Table from "@/components/Table";
import { role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from 'axios';

const SingleUserPage = ({ params }: any) => {
  const router = useRouter();
  const { id } = params;
  const baseURL = "https://www.offerboats.com";
  // const baseURL = "http://192.168.1.182:8090";
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [userType, setUserType] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState<number>(1);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch user data
        const userResponse = await fetch(`${baseURL}/user/userDetails/${id}`);
        const userData = await userResponse.json();

        if (userResponse.ok) {
          setUser(userData.user);
          setUserType(userData.user.userType);

          // Fetch bookings based on userType
          if (userData.user.userType === 'BoatOwner') {
            setBookings(userData.bookings || []); // Handle empty array
            setListings(userData.listings || []);
            setReviews(userData.reviews || []);
          } else if (userData.user.userType === 'BoatRenter') {
            setBookings(userData.bookings || []); // Handle empty array
            setReviews(userData.reviews || []);
          }
        } else {
          console.error("Error fetching user data:", userData.message);
        }
      } catch (error: any) {
        setError(error);
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <Loader state={loading} />;
  }
  if (error) return <div className="flex-1 p-4 flex flex-col gap-4 items-center">Error fetching data</div>;

  const filteredListings = listings;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredListings.slice(startIndex, endIndex);

  const handleDateSelect = (selectedDate: string) => {
    const userString = encodeURIComponent(JSON.stringify(user));
    router.push(`/list/upcomingBookings?date=${selectedDate}&user=${userString}`);
  };

  const latestReviews = reviews
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, userType === "BoatOwner" ? 7 : 3);

  const columns = [
    { header: "Info", accessor: "info" },
    { header: "Title", accessor: "title", className: "hidden md:table-cell" },
    { header: "Location", accessor: "location", className: "hidden md:table-cell" },
    { header: "Actions", accessor: "action" },
  ];
  // Filters for booking status
  const acceptedBookings = bookings.filter((booking) => booking.status === 'Accepted');
  const completedBookings = bookings.filter((booking) => booking.status === 'Completed');
  const rejectedBookings = bookings.filter((booking) => booking.status === 'Rejected');
  const pendingBookings = bookings.filter((booking) => booking.status === 'Pending');

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
          <Link href={`/list/listings/${item._id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="OfferBoat Admin Panel" width={16} height={16} />
            </button>
          </Link>
          <FormModal table="listing" type="delete" id={item.id} />
        </div>
      </td>
    </tr>
  );

const deleteProfilePicture = async () => {
  try {
    const response = await axios.delete(`${baseURL}/user/deleteProfilePicture/${id}`);
    alert(response.data.message);
  } catch (error) {
    console.error('Error deleting profile picture:', error);
    alert('Failed to delete profile picture');
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
            <div className="w-1/3 relative">
              <Image
                src={user?.profilePicture || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                alt="OfferBoat Admin Panel"
                width={144}
                height={144}
                className="w-36 h-36 rounded-md object-cover"
              />
               <button
                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full shadow-lg zindex:1000"
                onClick={deleteProfilePicture} 
              >
              <Image src="/trash.png" alt="OfferBoat Admin Panel" width={18} height={18} />
              </button>
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
            {role === "admin" && <FormModal
                  table="user"
                  type="update"
                  data={user}
                />}
              <div className="w-2/3 flex justify-between gap-4">
                <h1 className="text-xl font-semibold">{user?.firstName} {user?.lastName}</h1>
              </div>
              <div className="flex items-center gap-1">
                <Image src="/mail.png" alt="OfferBoat Admin Panel" width={14} height={14} />
                <span>
                  {user?.email.length > 17 ? `${user?.email.slice(0, 17)}...` : user?.email}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Image src="/phone.png" alt="OfferBoat Admin Panel" width={14} height={14} />
                <span>{user?.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-1">
                <Image src="/type.png" alt="OfferBoat Admin Panel" width={14} height={14} color="black" />
                <span>{user?.userType}</span>
              </div>
              <div className="flex items-center gap-1">
                <Image src="/location.png" alt="OfferBoat Admin Panel" width={14} height={14} />
                <span>{user?.location}</span>
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
                <h1 className="text-xl font-semibold">{acceptedBookings.length}</h1>
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
                <h1 className="text-xl font-semibold">{rejectedBookings.length}</h1>
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
                <h1 className="text-xl font-semibold">{completedBookings.length}</h1>
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
                <h1 className="text-xl font-semibold">{pendingBookings.length}</h1>
                <span className="text-sm text-gray-400">Pending</span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 ">
          <h1 className="text-lg font-semibold mb-4">Upcoming Bookings</h1>
          <Calender bookings={bookings} onDateSelect={handleDateSelect} />
          {acceptedBookings.length === 0 && (
            <p>This user has no upcoming bookings</p>
          )}
        </div>
        {/* Listings Table for BoatOwner */}
        {userType === "BoatOwner" && (
          <div className="mt-4 bg-white rounded-md p-4">
            <h1 className="text-lg font-semibold mb-4">Listings</h1>
            {listings.length === 0 ? (
              <p className="text-gray-500 mt-4">This owner has no listing yet!</p>
            ) : (
              <>
                <Table columns={columns} renderRow={renderRow} data={currentItems} />

                <Pagination
                  totalItems={filteredListings.length}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage} // Update page
                />
              </>
            )
            }
          </div>
        )}
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <Performance data={[{ name: "Group A", value: user.rating, fill: "#C3EBFA" }]} ratingValue={user.rating} />
        <div className="bg-white p-4 rounded-md">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Reviews</h1>
            {reviews.length > 0 && (
              <Link
                href={{
                  pathname: '/list/reviews',
                  query: { reviews: encodeURIComponent(JSON.stringify(reviews)) },
                }}
              >
                <span className="text-xs text-gray-400">View All</span>
              </Link>
            )}
          </div>
          {reviews.length === 0 ? (
            <p className="text-gray-500 mt-4">This user has no reviews yet!</p>
          ) : (
            latestReviews.map((review: any) => (
              <Review
                key={review._id}
                firstName={userType === "BoatOwner" ? review.renterId.firstName : review.ownerId.firstName}
                lastName={userType === "BoatOwner" ? review.renterId.lastName : review.ownerId.lastName}
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
  );
};

export default SingleUserPage;
