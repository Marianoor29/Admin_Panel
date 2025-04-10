"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";
import { useEffect, useState } from "react";
import Loader from "../Loader";

const schema = (type: "create" | "update" | "updatePassword") => {
  return z.object({
  _id: z.string().optional(), 
  email: z.string().email({ message: "Invalid email address!" }),
  userName: z.string().min(6, { message: "UserName must be at least 6 characters long!" }),
  password: type === "create"
      ? z.string().min(8, { message: "Password must be at least 8 characters long!" })
      : z.string().optional(),
  firstName: z.string().min(1, { message: "First name is required!" }),
  lastName: z.string().min(1, { message: "Last name is required!" }),
  phoneNumber: z.string().min(1, { message: "Phone Number is required!" }),
  type: z.enum(["Admin", "Team member"], { message: "Type is required!" }),
  profilePicture: z.any().optional(),
}) };

type Inputs = z.infer<ReturnType<typeof schema>>;

const TeamForm = ({
  type,
  data,
  closeModal,
  onSuccess,
}: {
  type:  "create" | "update" | "updatePassword";
  data?: Inputs;
  closeModal: () => void;
  onSuccess?: () => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<Inputs>({
    resolver: zodResolver(schema(type)),
    defaultValues: data || {},
  });
  const baseURL = "https://www.offerboats.com";
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(null);
  const [loading, setLoading] = useState(false);

  // Populate fields with data (if it's the update case)
  useEffect(() => {
    if (data && type === 'update') {
      setValue("userName", data.userName);
      setValue("email", data.email);
      setValue("firstName", data.firstName);
      setValue("lastName", data.lastName);
      setValue("phoneNumber", data?.phoneNumber);
      setValue("type", data.type);
      setValue("profilePicture", data.profilePicture);
      setImagePreview(`${data.profilePicture}`);
    }
  }, [data, setValue, type]);

  const onSubmit = handleSubmit(async (formData) => {
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("userName", formData.userName);
      formDataToSend.append("email", formData.email);
      
      if (type === 'create' && formData.password) {
        formDataToSend.append("password", formData.password);
      }
      
      formDataToSend.append("phoneNumber", formData.phoneNumber);
      formDataToSend.append("type", formData.type);
      
      if (formData.profilePicture instanceof File) {
        formDataToSend.append("profilePicture", formData.profilePicture);
      }
  
      const url = type === "create"
        ? `${baseURL}/team/signup`
        : `${baseURL}/team/updateteam/${data?._id}`;
  
      const method = type === "create" ? "POST" : "PUT";
  
      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });
  
      if (!response.ok) {
        const errorData = await response.json();  // Parse error response
        throw new Error(errorData.message || "Network response was not ok.");
      }
  
      const result = await response.json();
      reset();
      closeModal();
      alert(type === "create" ? "Team member successfully created!" : "Team member successfully updated!");
      if (onSuccess) onSuccess();  // Trigger the onSuccess callback
    } catch (error: any) {
      console.error("Error:", error);
      if (error.message === 'A team member with this email or username already exists.') {
        alert("This email or username is already in use. Please try a different one.");  // Show a user-friendly error message
      } else {
        alert(type === "create" ? "Error creating team member" : "Error updating team member");
      }
    } finally {
      setLoading(false);
    }
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("profilePicture", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <Loader state={loading} />
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new team member" : "Update team member"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Username"
          name="userName"
          defaultValue={data?.userName}
          register={register}
          error={errors?.userName}
        />
        <InputField
          label="Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
        />
           {type === 'create' && (
        <InputField
          label="Password"
          name="password"
          type="password"
          defaultValue={data?.password}
          register={register}
          error={errors?.password}
        /> )}
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
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Type</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("type")}
            defaultValue={data?.type}
          >
            <option value="Admin">Admin</option>
            <option value="Team member">Team Member</option>
          </select>
          {errors.type?.message && (
            <p className="text-xs text-red-400">
              {errors.type.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label
            className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
            htmlFor="profilePicture"
          >
            <Image src="/upload.png" alt="OfferBoat Admin Panel" width={28} height={28} />
            <span>Upload a photo</span>
          </label>
          <input
            type="file"
            id="profilePicture"
            {...register("profilePicture", { onChange: handleImageChange })}
            className="hidden"
          />
          {errors.profilePicture?.message && (
            <p className="text-xs text-red-400">
              {errors.profilePicture.message.toString()}
            </p>
          )}
          {imagePreview && (
            <div className="mt-4">
              <img src={imagePreview as string} alt="OfferBoat Admin Panel" className="w-32 h-32 object-cover" />
            </div>
          )}
        </div>
      </div>
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default TeamForm;
