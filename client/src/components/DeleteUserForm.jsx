function DeleteUserForm(props) {
    const user = props.user;
    const userId = user._id;
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
            <div>Are you sure you would like to delete {user.firstName} {user.lastName}?</div>
            <div>WARNING: This cannot be undone</div>
            <button onClick={handleSubmit}>Delete User</button>
            <button onClick={() => props.closeModal()}>Cancel</button>
        </>
    )
}

export default DeleteUserForm;