import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import PrivateRoutes from "./utils/PrivateRoutes";
import RoleBasedRoutes from "./utils/RoleBasedRoutes";
import DashboardOverview from "./components/dashboard/DashboardOverview";
import DepartmentList from "./components/departments/DepartmentList";
import AddDepartment from "./components/departments/AddDepartment";
import EditDepartment from "./components/departments/EditDepartment";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/admin-dashboard" />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoutes>
              <RoleBasedRoutes requiredRole={["admin"]}>
                <AdminDashboard />
              </RoleBasedRoutes>
            </PrivateRoutes>
          }
        >
          <Route index element={<DashboardOverview/>}></Route>
          <Route path="/admin-dashboard/employees" element={<DashboardOverview/>}></Route>
          <Route path="/admin-dashboard/departments" element={<DepartmentList/>}></Route>
          <Route path="/admin-dashboard/add-department" element={<AddDepartment/>}></Route>
          <Route path="/admin-dashboard/department/:id" element={<EditDepartment/>}></Route>
          <Route path="/admin-dashboard/leaves" element={<DashboardOverview/>}></Route>
          <Route path="/admin-dashboard/salary" element={<DashboardOverview/>}></Route>
          <Route path="/admin-dashboard/settings" element={<DashboardOverview/>}></Route>
        </Route>
        <Route
          path="/employee-dashboard"
          element={<EmployeeDashboard />}
        ></Route>
      </Routes>
    </>
  );
}

export default App;
