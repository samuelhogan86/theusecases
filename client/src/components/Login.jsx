import '../styles.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({ username: "", password: "" });

        try {
            const res = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                body: JSON.stringify({ username, password }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();

            if (res.ok) {
                // Save token and redirect
                localStorage.setItem("token", data.token);
                localStorage.setItem("userId", data.user._id);

                // Handle navigation using react-router-dom
                // Routes can be viewed under App.jsx
                if (data.user.role === "patient") {
                    navigate("/patient-portal", { replace: true });
                } else if (data.user.role === "doctor") {
                    navigate("/doctor-portal", { replace: true });
                } else if (data.user.role === "admin") {
                    navigate("/admin-portal", { replace: true });
                }
            } else {
                setErrors({
                    username: data.errors?.username || "",
                    password: data.errors?.password || "",
                });
            }
        } catch (err) {
            console.error("Login error:", err);
        }
    };

    return (
        <>
            <main>
                <div className="login-card">
                    <div className="login-header">
                        <h1>Patient Portal</h1>
                        <p>Sign in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit}>
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
                            <div className="username_error">{errors.username}</div>
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
                            <div className="password_error">{errors.password}</div>
                        </div>

                        <button type="submit" className="sign-in-btn">
                            Sign in
                        </button>
                    </form>
                </div>
            </main>
        </>
    )
}

export default Login