import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddLeaves = () => {
  const { user } = useAuth();
  const [leave, setLeave] = useState({
    userId: user?._id,
    leaveType: "",
    fromDate: "",
    endDate: "",
    reason: "",
    isHalfDay: false,
    halfDayPeriod: "morning"
  });
  const navigate = useNavigate();

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setLeave((prevState) => ({ 
      ...prevState, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    // If half day is checked, set fromDate and endDate to same value
    if (name === 'isHalfDay' && checked) {
      if (leave.fromDate) {
        setLeave(prev => ({ ...prev, endDate: prev.fromDate }));
      }
    }
  };

  const handleFromDateChange = (e: any) => {
    const { value } = e.target;
    setLeave(prevState => ({
      ...prevState,
      fromDate: value,
      // If half day, set end date same as from date
      endDate: prevState.isHalfDay ? value : prevState.endDate
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    // Debug logging
    console.log('Form data being sent:', leave);
    
    try {
      const response = await axios.post(
        'http://localhost:8000/api/leave/add', 
        leave,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.data.success) {
        navigate('/employee-dashboard/leaves');
      }
    } catch (error) {
      if (axios.isAxiosError(error) &&
          error.response &&
          error.response.data &&
          !error.response.data.success) {
        alert(error.response.data.error);
      } else {
        console.error("Upload error:", error);
        alert("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="px-20 py-28">
      <h2 className="source-sans-3-semibold">Applying for Leave</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-10 mt-10">
          <div className="flex flex-col">
            <label className="ml-2 mb-2">From Date</label>
            <input
              type="date"
              onChange={handleFromDateChange}
              name="fromDate"
              value={leave.fromDate}
              className="rounded-xl border border-black/30 py-3 px-5"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="ml-2 mb-2">End Date</label>
            <input
              type="date"
              onChange={handleChange}
              name="endDate"
              value={leave.endDate}
              className="rounded-xl border border-black/30 py-3 px-5"
              disabled={leave.isHalfDay}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="ml-2 mb-2">Leave Type</label>
            <select
              name="leaveType"
              onChange={handleChange}
              value={leave.leaveType}
              className="px-4 rounded-xl border border-black/30 w-full outline-none py-3"
              required
            >
              <option value="">Select Leave Type</option>
              <option value="casual">Casual Leave</option>
              <option value="sick">Sick Leave</option>
            </select>
          </div>
        </div>

        {/* Half Day Section */}
        <div className="mt-6 flex items-center gap-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isHalfDay"
              name="isHalfDay"
              checked={leave.isHalfDay}
              onChange={handleChange}
              className="mr-2 w-4 h-4"
            />
            <label htmlFor="isHalfDay" className="source-sans-3-regular">
              Half Day Leave
            </label>
          </div>
          
          {leave.isHalfDay && (
            <div className="flex items-center gap-4">
              <label className="source-sans-3-regular">Period:</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="halfDayPeriod"
                    value="morning"
                    checked={leave.halfDayPeriod === 'morning'}
                    onChange={handleChange}
                    className="mr-1"
                  />
                  Morning
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="halfDayPeriod"
                    value="afternoon"
                    checked={leave.halfDayPeriod === 'afternoon'}
                    onChange={handleChange}
                    className="mr-1"
                  />
                  Afternoon
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 flex gap-10 items-end">
          <div className="w-[32%] flex flex-col">
            <label className="source-sans-3-regular ml-2 mb-2">Reason</label>
            <textarea
              placeholder="Enter the Reason"
              name="reason"
              value={leave.reason}
              onChange={handleChange}
              className="px-3 py-5 border rounded-xl"
              required
            />
          </div>
          <button type="submit" className="py-4 px-16 bg-primary rounded-xl h-fit text-white source-sans-3-regular cursor-pointer">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLeaves;