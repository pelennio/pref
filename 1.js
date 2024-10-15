// script.js
document.addEventListener("DOMContentLoaded", function () {
  const openModalBtn = document.getElementById("openModalBtn");
  const modal = document.getElementById("dynamicModal");
  const closeModal = document.querySelector(".close");
  const inputFieldsContainer = document.getElementById("inputFieldsContainer");
  const submitBtn = document.getElementById("submitBtn");

  // Variable value to determine number of input fields
  let numberOfInputs = 5; // You can change this value dynamically

  // Function to create input fields based on variable value
  function createInputFields(count) {
    inputFieldsContainer.innerHTML = ""; // Clear previous fields
    for (let i = 0; i < count; i++) {
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = `Input ${i + 1}`;
      input.className = "input-field";
      inputFieldsContainer.appendChild(input);
    }
  }

  // Open modal and create input fields
  openModalBtn.onclick = function () {
    createInputFields(numberOfInputs);
    modal.style.display = "block";
  };

  // Close modal when the user clicks on <span> (x)
  closeModal.onclick = function () {
    modal.style.display = "none";
  };

  // Close modal when clicking outside of the modal content
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };

  // Handle the submit button click
  submitBtn.onclick = function () {
    const inputs = document.querySelectorAll(".input-field");
    inputs.forEach((input, index) => {
      console.log(`Input ${index + 1}: ${input.value}`);
    });
    modal.style.display = "none"; // Close modal after submission
  };
});
