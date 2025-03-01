const userbtn = document.querySelector("#user-btn");
const userDialog = document.querySelector("#user-dialog");
// const notificationDialog = document.querySelector("notification-dialog");

function closeDialog(e) {
    if (!userDialog.contains(e.target) && !userbtn.contains(e.target)) {
        userDialog.style.display = "none";
        document.removeEventListener("click", closeDialog);
    }
}

userbtn.addEventListener("click", (e) => {
    userDialog.style.display = "flex";
    setTimeout(() => {
        document.addEventListener("click", closeDialog);
    }, 0);

});
