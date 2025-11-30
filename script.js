// Menú móvil
const navToggle = document.getElementById("nav-toggle");
const nav = document.getElementById("nav");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    nav.classList.toggle("nav-open");
  });
}

// Cerrar menú al hacer clic en un enlace (móvil)
document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("nav-open");
  });
});

// Año dinámico en el footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Botón "Volver arriba"
const backToTop = document.getElementById("back-to-top");
if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Simulación envío de formulario (sin backend)
const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Aquí podrías integrar un servicio real como Formspree o EmailJS
    statusEl.textContent = "Gracias por tu mensaje. ¡Te responderé pronto!";
    form.reset();

    setTimeout(() => {
      statusEl.textContent = "";
    }, 4000);
  });
}

// ================= GAUGES DE HABILIDADES =================

const gauges = document.querySelectorAll(".gauge");

if (gauges.length) {
  gauges.forEach((gauge) => {
    const target = parseInt(gauge.dataset.value, 10) || 0;
    const percentageEl = gauge.querySelector(".gauge-percentage");

    // Animación inicial: de 0 al valor objetivo
    let started = false;

    const startAnimation = () => {
      if (started) return;
      started = true;

      const duration = 1200; // ms
      const startTime = performance.now();

      const animateToTarget = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easing suave
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentValue = target * eased;

        gauge.style.setProperty("--gauge-value", currentValue);
        if (percentageEl) {
          percentageEl.textContent = Math.round(currentValue) + "%";
        }

        if (progress < 1) {
          requestAnimationFrame(animateToTarget);
        } else {
          // cuando llega al valor, empieza oscilación
          startOscillation(gauge, target, percentageEl);
        }
      };

      requestAnimationFrame(animateToTarget);
    };

    // Lanzar animación cuando la página está lista
    if (document.readyState === "complete") {
      startAnimation();
    } else {
      window.addEventListener("load", startAnimation);
    }
  });

  function startOscillation(gauge, target, percentageEl) {
    const amplitude = 2; // +/- 2%
    const speed = 2; // velocidad de oscilación

    const t0 = performance.now();

    const tick = (now) => {
      const t = (now - t0) / 1000; // segundos
      const offset = Math.sin(t * speed) * amplitude;
      const value = target + offset;

      gauge.style.setProperty("--gauge-value", value);
      if (percentageEl) {
        percentageEl.textContent = Math.round(value) + "%";
      }

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }
}

// =============== ROTACIÓN DE PALABRAS EN EL HERO ===============

const heroRotator = document.getElementById("hero-rotator");

if (heroRotator) {
  const words = [
    "Jesús",
    "Desarrollador Web",
    "Creativo",
    "Proactivo",
    "Emprendedor",
  ];

  // Ajustar el ancho mínimo al de la palabra más larga
  const longest = words.reduce((max, word) => Math.max(max, word.length), 0);
  heroRotator.style.minWidth = `${longest + 2}ch`;

  let currentIndex = 0;
  let currentSpan = heroRotator.querySelector(".hero-word");

  const ANIM_DURATION = 900; // ms (debe coincidir con la transición CSS ~0.9s)
  const DELAY_BETWEEN = 3000; // tiempo entre palabras

  const rotate = () => {
    const nextIndex = (currentIndex + 1) % words.length;

    // span nuevo que entra desde ARRIBA
    const newSpan = document.createElement("span");
    newSpan.className = "hero-word hero-word--enter";
    newSpan.textContent = words[nextIndex];
    heroRotator.appendChild(newSpan);

    // siguiente frame: activamos la transición
    requestAnimationFrame(() => {
      if (currentSpan) {
        currentSpan.classList.add("hero-word--leave");
      }
      newSpan.classList.remove("hero-word--enter");
    });

    // cuando ha pasado la duración de la animación, limpiamos y programamos la siguiente
    setTimeout(() => {
      if (currentSpan && currentSpan.parentNode === heroRotator) {
        heroRotator.removeChild(currentSpan);
      }

      currentSpan = newSpan;
      currentIndex = nextIndex;

      // esperar un rato antes del siguiente cambio
      setTimeout(rotate, DELAY_BETWEEN);
    }, ANIM_DURATION + 60); // pequeño margen por seguridad
  };

  // pequeño delay inicial para que no cambie nada más cargar
  setTimeout(() => {
    rotate();
  }, 1500);
}
