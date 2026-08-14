/* =========================================
   CURSOR
========================================= */

const cursor = document.querySelector(".cursor");

if (cursor && window.matchMedia("(pointer: fine)").matches) {

  document.addEventListener("mousemove", (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });

  const interactiveElements = document.querySelectorAll(
    "a, button, .project-image"
  );

  interactiveElements.forEach((element) => {

    element.addEventListener("mouseenter", () => {
      cursor.classList.add("active");
    });

    element.addEventListener("mouseleave", () => {
      cursor.classList.remove("active");
    });

  });

} else if (cursor) {
  cursor.style.display = "none";
}


/* =========================================
   BACKGROUND PARALLAX
========================================= */

const blobs = document.querySelectorAll(".blob");

document.addEventListener("mousemove", (event) => {

  if (window.innerWidth < 800) return;

  const x = (event.clientX / window.innerWidth - 0.5) * 2;
  const y = (event.clientY / window.innerHeight - 0.5) * 2;

  blobs.forEach((blob, index) => {

    const intensity = (index + 1) * 12;

    blob.style.transform = `
      translate(
        ${x * intensity}px,
        ${y * intensity}px
      )
    `;

  });

});


/* =========================================
   SCROLL REVEAL
========================================= */

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {

    entries.forEach((entry) => {

      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }

    });

  },
  {
    threshold: 0.15
  }
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});


/* =========================================
   MOBILE MENU
========================================= */

const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");

if (menuButton && navLinks) {

  menuButton.addEventListener("click", () => {

    navLinks.classList.toggle("mobile-open");

  });

  navLinks.querySelectorAll("a").forEach((link) => {

    link.addEventListener("click", () => {
      navLinks.classList.remove("mobile-open");
    });

  });

}


/* =========================================
   CLOSE MENU WHEN RESIZING
========================================= */

window.addEventListener("resize", () => {

  if (window.innerWidth > 800) {
    navLinks?.classList.remove("mobile-open");
  }

});


/* =========================================
   MAGNETIC BUTTON EFFECT
========================================= */

const buttons = document.querySelectorAll(
  ".button, .circle-button, .nav-button"
);

buttons.forEach((button) => {

  button.addEventListener("mousemove", (event) => {

    if (window.innerWidth < 800) return;

    const rect = button.getBoundingClientRect();

    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    button.style.transform = `
      translate(
        ${x * 0.12}px,
        ${y * 0.12}px
      )
    `;

  });

  button.addEventListener("mouseleave", () => {

    button.style.transform = "";

  });

});


/* =========================================
   CURRENT YEAR
========================================= */

const year = document.querySelector(".footer-top span");

if (year) {
  year.textContent = `Rocío Lucas © ${new Date().getFullYear()}`;
}

/* =========================================
   ADAPTIVE NAVBAR
========================================= */

const navbar = document.querySelector(".navbar");

function getLuminance(r, g, b) {

  const colors = [r, g, b].map((color) => {
    color /= 255;

    return color <= 0.03928
      ? color / 12.92
      : Math.pow((color + 0.055) / 1.055, 2.4);
  });

  return (
    0.2126 * colors[0] +
    0.7152 * colors[1] +
    0.0722 * colors[2]
  );
}


function getColorAtPoint(x, y) {

  /*
   * Creamos un canvas temporal para obtener
   * información de color de fondos simples.
   */

  const element = document.elementFromPoint(x, y);

  if (!element) {
    return {
      r: 248,
      g: 247,
      b: 243
    };
  }

  let current = element;

  while (current && current !== document.body) {

    const style = window.getComputedStyle(current);

    /*
     * Primero buscamos un background-color real.
     */

    const backgroundColor = style.backgroundColor;

    if (
      backgroundColor &&
      backgroundColor !== "transparent" &&
      backgroundColor !== "rgba(0, 0, 0, 0)"
    ) {

      const match = backgroundColor.match(
        /rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/
      );

      if (match) {

        return {
          r: Number(match[1]),
          g: Number(match[2]),
          b: Number(match[3])
        };

      }
    }

    current = current.parentElement;
  }

  /*
   * Si no encontramos un color sólido,
   * usamos el fondo general de la página.
   */

  return {
    r: 248,
    g: 247,
    b: 243
  };
}


function updateNavbarColor() {

  if (!navbar) return;

  /*
   * Tomamos un punto justo debajo de la navbar.
   */

  const x = window.innerWidth / 2;
  const y = navbar.offsetHeight + 5;

  const color = getColorAtPoint(x, y);

  const luminance = getLuminance(
    color.r,
    color.g,
    color.b
  );

  /*
   * Cuanto menor sea la luminancia,
   * más oscuro es el fondo.
   */

  const isDark = luminance < 0.48;

  navbar.classList.toggle("light", isDark);

  /*
   * Fondo de seguridad al hacer scroll.
   */

  navbar.classList.toggle(
    "solid",
    window.scrollY > 40
  );
}


/* Actualizar al cargar */

updateNavbarColor();


/* Actualizar durante scroll */

window.addEventListener(
  "scroll",
  updateNavbarColor,
  { passive: true }
);


/* Actualizar al cambiar tamaño */

window.addEventListener(
  "resize",
  updateNavbarColor
);

