import { NavLink } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { IoSettings } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();
  return (
    <div className="w-[350px] bg-secondary h-screen py-5 pl-[18px]">
      <h2 className="source-sans-3-bold text-white text-2xl pb-4 border-b mr-[18px] text-center ">
        {" "}
        Employee Dashboard
      </h2>
      <div className="">
        <NavLink
          to="/employee-dashboard"
          className={({ isActive }) =>
            `${
              isActive ? "bg-white !text-black" : "!text-white"
            } flex pl-10 py-4 rounded-l-full mt-5 hover:bg-white hover:!text-black`
          }
          end
        >
          <div className="flex gap-5 items-center">
            <MdDashboard className="" />{" "}
            <span className="source-sans-3-semibold ">Dashboard</span>
          </div>
        </NavLink>
        <NavLink
          to={`/employee-dashboard/profile/${user?._id}`}
          className={({ isActive }) =>
            `${
              isActive ? "bg-white !text-black" : "!text-white"
            } flex pl-10 py-4 rounded-l-full mt-5 hover:bg-white hover:!text-black`
          }
        >
          <div className="flex gap-5 items-center">
            <FaUsers className="" />{" "}
            <span className="source-sans-3-semibold ">My Profile</span>
          </div>
        </NavLink>
        <NavLink
          to="/employee-dashboard/leaves"
          className={({ isActive }) =>
            `${
              isActive ? "bg-white !text-black" : "!text-white"
            } flex pl-10 py-4 rounded-l-full mt-5 hover:bg-white hover:!text-black`
          }
        >
          <div className="flex gap-5 items-center">
            <IoCalendarNumberOutline className="" />{" "}
            <span className="source-sans-3-semibold ">Leaves</span>
          </div>
        </NavLink>
        <NavLink
          to="/employee-dashboard/attendence"
          className={({ isActive }) =>
            `${
              isActive ? "bg-white !text-black" : "!text-white"
            } flex pl-10 py-4 rounded-l-full mt-5 hover:bg-white hover:!text-black`
          }
        >
          <div className="flex gap-5 items-center">
            <SlCalender className="" />{" "}
            <span className="source-sans-3-semibold ">Attendence</span>
          </div>
        </NavLink>
        <NavLink
          to="/employee-dashboard/settings"
          className={({ isActive }) =>
            `${
              isActive ? "bg-white !text-black" : "!text-white"
            } flex pl-10 py-4 rounded-l-full mt-5 hover:bg-white hover:!text-black`
          }
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

export default Sidebar;
