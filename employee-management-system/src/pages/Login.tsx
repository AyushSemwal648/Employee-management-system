import axios from "axios";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {

const [email, setEmail] = useState<string>("");
const [password, setPassword] = useState<string>("");
const [error, setError] = useState<string | null>(null);
const { login } = useAuth();
const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => { // Fix: Proper type instead of 'any'
  e.preventDefault();

  try {
    const response = await axios.post(
      "http://localhost:8000/api/auth/login",
      { email, password }
    );

    if (response.data.success) {
      // Fix 1: Pass both user AND token to login function (as your AuthContext expects)
      login(response.data.user, response.data.token);
      // Fix 2: Don't manually set localStorage - your login function should handle this
      
      // Fix 3: Correct the typo in the URL
      if (response.data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (response.data.user.role === "employee") { // Fix 4: Add explicit check
        navigate("/employee-dashboard"); // Fix 5: Correct spelling - was "dashborad"
      } else {
        setError("Unknown user role");
      }
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
    <div className="flex max-w-[1536px] mx-auto h-screen justify-center items-center py-28 px-20">
      <div className=" max-h-[800px] shadow-[0px_0px_20px] shadow-black/10 py-16 px-24">
        <h1 className="source-sans-3-bold text-4xl mb-8">
          Employe Management System
        </h1>
        {error && (
          <p className="source-sans-3-regular text-red-400 mb-2">{error}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 mb-4">
            <label className="source-sans-3-medium text-lg" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter Your Email"
              className="border px-4 py-2 outline-none rounded-xl border-black/30"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2 mb-4">
            <label className="source-sans-3-medium text-lg" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter Your Password"
              className="border px-4 py-2 outline-none rounded-xl border-black/30"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 flex items-center justify-between">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox" />
              <span className="ml-2">Remember Me</span>
            </label>
            <a href="#" className="text-primary">
              Forget Password?
            </a>
          </div>
          <button
            type="submit"
            className="px-8 py-2 source-sans-3-semibold border rounded-lg border-black/30 bg-primary text-white"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
