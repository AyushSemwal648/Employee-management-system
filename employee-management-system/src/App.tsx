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
import EmployeeList from "./components/employee/EmployeeList";
import AddEmployee from "./components/employee/AddEmployee";
import ViewEmployee from "./components/employee/ViewEmployee";
import EditEmployee from "./components/employee/EditEmployee";
import AddSalary from "./components/salary/AddSalary";
import EmployeeDashboardOverview from "./components/employeeDashboard/EmployeeDashboardOverview";
import Profile from "./components/employeeDashboard/Profile";
import ViewLeavies from "./components/employeeDashboard/leaves/ViewLeavies";
import AddLeaves from "./components/employeeDashboard/leaves/AddLeaves";
import Setting from "./components/employeeDashboard/setting/Setting";
import EmployeeLeaves from "./components/leaves/EmployeeLeaves";

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
          <Route index element={<DashboardOverview />}></Route>
          <Route
            path="/admin-dashboard/employees"
            element={<EmployeeList />}
          ></Route>
          <Route
            path="/admin-dashboard/add-employee"
            element={<AddEmployee />}
          ></Route>
          <Route
            path="/admin-dashboard/employees/:id"
            element={<ViewEmployee />}
          ></Route>
          <Route
            path="/admin-dashboard/employees/edit/:id"
            element={<EditEmployee />}
          ></Route>
          <Route
            path="/admin-dashboard/salary/add"
            element={<AddSalary />}
          ></Route>
          <Route
            path="/admin-dashboard/departments"
            element={<DepartmentList />}
          ></Route>
          <Route
            path="/admin-dashboard/add-department"
            element={<AddDepartment />}
          ></Route>
          <Route
            path="/admin-dashboard/department/:id"
            element={<EditDepartment />}
          ></Route>
          <Route
            path="/admin-dashboard/leaves"
            element={<EmployeeLeaves/>}
          ></Route>
          <Route
            path="/admin-dashboard/salary"
            element={<DashboardOverview />}
          ></Route>
          <Route
            path="/admin-dashboard/settings"
            element={<DashboardOverview />}
          ></Route>
        </Route>
        <Route
          path="/employee-dashboard"
          element={
            <PrivateRoutes>
              <RoleBasedRoutes requiredRole={["employee"]}>
                <EmployeeDashboard />
              </RoleBasedRoutes>
            </PrivateRoutes>
          }
        >
          <Route index element={<EmployeeDashboardOverview />} />
          <Route
            path="/employee-dashboard/profile/:id"
            element={<ViewEmployee />}
          />
          <Route path="/employee-dashboard/leaves" element={<ViewLeavies />} />
          <Route path="/employee-dashboard/add-leave" element={<AddLeaves />} />
          <Route path="/employee-dashboard/settings" element={<Setting />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
