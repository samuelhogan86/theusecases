import '../styles.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import RegisterUserForm from './RegisterUserForm';
import UserInformation from './UserInformation';
import ChangePassword from './ChangePassword';
import { handleLogout } from '../utils/logout';

function AdminPortal() {
    const [appointments, setAppointments] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('appointments');
    const [openAdd, setOpenAdd] = useState(false);
    const [openviewUserInfo, setOpenviewUserInfo] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [openChangePassword, setOpenChangePassword] = useState(false);

    // Retrieve all appointments and users from database
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch("http://localhost:3000/admin/dashboard", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setAppointments(data.appointments);
            } catch (err) {
                console.log("Error fetching appointments");
            }
        }

        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');    
                const response = await fetch("http://localhost:3000/admin/dashboard",  {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setUsers(data.users);
            } catch (err) {
                console.log("Error fetching users");
            }
        }

        fetchAppointments();
        fetchUsers();
    }, []);

    // Handle opening and closing add popup
    const handleAdd = () => setOpenAdd(true);
    const handleCloseAdd = () => setOpenAdd(false);

    // Handle opening and closing user info popup (entrypoint for update/delete user)
    const handleviewUserInfo = (user) => {
        setCurrentUser(user);
        setOpenviewUserInfo(true);
    };
    const handleCloseviewUserInfo = () => setOpenviewUserInfo(false);

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
                        <input type="text" className="dashboard-search-box" placeholder="Search by name..." />
                        <div className="dashboard-filter-group">
                            <select className="dashboard-filter-select">
                                <option>Search by Patient</option>
                                <option>Search by Doctor</option>
                            </select>
                            <button className="dashboard-btn dashboard-btn-primary">+ New Appointment</button>
                        </div>
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments && appointments.length > 0 ? (
                                        appointments.map((appointment) => (
                                            <tr key={appointment._id}>
                                                <td>{new Date(appointment.date).toLocaleDateString()}</td>
                                                <td>{appointment.startTime}</td>
                                                <td>{appointment.endTime}</td>
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
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: "center" }}>
                                                No appointments found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            <div className="dashboard-pagination">
                                <button className="dashboard-btn">Prev</button>
                                <div className="dashboard-page-info">
                                    Page <input type="number" className="dashboard-page-input" value="1" readOnly min="1" max="3" /> of 3
                                </div>
                                <button className="dashboard-btn">Next</button>
                            </div>
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
                                <input type="text" className="dashboard-search-box" placeholder="Search users..." />
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
                                        {users && users.length > 0 ? (
                                            users.map((user) => (
                                                <tr key={user._id || user.username}>
                                                    <td>{user.firstName} {user.lastName}</td>
                                                    <td>{user.username}</td>
                                                    <td>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
                                                    <td>{user.status || "Active"}</td>
                                                    <td><Button type="primary" onClick={() => handleviewUserInfo(user)}>View Information</Button></td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" style={{ textAlign: "center" }}>
                                                    No users found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                <div className="dashboard-pagination">
                                    <button className="dashboard-btn">Prev</button>
                                    <div className="dashboard-page-info">
                                        Page <input type="number" className="dashboard-page-input" value="1" readOnly min="1" max="1" /> of 1
                                    </div>
                                    <button className="dashboard-btn">Next</button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

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
                open={openviewUserInfo}
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