import { useState, useEffect } from "react"
import { DatePicker } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function NewAppointmentForm(props) {
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [doctorId, setDoctorId] = useState("");
    const [patientId, setPatientId] = useState("patient");
    const [errors, setErrors] = useState(
        { date: "", startTime: "", endTime: "", doctorId: "", patientId: "" }
    );
    const users = props.users;
    const doctors = users.filter(user => user.role === "doctor");
    const patients = users.filter(user => user.role === "patient");

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({ date: "", startTime: "", endTime: "", doctorId: "", patientId: "" });

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:3000/api/appointments", {
                method: "POST",
                body: JSON.stringify({ startTime, endTime, doctorId, patientId }),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await res.json();

            if (res.ok) {
                console.log("Appointment successfully scheduled!");
                // Close modal
                if (props.closeModal) props.closeModal();
            } else {
                setErrors({
                    date: data.errors?.date || "",
                    startTime: data.errors?.startTime || "",
                    endTime: data.errors?.endTime || "",
                    doctorId: data.errors?.doctorId || "",
                    patientId: data.errors?.patientId || ""
                });
            }
        } catch (err) {
            console.log("Schedule appointment error", err);
        }
    }

    // Set startTime to Datetime object using date
    useEffect(() => {
        if (date && startTime) {
            setStartTime();
        }
    }, [date, startTime]);

    // Set endTime to Datetime object using date
    useEffect(() => {
        if (date && endTime) {
            setEndTime();
        }
    }, [date, endTime]);

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <DatePicker
                        selected={date}
                        onChange={(date) => setDate(date)}
                        minDate={new Date()}
                    />
                    <div className="error">{errors.date}</div>
                </div>

                <div className="form-group">
                    <label htmlFor="startTime">Start Time</label>
                    <input
                        type="text"
                        id="startTime"
                        name="startTime"
                        required
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                    <div className="error">{errors.startTime}</div>
                </div>

                <div className="form-group">
                    <label htmlFor="endTime">End Time</label>
                    <input
                        type="text"
                        id="endTime"
                        name="endTime"
                        required
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    />
                    <div className="error">{errors.endTime}</div>
                </div>

                <div className="form-group">
                    <label htmlFor="doctorId">Doctor</label>
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
                    <select name="role" id="role" required value={role} onChange={(e) => setRole(e.target.value)}>
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