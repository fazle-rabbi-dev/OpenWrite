// Select DOM elements
const elements = {
  createNoteBtn: document.querySelector("#createNoteBtn"),
  createNoteModal: document.querySelector("#createNoteModal"),
  createNoteModalCloseBtn: document.querySelector("#createNoteModalCloseBtn"),
  viewNoteModal: document.querySelector("#viewNoteModal"),
  viewNoteModalCloseBtn: document.querySelector("#viewNoteModalCloseBtn"),
  getNoteBtn: document.querySelector("#getNoteBtn"),
  notePasswordInput: document.querySelector("#notePasswordInput"),
  displayNote: document.querySelector("#displayNote"),
  displayToast: document.querySelector("#displayToast")
};

// Functions to show/hide modals
const toggleModal = (modal, show) => {
  modal.classList.toggle("hidden", !show);
};

// Event listeners for modal controls
elements.createNoteBtn.addEventListener("click", () => toggleModal(elements.createNoteModal, true));
elements.createNoteModalCloseBtn.addEventListener("click", () => toggleModal(elements.createNoteModal, false));
elements.viewNoteModalCloseBtn.addEventListener("click", () => toggleModal(elements.viewNoteModal, false));

// ╭────────────────────────────────────────────────────────╮
// │      Get note ID when the user clicks on the "View Note" icon
// ╰────────────────────────────────────────────────────────╯
let noteId;

document.addEventListener("DOMContentLoaded", () => {
  const viewNoteButtons = document.querySelectorAll("#viewNoteBtn");

  viewNoteButtons.forEach(button => {
    button.addEventListener("click", function () {
      toggleModal(elements.viewNoteModal, true);
      noteId = this.getAttribute("data-note-id");
    });
  });
});

// ╭────────────────────────────────────────────────────────╮
// │      Get password-protected note with the provided password
// ╰────────────────────────────────────────────────────────╯
elements.getNoteBtn.addEventListener("click", async () => {
  const password = elements.notePasswordInput.value.trim();
  
  if (!password) {
    return alert("Oops! Please enter your password.");
  }

  try {
    const response = await fetch(`/notes/${noteId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    const data = await response.json();

    if (data.success) {
      elements.displayToast.textContent = "🔓 Note unlocked successfully.";
      elements.displayNote.textContent = data.data.note_content;
    } else {
      elements.displayToast.textContent = data.error;
    }
  } catch (error) {
    console.error(error);
  }
});