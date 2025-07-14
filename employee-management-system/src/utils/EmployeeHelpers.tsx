import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaRegCalendarAlt } from "react-icons/fa";

export const columns = [
  {
    name: "S No.",
    selector: (row: any) => row.sno,
    width: "70px",
  },
  {
    name: "Image",
    selector: (row: any) => row.image,
    width: "150px",
  },
  {
    name: "name",
    selector: (row: any) => row.name,
    sortable: true,
  },
  {
    name: "Department Name",
    selector: (row: any) => row.dep_name,
  },
  {
    name: "email",
    selector: (row: any) => row.email,
  },
  {
    name: "Account",
    selector: (row: any) => row.account,
  },
  {
    name: "Action",
    selector: (row: any) => row.action,
  },
];

export const customStyles = {
  headCells: {
    style: {
      width: "100%",
    },
  },
  row: {
    style: {
      display: "flex",
      justifyContent: "",
    },
  },
  cells: {
    style: {
      paddingLeft: "16px",
      paddingRight: "0px",
      paddingTop: "16px",
      paddingBottom: "16px",
    },
  },
  columnheader: {
    style: {
      paddingLeft: "16px",
      paddingRight: "0px",
    },
  },
};

export const fetchDepartments = async () => {
  let departments;
  try {
    const response = await axios.get("http://localhost:8000/api/department", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.data.success) {
      departments = response.data.departments;
    }
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response &&
      !error.response.data.success
    ) {
      alert(error.response.data.error);
    }
  }

  return departments;
};

// employess for salary forum

export const getEmployees = async (id: string) => {
  let employees;
  try {
    const response = await axios.get(`http://localhost:8000/api/employees/department/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.data.success) {
      employees = response.data.employees;
    }
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response &&
      !error.response.data.success
    ) {
      alert(error.response.data.error);
    }
  }

  return employees;
};

type EmployeeButtonProps = {
  _id: string;
  onEmployeeDelete: (id: string) => void;
};

export const EmployeeButtons = ({
  _id,
  onEmployeeDelete,
}: // onEmployeeDelete,
EmployeeButtonProps) => {
  const navigate = useNavigate();

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("do you want to delete?");
    if (confirm) {
      try {
        const response = await axios.delete(
          `http://localhost:8000/api/employees/department/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          onEmployeeDelete(id);
        }
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response &&
          !error.response.data.success
        ) {
          alert(error.response.data.error);
        }
      }
    }
  };
  return (
    <div className="flex items-center gap-4">
      <FaEye
        className="text-[#05AC72] cursor-pointer"
        onClick={() => navigate(`/admin-dashboard/employees/${_id}`)}
      ></FaEye>
      <MdEdit
        className="text-[#05AC72] cursor-pointer"
        onClick={() => navigate(`/admin-dashboard/employees/edit/${_id}`)}
      ></MdEdit>
      <MdDelete className="text-[#05AC72] cursor-pointer" onClick={() =>  handleDelete(_id)}></MdDelete>
      <FaRegCalendarAlt className="text-[#05AC72] cursor-pointer"></FaRegCalendarAlt>
      {/* <button
        className="px-4 py-2 bg-red-600 text-white source-sans-3-medium cursor-pointer"
        onClick={() => handleDelete(_id)}
      >
        Delete
      </button> */}
    </div>
  );
};
