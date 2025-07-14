import { Outlet } from "react-router-dom"
import Sidebar from "../components/employeeDashboard/Sidebar"
import Navbar from "../components/dashboard/Navbar"

const EmployeeDashboard = () => {
  console.log
  return (
    <div className="flex bg-background">
      <Sidebar />
      <div className="flex-1/2">
        <Navbar />
        <Outlet />
      </div>
    </div>
  )
}

export default EmployeeDashboard