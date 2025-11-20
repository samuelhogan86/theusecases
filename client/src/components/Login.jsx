import { Container, Card, Form, Button } from "react-bootstrap";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css'

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
        <Container 
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "100vh"}}
        >
            <Card className="p-4 shadow-sm" style={{ width: "420px", borderRadius: "14px", border: "2px solid #dcdcdc", background: "#ffffff", padding: "10px 15px 30px" }}>
                
                <div className="text-center mb-4">
                    <h3 className="mb-1 text-center">Patient Portal</h3>
                    <p className="text-muted text-center">Sign in to your account</p>
                </div><br/>

                <Form onSubmit={handleSubmit}>
                    {/* Username */}
                    <Form.Group className="mb-3" controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="py-2"
                            isInvalid={!!errors.username}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.username}
                        </Form.Control.Feedback>
                    </Form.Group><br/>

                    {/* Password */}
                    <Form.Group className="mb-4" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="py-2"
                            isInvalid={!!errors.password}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.password}
                        </Form.Control.Feedback>
                    </Form.Group><br/>

                    {/* Submit button */}
                    <Button 
                        type="submit" 
                        variant="dark" 
                        className="w-100 py-2"
                    >
                        Sign in
                    </Button>
                </Form>
            </Card>
        </Container>
    );
}


export default Login