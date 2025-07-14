import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";

interface LeaveBalance {
  casual: {
    available: number;
    used: number;
    remaining: number;
    monthlyAllocation: number;
  };
  sick: {
    available: number;
    used: number;
    remaining: number;
    monthlyAllocation: number;
  };
  doj: string;
  currentYear: number;
}

const ViewLeaves = () => {
  const { user } = useAuth();
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLeaveBalance();
  }, []);

  const fetchLeaveBalance = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/leave/balance/${user?._id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setLeaveBalance(response.data.leaveBalance);
      }
    } catch (error) {
      console.error("Error fetching leave balance:", error);
      setError("Failed to fetch leave balance");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateMonthsWorked = (doj: string) => {
    const joining = new Date(doj);
    const current = new Date();
    const currentYear = current.getFullYear();
    const joiningYear = joining.getFullYear();

    if (joiningYear === currentYear) {
      return current.getMonth() - joining.getMonth() + 1;
    } else {
      return 12; // Full year if joined in previous years
    }
  };

  if (loading) {
    return (
      <div className="px-20 py-28">
        <div className="grid grid-cols-3 gap-10">
          <div className="py-6 flex justify-center bg-white rounded-2xl overflow-hidden">
            <p className="source-sans-3-regular">Loading...</p>
          </div>
          <div className="py-6 flex justify-center bg-white rounded-2xl overflow-hidden">
            <p className="source-sans-3-regular">Loading...</p>
          </div>
          <Link
            to="/employee-dashboard/add-leave"
            className="bg-primary text-white source-sans-3-regular flex justify-center items-center rounded-2xl py-6"
          >
            Apply Leaves
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-20 py-28">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
        <div className="grid grid-cols-3 gap-10">
          <div className="py-6 flex justify-center bg-white rounded-2xl overflow-hidden">
            <p className="source-sans-3-regular text-gray-500">Unable to load</p>
          </div>
          <div className="py-6 flex justify-center bg-white rounded-2xl overflow-hidden">
            <p className="source-sans-3-regular text-gray-500">Unable to load</p>
          </div>
          <Link
            to="/employee-dashboard/add-leave"
            className="bg-primary text-white source-sans-3-regular flex justify-center items-center rounded-2xl py-6"
          >
            Apply Leaves
          </Link>
        </div>
      </div>
    );
  }
  
  const monthsWorked = leaveBalance ? calculateMonthsWorked(leaveBalance.doj) : 0;

  return (
    <div className="px-20 py-28">
      {/* Leave Balance Summary */}
      {leaveBalance && (
        <div className="mb-8 p-6 bg-blue-50 rounded-2xl">
          <h3 className="source-sans-3-semibold text-lg mb-3">Leave Summary - {leaveBalance.currentYear}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Joined:</p>
              <p className="source-sans-3-semibold">{formatDate(leaveBalance.doj)}</p>
            </div>
            <div>
              <p className="text-gray-600">Months Worked:</p>
              <p className="source-sans-3-semibold">{monthsWorked} months</p>
            </div>
            <div>
              <p className="text-gray-600">Monthly Allocation:</p>
              <p className="source-sans-3-semibold">1 Casual + 1 Sick per month</p>
            </div>
          </div>
        </div>
      )}

      {/* Leave Cards */}
      <div className="grid grid-cols-3 gap-10">
        {/* Casual Leaves Card */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-green-500 text-white p-4">
            <h3 className="source-sans-3-semibold text-lg">Casual Leaves</h3>
          </div>
          <div className="p-6">
            {leaveBalance ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="source-sans-3-regular text-gray-600">Available:</span>
                  <span className="source-sans-3-semibold text-xl text-green-600">
                    {leaveBalance.casual.available}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="source-sans-3-regular text-gray-600">Used:</span>
                  <span className="source-sans-3-semibold text-xl text-orange-600">
                    {leaveBalance.casual.used}
                  </span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between items-center">
                  <span className="source-sans-3-regular text-gray-800">Remaining:</span>
                  <span className={`source-sans-3-semibold text-2xl ${
                    leaveBalance.casual.remaining > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {leaveBalance.casual.remaining}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min((leaveBalance.casual.used / leaveBalance.casual.available) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    {leaveBalance.casual.available > 0 ? 
                      `${((leaveBalance.casual.used / leaveBalance.casual.available) * 100).toFixed(1)}% used` : 
                      '0% used'
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <p className="source-sans-3-regular">Loading...</p>
              </div>
            )}
          </div>
        </div>

        {/* Sick Leaves Card */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-red-500 text-white p-4">
            <h3 className="source-sans-3-semibold text-lg">Sick Leaves</h3>
          </div>
          <div className="p-6">
            {leaveBalance ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="source-sans-3-regular text-gray-600">Available:</span>
                  <span className="source-sans-3-semibold text-xl text-green-600">
                    {leaveBalance.sick.available}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="source-sans-3-regular text-gray-600">Used:</span>
                  <span className="source-sans-3-semibold text-xl text-orange-600">
                    {leaveBalance.sick.used}
                  </span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between items-center">
                  <span className="source-sans-3-regular text-gray-800">Remaining:</span>
                  <span className={`source-sans-3-semibold text-2xl ${
                    leaveBalance.sick.remaining > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {leaveBalance.sick.remaining}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-red-500 h-3 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min((leaveBalance.sick.used / leaveBalance.sick.available) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    {leaveBalance.sick.available > 0 ? 
                      `${((leaveBalance.sick.used / leaveBalance.sick.available) * 100).toFixed(1)}% used` : 
                      '0% used'
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <p className="source-sans-3-regular">Loading...</p>
              </div>
            )}
          </div>
        </div>

        {/* Apply Leaves Button */}
        <Link
          to="/employee-dashboard/add-leave"
          className="bg-primary text-white source-sans-3-regular flex flex-col justify-center items-center rounded-2xl py-6 hover:bg-primary/90 transition-colors duration-200 shadow-lg"
        >
          <div className="text-center">
            <div className="text-4xl mb-2">+</div>
            <div className="text-lg">Apply Leaves</div>
            <div className="text-sm opacity-80 mt-1">Submit new leave request</div>
          </div>
        </Link>
      </div>

      {/* Additional Info */}
      {leaveBalance && (
        <div className="mt-8 p-4 bg-yellow-50 rounded-2xl border border-yellow-200">
          <div className="flex items-start">
            <div className="text-yellow-600 text-xl mr-3">💡</div>
            <div>
              <p className="source-sans-3-semibold text-yellow-800 mb-1">Leave Policy Information</p>
              <ul className="source-sans-3-regular text-yellow-700 text-sm space-y-1">
                <li>• You get 1 casual leave and 1 sick leave per month</li>
                <li>• Leave balance resets every January 1st</li>
                <li>• Unused leaves do not carry forward to next year</li>
                <li>• Half-day leaves count as 0.5 days</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewLeaves;