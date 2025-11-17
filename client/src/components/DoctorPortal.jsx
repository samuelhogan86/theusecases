import '../styles.css'
import { useState } from 'react'
import { Modal } from 'antd'
import ChangePassword from './ChangePassword'
import { handleLogout } from '../utils/logout'

function DoctorPortal() {
    const [openChangePassword, setOpenChangePassword] = useState(false);

    const handleOpenChange = () => setOpenChangePassword(true);
    const handleCloseChange = () => setOpenChangePassword(false);

    return (
        <>
            <div className="dashboard-header">
                <div className="dashboard-header-left">
                    <h1>Doctor Dashboard</h1>
                    <p>Welcome, Dr.Lucy Chen</p>
                </div>
                <div className="dashboard-header-right">
                    <button className="dashboard-btn dashboard-top-btn" onClick={handleOpenChange}>Change Password</button>
                    <button className="dashboard-btn dashboard-top-btn" onClick = {handleLogout}>Logout</button>
                </div>
            </div>

            <Modal
                title="Change Password"
                open={openChangePassword}
                onCancel={handleCloseChange}
                footer={null}
                centered
            >
                <ChangePassword userId={localStorage.getItem('userId')} closeModal={handleCloseChange} />
            </Modal>

            <div className="dashboard-section">
                <div className="dashboard-section-header">
                    <h2>My Appointments</h2>
                    <div className="dashboard-section-controls">
                        <select className="dashboard-dropdown">
                            <option>Today</option>
                            <option>This Week</option>
                            <option>This Month</option>
                        </select>
                        <button className="dashboard-btn">View History</button>
                    </div>
                </div>
                <div className="appointment-box">
                    <div className="appointment-card">
                        <div className="appointment-time">10/31/2025</div>
                        <div className="appointment-detail">Patient: Jane Smith</div>
                        <div className="appointment-detail">Duration: 09:00-09:30</div>
                    </div>
                    <div className="appointment-card">
                        <div className="appointment-time">11/1/2025</div>
                        <div className="appointment-detail">Patient: John Adams</div>
                        <div className="appointment-detail">Duration: 12:00-12:00</div>
                    </div>
                </div>
                <div className="dashboard-account-info">
                    <h2>Account Information</h2>
                    <div className="dashboard-info-row">
                        <div className="dashboard-info-label">Name</div>
                        <div className="dashboard-info-value">Lucy Chen</div>
                    </div>
                    <div className="dashboard-info-row">
                        <div className="dashboard-info-label"></div>
                        <div className="dashboard-info-value">10/16/2025, 18:39:47</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DoctorPortal