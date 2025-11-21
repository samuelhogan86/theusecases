import '../styles.css'
import { useEffect, useState } from 'react'
import { Modal } from 'antd'
import ChangePassword from './ChangePassword'
import { handleLogout } from '../utils/logout'
import AccountInformation from './AccountInformation'

function PatientPortal() {
    const [openChangePassword, setOpenChangePassword] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [user, setUser] = useState([]);

    // Fetch patient appointment data for dashboard
    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch("http://localhost:3000/user/patient/dashboard", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setAppointments(data.appointments);
                setUser(data.user);
            } catch (err) {
                console.log("Error fetching patient data:", err);
            }
        };

        fetchPatientData();
    }, []);

    const handleOpenChange = () => setOpenChangePassword(true);
    const handleCloseChange = () => setOpenChangePassword(false);

    return (
        <>
            <div className="dashboard-header">
                <div className="dashboard-header-left">
                    <h1>Patient Dashboard</h1>
                    <p>Welcome, {user ? `${user.firstName} ${user.lastName}` : "Patient"}</p>
                </div>
                <div className="dashboard-header-right">
                    <button className="dashboard-btn dashboard-top-btn" onClick={handleOpenChange}>Change Password</button>
                    <button className="dashboard-btn dashboard-top-btn" onClick={handleLogout}>Logout</button>
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
                        <button className="dashboard-btn">View History</button>
                    </div>
                </div>
                <div className="appointment-box">
                    {appointments && appointments.length > 0 ? (
                        appointments.map((appointment) => (
                            <div className="appointment-card" key={appointment._id}>
                                <div className="appointment-time">{new Date(appointment.date).toLocaleDateString()} at {appointment.startTime}</div>
                                <div className="appointment-detail">
                                    with {appointment.doctorId
                                        ? `${appointment.doctorId.firstName} ${appointment.doctorId.lastName}`
                                        : "Unknown"}
                                </div>
                                <div className="appointment-detail">Duration: {appointment.startTime}-{appointment.endTime}</div>
                                <div className="appointment-cancel">
                                    <button className="dashboard-btn">Cancel</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div colSpan="4" style={{ textAlign: "center" }}>
                            No appointments found.
                        </div>
                    )}
                </div>
                {user && <AccountInformation user={user} />}
            </div>
        </>
    )
}

export default PatientPortal