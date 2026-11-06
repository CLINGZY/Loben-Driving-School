const form = document.querySelector("#form");
const modal = document.querySelector("#whatsapp-modal");
const messagePreview = document.querySelector("#message-preview");
const closeButton = document.querySelector("#modal-close");
const cancelButton = document.querySelector("#modal-cancel");
const continueButton = document.querySelector("#modal-continue");

let pendingMessage = "";
let lastFocusedElement = null;

const whatsappNumber = "2349070081056";

function openModal(message) {
  pendingMessage = message;
  messagePreview.textContent = message;
  lastFocusedElement = document.activeElement;
  modal.hidden = false;
  document.body.classList.add("modal-open");
  closeButton.focus();
}

function closeModal() {
  modal.hidden = true;
  document.body.classList.remove("modal-open");
  pendingMessage = "";
  if (lastFocusedElement) lastFocusedElement.focus();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.reportValidity()) return;

  const formData = new FormData(form);
  const name = String(formData.get("name") || "").trim();
  const level = String(formData.get("level") || "").trim();

  pendingMessage = [
    "Hello Loben Driving School,",
    "",
    `My name is ${name}.`,
    `Where I'm starting from: ${level}.`,
    "",
    "I'd like to know more about the available training options, requirements and how to get started."
  ].join("\n");

  openModal(pendingMessage);
});

closeButton.addEventListener("click", closeModal);
cancelButton.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (modal.hidden) return;
  if (event.key === "Escape") closeModal();

  // Keep keyboard focus inside the open dialog.
  if (event.key === "Tab") {
    const focusable = [...modal.querySelectorAll("button")].filter(el => !el.disabled);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  }
});

continueButton.addEventListener("click", () => {
  if (!pendingMessage) return;
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(pendingMessage)}`;
  window.open(url, "_blank", "noopener,noreferrer");
  closeModal();
});
