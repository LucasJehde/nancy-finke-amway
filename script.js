const AMWAY_KUNDEN_LINK = "#";
const AMWAY_GESCHAEFTSPARTNER_LINK = "#";

// Navigation Toggle
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navMenu.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      navMenu.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    });
  });
}

// CTA Links
document.querySelectorAll("[data-amway-customer]").forEach((link) => {
  link.setAttribute("href", AMWAY_KUNDEN_LINK);
});

document.querySelectorAll("[data-amway-partner]").forEach((link) => {
  link.setAttribute("href", AMWAY_GESCHAEFTSPARTNER_LINK);
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.13 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

// FAQ Accordion
document.querySelectorAll(".faq-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const answer = item.querySelector(".faq-answer");
    const isOpen = item.classList.contains("is-open");

    document.querySelectorAll(".faq-item.is-open").forEach((openItem) => {
      if (openItem !== item) {
        openItem.classList.remove("is-open");
        openItem.querySelector("button").setAttribute("aria-expanded", "false");
        openItem.querySelector(".faq-answer").style.maxHeight = null;
      }
    });

    item.classList.toggle("is-open", !isOpen);
    button.setAttribute("aria-expanded", String(!isOpen));
    answer.style.maxHeight = isOpen ? null : `${answer.scrollHeight}px`;
  });
});

// Contact Form
const contactForm = document.querySelector("[data-contact-form]");
const successMessage = document.querySelector("[data-success-message]");

function validateField(field) {
  const row = field.closest(".form-row");

  if (!row) {
    return field.checkValidity();
  }

  const isValid = field.checkValidity();
  row.classList.toggle("is-invalid", !isValid);
  return isValid;
}

if (contactForm) {
  contactForm.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.closest(".form-row")?.classList.contains("is-invalid")) {
        validateField(field);
      }
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const fields = Array.from(contactForm.querySelectorAll("input:not([type='checkbox']), select, textarea"));
    const fieldResults = fields.map((field) => validateField(field));
    const isFieldsValid = fieldResults.every(Boolean);
    const privacy = contactForm.querySelector("input[name='privacy']");
    const privacyError = contactForm.querySelector(".privacy-error");
    const isPrivacyValid = privacy?.checked === true;

    privacyError?.classList.toggle("is-visible", !isPrivacyValid);

    if (!isFieldsValid || !isPrivacyValid) {
      successMessage?.classList.remove("is-visible");
      return;
    }

    successMessage?.classList.add("is-visible");
    contactForm.reset();
    contactForm.querySelectorAll(".is-invalid").forEach((row) => row.classList.remove("is-invalid"));
    privacyError?.classList.remove("is-visible");
  });
}