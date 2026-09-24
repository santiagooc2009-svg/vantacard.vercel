/* ============================================================
   VantaCard — Contacto
   Dos cosas: las revelaciones al hacer scroll (el mismo mecanismo que
   compromiso.js, para que las dos páginas secundarias se comporten
   igual) y el compositor de mensajes.

   El compositor existe porque el sitio es estático: no hay servidor
   que reciba un POST, así que un <form> normal no tiene a dónde
   mandar nada. En vez de simular un formulario que no envía —o de
   colgar el contacto de un servicio externo— los campos se arman
   como texto y el botón abre WhatsApp con el mensaje ya escrito.

   Consecuencia deliberada: el mensaje sale desde la cuenta de la
   persona. Ella conserva la conversación, y nosotros contestamos por
   donde ya contestamos todo lo demás del sitio.
   ============================================================ */

const WA_NUMBER = "525639317160";
const MAIL_TO = "a01739804@tec.mx";
const MAIL_SUBJECT = "Cotización VantaCard";

/* Arma el mensaje a partir de los campos. Cada línea se agrega solo
   si tiene contenido: un mensaje con "Cantidad:" vacío se lee como un
   formulario a medio llenar, no como algo que una persona escribió. */
function buildMessage(form) {
  const value = (name) => (form.elements[name]?.value || "").trim();

  const nombre = value("nombre");
  const interes = value("interes");
  const cantidad = value("cantidad");
  const mensaje = value("mensaje");

  const saludo = nombre
    ? `Hola VantaCard, soy ${nombre}.`
    : "Hola VantaCard.";

  const lineas = [`${saludo} Me interesa ${interes}.`];
  if (cantidad) lineas.push(`Cantidad aproximada: ${cantidad}.`);
  if (mensaje) lineas.push(mensaje);

  return lineas.join("\n");
}

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Compositor ---------- */
  const form = document.getElementById("composerForm");

  if (form) {
    const preview = document.getElementById("composerPreview");
    const mailLink = document.getElementById("composerMail");

    const refresh = () => {
      const texto = buildMessage(form);
      if (preview) preview.textContent = texto;
      if (mailLink) {
        mailLink.href =
          `mailto:${MAIL_TO}` +
          `?subject=${encodeURIComponent(MAIL_SUBJECT)}` +
          `&body=${encodeURIComponent(texto)}`;
      }
    };

    form.addEventListener("input", refresh);
    form.addEventListener("change", refresh);
    refresh();

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(buildMessage(form))}`;
      /* Pestaña nueva y no navegación: si la persona vuelve del
         chat, la página sigue como la dejó, con lo que escribió. */
      window.open(url, "_blank", "noopener");
    });
  }

  /* ---------- Movimiento ----------
     A partir de aquí es exactamente lo de compromiso.js. Si GSAP no
     cargó, el compositor de arriba ya quedó funcionando: lo que se
     pierde son las animaciones, no el contacto. */
  const nav = document.getElementById("nav");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (typeof gsap === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.create({
    trigger: ".contact-hero",
    start: "bottom top+=80",
    onEnter: () => nav.classList.add("nav--solid"),
    onLeaveBack: () => nav.classList.remove("nav--solid"),
  });

  // filter:none al terminar, no clearProps: limpiar el estilo inline
  // volvería a exponer el blur del CSS.
  const releaseFilter = function () {
    gsap.set(this.targets(), { filter: "none" });
  };
  const arrive = (extra) =>
    Object.assign(
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
      prefersReduced ? {} : { filter: "blur(0px)", onComplete: releaseFilter },
      extra
    );

  ScrollTrigger.batch(".reveal-up", {
    start: "top 88%",
    once: true,
    onEnter: (batch) => gsap.to(batch, arrive({ stagger: 0.08 })),
  });

  ScrollTrigger.batch(".reveal-group", {
    start: "top 88%",
    once: true,
    onEnter: (batch) => batch.forEach((el) => gsap.to(el.children, arrive({ stagger: 0.06 }))),
  });

  if (!prefersReduced) {
    document.querySelectorAll(".btn").forEach((btn) => {
      const moveX = gsap.quickTo(btn, "x", { duration: 0.35, ease: "power3.out" });
      const moveY = gsap.quickTo(btn, "y", { duration: 0.35, ease: "power3.out" });
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        moveX((e.clientX - r.left - r.width / 2) * 0.25);
        moveY((e.clientY - r.top - r.height / 2) * 0.3);
      });
      btn.addEventListener("pointerleave", () => {
        moveX(0);
        moveY(0);
      });
    });
  }
});
