export async function changePasswordRequest(userId, currentPassword, newPassword) {
    if (!userId) throw new Error('Missing userId');

    const res = await fetch(`http://localhost:3000/users/${userId}/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
    });

    return res;
}
