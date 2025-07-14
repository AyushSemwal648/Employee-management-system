import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Define the structure based on the actual API response
type UserType = {
  _id: string;
  name: string;
  email: string;
  role: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type DepartmentType = {
  _id: string;
  dep_name: string;
  description: string;
  // You may add other department fields if needed
};

type EmployeeDataType = {
  _id: string;
  employeeId: string;
  dob: string;
  gender: string;
  phoneNumber: string;
  salary: number;
  accountNumber: string;
  bankBranch: string;
  bankIfsc: string;
  department: DepartmentType;
  userId: UserType;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type ApiResponse = {
  success: boolean;
  employee: EmployeeDataType;
};

const ViewEmployee = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState<EmployeeDataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      setLoading(true);
      try {
        const response = await axios.get<ApiResponse>(
          `http://localhost:8000/api/employees/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        
        if (response.data.success) {
          setEmployee(response.data.employee);
        }
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response &&
          !error.response.data.success
        ) {
          setError(error.response.data.error || "An error occurred");
          alert(error.response.data.error);
        } else {
          setError("Failed to fetch employee data");
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmployee();
  }, [id]);

  if (loading) {
    return <div>Loading employee data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!employee) {
    return <div>No employee data found</div>;
  }

  return (
    <div className="p-4 px-14">
      <h1 className="text-3xl source-sans-3-bold mb-4">Employee Details</h1>
      
      <div className="bg-white shadow rounded p-6">
        <div className="flex items-center mb-6">
          {employee.userId.image && (
            <img 
              src={`http://localhost:8000/${employee.userId.image}`} 
              alt={employee.userId.name}
              className="w-24 h-24 rounded-full object-cover object-top mr-6"
            />
          )}
          <div>
            <h2 className="text-xl source-sans-3-bold">{employee.userId.name}</h2>
            <p className="text-gray-600">{employee.employeeId} • {employee.department.dep_name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-lg mb-2">Personal Information</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Email:</span> {employee.userId.email}</p>
              <p><span className="font-medium">Phone:</span> {employee.phoneNumber}</p>
              <p><span className="font-medium">Gender:</span> {employee.gender}</p>
              <p><span className="font-medium">Date of Birth:</span> {new Date(employee.dob).toLocaleDateString()}</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-2">Employment Details</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Department:</span> {employee.department.dep_name}</p>
              <p><span className="font-medium">Role:</span> {employee.userId.role}</p>
              <p><span className="font-medium">Salary:</span> ₹ {employee.salary.toLocaleString()}</p>
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-medium text-lg mb-2">Banking Information</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Bank:</span> {employee.bankBranch}</p>
              <p><span className="font-medium">IFSC Code:</span> {employee.bankIfsc}</p>
              <p><span className="font-medium">Account Number:</span> {employee.accountNumber}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployee;