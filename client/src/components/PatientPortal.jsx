import "bootstrap/dist/css/bootstrap.min.css"
import { useState, useEffect } from 'react'
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
        {/* HEADER */}
        <div className="container mt-4" style={{ maxWidth: "100%", "--bs-gutter-x": "0" }}>
            <div className="d-flex justify-content-between align-items-start">
                <div>
                    <h1 className="fw-bold mb-1">Patient Dashboard</h1>
                    <p className="text-muted">Welcome, {user ? `${user.firstName} ${user.lastName}` : "Patient"}</p>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-secondary" onClick={handleOpenChange}>
                        Change Password
                    </button>
                    <button className="btn btn-outline-danger" onClick={handleLogout}>
                        Logout
                    </button>
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
        <div className="container-fluid px-4" style={{ minWidth: "90vw" }}>
            <div className="card mb-4 border-0">
                <div className="border rounded-3 p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-semibold mb-0">My Appointments</h2>
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => setViewPastAppointments(!viewPastAppointments)}
                        >
                            {viewPastAppointments ? "View Upcoming" : "View History"}
                        </button>
                    </div>

                    <div className="border rounded-3 p-4">
                        {filteredAppointments && filteredAppointments.length > 0 ? (
                            filteredAppointments.map((appointment, index) => {
                                // Declare variables inside the callback function
                                const startDate = new Date(appointment.startTime);
                                const endDate = new Date(appointment.endTime);
                                const dateString = startDate.toLocaleDateString();
                                const startTimeString = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                const endTimeString = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                
                                return (
                                    <div 
                                        key={appointment._id} 
                                        className={index !== filteredAppointments.length - 1 ? 'border-bottom pb-4 mb-4' : ''}
                                    >
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h3 className="fs-5 fw-semibold mb-0">
                                                {dateString} at {startTimeString}
                                            </h3>
                                            <button className="btn btn-outline-danger btn-sm" onClick={() => handleCancelAppointment(appointment.appointmentId)}>
                                                Cancel
                                            </button>
                                        </div>
                                        <p className="text-secondary mb-1">
                                            with {appointment.doctorId
                                                ? `${appointment.doctorId.firstName} ${appointment.doctorId.lastName}`
                                                : "Unknown Doctor"}
                                        </p>
                                        <p className="text-secondary mb-0">
                                            Duration: {startTimeString} - {endTimeString}
                                        </p>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center text-muted py-4">
                                No appointments found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {user && <AccountInformation user={user} />}
        </div>
    </>
)
}

export default PatientPortal