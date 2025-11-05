function DeleteUserForm(props) {
    const user = props.user;
    const userId = user.id;
    // Handle delete
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`http://localhost:3000/users/${userId}`, {
                method: "DELETE"
            });

            const data = await res.json();

            if (res.ok) {
                console.log("User successfully deleted!");
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