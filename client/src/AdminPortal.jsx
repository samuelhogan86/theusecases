import './styles.css';
import { useState } from 'react';
import { Modal } from 'antd';

function AdminPortal() {
    const [activeTab, setActiveTab] = useState('appointments');
    const [openAdd, setOpenAdd] = useState(false);

    const handleAdd = () => setOpenAdd(true);
    const handleCloseAdd = () => setOpenAdd(false);

    return (
        <>
            <div className="dashboard-header">
                <div className="dashboard-header-left">
                    <h1>Admin Dashboard</h1>
                    <p>Manage Users and Appointments</p>
                </div>
                <div className="dashboard-header-right">
                    <button className="dashboard-btn dashboard-top-btn">Change Password</button>
                    <button className="dashboard-btn dashboard-top-btn">Logout</button>
                </div>
            </div>

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
                            <button className="dashboard-btn dashboard-btn-primary" onClick={handleAdd}>+ New Appointment</button>
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
                                    <tr>
                                        <td>9/26/2025</td>
                                        <td>09:00</td>
                                        <td>09:30</td>
                                        <td>Dr. Lucy Chen</td>
                                        <td>Jane Smith</td>
                                    </tr>
                                    <tr>
                                        <td>9/26/2025</td>
                                        <td>10:30</td>
                                        <td>11:00</td>
                                        <td>Dr. Lucy Chen</td>
                                        <td>Adam Johnson</td>
                                    </tr>
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
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Dr. Lucy Chen</td>
                                            <td>lucy.chen@hospital.com</td>
                                            <td>Doctor</td>
                                            <td>Active</td>
                                        </tr>
                                        <tr>
                                            <td>Jane Smith</td>
                                            <td>jane.smith@email.com</td>
                                            <td>Patient</td>
                                            <td>Active</td>
                                        </tr>
                                        <tr>
                                            <td>Dr. Michael Smith</td>
                                            <td>michael.smith@hospital.com</td>
                                            <td>Doctor</td>
                                            <td>Active</td>
                                        </tr>
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

            <Modal
                title={activeTab === 'users' ? "Register New User" : "Schedule New Appointment"}
                open={openAdd}
                onCancel={handleCloseAdd}
                onOk={handleCloseAdd}
                okText="Save"
            >
            </Modal>
        </>
    );
}

export default AdminPortal;