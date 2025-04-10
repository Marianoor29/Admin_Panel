"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation"; 

const Navbar = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]); 
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname(); 
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Get the user's name from localStorage
    const savedUserName = localStorage.getItem("userName");

    if (savedUserName) {
      setUserName(savedUserName);

      // Fetch user data from the backend
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`https://www.offerboats.com/team/teamData/${savedUserName}`);
          const userData = response.data;

          // Set user data in state
          setUserName(userData.userName);
          setUserRole(userData.type); // Assuming type is the user role
          setProfilePicture(userData.profilePicture ? userData.profilePicture : "/avatar.png");

          // Optionally, save profile picture to localStorage
          localStorage.setItem("profilePicture", userData.profilePicture);
        } catch (error) {
          console.error("Error fetching user data", error);
        }
      };

      fetchUserData();
    } else {
      console.log("No user is logged in");
    }
  }, []);


  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://www.offerboats.com/notification/notifications');
      const fetchedNotifications = response.data;

      // Only update state if there are new notifications
      if (JSON.stringify(fetchedNotifications) !== JSON.stringify(notifications)) {
        setNotifications(fetchedNotifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Set up polling every 30 seconds (adjust the interval as necessary)
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000); // Poll every 30 seconds

    // Save the polling interval to the state, so we can clear it if needed
    setPollingInterval(interval);

    // Clean up the interval on unmount
    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [notifications]);

  useEffect(() => {
    setIsDropdownOpen(false);
  }, [pathname]);


  useEffect(() => {
    setIsDropdownOpen(false);
  }, [pathname]); 

  // Function to mark a notification as read
  const markAsRead = async (notificationId: string,  messageId: string) => {
    try {
      await axios.put(`https://www.offerboats.com/notification/notifications/${notificationId}/read`);
      // Update the notifications state to reflect the change
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId ? { ...notification, read: true } : notification
        )
      );
      router.push(`/list/messages/${messageId}`);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Function to clear all read notifications
const clearAllNotifications = async () => {
  setLoading(true)
  try {
    await axios.delete('https://www.offerboats.com/notification/delete-Notifications'); // Call your delete API
    // Update the state to remove all read notifications
    setNotifications(prev => prev.filter(notification => !notification.read));
  } catch (error) {
    console.error("Error clearing notifications:", error);
  }
  setLoading(false)
};


  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };
  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <div className="flex items-center justify-between p-4">
      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        {/* Announcement Icon */}
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative" 
          onClick={toggleDropdown}>
          <Image src="/announcement.png" alt="OfferBoat Admin Panel" width={20} height={20} />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
            {unreadCount}
          </div>
        </div>
      {/* Dropdown Menu */}
{isDropdownOpen && (
  <div className="fixed top-12 right-0 bg-white shadow-md rounded-md w-full md:w-96 p-2 z-50">
    {loading ? (
              <div className="flex justify-center items-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : 
    notifications.length > 0 ? (
      <div className="max-h-60 overflow-y-auto"> {/* Added max-height and overflow */}
        {notifications.map((notification) => (
          <div 
            key={notification._id} 
            onClick={() => markAsRead(notification._id, notification.data.messageId)} 
            className={`rounded-md cursor-pointer p-2 mb-2 ${notification.read ? 'bg-gray-100' : 'bg-gray-300'}`}
          >
            <div className="flex justify-start gap-2 mb-2 w-full ">
              <Image 
                src={notification.userId.profilePicture}
                alt="OfferBoat Admin Panel" 
                width={20} 
                height={20}  
                className="xl:block w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col ">
                <h6 className="text-sm font-semibold">
                  {notification.userId.firstName} {notification.userId.lastName}
                </h6>
                <h6 className="text-sm">{notification.userId.email}</h6>
              </div>
            </div>
            <div className="flex flex-col items-start mt-2 ">
              <h3 className="text-sm font-semibold">{notification.title}</h3>
              <h3 className="text-sm font-medium">{notification.body}</h3>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-sm font-medium text-center">No notifications</p>
    )}
     {notifications.length > 0 && (
    <p onClick={clearAllNotifications} className="text-sm cursor-pointer font-semibold text-center">Clear All</p>
     )}
  </div>
)}



        {/* Display the User's Name and Role */}
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">{userName || "Guest"}</span>
          <span className="text-[10px] text-gray-500 text-right">
            {userRole || "User"}
          </span>
        </div>

        {/* Avatar */}
        <Image
          src={profilePicture ? profilePicture : "/avatar.png"}
          alt="OfferBoat Admin Panel"
          width={36}
          height={36}
          className="rounded-full border-2 border-blue-400"
        />
      </div>
    </div>
  );
};

export default Navbar;
