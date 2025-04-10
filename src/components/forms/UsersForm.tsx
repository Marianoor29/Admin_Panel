"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";
import { useState } from "react";
import Loader from "../Loader";
import axios from 'axios';

const getSchema = (type: "create" | "update" | "updatePassword") => {
  return z.object({
    _id: z.string().optional(),
    firstName: z.string().min(1, { message: "First name is required!" }),
    lastName: z.string().min(1, { message: "Last name is required!" }),
    email: z.string().email({ message: "Invalid email address!" }),
    location: z.string().min(1, { message: "Location is required, Please use City, Country format!" }),
    password: type === "create"
      ? z.string().min(8, { message: "Password must be at least 8 characters long!" })
      : z.string().optional(), 
    phoneNumber: z.string().min(1, { message: "Phone is required!" }),
    rating: z
    .string() 
    .transform((val) => Number(val)) 
    .refine((val) => !isNaN(val) && val >= 0 && val <= 5, { 
      message: "Rating must be between 0 and 5!",
    }),  
    userType: z.enum(["BoatRenter", "BoatOwner"], { message: "User Type is required!" }),
    frontImage: z.any().optional(),
    backImage: z.any().optional(),
  });
};

type Inputs = z.infer<ReturnType<typeof getSchema>>;

const UsersForm = ({
  type,
  data,
  closeModal,
  onSuccess,
}: {
  type: "create" | "update" | "updatePassword";
  data?: any;
  closeModal: () => void;
  onSuccess?: () => void;
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    reset,
  } = useForm<Inputs>({
    resolver: zodResolver(getSchema(type)),
  });

  const baseURL = "https://www.offerboats.com";
  // const baseURL = "http://192.168.1.182:8090";
  const [frontImagePreview, setFrontImagePreview] = useState<string | ArrayBuffer | null>(null);
  const [backImagePreview, setBackImagePreview] = useState<string | ArrayBuffer | null>(null);
  const selectedUserType = watch("userType", data?.userType || "BoatRenter");
  const [loading, setLoading] = useState(false);

  const handleFrontImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("frontImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFrontImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("backImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (formData: Inputs) => {
    setLoading(true);
    try {
      const UserData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        userType: formData.userType,
        password: formData.password,
        rating: formData.rating,
        location:formData.location,
        termsAndPolicies: true
      };
      const UpdateUserData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        userType: formData.userType,
        rating: formData.rating,
        location:formData.location,
        termsAndPolicies: true,
      };

      if (type === "create") {
        await axios.post(`${baseURL}/user/signup`, UserData);
      } else {
        await axios.put(`${baseURL}/user/updateUser/${data._id}`, UpdateUserData);
      }

      if (formData.userType === 'BoatOwner' && formData.frontImage && formData.backImage) {
        const formDataForImages = new FormData();
        formDataForImages.append('email', formData.email);
        formDataForImages.append('frontImage', formData.frontImage);
        formDataForImages.append('backImage', formData.backImage);

        await axios.post(`${baseURL}/user/uploadDocuments`, formDataForImages, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      if (onSuccess) onSuccess();
      closeModal();
      alert(type === "create" ? "User successfully created!" : "User successfully updated!");
      reset();
    } catch (error) {
      console.error('Error during submission:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
      <Loader state={loading} />
      <h1 className="text-xl font-semibold">{type === "create" ? "Create a new user" : "Update user"}</h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">User Type</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("userType")}
            defaultValue={data?.userType}
          >
            <option value="BoatRenter">Boat Renter</option>
            <option value="BoatOwner">Boat Owner</option>
          </select>
          {errors.userType?.message && (
            <p className="text-xs text-red-400">
              {errors.userType.message.toString()}
            </p>
          )}
        </div>
        {/* Password Field - Only show when creating */}
        {type === "create" && (
          <InputField
            label="Password"
            name="password"
            type="password"
            defaultValue={data?.password}
            register={register}
            error={errors?.password}
          />
        )}
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="First Name"
          name="firstName"
          defaultValue={data?.firstName}
          register={register}
          error={errors.firstName}
        />
        <InputField
          label="Last Name"
          name="lastName"
          defaultValue={data?.lastName}
          register={register}
          error={errors.lastName}
        />
        <InputField
          label="Phone Number"
          name="phoneNumber"
          defaultValue={data?.phoneNumber}
          register={register}
          error={errors.phoneNumber}
        />
          <InputField
          label="Location"
          name="location"
          defaultValue={data?.location}
          register={register}
          error={errors.location}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Rating</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("rating")}
            defaultValue={data?.rating?.toString()} // Ensure it's a string for the select
          >
            <option value={0}>0</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>

          {errors.rating?.message && (
            <p className="text-xs text-red-400">
              {errors.rating.message.toString()}
            </p>
          )}
        </div>

        {type === "create" && selectedUserType === "BoatOwner" && (
          <div className="flex justify-between md:w-3/4 w-full ">
            <div className="flex flex-col gap-2 justify-center ">
              <label
                className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
                htmlFor="frontImage"
              >
                <Image src="/upload.png" alt="OfferBoat Admin Panel" width={28} height={28} />
                <span>Upload a Front Side</span>
              </label>
              <input type="file" id="frontImage" {...register("frontImage", { onChange: handleFrontImage })} className="hidden" />
              {errors.frontImage?.message && (
                <p className="text-xs text-red-400">
                  {errors.frontImage.message.toString()}
                </p>
              )}
              {frontImagePreview && (
                <div className="mt-4">
                  <img src={frontImagePreview as string} alt="OfferBoat Admin Panel" className="w-32 h-32 object-cover" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 justify-center">
              <label
                className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
                htmlFor="backImage"
              >
                <Image src="/upload.png" alt="" width={28} height={28} />
                <span>Upload a Back Side</span>
              </label>
              <input type="file" id="backImage" {...register("backImage", { onChange: handleBackImage })} className="hidden" />
              {errors.backImage?.message && (
                <p className="text-xs text-red-400">
                  {errors.backImage.message.toString()}
                </p>
              )}
              {backImagePreview && (
                <div className="mt-4">
                  <img src={backImagePreview as string} alt="OfferBoat Admin Panel" className="w-32 h-32 object-cover" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default UsersForm;
