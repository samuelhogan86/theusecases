function DeleteUserForm(props) {
    const user = props.user;
    const userId = user.id;
    // Handle delete
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3000/api/users/${userId}`, {
                method: "DELETE",
                headers: {
                        'Authorization': `Bearer ${token}`
                    }
            });

            const data = await res.json();

            if (res.ok) {
                console.log("User successfully deleted!");
                window.location.reload();
                // Close modal
                if (props.closeModal) props.closeModal();
            }
        } catch (err) {
            console.log("Delete user error", err);
        }
    }

    return (
        <>
            <div className="mb-1">Are you sure you would like to delete {user.firstName} {user.lastName}?</div>
            <div className="text-danger mb-3">WARNING! This action cannot be undone.</div>
            <div className="d-flex gap-2">
                <button className="btn btn-outline-danger" onClick={handleSubmit}>Delete User</button>
                <button className="btn btn-outline-secondary" onClick={() => props.closeModal()}>Cancel</button>
            </div>
        </>
    )
}

export default DeleteUserForm;