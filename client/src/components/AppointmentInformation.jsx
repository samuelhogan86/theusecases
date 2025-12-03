import { useState } from "react";
import { Modal } from "antd";
import UpdateAppointmentForm from "./UpdateAppointmentForm";
import DeleteAppointmentForm from "./DeleteAppointmentForm";

function AppointmentInformation(props) {
    const appointment = props.appointment;
    const users = props.users;
    const [openUpdate, setOpenUpdate] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    // In case appointment is undefined
    if (!appointment) {
        return <div>Loading appointment information...</div>;
    }

    // Extract date and time from DateTime objects
    const startDateTime = new Date(appointment.startTime);
    const endDateTime = new Date(appointment.endTime);
    
    const dateStr = startDateTime.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const startTimeStr = startDateTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
    
    const endTimeStr = endDateTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });

    // Handle open and closing update popup
    const handleUpdate = () => setOpenUpdate(true);
    const handleCloseUpdate = () => setOpenUpdate(false);

    // Handle open and closing delete popup
    const handleDelete = () => setOpenDelete(true);
    const handleCloseDelete = () => setOpenDelete(false);

    return (
        <>
            <div className="mb-3">
                <div>
                    <strong>Date:</strong> {dateStr}
                </div>
            </div>
            <div className="mb-3">
                <div>
                    <strong>Time:</strong> {startTimeStr} - {endTimeStr}
                </div>
            </div>
            <div className="mb-3">
                <div>
                    <strong>Doctor:</strong> {appointment.doctorId
                        ? `${appointment.doctorId.firstName} ${appointment.doctorId.lastName}`
                        : "Unknown"}
                </div>
            </div>
            <div className="mb-3">
                <div>
                    <strong>Patient:</strong> {appointment.patientId
                        ? `${appointment.patientId.firstName} ${appointment.patientId.lastName}`
                        : "Unknown"}
                </div>
            </div>
            <div className="mb-3">
                <div>
                    <strong>Status:</strong> {appointment.status 
                        ? appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)
                        : "Unknown"}
                </div>
            </div>
            <div className="d-flex gap-2">
                <button className="btn btn-dark" onClick={handleUpdate}>Update Appointment</button>
                <button className="btn btn-outline-danger" onClick={handleDelete}>Delete Appointment</button>
            </div>

            {/* Popup form for updating appointment */}
            <Modal
                title="Update Appointment"
                open={openUpdate}
                onCancel={handleCloseUpdate}
                footer={null}
                centered
            >
                <UpdateAppointmentForm 
                    closeModal={handleCloseUpdate} 
                    appointment={appointment}
                    users={users}
                />
            </Modal>

            {/* Popup form for deleting appointment */}
            <Modal
                title="Delete Appointment"
                open={openDelete}
                onCancel={handleCloseDelete}
                footer={null}
                centered
            >
                <DeleteAppointmentForm 
                    closeModal={handleCloseDelete} 
                    appointment={appointment}
                />
            </Modal>
        </>
    );
}

export default AppointmentInformation;