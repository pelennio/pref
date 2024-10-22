// Helper function to wait for the element to be available
function waitForElement(id) {
  return new Promise((resolve) => {
    const checkExist = setInterval(() => {
      const element = document.getElementById(id);
      if (element) {
        clearInterval(checkExist);
        resolve(element);
      }
    }, 100); // Check every 100ms
  });
}
window.waitForElement = waitForElement;

async function loadModal(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");

    const modalContent = await response.text();
    // Assuming you have a way to display this modal content
    document.getElementById("modalContentMain").innerHTML =
      `<span class="close" onclick="closeModal()">&times;</span>` +
      modalContent;
    document.getElementById("modalContainerMain").style.display = "flex"; // Show modal

    // Return a promise that resolves when the modal is loaded
    return Promise.resolve();
  } catch (error) {
    console.error("Error loading modal:", error);
    return Promise.reject(error);
  }
}
window.loadModal = loadModal;

function closeModal() {
  document.getElementById("modalContainerMain").style.display = "none";
}
window.closeModal = closeModal;
