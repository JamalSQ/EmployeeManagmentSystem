import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./layout/navbar";
import Home from "./pages/Home";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AddUser from "./modules/users/AddUser";
import EditUser from "./modules/users/EditUser";
import ViewUser from "./modules/users/ViewUser";
import ViewAllUser from "./modules/users/ViewAllUser";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import PrivateRoute from "./auth/PrivateRoute";
import AdministracineInformacija from "./pages/AdministracineInformacija";
import Paslaugos from "./pages/Paslaugos";
import Kontaktai from "./pages/Kontaktai";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./context/AuthContext";
// Import the CustomerDashboard component
import CustomerDashboard from "./modules/customers/CustomerDashboard";

import AppointmentBooking from "./modules/customers/AppointmentBooking";
import AppointmentHistory from "./modules/customers/AppointmentHistory";
import CustomerCalendar from "./modules/customers/CustomerCalendar";
import SubmitFeedback from "./modules/customers/SubmitFeedback";
import SendMessage from "./modules/customers/SendMessage";
import CustomerMessages from "./modules/customers/CustomerMessages";
import CreateTask from "./modules/employees/CreateTask";
import TaskList from "./modules/employees/TaskList";
import EmployeeCalendar from "./modules/employees/EmployeeCalendar";
import DocumentManagement from "./modules/employees/DocumentManagement";
import EmployeeAppointments from "./modules/employees/EmployeeAppointments";

function App() {
  const { auth } = useAuth();
  const isAuthenticated = !!auth.token;

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          {/* Make the homepage accessible for everyone */}
          <Route path="/" element={<Home />} />

          {/* Route for Administracine Informacija */}
          <Route
            path="/administracine-informacija"
            element={<AdministracineInformacija />}
          />

          {/* Route for Paslaugos */}
          <Route path="/paslaugos" element={<Paslaugos />} />

          {/* Route for Kontaktai */}
          <Route path="/kontaktai" element={<Kontaktai />} />

          {/* Protected routes requiring authentication */}
          {isAuthenticated && (
            <>
              <Route
                path="/adduser"
                element={
                  <PrivateRoute>
                    <AddUser />
                  </PrivateRoute>
                }
              />
              <Route
                path="/edituser/:id"
                element={
                  <PrivateRoute>
                    <EditUser />
                  </PrivateRoute>
                }
              />
              <Route
                path="/viewuser/:id"
                element={
                  <PrivateRoute>
                    <ViewUser />
                  </PrivateRoute>
                }
              />
              <Route
                path="/ViewAllUsers"
                element={
                  <PrivateRoute>
                    <ViewAllUser />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              {/* Route for Customer Dashboard */}
              <Route
                path="/customer-dashboard/:customerId"
                element={
                  <PrivateRoute>
                    <CustomerDashboard />
                  </PrivateRoute>
                }
              />
              {/* Route for Appointment Booking */}
              <Route
                path="/appointments/book/:customerId"
                element={
                  <PrivateRoute>
                    <AppointmentBooking />
                  </PrivateRoute>
                }
              />
              {/* Route for Appointment History */}
              <Route
                path="/appointments/history/:customerId"
                element={
                  <PrivateRoute>
                    <AppointmentHistory />
                  </PrivateRoute>
                }
              />
              {/* Route for Customer Calendar */}
              <Route
                path="/appointments/calendar/:customerId"
                element={
                  <PrivateRoute>
                    <CustomerCalendar />
                  </PrivateRoute>
                }
              />
              {/* Route for Submit Feedback */}
              <Route
                path="/feedback/submit/:customerId"
                element={
                  <PrivateRoute>
                    <SubmitFeedback />
                  </PrivateRoute>
                }
              />
              {/* Route for Send Message */}
              <Route
                path="/messages/send/:customerId"
                element={
                  <PrivateRoute>
                    <SendMessage />
                  </PrivateRoute>
                }
              />
              {/* Route for Customer Messages */}
              <Route
                path="/messages/view/:customerId"
                element={
                  <PrivateRoute>
                    <CustomerMessages />
                  </PrivateRoute>
                }
              />
              <Route
                path="/employee/tasks"
                element={
                  <PrivateRoute allowedRoles={["EMPLOYEE", "ADMIN"]}>
                    <CreateTask />
                  </PrivateRoute>
                }
              />
              <Route
                path="/employee/task-list"
                element={
                  <PrivateRoute allowedRoles={["EMPLOYEE", "ADMIN"]}>
                    <TaskList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/employee/calendar"
                element={
                  <PrivateRoute allowedRoles={["EMPLOYEE", "ADMIN"]}>
                    <EmployeeCalendar />
                  </PrivateRoute>
                }
              />
              <Route
                path="/employee/documents"
                element={
                  <PrivateRoute allowedRoles={["EMPLOYEE", "ADMIN"]}>
                    <DocumentManagement />
                  </PrivateRoute>
                }
              />
              <Route
                path="/employee/appointments"
                element={
                  <PrivateRoute allowedRoles={["EMPLOYEE", "ADMIN"]}>
                    <EmployeeAppointments />
                  </PrivateRoute>
                }
              />
            </>
          )}

          {/* Login and signup routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Redirect unknown routes to the homepage */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
