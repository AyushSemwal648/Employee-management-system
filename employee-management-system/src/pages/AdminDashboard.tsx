import { Outlet } from "react-router-dom"
import AdminSidebar from "../components/dashboard/AdminSidebar"
import Navbar from "../components/dashboard/Navbar"
import { useAuth } from "../context/AuthContext"


const AdminDashboard = () => {
  const { user } = useAuth()

  return (
    <div className="flex bg-background">
      <AdminSidebar />
      <div className="flex-1/2">
        <Navbar />
        <Outlet/>
      </div>
    </div>
  )
}

export default AdminDashboard