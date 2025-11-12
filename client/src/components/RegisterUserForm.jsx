import { useState } from "react";

function RegisterUserForm(props) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("patient");
    const [errors, setErrors] = useState(
        { firstName: "", lastName: "", username: "", password: "", role: "" }
    );

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({ firstName: "", lastName: "", username: "", password: "", role: "" });

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:3000/admin/users", {
                method: "POST",
                body: JSON.stringify({ firstName, lastName, username, password, role }),
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await res.json();

            if (res.ok) {
                console.log("User successfully updated!");
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
                <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <div className="error">{errors.firstName}</div>
                </div>

                <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <div className="error">{errors.lastName}</div>
                </div>

                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <div className="username error">{errors.username}</div>
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="password error">{errors.password}</div>
                </div>

                <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <select name="role" id ="role" required value ={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>
                        <option value="admin">Admin</option>
                    </select>
                    <div className="password error">{errors.password}</div>
                </div>

                <button type="submit" className="sign-in-btn">
                    Register User
                </button>
            </form>
        </>
    )
}

export default RegisterUserForm;