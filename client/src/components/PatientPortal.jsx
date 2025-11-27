import "bootstrap/dist/css/bootstrap.min.css"
import { useState } from 'react'
import { Modal } from 'antd'
import ChangePassword from './ChangePassword'

function PatientPortal() {
    const [appointments, setAppointments] = useState([]);
    const [user, setUser] = useState(null);
    const [openChangePassword, setOpenChangePassword] = useState(false);

    const handleOpenChange = () => setOpenChangePassword(true);
    const handleCloseChange = () => setOpenChangePassword(false);

// User routes and REST Endpoints needed

    const handleLogout = async () => {
        try{
            await fetch("http://localhost:3000/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            localStorage.removeItem("token");
            localStorage.removeItem("userId");

            window.location.href = "/";
        } catch (err) {
            console.log("Logout error", err);
        }
    };

    return (
        <>
            {/* HEADER */}
            <div className="container mt-4" style={{ maxWidth: "100%", "--bs-gutter-x": "0" }}>
                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <h1 className="fw-bold mb-1">Patient Dashboard</h1>
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
            {/* My Appointments */}
        <div className="container-fluid" style={{ minWidth: "90vw" }}>
            <div className="card mb-4" style={{ border: "none"}}>
                <div className="border rounded-3 p-3">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-semibold mb-0">My Appointments</h2>
                        <button className="btn btn-outline-secondary">View History</button>
                    </div>
                    {/* Need to redo this section to include appointments and map them to the database */}
                    <div className="border rounded-3 p-4 mb-3">
                        {/* Replace raw data with actual data */}
                        <div className="d-flex justify-content-between">
                            <h3 className="fs-5 fw-semibold mb-2">1/1/2025 at 09:00</h3>
                            {/* Need to finish this button */}
                            <button className="btn btn-outline-danger" onClick={() => handleCancelAppointment(appointment._id)}>Cancel</button>
                        </div>
                        <p className="text-secondary mb-1">with Dr. Michael Brown</p>
                        <p className="text-secondary mb-3">Duration: 09:00-09:30</p>
                    </div>
                    {/* Another raw data, can be removed once the appointments are set up */}
                    <div className="border rounded-3 p-4">
                        <div className="d-flex justify-content-between">
                            <h3 className="fs-5 fw-semibold mb-2">3/23/2025 at 10:30</h3>
                            <button className="btn btn-outline-danger" onClick={() => handleCancelAppointment(appointment._id)}>Cancel</button>
                        </div>
                        <p className="text-secondary mb-1">with Dr. Lucy Chen</p>
                        <p className="text-secondary mb-3">Duration: 10:30-11:00</p>
                    </div>
                </div>
                {/* include a statement with no upcoming appontments */}

                {/* ACCOUNT INFORMATION SECTION */}
                <div className="border rounded-3 p-4 mt-4">
                    <h2 className="fw-semibold mb-4">Account Information</h2>
                    <div className="mb-3">
                        <div className="fw-semibold mb-1">Name</div>
                        <div className="text-dark">John Doe</div>
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

export default PatientPortal