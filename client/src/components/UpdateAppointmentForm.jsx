import { useState } from "react";
import { DatePicker, TimePicker, Select } from "antd";
import dayjs from "dayjs";

// Same as scheduling new appointment, except fields are not required and status can be updated
function UpdateAppointmentForm(props) {
    const appointment = props.appointment;
    const appointmentId = appointment._id;

    // Extract initial values from the appointment DateTime objects
    const initialStartDateTime = new Date(appointment.startTime);
    const initialEndDateTime = new Date(appointment.endTime);

    // Format date for input (YYYY-MM-DD)
    const formatDateForInput = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Format time for input (HH:MM)
    const formatTimeForInput = (date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const [date, setDate] = useState(formatDateForInput(initialStartDateTime));
    const [startTime, setStartTime] = useState(formatTimeForInput(initialStartDateTime));
    const [endTime, setEndTime] = useState(formatTimeForInput(initialEndDateTime));
    const [doctorId, setDoctorId] = useState(appointment.doctorId?._id || appointment.doctorId || "");
    const [patientId, setPatientId] = useState(appointment.patientId?._id || appointment.patientId || "");
    const [errors, setErrors] = useState({
        date: "",
        startTime: "",
        endTime: "",
        doctorId: "",
        patientId: ""
    });

    const users = props.users || [];
    const doctors = users.filter(user => user.role === "doctor");
    const patients = users.filter(user => user.role === "patient");

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({ date: "", startTime: "", endTime: "", doctorId: "", patientId: "" });

        try {
            // Combine date and time into DateTime objects
            const startDateTime = new Date(`${date}T${startTime}`);
            const endDateTime = new Date(`${date}T${endTime}`);

            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/api/appointments/${appointmentId}`, {
                method: "PUT",
                body: JSON.stringify({
                    startTime: startDateTime.toISOString(),
                    endTime: endDateTime.toISOString(),
                    doctorId,
                    patientId
                }),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await res.json();

            if (res.ok) {
                console.log("Appointment successfully updated!");
                window.location.reload();
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
            console.log("Update appointment error", err);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <DatePicker
                        value={date}
                        onChange={(dateValue) => setDate(dateValue)}
                        minDate={dayjs()}
                        format="YYYY-MM-DD"
                        style={{ width: '100%' }}
                    />
                    <div className="error">{errors.date}</div>
                </div>

                <div className="form-group">
                    <label htmlFor="startTime">Start Time</label>
                    <Select
                        id="startTime"
                        value={startTime}
                        onChange={(value) => setStartTime(value)}
                        options={timeOptions}
                        placeholder="Select start time"
                        style={{ width: '100%' }}
                    />
                    <div className="error">{errors.startTime}</div>
                </div>

                <div className="form-group">
                    <label htmlFor="endTime">End Time</label>
                    <Select
                        id="endTime"
                        value={endTime}
                        onChange={(value) => setEndTime(value)}
                        options={timeOptions}
                        placeholder="Select end time"
                        style={{ width: '100%' }}
                    />
                    <div className="error">{errors.endTime}</div>
                </div>

                <div className="form-group">
                    <label htmlFor="doctorId">Doctor</label>
                    <Select
                        id="doctorId"
                        value={doctorId}
                        onChange={(value) => setDoctorId(value)}
                        placeholder="Select doctor"
                        style={{ width: '100%' }}
                    >
                        {doctors.map(doctor => (
                            <Select.Option key={doctor._id} value={doctor.id}>
                                {doctor.firstName} {doctor.lastName}
                            </Select.Option>
                        ))}
                    </Select>
                    <div className="error">{errors.doctorId}</div>
                </div>

                <div className="form-group">
                    <label htmlFor="patientId">Patient</label>
                    <Select
                        id="patientId"
                        value={patientId}
                        onChange={(value) => setPatientId(value)}
                        placeholder="Select patient"
                        style={{ width: '100%' }}
                    >
                        {patients.map(patient => (
                            <Select.Option key={patient._id} value={patient.id}>
                                {patient.firstName} {patient.lastName}
                            </Select.Option>
                        ))}
                    </Select>
                    <div className="error">{errors.patientId}</div>
                </div>

                <button type="submit" className="sign-in-btn">
                    Update Appointment
                </button>
            </form>
        </>
    );
}

export default UpdateAppointmentForm;