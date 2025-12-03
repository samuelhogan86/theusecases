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
            <div>Are you sure you would like to delete this appointment?</div>
            <div>WARNING: This cannot be undone</div>
            <button onClick={handleSubmit}>Delete Appointment</button>
            <button onClick={() => props.closeModal()}>Cancel</button>
        </>
    )
}

export default DeleteAppointmentForm;