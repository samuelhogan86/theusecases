
export function AccountInformation({ user }) {
    return (
        <div className="dashboard-account-info">
            <h2>Account Information</h2>
            <div className="dashboard-info-row">
                <div className="dashboard-info-label">Name</div>
                <div className="dashboard-info-value">
                    {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "Unknown"}
                </div>
            </div>
            <div className="dashboard-info-row">
                <div className="dashboard-info-label">Role</div>
                <div className="dashboard-info-value">
                    {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Unknown"}
                </div>
            </div>
            <div className="dashboard-info-row">
                <div className="dashboard-info-label">Last Password Change</div>
                <div className="dashboard-info-value">
                    {user?.lastPasswordChange ? user.lastPasswordChange : "Unknown"}
                </div>
            </div>
        </div>
    );
}

export default AccountInformation;
