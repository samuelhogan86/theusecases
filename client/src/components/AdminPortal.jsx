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
        <div className="container mt-4" style={{ maxWidth: "100%", "--bs-gutter-x": "0" }}>
            <div className="d-flex justify-content-between align-items-start">
            <div>
                <h1 className="fw-bold mb-1">Admin Dashboard</h1>
                <p className="text-muted mb-4">Manage Users and Appointments</p>
            </div>

            <div className="d-flex gap-2">
                <button
                className="btn btn-outline-dark"
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
            <div className="container mt-1 mb-1" style={{ paddingLeft: "0", marginLeft: "0"}}>
                <ul className="nav nav-tabs" style={{ borderBottom: "none" }}>
                    <li className="nav-item">
                        <button
                            className="nav-link"
                            style={{
                                backgroundColor: activeTab === "appointments" ? "#ffffff" : "#e9ecef",
                                fontWeight: activeTab === "appointments" ? "600" : "400",
                                color: "#000000",
                                border: "1px solid #dee2e6",
                                borderRadius: "0.25rem",
                                marginRight: "0.4vw"
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
                {activeTab === 'appointments' && (
                <> 
            <div className="d-flex justify-content-between align-items-center mb-3">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search by name..." 
                style={{ maxWidth: '300px', fontSize: '14px' }}
              />
              <div className="d-flex gap-2">
                <select className="form-select" style={{ width: 'auto' }}>
                  <option>Search by Patient</option>
                  <option>Search by Doctor</option>
                </select>
                <button className="btn btn-dark px-3">
                  + New Appointment
                </button>
              </div>
            </div>
                    <div className="bg-white border rounded-3 p-4" style={{ minWidth: '90vw' }}>
                        <div className="table-responsive bg-white rounded">
                            <table className="table table-hover mb-0">
                                <thead style={{ backgroundColor: '#f9f9f9' }}>
                                    <tr>
                                        <th className="fw-semibold">Date</th>
                                        <th className="fw-semibold">Start time</th>
                                        <th className="fw-semibold">End time</th>
                                        <th className="fw-semibold">Doctor</th>
                                        <th className="fw-semibold">Patient</th>
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

                            <div className="d-flex justify-content-between align-items-center p-3 border-top">
                                <button className="btn btn-outline-secondary">Prev</button>
                                <div>
                                    Page <input type="number" className="form-control d-inline-block mx-2" value="1" style={{ width: '60px', textAlign: 'center' }} /> of 3
                                </div>
                                <button className="btn btn-outline-secondary">Next</button>
                            </div>
                        </div>
                    </div>
                    </>
                    )}
                {/* Users Tab */}
                    {activeTab === 'users' && (
                        <>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Search users..." 
                                style={{ maxWidth: '300px', fontSize: '14px' }}
                            />
                            <div className="d-flex gap-2">
                                <button className="btn btn-dark px-3" onClick={handleAdd}>+ Add User</button>
                            </div>
                        </div>
                <div className="bg-white border rounded-3 p-4" style={{ minWidth: '90vw' }}>
                            <div className="table-responsive bg-white rounded">
                                <table className="table table-hover mb-0">
                                    <thead style={{ backgroundColor: '#f9f9f9' }}>
                                        <tr>
                                            <th className="fw-semibold">Name</th>
                                            <th className="fw-semibold">Username</th>
                                            <th className="fw-semibold">Role</th>
                                            <th className="fw-semibold">Status</th>
                                            <th className="fw-semibold"></th>
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
                                                <td colSpan="5" style={{ textAlign: "center" }}>
                                                    No users found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                <div className="d-flex justify-content-between align-items-center p-3 border-top">
                                <button className="btn btn-outline-secondary">Prev</button>
                                <div>
                                    Page <input type="number" className="form-control d-inline-block mx-2" value="1" style={{ width: '60px', textAlign: 'center' }} /> of 1
                                </div>
                                <button className="btn btn-outline-secondary">Next</button>
                                </div>
                            </div>
                        </div>
                        </>
                    )}
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