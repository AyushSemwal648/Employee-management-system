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
  // Personal Information
  name: string;
  email: string;
  password: string;
  employeeId: string;
  dob: string;
  gender: "Male" | "Female" | "Others" | "";

  // Work Information
  department: string;
  phoneNumber: string;
  salary: number;
  role: "admin" | "employee" | "";

  // File Upload
  image: File | null;

  // Banking Information
  bankBranch: string;
  bankIfsc: string;
  accountNumber: string;
  action: React.ReactNode;
};

const EmployeeList = () => {
  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [empLoading, setEmpLoading] = useState<boolean>(false);

  const fetchEmployees = async () => {
    setEmpLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/employees", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        let sno = 1;
        const data = response.data.employees.map((emp: any) => ({
          _id: emp._id,
          sno: sno++,
          dep_name: emp.department.dep_name,
          name: emp.userId.name,
          email: emp.userId.email,
          account: emp.accountNumber,
          dob: new Date(emp.dob).toDateString(),
          image: (
            <img
              src={`http://localhost:8000/${emp.userId.image}`}
              alt="profile image"
              className="size-16 rounded-full object-cover object-top"
            />
          ),
          action: <EmployeeButtons _id={emp._id} />,
        }));
        setEmployees(data);
      }
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        !error.response.data.success
      ) {
        alert(error.response.data.error);
      }
    } finally {
      setEmpLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <>
      {empLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="px-14 bg-background ">
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
              <DataTable
                columns={columns}
                data={employees}
                key={employees.length}
                customStyles={customStyles}
                pagination
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeList;
