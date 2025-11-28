import "bootstrap/dist/css/bootstrap.min.css"
import { useState } from 'react'
import { Modal } from 'antd'
import ChangePassword from './ChangePassword'
import { handleLogout } from '../utils/logout'

function DoctorPortal() {
    const [appointments, setAppointments] = useState([]);
    const [user, setUser] = useState(null);
    const [openChangePassword, setOpenChangePassword] = useState(false);

    const handleOpenChange = () => setOpenChangePassword(true);
    const handleCloseChange = () => setOpenChangePassword(false);

    return (
        <>
            {/* HEADER */}
        <div className="container mt-4" style={{ maxWidth: "100%", "--bs-gutter-x": "0" }}>
            <div className="d-flex justify-content-between align-items-start">
                <div>
                    <h1 className="fw-bold mb-1">Doctor Dashboard</h1>
                    <p className="text-muted mb-4">Welcome, {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}</p> {/* Should work once the sent information from database is processed */}
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-secondary" onClick={handleOpenChange}>Change Password</button>
                    <button className="btn btn-outline-danger" onClick = {handleLogout}>Logout</button>
                </div>
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
            {/* Doctor Appointments */}
        <div className="container-fluid" style={{ minWidth: "90vw" }}>
            <div className="card mb-4" style={{ border: "none"}}>
                <div className="border rounded-3 p-3">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-semibold mb-0">My Appointments</h2>
                        <div className="d-flex gap-2">
                            <select className="form-select" style={{ width: 'auto' }}>
                                <option>Today</option>
                                <option>This Week</option>
                                <option>This Month</option>
                            </select>
                            <button className="btn btn-outline-secondary">View History</button>
                        </div>
                    </div>
                
                    {/* Need to redo this section to include appointments and map them to the database */}
                    <div className="border rounded-3 p-4 mb-3">
                        <h3 className="fs-5 fw-semibold mb-2">10/31/2025</h3>
                        <p className="text-secondary mb-1">Patient: Jane Smith</p>
                        <p className="text-secondary mb-3">Duration: 09:00-09:30</p>
                    </div>
                    <div className="border rounded-3 p-4">
                        <h3 className="fs-5 fw-semibold mb-2">11/1/2025</h3>
                        <p className="text-secondary mb-1">Patient: John Adams</p>
                        <p className="text-secondary mb-3">Duration: 12:00-12:00</p>
                    </div>
                </div>
                {/* include a statement with no upcoming appontments */}

                {/* ACCOUNT INFORMATION SECTION */}
                <div className="border rounded-3 p-4 mt-4">
                    <h2 className="fw-semibold mb-4">Account Information</h2>
                    <div className="mb-3">
                        <div className="fw-semibold mb-1">Name</div>
                        <div className="text-dark">Lucy Chen</div>
                    </div>
                    <div className="mb-3">
                        <div className="fw-semibold mb-1">Last login</div>
                        <div className="text-dark">10/16/2025, 18:39:47</div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default DoctorPortal