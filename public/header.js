const userbtn = document.querySelector("#user-btn");
const dialog = document.querySelector("#dialog");

function closeDialog(e) {
    console.log(e.target)
    if (!dialog.contains(e.target)) {
        dialog.style.display = "none";
        document.removeEventListener("click", closeDialog);
    }
}

userbtn.addEventListener("click", (e) => {
    dialog.style.display = "flex";
    setTimeout(() => {
        document.addEventListener("click", closeDialog);
    }, 0);

});
