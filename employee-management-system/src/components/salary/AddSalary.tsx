import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { fetchDepartments, getEmployees } from "../../utils/EmployeeHelpers";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

type FormDataType = {
  employeeId: string;
  payDate: string;
  department: string;
  basicSalary: number;
};

const AddSalary = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<EmployeeDataType[] | null>(null);
  const [loading, setLoading] = useState(false); // Changed to false initially
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<DepartmentType[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormDataType>({
    employeeId: "",
    payDate: "",
    department: "",
    basicSalary: 0,
  });

  // Fetch departments on component mount
  useEffect(() => {
    const getDepartments = async () => {
      try {
        setLoading(true);
        const depsData = await fetchDepartments();
        if (depsData) {
          setDepartments(depsData);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
        setError("Failed to fetch departments");
      } finally {
        setLoading(false);
      }
    };

    getDepartments();
  }, []);

  // Fixed department handler
  const handleDepartment = async (e: ChangeEvent<HTMLSelectElement>) => {
    const departmentId = e.target.value;
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      department: departmentId,
      employeeId: "" // Reset employee selection when department changes
    }));

    if (departmentId) {
      try {
        setLoading(true);
        const emps = await getEmployees(departmentId);
        setEmployees(emps);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setError("Failed to fetch employees");
      } finally {
        setLoading(false);
      }
    } else {
      setEmployees(null);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!formData.employeeId || !formData.payDate || !formData.department || !formData.basicSalary) {
      alert("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    try {
      const response = await axios.post(
        `http://localhost:8000/api/salary/add`,
        {
          employeeId: formData.employeeId,
          payDate: formData.payDate,
          department: formData.department,
          basicSalary: formData.basicSalary,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        alert("Salary added successfully!");
        navigate("/admin-dashboard/salary"); // Navigate to salary page instead
      }
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.data &&
        !error.response.data.success
      ) {
        alert(error.response.data.error);
      } else {
        console.error("Submit error:", error);
        alert("An unexpected error occurred");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && departments.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading departments...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  return (
    <div className="px-14 bg-background">
      <div className="max-w-4xl mx-auto mt-10 bg-white px-14 py-16">
        <h3 className="source-sans-3-semibold text-2xl text-center mb-8">
          Add Salary
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-10 mb-4">
            <div className="flex flex-col">
              <label className="source-sans-3-medium">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleDepartment}
                className="px-4 py-2 border-b border-black/30 w-full outline-none"
                required
                disabled={loading}
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
              <label className="source-sans-3-medium">Employee</label>
              <select
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                className="px-4 py-2 border-b border-black/30 w-full outline-none"
                required
                disabled={!formData.department || loading}
              >
                <option value="">
                  {!formData.department 
                    ? "Select Department First" 
                    : loading 
                    ? "Loading employees..." 
                    : "Select Employee"
                  }
                </option>
                {employees?.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.employeeId} - {emp.userId.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="source-sans-3-medium">Pay Date</label>
              <input
                type="date"
                name="payDate"
                value={formData.payDate}
                onChange={handleChange}
                className="px-4 py-2 border-b border-black/30 w-full outline-none"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="source-sans-3-medium">Basic Salary</label>
              <input
                name="basicSalary"
                type="number"
                value={formData.basicSalary}
                onChange={handleChange}
                placeholder="Basic Salary"
                className="px-4 py-2 border-b border-black/30 w-full outline-none"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate("/admin-dashboard/salary")}
              className="px-4 py-2 border w-full mt-4 bg-gray-300 text-gray-800 cursor-pointer hover:bg-gray-400 transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border w-full mt-4 bg-secondary text-white cursor-pointer hover:bg-secondary/90 transition-colors disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? "Adding Salary..." : "Add Salary"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSalary;