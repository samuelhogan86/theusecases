export async function handleLogout() {
    try {
        await fetch("http://localhost:3000/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });

        localStorage.removeItem("token");
        localStorage.removeItem("userId");

        window.location.href = "/";
    } catch (err) {
        console.log("Logout error", err);
    }
}