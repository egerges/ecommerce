// Script to open and close sidebar
function w3_open() {
    //document.getElementById("mySidebar").style.display = "block";
    document.getElementById("mySidebar").classList.add("animate-sidebar-show");
    document.getElementById("mySidebar").classList.remove("animate-sidebar-hide");
    document.getElementById("myOverlay").style.display = "block";
}

function w3_close() {
    //document.getElementById("mySidebar").style.display = "none";
    document.getElementById("mySidebar").classList.remove("animate-sidebar-show");
    document.getElementById("mySidebar").classList.add("animate-sidebar-hide");
    document.getElementById("myOverlay").style.display = "none";
}