import '../styles.css'

function PatientPortal() {

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
            <div className="dashboard-header">
                <div className="dashboard-header-left">
                    <h1>Patient Dashboard</h1>
                    <p>Welcome, John Doe</p>
                </div>
                <div className="dashboard-header-right">
                    <button className="dashboard-btn dashboard-top-btn">Change Password</button>
                    <button className="dashboard-btn dashboard-top-btn" onClick = {handleLogout}>Logout</button>
                </div>
            </div>

            <div className="dashboard-section">
                <div className="dashboard-section-header">
                    <h2>My Appointments</h2>
                    <div className="dashboard-section-controls">
                        <button className="dashboard-btn">View History</button>
                    </div>
                </div>
                <div className="appointment-box">
                    <div className="appointment-card">
                        <div className="appointment-time">1/1/2025 at 09:00</div>
                        <div className="appointment-detail">with Dr. Michael Brown</div>
                        <div className="appointment-detail">Duration: 09:00-09:30</div>
                        <div className="appointment-cancel">
                            <button className="dashboard-btn">Cancel</button>
                        </div>
                    </div>
                    <div className="appointment-card">
                        <div className="appointment-time">3/23/2025 at 10:30</div>
                        <div className="appointment-detail">with Dr. Lucy Chen</div>
                        <div className="appointment-detail">Duration: 10:30-11:00</div>
                        <div className="appointment-cancel">
                            <button className="dashboard-btn">Cancel</button>
                        </div>
                    </div>
                </div>
                <div className="dashboard-account-info">
                    <h2>Account Information</h2>
                    <div className="dashboard-info-row">
                        <div className="dashboard-info-label">Name</div>
                        <div className="dashboard-info-value">John Doe</div>
                    </div>
                    <div className="dashboard-info-row">
                        <div className="dashboard-info-label">Last login</div>
                        <div className="dashboard-info-value">10/16/2025, 18:39:47</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PatientPortal