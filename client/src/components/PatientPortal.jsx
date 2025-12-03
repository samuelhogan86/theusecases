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

    const handleOpenChange = () => setOpenChangePassword(true);
    const handleCloseChange = () => setOpenChangePassword(false);

    const handleCancelAppointment = async (appointmentId) => {
        if(!window.confirm('Are you sure you want to cancel this appointment?')) 
            return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/appointments/${appointmentId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if(response.ok) {
                setAppointments(appointments.filter(app => app.appointmentId !== appointmentId));
                alert('Appointment cancelled successfully.');
            } else {
                const data = await response.json();
                alert(`Failed to cancel appointment: ${data.message || 'Unknown error'}`);
            }
        } catch (err) {
            console.error("Error cancelling appointment:", err);
            alert('An error occurred while cancelling the appointment.');
        }
    };

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
                                    <button className="dashboard-btn" onClick={() => handleCancelAppointment(appointment.appointmentId)}>Cancel</button>
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