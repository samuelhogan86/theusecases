function DeleteAppointmentForm(props) {
    const appointment = props.appointment;
    const appointmentId = appointment._id;
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

}

export default DeleteAppointmentForm;