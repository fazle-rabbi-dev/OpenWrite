// script.js
document.addEventListener("DOMContentLoaded", function () {
  // alert('Script loaded!');
});

const createNoteBtn = document.querySelector("#createNoteBtn");
const createNoteModal = document.querySelector("#createNoteModal");
const createNoteModalCloseBtn = document.querySelector(
  "#createNoteModalCloseBtn"
);

const viewNoteBtn = document.querySelector("#viewNoteBtn");
const viewNoteModal = document.querySelector("#viewNoteModal");
const viewNoteModalCloseBtn = document.querySelector("#viewNoteModalCloseBtn");

const getNoteBtn = document.querySelector("#getNoteBtn");
const notePasswordInput = document.querySelector("#notePasswordInput");

const displayNote = document.querySelector("#displayNote");
const displayToast = document.querySelector("#displayToast");

createNoteBtn.addEventListener("click", function () {
  createNoteModal.classList.remove("hidden");
});

createNoteModalCloseBtn.addEventListener("click", function () {
  createNoteModal.classList.add("hidden");
});

/*viewNoteBtn.addEventListener("click", function(){
  viewNoteModal.classList.remove("hidden");
});*/

viewNoteModalCloseBtn.addEventListener("click", function () {
  viewNoteModal.classList.add("hidden");
});

let noteId;
document.addEventListener("DOMContentLoaded", function () {
  // Select all "view" buttons
  const viewNoteButtons = document.querySelectorAll("#viewNoteBtn");

  // Add a click event listener to each button
  viewNoteButtons.forEach(button => {
    button.addEventListener("click", function () {
      viewNoteModal.classList.remove("hidden");

      // Retrieve the note ID from the data attribute
      noteId = this.getAttribute("data-note-id");

      // Now you can use noteId as needed, e.g., log it or make an API call
      console.log("Note ID:", noteId);
    });
  });
});

getNoteBtn.addEventListener("click", async function () {
  // Make api call to get the note
  if(notePasswordInput.value.trim() === "") {
    return alert("Oops! enter your password.")
  }
  
  try {
    const response = await fetch(`/notes/${noteId}`, {
      method: "POST",
      body: JSON.stringify({
        password: notePasswordInput.value
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
    const jsonData = await response.json();
    if(jsonData.success) {
      displayToast.textContent = "🔓 Note unlocked successfully.";
      displayNote.textContent = jsonData.data.note;
    } else {
      displayToast.textContent = jsonData.error;
    }
  } catch (error) {
    console.log(error);
  }
});


