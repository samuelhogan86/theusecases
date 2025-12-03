import { useState, useEffect } from "react";
import { DatePicker, TimePicker, Select } from "antd";
import dayjs from "dayjs";
import { ArrowClockwise, X } from 'react-bootstrap-icons';

// Same as scheduling new appointment, except fields are not required and status can be updated
function UpdateAppointmentForm(props) {
    const appointment = props.appointment;
    const appointmentId = appointment.appointmentId;

    // Extract initial value from the appointment DateTime object
    const initialStartDateTime = dayjs(appointment.startTime);

    // Extract ID from appointment doctor/patient (could be full object or just ID string)
    const getIdFromUser = (user) => {
        if (!user) return "";
        if (typeof user === 'string') return user;
        return user.id || user._id || "";
    };

    const [date, setDate] = useState(initialStartDateTime.startOf("day"));
    const [startTime, setStartTime] = useState(initialStartDateTime.format('HH:mm'));
    const [doctorId, setDoctorId] = useState(getIdFromUser(appointment.doctorId));
    const [patientId, setPatientId] = useState(getIdFromUser(appointment.patientId));
    const [errors, setErrors] = useState({
        date: "",
        startTime: "",
        doctorId: "",
        patientId: ""
    });

    const users = props.users || [];
    const doctors = users.filter(user => user.role === "doctor");
    const patients = users.filter(user => user.role === "patient");

    // Update dates and times when different appointment is going to be updated 
    useEffect(() => {
        const start = dayjs(appointment.startTime);
        const end = dayjs(appointment.endTime);

        setDate(start.startOf("day"));
        setStartTime(start.format("HH:mm"));
        setDoctorId(getIdFromUser(appointment.doctorId));
        setPatientId(getIdFromUser(appointment.patientId));
    }, [appointment]);

    // Generate time options in 15-minute intervals from 8 AM to 6 PM
    const generateTimeOptions = () => {
        const options = [];
        for (let hour = 8; hour <= 18; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
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
        setErrors({ date: "", startTime: "", endTime: "", doctorId: "", patientId: "" });

        try {
            const [startHour, startMinute] = startTime.split(':');

            const startDateTime = dayjs(date)
                .hour(parseInt(startHour))
                .minute(parseInt(startMinute))
                .second(0)
                .toISOString();

            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/api/appointments/${appointmentId}`, {
                method: "PUT",
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
                console.log("Appointment successfully updated!");
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
            console.log("Update appointment error", err);
        }
    };

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
                        options={doctors.map(doctor => ({
                            label: `${doctor.firstName} ${doctor.lastName}`,
                            value: doctor.id
                        }))}
                    />
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
                        options={patients.map(patient => ({
                            label: `${patient.firstName} ${patient.lastName}`,
                            value: patient.id
                        }))}
                    />
                    <div className="error">{errors.patientId}</div>
                </div>

                <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-dark"><ArrowClockwise /> Update Appointment</button>
                    <button className="btn btn-outline-secondary" onClick={() => props.closeModal()}><X />Cancel</button>
                </div>
            </form>
        </>
    );
}

export default UpdateAppointmentForm;