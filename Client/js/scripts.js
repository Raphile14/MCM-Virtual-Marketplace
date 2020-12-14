var modal = document.getElementById("myModal");
var btn = document.getElementById("popUp");
var modalDelete = document.getElementById("myModalDelete");
var btnDelete = document.getElementById("popUpDelete");
var span = document.getElementsByClassName("close")[0];
btn.onclick = function() {

  modal.style.display = "block";
}
btnDelete.onclick = function() {

  modalDelete.style.display = "block";
}
span.onclick = function() {
  modal.style.display = "none";
  modalDelete.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
  if (event.target == modalDelete) {
    modalDelete.style.display = "none";
  }
}