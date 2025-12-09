// gallery-scripts.js
document.addEventListener("DOMContentLoaded", () => {
  const galleryGrid = document.getElementById("galleryGrid");
  const uploadInput = document.getElementById("uploadInput");
  const imageModal = document.getElementById("imageModal");
  const modalCloseBtn = imageModal.querySelector(".modal-close");
  const modalImage = document.getElementById("modalImage");
  const captionInput = document.getElementById("captionInput");
  const saveCaptionBtn = document.getElementById("saveCaptionBtn");
  const deleteImageBtn = document.getElementById("deleteImageBtn");

  // Load saved gallery from localStorage or initialize with placeholders
  let gallery = JSON.parse(localStorage.getItem("schoolGallery")) || [
    { src: "https://via.placeholder.com/300x200?text=Event+1", caption: "Event 1" },
    { src: "https://via.placeholder.com/300x200?text=Event+2", caption: "Event 2" },
    { src: "https://via.placeholder.com/300x200?text=Event+3", caption: "Event 3" },
    { src: "https://via.placeholder.com/300x200?text=Event+4", caption: "Event 4" },
    { src: "https://via.placeholder.com/300x200?text=Event+5", caption: "Event 5" },
    { src: "https://via.placeholder.com/300x200?text=Event+6", caption: "Event 6" },
  ];

  let currentEditIndex = null;

  function saveGallery() {
    localStorage.setItem("schoolGallery", JSON.stringify(gallery));
  }

  function renderGallery() {
    galleryGrid.innerHTML = "";
    gallery.forEach(({ src, caption }, index) => {
      const item = document.createElement("div");
      item.className = "gallery-item";
      item.tabIndex = 0;
      item.setAttribute("aria-label", caption ? `Photo: ${caption}` : "Photo without caption");

      const img = document.createElement("img");
      img.src = src;
      img.alt = caption || "Gallery photo";
      img.tabIndex = -1;

      const editControls = document.createElement("div");
      editControls.className = "edit-controls";

      const editBtn = document.createElement("button");
      editBtn.className = "edit-btn";
      editBtn.textContent = "Edit";
      editBtn.title = "Edit caption or delete image";
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openModal(index);
      });

      editControls.appendChild(editBtn);
      item.appendChild(img);
      item.appendChild(editControls);

      // Open modal on image or container click
      item.addEventListener("click", () => openModal(index));
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal(index);
        }
      });

      galleryGrid.appendChild(item);
    });
  }

  function openModal(index) {
    currentEditIndex = index;
    const { src, caption } = gallery[index];
    modalImage.src = src;
    modalImage.alt = caption || "Gallery photo preview";
    captionInput.value = caption || "";
    imageModal.setAttribute("aria-hidden", "false");
    captionInput.focus();
    document.body.style.overflow = "hidden"; // Prevent background scroll
  }

  function closeModal() {
    imageModal.setAttribute("aria-hidden", "true");
    modalImage.src = "";
    captionInput.value = "";
    currentEditIndex = null;
    document.body.style.overflow = "";
  }

  modalCloseBtn.addEventListener("click", closeModal);
  imageModal.addEventListener("click", (e) => {
    if (e.target === imageModal) closeModal();
  });

  saveCaptionBtn.addEventListener("click", () => {
    if (currentEditIndex !== null) {
      gallery[currentEditIndex].caption = captionInput.value.trim();
      saveGallery();
      renderGallery();
      closeModal();
    }
  });

  deleteImageBtn.addEventListener("click", () => {
    if (currentEditIndex !== null) {
      if (confirm("Are you sure you want to delete this photo?")) {
        gallery.splice(currentEditIndex, 1);
        saveGallery();
        renderGallery();
        closeModal();
      }
    }
  });

  uploadInput.addEventListener("change", (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        gallery.push({ src: e.target.result, caption: "" });
        saveGallery();
        renderGallery();
      };
      reader.readAsDataURL(file);
    });

    uploadInput.value = ""; // reset input
  });

  // Drag & drop support on upload form
  const uploadForm = document.getElementById("uploadForm");
  uploadForm.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadForm.style.borderColor = "var(--primary-color)";
  });
  uploadForm.addEventListener("dragleave", (e) => {
    e.preventDefault();
    uploadForm.style.borderColor = "#ccc";
  });
  uploadForm.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadForm.style.borderColor = "#ccc";
    const droppedFiles = Array.from(e.dataTransfer.files);
    droppedFiles.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        gallery.push({ src: ev.target.result, caption: "" });
        saveGallery();
        renderGallery();
      };
      reader.readAsDataURL(file);
    });
  });

  renderGallery();
});