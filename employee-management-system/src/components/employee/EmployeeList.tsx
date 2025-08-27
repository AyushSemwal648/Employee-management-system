import axios from "axios";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import React, { useEffect, useState } from "react";
import {
  columns,
  EmployeeButtons,
  customStyles,
} from "../../utils/EmployeeHelpers";

type EmployeeType = {
  _id: string;
  sno: number;
  dep_name: string;
  name: string;
  email: string;
  account: string;
  dob: string;
  image: React.ReactNode;
  action: React.ReactNode;
};

const EmployeeList = () => {
  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [empLoading, setEmpLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleEmployeeDelete = (id: string) => {
    setEmployees(prev => prev.filter(emp => emp._id !== id));
  };

  const fetchEmployees = async () => {
    setEmpLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      console.log("Token exists:", !!token);
      
      if (!token) {
        setError("No authentication token found");
        return;
      }

      console.log("Fetching employees from API...");
      
      const response = await axios.get("http://localhost:8000/api/employees", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("API Response:", response.data);

      if (response.data.success) {
        const employeesData = response.data.employees;
        console.log("Employees data:", employeesData);
        
        if (!employeesData || employeesData.length === 0) {
          console.log("No employees found in database");
          setEmployees([]);
          return;
        }

        let sno = 1;
        const data = employeesData.map((emp: any) => {
          console.log("Processing employee:", emp);
          
          // Check if required nested data exists
          if (!emp.userId) {
            console.error("Employee missing userId:", emp);
            return null;
          }
          
          if (!emp.department) {
            console.error("Employee missing department:", emp);
            return null;
          }

          return {
            _id: emp._id,
            sno: sno++,
            dep_name: emp.department.dep_name || "N/A",
            name: emp.userId.name || "N/A",
            email: emp.userId.email || "N/A",
            account: emp.accountNumber || "N/A",
            dob: emp.dob ? new Date(emp.dob).toDateString() : "N/A",
            image: emp.userId.image ? (
              <img
                src={`http://localhost:8000/${emp.userId.image}`}
                alt="profile image"
                className="size-16 rounded-full object-cover object-top"
                onError={(e) => {
                  console.error("Image failed to load:", emp.userId.image);
                  e.currentTarget.src = "/placeholder-avatar.png"; // fallback image
                }}
              />
            ) : (
              <div className="size-16 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 text-xs">No Image</span>
              </div>
            ),
            action: (
              <EmployeeButtons 
                _id={emp._id} 
                onEmployeeDelete={handleEmployeeDelete}
              />
            ),
          };
        }).filter(Boolean); // Remove null entries
        
        console.log("Processed employees data:", data);
        setEmployees(data);
      } else {
        console.error("API returned success: false");
        setError("Failed to fetch employees: " + (response.data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error("Error response:", error.response.data);
          const errorMessage = error.response.data.error || `Server error: ${error.response.status}`;
          setError(errorMessage);
          
          if (error.response.status === 401) {
            setError("Authentication failed. Please login again.");
            // Optionally redirect to login
            // window.location.href = "/login";
          }
        } else if (error.request) {
          console.error("No response received:", error.request);
          setError("No response from server. Please check if the server is running.");
        } else {
          console.error("Request setup error:", error.message);
          setError("Request failed: " + error.message);
        }
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setEmpLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  console.log("Current employees state:", employees);

  if (empLoading) {
    return (
      <div className="px-14 bg-background">
        <div className="mt-10 flex justify-center items-center h-64">
          <div className="text-xl">Loading employees...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-14 bg-background">
        <div className="mt-10">
          <div className="mb-8">
            <h2 className="source-sans-3-bold text-3xl">Manage Employees</h2>
          </div>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p><strong>Error:</strong> {error}</p>
            <button 
              onClick={fetchEmployees}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-14 bg-background">
      <div className="mt-10">
        <div className="mb-8">
          <h2 className="source-sans-3-bold text-3xl">Manage Employees</h2>
        </div>
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="Search Employee Name"
            className="px-4 py-2 border border-black/30 source-sans-3-regular outline-none"
          />
          <Link
            to="/admin-dashboard/add-employee"
            className="px-6 py-2 bg-secondary text-white source-sans-3-semibold cursor-pointer"
          >
            Add New Employee
          </Link>
        </div>
        <div className="mt-5">
          {employees.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No employees found.</p>
              <Link
                to="/admin-dashboard/add-employee"
                className="mt-4 inline-block px-6 py-2 bg-secondary text-white source-sans-3-semibold cursor-pointer"
              >
                Add First Employee
              </Link>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={employees}
              customStyles={customStyles}
              pagination
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;