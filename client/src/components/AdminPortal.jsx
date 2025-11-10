import '../styles.css';
import { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import RegisterUserForm from './RegisterUserForm';
import UserInformation from './UserInformation';
import ChangePassword from './ChangePassword';

function AdminPortal() {
    const [appointments, setAppointments] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('appointments');
    const [openAdd, setOpenAdd] = useState(false);
    const [openviewUserInfo, setOpenviewUserInfo] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [openChangePassword, setOpenChangePassword] = useState(false);
    // const [currentUserName, setCurrentUserName] = useState("Unknown");

    // Retrieve all appointments and users from database
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await fetch("http://localhost:3000/appointments");
                const data = await response.json();
                setAppointments(data);
            } catch (err) {
                console.log("Error fetching appointments");
            }
        }

        const fetchUsers = async () => {
            try {
                const response = await fetch("http://localhost:3000/users");
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                console.log("Error fetching users");
            }
        }

        fetchAppointments();
        fetchUsers();
    }, []);

    // Set current username when users are retrieved from database
    // useEffect(() => {
    //     console.log(users);
    //     const userId = localStorage.getItem("userId");
    //     console.log("userId:", userId);
    //     const currentUser = users.find(user => user._id == userId);
    //     setCurrentUserName(currentUser.username);
    // }, [users])

    // Find and return user's full name given their id
    const getUserName = (userId) => {
        const user = users.find(user => user._id === userId);
        return user ? `${user.firstName} ${user.lastName}` : "Unknown";
    }

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
            <div className="dashboard-header">
                <div className="dashboard-header-left">
                    <h1>Admin Dashboard</h1>
                    <p>Manage Users and Appointments</p>
                </div>
                <div className="dashboard-header-right">
                    <button className="dashboard-btn dashboard-top-btn" onClick={() => setOpenChangePassword(true)}>Change Password</button>
                    <button className="dashboard-btn dashboard-top-btn">Logout</button>
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

            <div className="dashboard-section">
                <div className="dashboard-tab-container">
                    <button
                        className={`dashboard-tab ${activeTab === 'appointments' ? 'active' : ''}`}
                        onClick={() => setActiveTab('appointments')}
                    >
                        Appointments
                    </button>
                    <button
                        className={`dashboard-tab ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Users
                    </button>
                </div>

                {/* Appointments Tab */}
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
                                                <td>{getUserName(appointment.doctorId)}</td>
                                                <td>{getUserName(appointment.patientId)}</td>
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