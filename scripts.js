// scripts.js

document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const slider = document.querySelector(".slider");
  const slides = slider.querySelector(".slides");
  const testimonials = slider.querySelectorAll(".testimonial");
  const prevBtn = slider.querySelector(".slider-btn.prev");
  const nextBtn = slider.querySelector(".slider-btn.next");
  let currentIndex = 0;
  const totalSlides = testimonials.length;

  // Responsive nav toggle
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", !expanded);
    navMenu.classList.toggle("open");
  });

  // Close nav menu on link click (mobile)
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu.classList.contains("open")) {
        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", false);
      }
    });
  });

  // Testimonials slider
  function updateSlider(index) {
    slides.style.transform = `translateX(-${index * 100}%)`;
    testimonials.forEach((t, i) => {
      t.classList.toggle("active", i === index);
    });
  }

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlider(currentIndex);
  });

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlider(currentIndex);
  });

  // Auto-slide every 8 seconds
  let slideInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlider(currentIndex);
  }, 8000);

  // Pause on hover
  slider.addEventListener("mouseenter", () => clearInterval(slideInterval));
  slider.addEventListener("mouseleave", () => {
    slideInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateSlider(currentIndex);
    }, 8000);
  });

  updateSlider(currentIndex);

  // Modal elements (for admissions page)
  const contactPopup = document.getElementById("contactPopup");
  const openContactBtn = document.getElementById("openContactPopup");
  const closeContactBtn = contactPopup?.querySelector(".modal-close");
  const admissionForm = document.getElementById("admissionContactForm");
  const formStatus = document.getElementById("formStatus");

  if (openContactBtn && contactPopup && closeContactBtn && admissionForm) {
    openContactBtn.addEventListener("click", () => {
      contactPopup.setAttribute("aria-hidden", "false");
      // Focus first input in modal
      admissionForm.querySelector("input, textarea").focus();
      document.body.style.overflow = "hidden"; // prevent background scroll
    });

    closeContactBtn.addEventListener("click", closeModal);
    contactPopup.addEventListener("click", (e) => {
      if (e.target === contactPopup) closeModal();
    });

    function closeModal() {
      contactPopup.setAttribute("aria-hidden", "true");
      openContactBtn.focus();
      document.body.style.overflow = "";
      formStatus.textContent = "";
      admissionForm.reset();
    }

    admissionForm.addEventListener("submit", (e) => {
      e.preventDefault();
      formStatus.textContent = "";

      if (!admissionForm.checkValidity()) {
        formStatus.textContent = "Please fill in all required fields correctly.";
        formStatus.style.color = "red";
        return;
      }

      // Simulate sending message (replace with real backend call)
      formStatus.style.color = "green";
      formStatus.textContent = "Sending message...";
      setTimeout(() => {
        formStatus.textContent = "Message sent successfully! We will contact you soon.";
        admissionForm.reset();
      }, 1500);
    });
  }

  // General contact form on contact.html
  const generalForm = document.getElementById("generalContactForm");
  const generalFormStatus = document.getElementById("generalFormStatus");

  if (generalForm && generalFormStatus) {
    generalForm.addEventListener("submit", (e) => {
      e.preventDefault();
      generalFormStatus.textContent = "";

      if (!generalForm.checkValidity()) {
        generalFormStatus.textContent = "Please fill in all required fields correctly.";
        generalFormStatus.style.color = "red";
        return;
      }

      generalFormStatus.style.color = "green";
      generalFormStatus.textContent = "Sending message...";
      setTimeout(() => {
        generalFormStatus.textContent = "Message sent successfully! Thank you for contacting us.";
        generalForm.reset();
      }, 1500);
    });
  }
});
