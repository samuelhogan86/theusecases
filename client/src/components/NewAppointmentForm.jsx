import { useState, useEffect } from "react"
import { DatePicker, TimePicker, Select } from "antd";
import dayjs from "dayjs";

function NewAppointmentForm(props) {
    const [date, setDate] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [doctorId, setDoctorId] = useState("");
    const [patientId, setPatientId] = useState("");
    const [errors, setErrors] = useState(
        { date: "", startTime: "", endTime: "", doctorId: "", patientId: "" }
    );
    const users = props.users;
    const doctors = users.filter(user => user.role === "doctor");
    const patients = users.filter(user => user.role === "patient");

    // Generate time options in 30-minute intervals from 8 AM to 6 PM
    const generateTimeOptions = () => {
        const options = [];
        for (let hour = 8; hour <= 18; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                if (hour === 18 && minute > 0) break; // Stop at 6 PM
                const time = dayjs().hour(hour).minute(minute).second(0);
                options.push({
                    label: time.format('h:mm A'),
                    value: time.format('HH:mm')
                });
            }
        }
        return options;
    }

    const timeOptions = generateTimeOptions();

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({ date: "", startTime: "", doctorId: "", patientId: "" });

        // Handle errors and stop submission if necessary
        const newErrors = {};
        if (!date) newErrors.date = "Date is required";
        if (!startTime) newErrors.startTime = "Start time is required";
        if (!doctorId) newErrors.doctorId = "Doctor is required";
        if (!patientId) newErrors.patientId = "Patient is required";

        // If any errors exist, stop submission
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Combine date and time to create DateTime objects
        const [startHour, startMinute] = startTime.split(':');
        const startDateTime = dayjs(date)
            .hour(parseInt(startHour))
            .minute(parseInt(startMinute))
            .second(0)
            .toISOString();

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:3000/api/appointments", {
                method: "POST",
                body: JSON.stringify({
                    startTime: startDateTime,
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
                console.log("Appointment successfully scheduled!");
                window.location.reload();
                // Close modal
                if (props.closeModal) props.closeModal();
            } else {
                setErrors({
                    date: data.errors?.date || "",
                    startTime: data.errors?.startTime || "",
                    doctorId: data.errors?.doctorId || "",
                    patientId: data.errors?.patientId || ""
                });
            }
        } catch (err) {
            console.log("Schedule appointment error", err);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
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

                <div className="mb-3">
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

                <div className="mb-3">
                    <label htmlFor="doctorId">Doctor</label>
                    <Select
                        id="doctorId"
                        value={doctorId}
                        onChange={(value) => setDoctorId(value)}
                        placeholder="Select doctor"
                        style={{ width: '100%' }}
                    >
                        {doctors.map(doctor => (
                            <Select.Option key={doctor.id} value={doctor.id}>
                                {doctor.firstName} {doctor.lastName}
                            </Select.Option>
                        ))}
                    </Select>
                    <div className="error">{errors.doctorId}</div>
                </div>

                <div className="mb-3">
                    <label htmlFor="patientId">Patient</label>
                    <Select
                        id="patientId"
                        value={patientId}
                        onChange={(value) => setPatientId(value)}
                        placeholder="Select patient"
                        style={{ width: '100%' }}
                    >
                        {patients.map(patient => (
                            <Select.Option key={patient.id} value={patient.id}>
                                {patient.firstName} {patient.lastName}
                            </Select.Option>
                        ))}
                    </Select>
                    <div className="error">{errors.patientId}</div>
                </div>

                <button type="submit" className="btn btn-success">
                    Schedule Appointment
                </button>
            </form>
        </>
    )
}

export default NewAppointmentForm;