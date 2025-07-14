import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { columns, DepartmentButtons } from "../../utils/DepartmentHelpers";
import { useEffect, useState } from "react";
import axios from "axios";

type DepartmentType = {
  _id: string;
  sno: string;
  dep_name: string;
  description: string;
  action?: React.ReactNode;
};

const DepartmentList = () => {
  const [departments, setDepartments] = useState<DepartmentType[]>([]);
  const [depLoading, setDepLoading] = useState<boolean>(false);
  const [filteredDepartments, setFilteredDepartments] = useState<
    DepartmentType[]
  >([]);

  const fetchDepartments = async () => {
    setDepLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/department", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        let sno = 1;
        const data = response.data.departments.map((dep: any) => ({
          _id: dep._id,
          sno: sno++,
          dep_name: dep.dep_name,
          description: dep.description,
          action: (
            <DepartmentButtons
              _id={dep._id}
              onDepartmentDelete={onDepartmentDelete}
            />
          ),
        }));
        setDepartments(data);
        setFilteredDepartments(data)
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
      setDepLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const onDepartmentDelete = (id: string) => {
    const updatedDepartments = departments.filter((dep) => dep._id !== id);
    setDepartments(updatedDepartments);
    fetchDepartments();
    alert("Department deleted successfully");
  };

  const filterDepartments = (e: any) => {
    const records = departments.filter((dep) =>
      dep.dep_name.toLowerCase().includes(e.target.value.toLowerCase())
    );

    setFilteredDepartments(records);
  };

  return (
    <>
      {depLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="px-14 bg-background">
          <div className="mt-10">
            <div className="mb-8">
              <h2 className="source-sans-3-bold text-3xl">Manage Department</h2>
            </div>
            <div className="flex justify-between items-center">
              <input
                type="text"
                placeholder="Search Department Name"
                className="px-4 py-2 border border-black/30 source-sans-3-regular outline-none"
                onChange={filterDepartments}
              />
              <Link
                to="/admin-dashboard/add-department"
                className="px-6 py-2 bg-secondary text-white source-sans-3-semibold cursor-pointer"
              >
                Add New Department
              </Link>
            </div>
            <div className="mt-5">
              <DataTable
                columns={columns}
                data={filteredDepartments}
                key={departments.length}
                pagination
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DepartmentList;
