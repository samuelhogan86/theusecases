import '../styles.css'
import { useState, useEffect } from 'react'
import { Modal } from 'antd'
import ChangePassword from './ChangePassword'
import { handleLogout } from '../utils/logout'
import AccountInformation from './AccountInformation'

function DoctorPortal() {
    const [openChangePassword, setOpenChangePassword] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [user, setUser] = useState([]);

    // Search state for appointments
    const [viewPastAppointments, setViewPastAppointments] = useState(false);
    const [appointmentView, setAppointmentView] = useState('Today'); // 'Today' or 'This Week' or 'This Month'

    // Fetch doctor appointment data for dashboard
    useEffect(() => {
        const fetchDoctorData = async () => {
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
                console.log("Error fetching doctor data:", err);
            }
        };

        fetchDoctorData();
    }, []);

    const filteredAppointments = appointments.filter(appointment => {
        const apptDate = new Date(appointment.startTime);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const apptDay = new Date(apptDate);
        apptDay.setHours(0, 0, 0, 0);

        if (viewPastAppointments) {
            return apptDay.getTime() < today.getTime();
        }

        if (appointmentView === "Today") {
            return apptDay.getTime() === today.getTime();
        }

        if (appointmentView === "This Week") {
            // Start of this week (Sunday)
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
            startOfWeek.setHours(0, 0, 0, 0);

            // End of this week (Saturday)
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);

            return apptDate >= startOfWeek && apptDate <= endOfWeek;
        }

        if (appointmentView === "This Month") {
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

            return apptDate >= startOfMonth && apptDate <= endOfMonth;
        }
    });

    const handleOpenChange = () => setOpenChangePassword(true);
    const handleCloseChange = () => setOpenChangePassword(false);

    return (
        <>
            <div className="dashboard-header">
                <div className="dashboard-header-left">
                    <h1>Doctor Dashboard</h1>
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
                        {!viewPastAppointments && (
                            <select
                                className="dashboard-dropdown"
                                value={appointmentView}
                                onChange={(e) => setAppointmentView(e.target.value)}
                            >
                                <option value="Today">Today</option>
                                <option value="This Week">This Week</option>
                                <option value="This Month">This Month</option>
                            </select>
                        )}
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
                        filteredAppointments.map((appointment) => (
                            <div className="appointment-card" key={appointment._id}>
                                <div className="appointment-time">{new Date(appointment.date).toLocaleDateString()} at {appointment.startTime}</div>
                                <div className="appointment-detail">
                                    with {appointment.patientId
                                        ? `${appointment.patientId.firstName} ${appointment.patientId.lastName}`
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

export default DoctorPortal