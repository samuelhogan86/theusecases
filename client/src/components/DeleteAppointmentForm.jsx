function DeleteAppointmentForm(props) {
    const appointment = props.appointment;
    const appointmentId = appointment.appointmentId;
    // Handle delete
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3000/api/appointments/${appointmentId}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await res.json();

            if (res.ok) {
                console.log("Appointment successfully deleted!");
                window.location.reload();
                // Close modal
                if (props.closeModal) props.closeModal();
            }
        } catch (err) {
            console.log("Delete appointment error", err);
        }
    }

    return (
        <>
            <div className="mb-1">Are you sure you would like to delete this appointment?</div>
            <div className="text-danger mb-3">WARNING: This cannot be undone</div>
            <div className="d-flex gap-2">
                <button className="btn btn-outline-danger" onClick={handleSubmit}>Delete Appointment</button>
                <button className="btn btn-outline-secondary" onClick={() => props.closeModal()}>Cancel</button>
            </div>
        </>
    )
}

export default DeleteAppointmentForm;