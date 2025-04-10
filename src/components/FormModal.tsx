"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";

const TeamForm = dynamic(() => import("./forms/TeamForm"), {
  loading: () => <h1>Loading...</h1>,
});
const UsersForm = dynamic(() => import("./forms/UsersForm"), {
  loading: () => <h1>Loading...</h1>,
});
const DocumentForm = dynamic(() => import("./forms/DocumentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ResetTeamPassword = dynamic(() => import("./forms/ResetTeamPassword"), {
  loading: () => <h1>Loading...</h1>,
});

const forms: {
  [key: string]: (type: "create" | "update" | "updatePassword", data?: any, closeModal?: () => void, onSuccess?: () => void) => JSX.Element;
} = {
  team: (type, data, closeModal, onSuccess) => <TeamForm type={type} data={data} closeModal={closeModal || (() => { })} onSuccess={onSuccess} />,
  user: (type, data, closeModal, onSuccess) => <UsersForm type={type} data={data} closeModal={closeModal || (() => { })} onSuccess={onSuccess} />,
  document: (type, data, closeModal, onSuccess) => <DocumentForm type={type} data={data} closeModal={closeModal || (() => { })} onSuccess={onSuccess} />,
  teamPassword: (type, data, closeModal, onSuccess) => <ResetTeamPassword type={type} data={data} closeModal={closeModal || (() => { })} onSuccess={onSuccess} />
};

const FormModal = ({
  table,
  type,
  data,
  id,
  onSuccess,
}: {
  table:
  | "team"
  | "user"
  | "booking"
  | "listing"
  | "document"
  | "teamPassword"
  | "offer"
  type: "create" | "update" | "delete" | "updatePassword";
  data?: any;
  id?: string;
  onSuccess?: () => void;
}) => {
  const size = type === "create" ? "w-8 h-8" : type === "updatePassword"  ?"w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
        ? "bg-lamaSky"
         : type === "updatePassword"
        ? "bg-lamaYellow" : "bg-lamaPurple";

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const closeModal = () => setOpen(false);
  const baseURL = "https://www.offerboats.com";

  const handleDelete = async () => {
    if (!id) return;

    setLoading(true);
    try {
      let response;

      if (table === "user") {
        // Call the backend deleteUserById endpoint if deleting a user
        response = await axios.post(`${baseURL}/user/deleteUserById`, { id });
      } else if (table === 'booking') {
        // Fallback for other delete endpoints (e.g., for 'team')
        response = await axios.delete(`${baseURL}/booking/delete-booking/${id}`);
      }
       else if (table === 'listing') {
        // Fallback for other delete endpoints (e.g., for 'team')
        response = await axios.delete(`${baseURL}/listing/delete-listing/${id}`);
      }
       else if (table === 'offer') {
        // Fallback for other delete endpoints (e.g., for 'team')
        response = await axios.delete(`${baseURL}/deleteCustomOffer/${id}`);
      }
        else {
        // Fallback for other delete endpoints (e.g., for 'team')
        response = await axios.delete(`${baseURL}/team/deleteTeam/${id}`);
      }

      if (response.status === 200) {
        alert(`${table.charAt(0).toUpperCase() + table.slice(1)} deleted successfully!`);
        closeModal(); // Close the modal after successful deletion
        if (onSuccess) onSuccess();
      } else {
        console.error("Delete failed:", response.data);
        alert(`Error deleting ${table}: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(`Error deleting ${table}`);
    } finally {
      setLoading(false);
    }
  };

  const Form = () => {
    if (type === "delete" && id) {
      return (
        <form className="p-4 flex flex-col gap-4" onSubmit={(e) => {
          e.preventDefault(); 
          handleDelete();
        }}>
          {
            table === "team" ?
              <span className="text-center font-medium">
                Are you sure you want to delete this member?
              </span>
              :
              table === "user" ?
                <span className="text-center font-medium">
                  Are you sure you want to delete this user? <br />
                  Note: Before deleting the user, please check if they have any "Accepted" bookings.
                </span>
            : 
            <span className="text-center font-medium">
            Are you sure you want to delete this {table}?
          </span>
          }

          <button
            type="submit"
            className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </form>
      );
    } else if (type === "create" || type === "update" || type === "updatePassword") {
      return forms[table](type, data, closeModal);
    } else {
      return "Form not found!";
    }
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="OfferBoat Admin Panel" width={16} height={16} />
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="OfferBoat Admin Panel" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
