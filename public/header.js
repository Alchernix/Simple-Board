const userbtn = document.querySelectorAll(".user-btn");
const userDialog = document.querySelector("#user-dialog");
// const notificationDialog = document.querySelector("notification-dialog");

function closeDialog(e) {
    if (!userDialog.contains(e.target)
        && !userbtn[0].contains(e.target)
        && !userbtn[1].contains(e.target)) {
        userDialog.style.display = "none";
        document.removeEventListener("click", closeDialog);
    }
}

if (userbtn.length > 0) {
    userbtn[0].addEventListener("click", (e) => {
        userDialog.style.display = "flex";
        setTimeout(() => {
            document.addEventListener("click", closeDialog);
        }, 0);

    });

    userbtn[1].addEventListener("click", (e) => {
        userDialog.style.display = "flex";
        setTimeout(() => {
            document.addEventListener("click", closeDialog);
        }, 0);

    });
}

