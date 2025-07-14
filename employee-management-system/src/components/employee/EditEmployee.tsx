import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { fetchDepartments } from "../../utils/EmployeeHelpers";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

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

// Form data type for edited employee
type FormDataType = {
  name: string;
  email: string;
  employeeId: string;
  dob: string;
  doj: string;
  gender: string;
  department: string;
  phoneNumber: string;
  salary: number;
  role: string;
  bankBranch: string;
  bankIfsc: string;
  accountNumber: string;
  image: File | null;
};

const EditEmployee = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<EmployeeDataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<DepartmentType[]>([]);
  const { id } = useParams();

  // Create separate state for form data
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    employeeId: "",
    dob: "",
    doj: "",
    gender: "",
    department: "",
    phoneNumber: "",
    salary: 0,
    role: "",
    bankBranch: "",
    bankIfsc: "",
    accountNumber: "",
    image: null
  });

  // Fetch departments
  useEffect(() => {
    const getDepartments = async () => {
      try {
        const depsData = await fetchDepartments();
        if (depsData) {
          setDepartments(depsData);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    getDepartments();
  }, []);

  // Fetch employee data
  useEffect(() => {
    const fetchEmployee = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/api/employees/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        
        if (response.data.success) {
          const employeeData = response.data.employee;
          setEmployee(employeeData);
          
          // Populate form data with employee data
          setFormData({
            name: employeeData.userId.name || "",
            email: employeeData.userId.email || "",
            employeeId: employeeData.employeeId || "",
            dob: employeeData.dob ? employeeData.dob.split('T')[0] : "", // Format date for input
            doj: employeeData.doj ? employeeData.doj.split('T')[0] : "", // Format date for input
            gender: employeeData.gender || "",
            department: employeeData.department._id || "",
            phoneNumber: employeeData.phoneNumber || "",
            salary: employeeData.salary || 0,
            role: employeeData.userId.role || "",
            bankBranch: employeeData.bankBranch || "",
            bankIfsc: employeeData.bankIfsc || "",
            accountNumber: employeeData.accountNumber || "",
            image: null // Can't prefill file input
          });
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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle file input separately
    if (type === "file") {
      const fileInput = e.target as HTMLInputElement;
      const files = fileInput.files;
      
      if (files && files.length > 0) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: files[0]
        }));
      }
    } else {
      // Handle other input types
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === "number" ? Number(value) : value
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Create a new FormData object
    const formDataObj = new FormData();
    
    // Add text fields to FormData
    formDataObj.append("name", formData.name);
    formDataObj.append("email", formData.email);
    formDataObj.append("employeeId", formData.employeeId);
    formDataObj.append("dob", formData.dob);
    formDataObj.append("doj", formData.doj);
    formDataObj.append("gender", formData.gender);
    formDataObj.append("department", formData.department);
    formDataObj.append("phoneNumber", formData.phoneNumber);
    formDataObj.append("salary", formData.salary.toString());
    formDataObj.append("role", formData.role);
    formDataObj.append("bankBranch", formData.bankBranch);
    formDataObj.append("bankIfsc", formData.bankIfsc);
    formDataObj.append("accountNumber", formData.accountNumber);
    
    // Add the file separately if it exists
    if (formData.image) {
      formDataObj.append("image", formData.image);
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/api/employees/${id}`, 
        formDataObj,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Important!
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.data.success) {
        alert("Employee updated successfully!");
        navigate('/admin-dashboard/employees');
      }
    } catch (error) {
      if (axios.isAxiosError(error) &&
          error.response &&
          error.response.data &&
          !error.response.data.success) {
        alert(error.response.data.error);
      } else {
        console.error("Update error:", error);
        alert("An unexpected error occurred");
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading employee data...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  return (
    <div className="px-14 bg-background">
      <div className="max-w-4xl mx-auto mt-10 bg-white px-14 py-16">
        <h3 className="source-sans-3-semibold text-2xl text-center mb-8">
          Edit Employee
        </h3>
        <form className="" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-10 mb-4 overflow-y-scroll max-h-[500px]">
            <div className="flex flex-col">
              <label htmlFor="name" className="source-sans-3-medium">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter Employee Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border-b border-black/30 px-4 py-2 w-full outline-none"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email" className="source-sans-3-medium">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border-b border-black/30 px-4 py-2 w-full outline-none"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="employeeId" className="source-sans-3-medium">
                Employee ID
              </label>
              <input
                type="text"
                placeholder="Enter Employee ID"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                className="border-b border-black/30 px-4 py-2 w-full outline-none"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="source-sans-3-medium">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                placeholder="Date of Birth"
                className="px-4 py-2 border-b border-black/30 w-full outline-none"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="source-sans-3-medium">Date of Joining</label>
              <input
                type="date"
                name="doj"
                value={formData.doj}
                onChange={handleChange}
                placeholder="Date of Birth"
                className="px-4 py-2 border-b border-black/30 w-full outline-none"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="source-sans-3-medium">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="px-4 py-2 border-b border-black/30 w-full outline-none"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="source-sans-3-medium">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="px-4 py-2 border-b border-black/30 w-full outline-none"
                required
              >
                <option value="">Select Department</option>
                {departments.map((dep) => (
                  <option key={dep._id} value={dep._id}>
                    {dep.dep_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="phoneNumber" className="source-sans-3-medium">
                Contact Number
              </label>
              <input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter Phone Number"
                className="px-4 py-2 border-b border-black/30 w-full outline-none"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="source-sans-3-medium">Salary</label>
              <input
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Enter Salary"
                className="px-4 py-2 border-b border-black/30 w-full outline-none"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="source-sans-3-medium">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="px-4 py-2 border-b border-black/30 w-full outline-none"
                required
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="source-sans-3-medium">Upload Image</label>
              <div className="flex items-center gap-4">
                {employee?.userId.image && (
                  <img 
                    src={`http://localhost:8000/${employee.userId.image}`} 
                    alt="Current profile" 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <input
                  name="image"
                  type="file"
                  onChange={handleChange}
                  placeholder="Upload Image"
                  accept="image/*"
                  className="px-4 py-2 border-b border-black/30 w-full outline-none"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Leave empty to keep current image</p>
            </div>
            <div className="flex flex-col">
              <label htmlFor="bankBranch" className="source-sans-3-medium">
                Bank name
              </label>
              <input
                name="bankBranch"
                value={formData.bankBranch}
                onChange={handleChange}
                placeholder="Enter Bank Branch"
                className="px-4 py-2 border-b border-black/30 w-full outline-none"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="bankIfsc" className="source-sans-3-medium">
                Bank IFSC Code
              </label>
              <input
                name="bankIfsc"
                value={formData.bankIfsc}
                onChange={handleChange}
                placeholder="Enter Bank IFSC Code"
                className="px-4 py-2 border-b border-black/30 w-full outline-none"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="accountNumber" className="source-sans-3-medium">
                Account Number
              </label>
              <input
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="Enter Account Number"
                className="px-4 py-2 border-b border-black/30 w-full outline-none"
                required
              />
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate('/admin-dashboard/employees')}
              className="px-4 py-2 border w-full mt-4 bg-gray-300 text-gray-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border w-full mt-4 bg-secondary text-white cursor-pointer"
            >
              Update Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;