
export function AccountInformation({ user }) {
    return (
        <div className="border rounded-3 p-4 mt-4">
            <h2 className="fw-semibold mb-4">Account Information</h2>
            <div className="mb-3">
                <div className="fw-semibold mb-1">Name</div>
                <div className="text-dark">
                    {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "Unknown"}
                </div>
            </div>
            <div className="mb-3">
                <div className="fw-semibold mb-1">Role</div>
                <div className="text-dark">
                    {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Unknown"}
                </div>
            </div>
            <div className="mb-3">
                <div className="fw-semibold mb-1">Last Password Change</div>
                <div className="text-dark">
                    {user?.lastPasswordChange ? user.lastPasswordChange : "Unknown"}
                </div>
            </div>
        </div>
    );
}

export default AccountInformation;
