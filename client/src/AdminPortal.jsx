import './styles.css'

function AdminPortal() {
    // Previous code for switching tabs between appointments and users
    // <script>
    //     function switchTab(tabName) {
    //         const tabs = document.querySelectorAll('.dashboard-tab');
    //         const contents = document.querySelectorAll('.dashboard-content');

    //         tabs.forEach(tab => tab.classList.remove('active'));
    //         contents.forEach(content => content.classList.remove('active'));

    //         event.target.classList.add('active');
    //         document.getElementById(tabName).classList.add('active');
    //     }
    // </script>
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
                    <button className="dashboard-tab active" onclick="switchTab('appointments')">Appointments</button>
                    <button className="dashboard-tab" onclick="switchTab('users')">Users</button>
                </div>

                <div id="appointments" className="dashboard-content active">
                    <div className="dashboard-controls-bar">
                        <input type="text" className="dashboard-search-box" placeholder="Search by name..." />
                        <div className="dashboard-filter-group">
                            <select className="dashboard-filter-select">
                                <option>Search by Patient</option>
                                <option>Search by Doctor</option>
                            </select>
                            <button className="dashboard-btn dashboard-btn-primary">+ New Appointment</button>
                        </div>
                    </div>

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
                                <tr>
                                    <td>9/26/2025</td>
                                    <td>11:00</td>
                                    <td>12:00</td>
                                    <td>Dr. Michael Smith</td>
                                    <td>Amy Tran</td>
                                </tr>
                                <tr>
                                    <td>9/26/2025</td>
                                    <td>11:30</td>
                                    <td>12:00</td>
                                    <td>Dr. Lucy Chen</td>
                                    <td>Steve Jones</td>
                                </tr>
                                <tr>
                                    <td>9/26/2025</td>
                                    <td>13:00</td>
                                    <td>13:30</td>
                                    <td>Dr. Maria Gonzalez</td>
                                    <td>Laura White</td>
                                </tr>
                                <tr>
                                    <td>9/26/2025</td>
                                    <td>14:00</td>
                                    <td>14:30</td>
                                    <td>Dr. James Thompson</td>
                                    <td>David Green</td>
                                </tr>
                                <tr>
                                    <td>9/26/2025</td>
                                    <td>15:00</td>
                                    <td>15:30</td>
                                    <td>Dr. Priya Patel</td>
                                    <td>Emily Carter</td>
                                </tr>
                                <tr>
                                    <td>9/26/2025</td>
                                    <td>15:30</td>
                                    <td>18:30</td>
                                    <td>Dr. William Johnson</td>
                                    <td>Robert Brown</td>
                                </tr>
                                <tr>
                                    <td>9/27/2025</td>
                                    <td>09:00</td>
                                    <td>09:45</td>
                                    <td>Dr. Michael Smith</td>
                                    <td>Susan Taylor</td>
                                </tr>
                                <tr>
                                    <td>9/27/2025</td>
                                    <td>10:00</td>
                                    <td>10:30</td>
                                    <td>Dr. Sarah Kim</td>
                                    <td>Brian Wilson</td>
                                </tr>
                                <tr>
                                    <td>9/27/2025</td>
                                    <td>11:00</td>
                                    <td>11:30</td>
                                    <td>Dr. Lucy Chen</td>
                                    <td>Olivia Harris</td>
                                </tr>
                                <tr>
                                    <td>9/27/2025</td>
                                    <td>13:00</td>
                                    <td>13:30</td>
                                    <td>Dr. Ahmed Hassan</td>
                                    <td>Kevin Davis</td>
                                </tr>
                                <tr>
                                    <td>9/27/2025</td>
                                    <td>14:00</td>
                                    <td>14:45</td>
                                    <td>Dr. Maria Gonzalez</td>
                                    <td>Sophia Martinez</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="dashboard-pagination">
                            <button className="dashboard-btn">Prev</button>
                            <div className="dashboard-page-info">
                                Page <input type="number" className="dashboard-page-input" value="1" min="1" max="3" /> of 3
                            </div>
                            <button className="dashboard-btn">Next</button>
                        </div>
                    </div>
                </div>

                <div id="users" className="dashboard-content">
                    <div className="dashboard-controls-bar">
                        <input type="text" className="dashboard-search-box" placeholder="Search users..." />
                        <button className="dashboard-btn dashboard-btn-primary">+ Add User</button>
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
                                Page <input type="number" className="dashboard-page-input" value="1" min="1" max="1" /> of 1
                            </div>
                            <button className="dashboard-btn">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminPortal