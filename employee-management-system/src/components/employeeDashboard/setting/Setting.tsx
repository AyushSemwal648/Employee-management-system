import React from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const Setting = () => {
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [setting, setSetting] = useState({
    userId: user?._id,
    oldPassword: "",
    newPassword: "", // Fixed: Changed from newPassWord to newPassword
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // Removed e.preventDefault() - not needed for onChange
    setSetting({ ...setting, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (setting.newPassword !== setting.confirmPassword) {
      setError("Passwords do not match");
      return; // Added return to prevent API call
    }

    try {
      const response = await axios.put(
        "http://localhost:8000/api/setting/change-password",
        {
          userId: setting.userId,
          oldPassword: setting.oldPassword,
          newPassword: setting.newPassword, // Fixed property name
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      if (response.data.success) {
        navigate("/employee-dashboard");
      }
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        !error.response.data.success
      ) {
        setError(error.response.data.error);
      } else {
        setError("Server Error");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <div className="max-h-[800px] shadow-[0px_0px_20px] shadow-black/10 py-16 px-24 md:w-[600px]">
        <h1 className="source-sans-3-bold text-4xl mb-8">
          Change Password
        </h1>
        {error && (
          <p className="source-sans-3-regular text-red-400 mb-2">{error}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 mb-4">
            <label
              className="source-sans-3-medium text-lg"
              htmlFor="oldPassword"
            >
              Old Password
            </label>
            <input
              type="password"
              name="oldPassword" // Added name attribute
              value={setting.oldPassword} // Added controlled value
              placeholder="Old Password"
              onChange={handleChange}
              className="border px-4 py-2 outline-none rounded-xl border-black/30"
              required
            />
          </div>
          <div className="flex flex-col gap-2 mb-4">
            <label
              className="source-sans-3-medium text-lg"
              htmlFor="newPassword"
            >
              New Password
            </label>
            <input
              type="password"
              name="newPassword" // Added name attribute
              value={setting.newPassword} // Added controlled value
              placeholder="New Password"
              onChange={handleChange}
              className="border px-4 py-2 outline-none rounded-xl border-black/30"
              required
            />
          </div>
          <div className="flex flex-col gap-2 mb-4">
            <label
              className="source-sans-3-medium text-lg"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword" // Added name attribute
              value={setting.confirmPassword} // Added controlled value
              placeholder="Confirm Password"
              onChange={handleChange}
              className="border px-4 py-2 outline-none rounded-xl border-black/30"
              required
            />
          </div>
          <button
            type="submit"
            className="px-8 py-2 source-sans-3-semibold border rounded-lg border-black/30 bg-primary text-white cursor-pointer"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Setting;