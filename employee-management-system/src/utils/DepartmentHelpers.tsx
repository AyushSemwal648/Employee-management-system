import axios from "axios";
import { useNavigate } from "react-router-dom";

export const columns = [
  {
    name: "S No.",
    selector: (row: any) => row.sno,
  },
  {
    name: "Department Name",
    selector: (row: any) => row.dep_name,
    sortable: true
  },
  {
    name: "Action",
    selector: (row: any) => row.action,
  },
];

type DepartmentButtonProps = {
  _id: string;
  onDepartmentDelete: (id: string) => void;
};

export const DepartmentButtons = ({
  _id,
  onDepartmentDelete,
}: DepartmentButtonProps) => {
  const navigate = useNavigate();

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("do you want to delete?");
    if (confirm) {
      try {
        const response = await axios.delete(
          `http://localhost:8000/api/department/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          onDepartmentDelete(id);
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
    <div className="flex gap-2">
      <button
        className="px-4 py-2 bg-green-600 text-white source-sans-3-medium cursor-pointer"
        onClick={() => navigate(`/admin-dashboard/department/${_id}`)}
      >
        Edit
      </button>
      <button
        className="px-4 py-2 bg-red-600 text-white source-sans-3-medium cursor-pointer"
        onClick={() => handleDelete(_id)}
      >
        Delete
      </button>
    </div>
  );
};
