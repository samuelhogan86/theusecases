import '../styles.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import NewAppointmentForm from './NewAppointmentForm';
import AppointmentInformation from './AppointmentInformation';
import RegisterUserForm from './RegisterUserForm';
import UserInformation from './UserInformation';
import ChangePassword from './ChangePassword';
import { handleLogout } from '../utils/logout';

function AdminPortal() {
    const [appointments, setAppointments] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('appointments');
    const [openNewAppointment, setOpenNewAppointment] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [openViewAppointmentInfo, setOpenViewAppointmentInfo] = useState(false);
    const [openViewUserInfo, setopenViewUserInfo] = useState(false);
    const [currentAppointment, setCurrentAppointment] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [openChangePassword, setOpenChangePassword] = useState(false);

    // Search states for appointments
    const [appointmentSearchTerm, setAppointmentSearchTerm] = useState('');
    const [appointmentSearchBy, setAppointmentSearchBy] = useState('patient'); // 'patient' or 'doctor'

    // Search state for users
    const [userSearchTerm, setUserSearchTerm] = useState('');

    // For viewing upcoming appointments
    const [showUpcomingOnly, setShowUpcomingOnly] = useState(false);

    // Retrieve all appointments and users from database
    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch("http://localhost:3000/api/users/dashboard", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (data.payload) {
                    setAppointments(data.payload.appointments || []);
                    setUsers(data.payload.users || []);
                }
            } catch (err) {
                console.log("Error fetching admin data:", err);
            }
        }

        fetchAdminData();
    }, []);

    // Filter appointments based on search
    const filteredAppointments = appointments.filter(appointment => {
        if (!appointmentSearchTerm) return true;

        const searchLower = appointmentSearchTerm.toLowerCase();

        if (appointmentSearchBy === 'patient') {
            const patientName = appointment.patientId
                ? `${appointment.patientId.firstName} ${appointment.patientId.lastName}`.toLowerCase()
                : '';
            return patientName.includes(searchLower);
        } else if (appointmentSearchBy === 'doctor') {
            const doctorName = appointment.doctorId
                ? `${appointment.doctorId.firstName} ${appointment.doctorId.lastName}`.toLowerCase()
                : '';
            return doctorName.includes(searchLower);
        }

        return true;
    });

    const now = new Date();

    // Filter upcoming appointments
    const upcomingAppointments = filteredAppointments.filter(appt => {
        return new Date(appt.endTime) >= now;
    });

    // Filter users based on search (search across all fields)
    const filteredUsers = users.filter(user => {
        if (!userSearchTerm) return true;

        const searchLower = userSearchTerm.toLowerCase();
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const username = user.username.toLowerCase();
        const role = user.role.toLowerCase();
        const status = (user.status || "Active").toLowerCase();

        return fullName.includes(searchLower) ||
            username.includes(searchLower) ||
            role.includes(searchLower) ||
            status.includes(searchLower);
    });

    // Handle opening and closing new appointment popup
    const handleNewAppointment = () => setOpenNewAppointment(true);
    const handleCloseNewAppointment = () => setOpenNewAppointment(false);

    // Handle opening and closing appointment info popup (entrypoint for update/delete appointment)
    const handleViewAppointmentInfo = (appointment) => {
        setCurrentAppointment(appointment);
        setOpenViewAppointmentInfo(true);
    }
    const handleCloseViewAppointmentInfo = () => setOpenViewAppointmentInfo(false);

    // Handle opening and closing add user popup
    const handleAdd = () => setOpenAdd(true);
    const handleCloseAdd = () => setOpenAdd(false);

    // Handle opening and closing user info popup (entrypoint for update/delete user)
    const handleViewUserInfo = (user) => {
        setCurrentUser(user);
        setopenViewUserInfo(true);
    };
    const handleCloseviewUserInfo = () => setopenViewUserInfo(false);

    return (
        <>
            {/* HEADER */}
            <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <h1 className="fw-bold mb-1">Admin Dashboard</h1>
                        <p className="text-muted mb-4">Manage Users and Appointments</p>
                    </div>

                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => setOpenChangePassword(true)}
                        >
                            Change Password
                        </button>

                        <button
                            className="btn btn-outline-danger"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Change Password Modal for logged-in admin */}
            <Modal
                title="Change Password"
                open={openChangePassword}
                onCancel={() => setOpenChangePassword(false)}
                footer={null}
                centered
            >
                {/* Find currently logged in user by id if present */}
                <ChangePassword
                    user={users.find(u => u._id === localStorage.getItem('userId'))}
                    userId={localStorage.getItem('userId')}
                    closeModal={() => setOpenChangePassword(false)}
                />
            </Modal>

            {/* TAB NAVIGATION */}
            <div className="container mt-1 mb-1">
                <ul className="nav nav-tabs" style={{ borderBottom: "none" }}>
                    <li className="nav-item">
                        <button
                            className="nav-link"
                            style={{
                                backgroundColor: activeTab === "appointments" ? "#ffffff" : "#e9ecef",
                                fontWeight: activeTab === "appointments" ? "600" : "400",
                                color: "#000000",
                                border: "1px solid #dee2e6",
                                borderRadius: "0.25rem"
                            }}
                            onClick={() => setActiveTab('appointments')}
                        >
                            Appointments
                        </button>
                    </li>

                    <li className="nav-item">
                        <button
                            className="nav-link"
                            style={{
                                backgroundColor: activeTab === "users" ? "#ffffff" : "#e9ecef",
                                fontWeight: activeTab === "users" ? "600" : "400",
                                color: "#000000",
                                border: "1px solid #dee2e6",
                                borderRadius: "0.25rem"
                            }}
                            onClick={() => setActiveTab('users')}
                        >
                            Users
                        </button>
                    </li>
                </ul>
            </div>

            {/* Appointments Tab */}
            <div className="dashboard-section">
                <div
                    id="appointments"
                    className={`dashboard-content ${activeTab === 'appointments' ? 'active' : ''}`}
                >
                    <div className="dashboard-controls-bar">
                        <input
                            type="text"
                            className="dashboard-search-box"
                            placeholder={`Search by ${appointmentSearchBy} name...`}
                            value={appointmentSearchTerm}
                            onChange={(e) => setAppointmentSearchTerm(e.target.value)}
                        />
                        <div className="dashboard-filter-group">
                            <select
                                className="dashboard-filter-select"
                                value={appointmentSearchBy}
                                onChange={(e) => {
                                    setAppointmentSearchBy(e.target.value);
                                    setAppointmentSearchTerm(''); // Clear search when switching
                                }}
                            >
                                <option value="patient">Search by Patient</option>
                                <option value="doctor">Search by Doctor</option>
                            </select>
                            <button className="dashboard-btn dashboard-btn-primary" onClick={handleNewAppointment}>+ New Appointment</button>
                        </div>
                    </div>

                    <div className="mb-3">
                        <button
                            className={`dashboard-btn ${!showUpcomingOnly ? "dashboard-btn-primary" : ""}`}
                            onClick={() => setShowUpcomingOnly(false)}
                        >
                            All Appointments
                        </button>

                        <button
                            className={`dashboard-btn ${showUpcomingOnly ? "dashboard-btn-primary" : ""} ms-2`}
                            onClick={() => setShowUpcomingOnly(true)}
                        >
                            Upcoming
                        </button>
                    </div>

                    {activeTab === 'appointments' && (
                        <div className="dashboard-table-container">
                            <table className="dashboard-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Start time</th>
                                        <th>End time</th>
                                        <th>Doctor</th>
                                        <th>Patient</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAppointments && filteredAppointments.length > 0 ? (
                                        (showUpcomingOnly ? upcomingAppointments : filteredAppointments).map((appointment) => {
                                            // Extract date and time from DateTime objects
                                            const startDateTime = new Date(appointment.startTime);
                                            const endDateTime = new Date(appointment.endTime);

                                            // Format date (MM/DD/YYYY)
                                            const dateStr = startDateTime.toLocaleDateString();

                                            // Format times (HH:MM AM/PM)
                                            const startTimeStr = startDateTime.toLocaleTimeString('en-US', {
                                                hour: 'numeric',
                                                minute: '2-digit',
                                                hour12: true
                                            });
                                            const endTimeStr = endDateTime.toLocaleTimeString('en-US', {
                                                hour: 'numeric',
                                                minute: '2-digit',
                                                hour12: true
                                            });

                                            return (
                                                <tr key={appointment._id}>
                                                    <td>{dateStr}</td>
                                                    <td>{startTimeStr}</td>
                                                    <td>{endTimeStr}</td>
                                                    <td>
                                                        {appointment.doctorId
                                                            ? `${appointment.doctorId.firstName} ${appointment.doctorId.lastName}`
                                                            : "Unknown"}
                                                    </td>
                                                    <td>
                                                        {appointment.patientId
                                                            ? `${appointment.patientId.firstName} ${appointment.patientId.lastName}`
                                                            : "Unknown"}
                                                    </td>
                                                    <td>
                                                        <Button
                                                            type="primary"
                                                            onClick={() => handleViewAppointmentInfo(appointment)}
                                                        >
                                                            View Information
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: "center" }}>
                                                {appointmentSearchTerm
                                                    ? `No appointments found matching "${appointmentSearchTerm}"`
                                                    : "No appointments found."}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Users Tab */}
                <div
                    id="users"
                    className={`dashboard-content ${activeTab === 'users' ? 'active' : ''}`}
                >
                    {activeTab === 'users' && (
                        <>
                            <div className="dashboard-controls-bar">
                                <input
                                    type="text"
                                    className="dashboard-search-box"
                                    placeholder="Search by name, username, role, or status..."
                                    value={userSearchTerm}
                                    onChange={(e) => setUserSearchTerm(e.target.value)}
                                />
                                <button className="dashboard-btn dashboard-btn-primary" onClick={handleAdd}>+ Add User</button>
                            </div>

                            <div className="dashboard-table-container">
                                <table className="dashboard-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Username</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers && filteredUsers.length > 0 ? (
                                            filteredUsers.map((user) => (
                                                <tr key={user._id || user.username}>
                                                    <td>{user.firstName} {user.lastName}</td>
                                                    <td>{user.username}</td>
                                                    <td>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
                                                    <td>{user.status || "Active"}</td>
                                                    <td>
                                                        <Button
                                                            type="primary"
                                                            onClick={() => handleViewUserInfo(user)}
                                                        >
                                                            View Information
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" style={{ textAlign: "center" }}>
                                                    {userSearchTerm
                                                        ? `No users found matching "${userSearchTerm}"`
                                                        : "No users found."}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Popup for viewing appointment info */}
            <Modal
                title="Appointment Information"
                open={openViewAppointmentInfo}
                onCancel={handleCloseViewAppointmentInfo}
                footer={null}
                centered
            >
                {currentAppointment &&
                    <AppointmentInformation appointment={currentAppointment} users={users} />
                }
            </Modal>

            {/* Popup form for adding new appointment */}
            <Modal
                title="Schedule New Appointment"
                open={openNewAppointment}
                onCancel={handleCloseNewAppointment}
                footer={null}
                centered
            >
                <NewAppointmentForm closeModal={handleCloseNewAppointment} users={users} />
            </Modal>

            {/* Popup form for registering new user */}
            <Modal
                title="Register New User"
                open={openAdd}
                onCancel={handleCloseAdd}
                footer={null}
                centered
            >
                <RegisterUserForm closeModal={handleCloseAdd} />
            </Modal>

            {/* Popup for viewing user info */}
            <Modal
                title="User Information"
                open={openViewUserInfo}
                onCancel={handleCloseviewUserInfo}
                footer={null}
                centered
            >
                {currentUser &&
                    <UserInformation user={currentUser} />
                }
            </Modal>
        </>
    );
}

export default AdminPortal;