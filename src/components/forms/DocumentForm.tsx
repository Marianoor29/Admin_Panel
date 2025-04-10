"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";
import { useEffect, useState } from "react";
import Loader from "../Loader";
import axios from 'axios';

const getSchema = (type:  "create" | "update" | "updatePassword") => {
  return z.object({
    _id: z.string().optional(),
    email: z.string().email({ message: "Invalid email address!" }),
    frontImage: z.any().optional(),
    backImage: z.any().optional(),
  });
};

type Inputs = z.infer<ReturnType<typeof getSchema>>;

const DocumentForm = ({
  type,
  data,
  closeModal,
  onSuccess,
}: {
  type:  "create" | "update" | "updatePassword";
  data?: any;
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
    resolver: zodResolver(getSchema(type)),
    defaultValues: data || {},
  });

  const baseURL = "https://www.offerboats.com";
  const [frontImagePreview, setFrontImagePreview] = useState<string | ArrayBuffer | null>(null);
  const [backImagePreview, setBackImagePreview] = useState<string | ArrayBuffer | null>(null);
  const [loading, setLoading] = useState(false);
  const frontImage = data.frontImage;
  const backImage = data.backImage;

   // Populate fields with data (if it's the update case)
   useEffect(() => {
    if (data && type === 'update') {
      setValue("email", data.email);
      setValue("frontImage", data.frontImage);
      setFrontImagePreview(frontImage);
      setValue("backImage", data.backImage);
      setBackImagePreview(backImage);
    }
  }, [data, setValue, type]);


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
      const form = new FormData(); // Create a FormData object
  
      // Append the email and files to the FormData object
      form.append('email', formData.email);
      
      if (formData.frontImage instanceof File) {
        form.append('frontImage', formData.frontImage);
      }
      
      if (formData.backImage instanceof File) {
        form.append('backImage', formData.backImage);
      }
  
      if (type === "create") {
        // Create request
        await axios.post(`${baseURL}/user/uploadDocuments`, form, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Update request
        await axios.put(`${baseURL}/user/updateDocuments`, form, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
  
      if (onSuccess) onSuccess();
      closeModal();
      alert(type === "create" ? "Document successfully created!" : "Document successfully updated!");
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
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Personal Documents
      </span>
      <div className="flex justify-between flex-wrap ">
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
                  <Image src="/upload.png" alt="OfferBoat Admin Panel" width={28} height={28} />
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
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default DocumentForm;
