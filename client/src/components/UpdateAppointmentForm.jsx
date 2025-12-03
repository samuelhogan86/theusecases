import { useState, useEffect } from "react";
import { DatePicker, TimePicker, Select } from "antd";
import dayjs from "dayjs";

// Same as scheduling new appointment, except fields are not required and status can be updated
function UpdateAppointmentForm(props) {
    const appointment = props.appointment;
    const appointmentId = appointment.appointmentId;

    // Extract initial values from the appointment DateTime objects
    const initialStartDateTime = dayjs(appointment.startTime);
    const initialEndDateTime = dayjs(appointment.endTime);

    const [date, setDate] = useState(initialStartDateTime.startOf("day"));
    const [startTime, setStartTime] = useState(initialStartDateTime.format('HH:mm'));
    const [endTime, setEndTime] = useState(initialEndDateTime.format('HH:mm'));
    const [doctorId, setDoctorId] = useState(appointment.doctorId?._id || appointment.doctorId?.id || appointment.doctorId || "");
    const [patientId, setPatientId] = useState(appointment.patientId?._id || appointment.patientId?.id || appointment.patientId || "");
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

    // Update dates and times when different appointment is going to be updated 
    useEffect(() => {
        const start = dayjs(appointment.startTime);
        const end = dayjs(appointment.endTime);

        setDate(start.startOf("day"));
        setStartTime(start.format("HH:mm"));
        setEndTime(end.format("HH:mm"));
        setDoctorId(appointment.doctorId?._id || appointment.doctorId?.id || appointment.doctorId || "");
        setPatientId(appointment.patientId?._id || appointment.patientId?.id || appointment.patientId || "");
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
            const [endHour, endMinute] = endTime.split(':');

            const startDateTime = dayjs(date)
                .hour(parseInt(startHour))
                .minute(parseInt(startMinute))
                .second(0)
                .toISOString();

            const endDateTime = dayjs(date)
                .hour(parseInt(endHour))
                .minute(parseInt(endMinute))
                .second(0)
                .toISOString();

            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/api/appointments/${appointmentId}`, {
                method: "PUT",
                body: JSON.stringify({
                    startTime: startDateTime,
                    endTime: endDateTime,
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