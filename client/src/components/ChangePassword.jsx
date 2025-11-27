import { useState } from "react";
import { changePasswordRequest } from "../utils/passwordApi";

function ChangePassword(props) {
    const user = props.user;
    const userIdProp = props.userId;
    const userId = user ? (user._id || user.id) : userIdProp || localStorage.getItem("userId");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({ currentPassword: "", newPassword: "", confirmPassword: "", general: "" });
    const [loading, setLoading] = useState(false);

    // Handle password change
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({ currentPassword: "", newPassword: "", confirmPassword: "", general: "" });

        if (!newPassword || newPassword.length < 6) {
            setErrors((prev) => ({ ...prev, newPassword: "Password must be at least 6 characters." }));
            return;
        }
        if (newPassword !== confirmPassword) {
            setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match." }));
            return;
        }

        setLoading(true);
        try {
            const res = await changePasswordRequest(userId, currentPassword, newPassword);
            const data = await res.json();

            if (res.ok) {
                // success
                if (props.onSuccess) props.onSuccess(data);
                if (props.closeModal) props.closeModal();
            } else {
                setErrors((prev) => ({ ...prev, general: data.message || "Unable to change password." }));
            }
        } catch (err) {
            setErrors((prev) => ({ ...prev, general: err.message || "Network error" }));
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <div className="error">{errors.currentPassword}</div>
            </div>

            <div className="mb-3">
                <label htmlFor="newPassword">New Password</label>
                <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <div className="error">{errors.newPassword}</div>
            </div>

            <div className="mb-3">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <div className="error">{errors.confirmPassword}</div>
            </div>

            <div className="d-flex gap-2">
                <button type="submit" className="btn btn-dark" disabled={loading}>
                    {loading ? "Changing..." : "Change Password"}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => props.closeModal && props.closeModal()} disabled={loading}>
                    Cancel
                </button>
            </div>

            {errors.general && <div className="text-dark" style={{ marginTop: 8 }}>{errors.general}</div>}
        </form>
    )
}

export default ChangePassword;