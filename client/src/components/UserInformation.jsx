import { useState } from "react";
import { Modal } from "antd";
import UpdateUserForm from "./UpdateUserForm";
import DeleteUserForm from "./DeleteUserForm";

function UserInformation(props) {
    const user = props.user;
    const [openUpdate, setOpenUpdate] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    // In case user is undefined
    if (!user) {
        return <div>Loading user information...</div>;
    }

    // Handle open and closing update popup
    const handleUpdate = () => setOpenUpdate(true);
    const handleCloseUpdate = () => setOpenUpdate(false);

    // Handle open and closing delete popup
    const handleDelete = () => setOpenDelete(true);
    const handleCloseDelete = () => setOpenDelete(false);

    return (
        <>
            <div className="dashboard-info-row">
                <div>
                    Name: {user.firstName} {user.lastName}
                </div>
            </div>
            <div className="dashboard-info-row">
                <div>
                    Username: {user.username}
                </div>
            </div>
            <div className="dashboard-info-row">
                <div>
                    Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </div>
            </div>
            <div className="dashboard-info-row">
                <div>
                    Last Login: {user.lastLogin ? user.lastLogin : "N/A"}
                </div>
            </div>
            <div className="dashboard-info-row">
                <div>
                    Last Password Change: {user.lastPasswordChange ? user.lastPasswordChange : "N/A"}
                </div>
            </div>
            <div>
                <button onClick={handleUpdate}>Update User</button>
                <button onClick={handleDelete}>Delete User</button>
            </div>

            {/* Popup form for updating existing user */}
            <Modal
                title="Update User"
                open={openUpdate}
                onCancel={handleCloseUpdate}
                footer={null}
                centered
            >
                <UpdateUserForm closeModal={handleCloseUpdate} user={user} />
            </Modal>

            <Modal
                title="Delete User"
                open={openDelete}
                onCancel={handleCloseDelete}
                footer={null}
                centered
            >
                <DeleteUserForm closeModal={handleCloseDelete} user={user} />
            </Modal>
        </>
    )
}

export default UserInformation;