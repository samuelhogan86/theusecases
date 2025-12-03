import { useState } from "react";

// Same as register, but fields are not required
function UpdateUserForm(props) {
    const userId = props.user._id;
    const [firstName, setFirstName] = useState(props.user.firstName || "");
    const [lastName, setLastName] = useState(props.user.lastName || "");
    const [username, setUsername] = useState(props.user.username || "");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState(props.user.role || "patient");
    const [errors, setErrors] = useState(
        { firstName: "", lastName: "", username: "", password: "", role: "" }
    );

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({ firstName: "", lastName: "", username: "", password: "", role: "" });

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3000/api/users/${userId}`, {
                method: "PUT",
                body: JSON.stringify({ firstName, lastName, username, password, role }),
                headers: { 
                    "Content-Type": "application/json" ,
                    'Authorization': `Bearer ${token}` 
                }
            });

            const data = await res.json();

            if (res.ok) {
                console.log("User successfully updated!");
                window.location.reload();
                // Close modal
                if (props.closeModal) props.closeModal();
            } else {
                setErrors({
                    firstName: data.errors?.firstName || "",
                    lastName: data.errors?.lastName || "",
                    username: data.errors?.username || "",
                    password: data.errors?.password || "",
                    role: data.errors?.role || ""
                });
            }
        } catch (err) {
            console.log("Update user error", err);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="firstName">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <div className="text-dark">{errors.firstName}</div>
                </div>

                <div className="mb-3">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <div className="text-dark">{errors.lastName}</div>
                </div>

                <div className="mb-3">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <div className="text-dark">{errors.username}</div>
                </div>

                <div className="mb-3">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="text-dark">{errors.password}</div>
                </div>

                <div className="mb-3">
                    <label htmlFor="role" style={{ marginRight: "0.4vw" }}>Role</label>
                    <select name="role" id ="role" value = {role} onChange={(e) => setRole(e.target.value)}>
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>
                        <option value="admin">Admin</option>
                    </select>
                    <div className="text-dark">{errors.password}</div>
                </div>

                <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-dark">Update User</button>
                    <button className="btn btn-outline-secondary" onClick={() => props.closeModal()}>Cancel</button>
                </div>
            </form>
        </>
    )
}

export default UpdateUserForm;