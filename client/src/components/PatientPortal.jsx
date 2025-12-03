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

    // Search state for appointments
    const [viewPastAppointments, setViewPastAppointments] = useState(false);

    // Fetch patient appointment data for dashboard
    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch("http://localhost:3000/api/users/dashboard", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (data.payload) {
                    setUser(data.payload.user);
                    setAppointments(data.payload.appointments || []);
                }
            } catch (err) {
                console.log("Error fetching patient data:", err);
            }
        };

        fetchPatientData();
    }, []);

    const filteredAppointments = appointments.filter(appointment => {
        const apptDate = new Date(appointment.startTime);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const apptDay = new Date(apptDate);
        apptDay.setHours(0, 0, 0, 0);

        if (viewPastAppointments) {
            return apptDay.getTime() < today.getTime();
        } else {
            return apptDay.getTime() >= today.getTime();
        }
    });

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
                        <button
                            className="dashboard-btn"
                            onClick={() => setViewPastAppointments(!viewPastAppointments)}
                        >
                            {viewPastAppointments === false
                                ? "View History"
                                : "View Upcoming"}
                        </button>
                    </div>
                </div>
                <div className="appointment-box">
                    {filteredAppointments && filteredAppointments.length > 0 ? (
                        filteredAppointments.map((appointment) => {
                            const startDate = new Date(appointment.startTime);
                            const endDate = new Date(appointment.endTime);
                            const dateString = startDate.toLocaleDateString();
                            const startTimeString = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            const endTimeString = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                            return (
                                <div className="appointment-card" key={appointment._id}>
                                    <div className="appointment-time">{dateString} at {startTimeString}</div>
                                    <div className="appointment-detail">
                                        with Dr. {appointment.doctorId
                                            ? `${appointment.doctorId.firstName} ${appointment.doctorId.lastName}`
                                            : "Unknown"}
                                    </div>
                                    <div className="appointment-detail">Duration: {startTimeString}-{endTimeString}</div>
                                    <div className="appointment-cancel">
                                        <button className="dashboard-btn">Cancel</button>
                                    </div>
                                </div>
                            );
                        })
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