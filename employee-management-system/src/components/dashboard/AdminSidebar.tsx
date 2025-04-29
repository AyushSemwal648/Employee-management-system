import { NavLink } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { FaMoneyBillWave } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";

const AdminSidebar = () => {
  return (
    <div className="w-[350px] bg-secondary h-screen py-5 pl-[18px]">
      <h2 className="source-sans-3-bold text-white text-2xl pb-4 border-b mr-[18px] text-center ">
        {" "}
        Admin Dashboard
      </h2>
      <div className="">
        <NavLink
          to="/admin-dashboard"
          className={({ isActive }) => `${isActive ? "bg-white !text-black" : "!text-white"} flex pl-10 py-4 rounded-l-full mt-5 hover:bg-white hover:!text-black`}
          end
        >
          <div className="flex gap-5 items-center">
            <MdDashboard className="" />{" "}
            <span className="source-sans-3-semibold ">Dashboard</span>
          </div>
        </NavLink>
        <NavLink
          to="/admin-dashboard/employees"
          className={({ isActive }) => `${isActive ? "bg-white !text-black" : "!text-white"} flex pl-10 py-4 rounded-l-full mt-5 hover:bg-white hover:!text-black` }
        >
          <div className="flex gap-5 items-center">
            <FaUsers className="" />{" "}
            <span className="source-sans-3-semibold ">Employees</span>
          </div>
        </NavLink>
        <NavLink
          to="/admin-dashboard/departments"
          className={({ isActive }) => `${isActive ? "bg-white !text-black" : "!text-white"} flex pl-10 py-4 rounded-l-full mt-5 hover:bg-white hover:!text-black` }
        >
          <div className="flex gap-5 items-center">
            <FaUsers className="" />{" "}
            <span className="source-sans-3-semibold ">Departments</span>
          </div>
        </NavLink>
        <NavLink
          to="/admin-dashboard/leaves"
          className={({ isActive }) => `${isActive ? "bg-white !text-black" : "!text-white"} flex pl-10 py-4 rounded-l-full mt-5 hover:bg-white hover:!text-black` }
        >
          <div className="flex gap-5 items-center">
            <SlCalender className="" />{" "}
            <span className="source-sans-3-semibold ">Leaves</span>
          </div>
        </NavLink>
        <NavLink
          to="/admin-dashboard/salary"
          className={({ isActive }) => `${isActive ? "bg-white !text-black" : "!text-white"} flex pl-10 py-4 rounded-l-full mt-5 hover:bg-white hover:!text-black` }
        >
          <div className="flex gap-5 items-center">
            <FaMoneyBillWave className="" />{" "}
            <span className="source-sans-3-semibold ">Salary</span>
          </div>
        </NavLink>
        <NavLink
          to="/admin-dashboard/settings"
          className={({ isActive }) => `${isActive ? "bg-white !text-black" : "!text-white"} flex pl-10 py-4 rounded-l-full mt-5 hover:bg-white hover:!text-black` }
        >
          <div className="flex gap-5 items-center">
            <IoSettings className="" />{" "}
            <span className="source-sans-3-semibold ">Settings</span>
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSidebar;
