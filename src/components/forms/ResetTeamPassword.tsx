"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useState } from "react";
import Loader from "../Loader";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address!" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long!" }),
});

type Inputs = z.infer<typeof schema>;

const ResetTeamPassword = ({
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
    reset,
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });
  
  const baseURL = "https://www.offerboats.com"; // Change this to your actual backend URL
  const [loading, setLoading] = useState(false);

  const onSubmit = handleSubmit(async (formData) => {
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/team/reset-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          newPassword: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reset password');
      }

      alert("Password reset successfully");
      reset(); // Resets the form
      closeModal(); // Close the modal
      if (onSuccess) onSuccess(); // Call the onSuccess callback if passed
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Error resetting password');
    } finally {
      setLoading(false);
    }
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <Loader state={loading} />
      <h1 className="text-xl font-semibold">Reset team member's password</h1>
      <span className="text-xs text-gray-400 font-medium">Authentication Information</span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Email"
          name="email"
          register={register}
          error={errors?.email}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          register={register}
          error={errors?.password}
        /> 
      </div>
      <button className="bg-blue-400 text-white p-2 rounded-md">
        Reset
      </button>
    </form>
  );
};

export default ResetTeamPassword;
