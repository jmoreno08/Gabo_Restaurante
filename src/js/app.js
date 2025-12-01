// ====================================================================
//        1. VARIABLES Y SELECTORES
// ====================================================================

// Selectores del Menú Móvil
const hambtn = document.getElementById("hambtn");
const mobileMenu = document.getElementById("mobileMenu");
const closeBtn = document.getElementById("closeBtn");

// Selectores del Modal de Reservas
const reservasLink = document.querySelector('nav a[href="#reservas"]');
const reservasModal = document.getElementById("reservasModal");
const closeModalBtn = document.getElementById("closeModalBtn");

// Selectores de las Tarjetas de Ubicación
const locationCards = document.querySelectorAll(".location-card");

// Selectores del formulario de reservas
const reservationForm = document.getElementById("reservationForm");
const reservationFeedback = document.getElementById("reservationFeedback");
const reservationInputs = reservationForm ? Array.from(reservationForm.querySelectorAll("input")) : [];

// --- INICIO CÓDIGO NUEVO AGREGADO: SELECTORES BONOS DE REGALO ---
const giftcardLink = document.getElementById("openGiftcardModal");
const giftcardModal = document.getElementById("giftcardModal");
const closeGiftcardBtn = document.getElementById("closeGiftcardBtn");
const giftcardForm = document.getElementById("giftcardForm");
const giftcardFeedback = document.getElementById("giftcardFeedback");
const giftcardValueSelect = document.getElementById("giftcardValue");
const giftcardCustomWrapper = document.getElementById("customAmountWrapper");
const giftcardCustomAmount = document.getElementById("giftcardCustomAmount");
const giftcardDate = document.getElementById("giftcardDate");
const giftcardRecipientName = document.getElementById("giftcardRecipientName");
const giftcardRecipientEmail = document.getElementById("giftcardRecipientEmail");
const giftcardSenderName = document.getElementById("giftcardSenderName");
const giftcardSenderEmail = document.getElementById("giftcardSenderEmail");
const giftcardFields = giftcardForm
    ? Array.from(giftcardForm.querySelectorAll("input, select, textarea"))
    : [];
// --- FIN CÓDIGO NUEVO AGREGADO ---

// Selectores de la navegación interna de la carta (carta.html)
const categoryNav = document.querySelector(".menu-categorias");
const categoryLinks = categoryNav ? categoryNav.querySelectorAll("a") : [];
const headerNavLinks = document.querySelectorAll(".nav a, .mobile-menu nav a");

let categorySections = [];
if (categoryLinks.length) {
    categorySections = Array.from(categoryLinks)
        .map((link) => {
            const id = link.getAttribute("href")?.replace("#", "");
            const section = id ? document.getElementById(id) : null;
            return section;
        })
        .filter(Boolean);
}

// ====================================================================
//        2. FUNCIONES DE MANEJO (UI)
// ====================================================================

// --- Menú Móvil ---
function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.style.display = "block";
    mobileMenu.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}
function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.style.display = "none";
    mobileMenu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

// Exponer funciones para los onclick="" del HTML
if (typeof window !== "undefined") {
    window.closeMenu = closeMenu;
    window.openMenu = openMenu;
}

// --- Modal de Reservas ---
function openReservasModal(e) {
    if (!reservasModal) return;
    e.preventDefault();
    reservasModal.classList.add("active");
    reservasModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeReservasModal() {
    if (!reservasModal) return;
    reservasModal.classList.remove("active");
    reservasModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    // Deseleccionar tarjetas al cerrar
    locationCards.forEach((card) => card.classList.remove("selected"));
    reservationForm?.reset();
    reservationInputs.forEach((input) => flagReservationField(input, false));
    clearReservationFeedback();
}

// Validación del formulario de reservas y feedback
function setReservationFeedback(message, type = "error") {
    if (!reservationFeedback) return;
    reservationFeedback.textContent = message;
    reservationFeedback.classList.add("is-visible");
    reservationFeedback.classList.remove("is-error", "is-success");
    reservationFeedback.classList.add(type === "success" ? "is-success" : "is-error");
}

function clearReservationFeedback() {
    if (!reservationFeedback) return;
    reservationFeedback.textContent = "";
    reservationFeedback.classList.remove("is-visible", "is-error", "is-success");
}

function flagReservationField(input, hasError) {
    if (!input) return;
    if (hasError) {
        input.classList.add("input-invalid");
        input.setAttribute("aria-invalid", "true");
    } else {
        input.classList.remove("input-invalid");
        input.removeAttribute("aria-invalid");
    }
}

function validateReservationForm() {
    if (!reservationForm) return false;

    let isValid = true;
    const phonePattern = /^[0-9+()\\s-]{7,}$/;
    const requiredFields = [
        document.getElementById("reservationDate"),
        document.getElementById("reservationPeople"),
        document.getElementById("reservationTime"),
        document.getElementById("reservationEmail"),
        document.getElementById("reservationName"),
        document.getElementById("reservationPhone"),
    ];

    requiredFields.forEach((input) => {
        if (!input) return;

        const value = input.value.trim();
        let fieldValid = value !== "";

        if (input.type === "number") {
            const num = Number(value);
            fieldValid = fieldValid && !Number.isNaN(num) && num >= 1;
        }
        if (input.type === "email") {
            fieldValid = fieldValid && input.checkValidity();
        }
        if (input.type === "tel") {
            fieldValid = fieldValid && phonePattern.test(value);
        }

        flagReservationField(input, !fieldValid);
        if (!fieldValid) isValid = false;
    });

    return isValid;
}

function handleReservationSubmit(e) {
    e.preventDefault();

    clearReservationFeedback();
    const isValid = validateReservationForm();

    if (!isValid) {
        setReservationFeedback("Por favor completa los campos obligatorios antes de confirmar.", "error");
        return;
    }

    setReservationFeedback(
        "Su reserva se ha guardado y se confirmara por una notificacion de correo electronico.",
        "success"
    );

    reservationForm.reset();
    locationCards.forEach((card) => card.classList.remove("selected"));
}

// --- INICIO CÓDIGO NUEVO AGREGADO: FUNCIONES BONOS DE REGALO ---
function resetGiftcardForm(preserveFeedback = false) {
    if (!giftcardForm) return;

    giftcardForm.reset();
    giftcardFields.forEach((field) => flagGiftcardField(field, false));
    if (!preserveFeedback) {
        clearGiftcardFeedback();
    }
    toggleCustomAmountField();
}

function openGiftcardModal(e) {
    if (!giftcardModal) return;
    e.preventDefault();
    giftcardModal.classList.add("active");
    giftcardModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    toggleCustomAmountField();
}

function closeGiftcardModal() {
    if (!giftcardModal) return;
    giftcardModal.classList.remove("active");
    giftcardModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    resetGiftcardForm();
}

function setGiftcardFeedback(message, type = "error") {
    if (!giftcardFeedback) return;

    giftcardFeedback.textContent = message;
    giftcardFeedback.classList.add("is-visible");
    giftcardFeedback.classList.remove("is-error", "is-success");
    giftcardFeedback.classList.add(type === "success" ? "is-success" : "is-error");
}

function clearGiftcardFeedback() {
    if (!giftcardFeedback) return;

    giftcardFeedback.textContent = "";
    giftcardFeedback.classList.remove("is-visible", "is-error", "is-success");
}

function flagGiftcardField(field, hasError) {
    if (!field) return;

    if (hasError) {
        field.classList.add("input-invalid");
        field.setAttribute("aria-invalid", "true");
    } else {
        field.classList.remove("input-invalid");
        field.removeAttribute("aria-invalid");
    }
}

function toggleCustomAmountField() {
    if (!giftcardCustomWrapper) return;
    const showCustom = giftcardValueSelect?.value === "custom";

    giftcardCustomWrapper.classList.toggle("is-hidden", !showCustom);

    if (!showCustom && giftcardCustomAmount) {
        giftcardCustomAmount.value = "";
        flagGiftcardField(giftcardCustomAmount, false);
    }
}

function validateGiftcardForm() {
    if (!giftcardForm) return false;

    let isValid = true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const requiredFields = [
        giftcardValueSelect,
        giftcardDate,
        giftcardRecipientName,
        giftcardRecipientEmail,
        giftcardSenderName,
        giftcardSenderEmail,
    ];

    requiredFields.forEach((field) => {
        if (!field) return;

        const value = field.value.trim();
        let fieldValid = value !== "";

        if (field === giftcardDate && fieldValid) {
            const selectedDate = new Date(value);
            fieldValid = !Number.isNaN(selectedDate.getTime()) && selectedDate >= today;
        }

        if (field.type === "email") {
            fieldValid = fieldValid && field.checkValidity();
        }

        if (field.type === "text") {
            fieldValid = fieldValid && value.length >= 2;
        }

        flagGiftcardField(field, !fieldValid);
        if (!fieldValid) isValid = false;
    });

    if (giftcardValueSelect?.value === "custom") {
        const customValue = giftcardCustomAmount?.value.trim() || "";
        const numericValue = Number(customValue);
        const customValid =
            customValue !== "" &&
            !Number.isNaN(numericValue) &&
            numericValue >= Number(giftcardCustomAmount?.min || 0);

        flagGiftcardField(giftcardCustomAmount, !customValid);
        if (!customValid) isValid = false;
    }

    return isValid;
}

function handleGiftcardSubmit(e) {
    e.preventDefault();

    clearGiftcardFeedback();
    const isValid = validateGiftcardForm();

    if (!isValid) {
        setGiftcardFeedback("Completa los datos obligatorios para crear tu bono de regalo.", "error");
        return;
    }

    resetGiftcardForm(true);
    setGiftcardFeedback("Listo. Te enviaremos un enlace para finalizar el pago del bono.", "success");
}
// --- FIN C?DIGO NUEVO AGREGADO ---

// --- Selección de Tarjeta de Ubicación ---
function selectLocationCard(e) {
    const clickedCard = e.currentTarget;

    // Quitar 'selected' de todas
    locationCards.forEach((card) => {
        if (card !== clickedCard) {
            card.classList.remove("selected");
        }
    });

    // Alternar en la clicada
    clickedCard.classList.toggle("selected");
}

// --- Lógica de categoría activa en la carta ---

// resalta el link correspondiente a la sección visible
function setActiveCategoryOnScroll() {
    if (!categorySections.length) return;

    const offset = 140; // compensar header fijo / espacio superior
    const fromTop = window.scrollY + offset;

    let currentId = null;

    categorySections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const top = window.scrollY + rect.top;
        if (top <= fromTop) {
            currentId = section.id;
        }
    });

    if (!currentId) return;

    categoryLinks.forEach((link) => {
        const hrefId = link.getAttribute("href")?.replace("#", "");
        if (hrefId === currentId) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

// scroll suave al hacer click en categoría
function handleCategoryClick(e) {
    e.preventDefault();
    const href = this.getAttribute("href");
    if (!href || !href.startsWith("#")) return;

    const id = href.replace("#", "");
    const target = document.getElementById(id);
    if (!target) return;

    const offset = 120; // para que el título quede un poco más abajo del borde superior
    const top = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
        top,
        behavior: "smooth",
    });

    // Marcar activa inmediatamente al hacer click
    categoryLinks.forEach((link) => {
        link.classList.toggle("active", link === this);
    });
}

// --- Resaltado activo del navbar según la vista/anchor ---
function setHeaderActiveLink() {
    if (!headerNavLinks.length) return;

    const page = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    const hash = window.location.hash;

    let fallback = null;
    let applied = false;

    headerNavLinks.forEach((link) => {
        link.classList.remove("active");

        const href = link.getAttribute("href") || "";
        const [hrefPath, hrefHashPart] = href.split("#");
        const isHashOnly = href.startsWith("#");

        const targetPage = (isHashOnly ? page : hrefPath || page).toLowerCase();
        const targetHash = isHashOnly ? href : hrefHashPart ? `#${hrefHashPart}` : "";

        const samePage =
            targetPage === page || (targetPage === "" && page === "index.html");

        if (!samePage) return;

        if (hash && targetHash && hash === targetHash) {
            link.classList.add("active");
            applied = true;
        } else if (!hash && !fallback) {
            fallback = link;
        }
    });

    if (!applied && fallback) {
        fallback.classList.add("active");
    }
}

// ====================================================================
//        3. ASIGNACIÓN DE EVENTOS
// ====================================================================

// --- Menú Móvil ---
hambtn?.addEventListener("click", openMenu);
closeBtn?.addEventListener("click", closeMenu);

// --- Modal de Reservas (Apertura y Cierre) ---
reservasLink?.addEventListener("click", openReservasModal);
closeModalBtn?.addEventListener("click", closeReservasModal);

// --- Lógica de Selección de Tarjetas ---
locationCards.forEach((card) => {
    card.addEventListener("click", selectLocationCard);
});

// --- Eventos del formulario de reservas ---
if (reservationForm) {
    reservationForm.addEventListener("submit", handleReservationSubmit);
    reservationInputs.forEach((input) => {
        input.addEventListener("input", () => {
            flagReservationField(input, false);
            if (reservationFeedback?.classList.contains("is-error")) {
                clearReservationFeedback();
            }
        });
    });
}


if (giftcardForm) {
    giftcardForm.addEventListener("submit", handleGiftcardSubmit);

    giftcardValueSelect?.addEventListener("change", () => {
        toggleCustomAmountField();
        flagGiftcardField(giftcardValueSelect, false);
        if (giftcardFeedback?.classList.contains("is-error")) {
            clearGiftcardFeedback();
        }
    });

    giftcardFields.forEach((field) => {
        field.addEventListener("input", () => {
            flagGiftcardField(field, false);
            if (giftcardFeedback?.classList.contains("is-error")) {
                clearGiftcardFeedback();
            }
        });
    });

    toggleCustomAmountField();
}

// --- Cerrar modal de Reservas haciendo clic en el fondo ---
reservasModal?.addEventListener("click", (e) => {
    if (e.target === reservasModal) {
        closeReservasModal();
    }
});

// --- INICIO CÓDIGO NUEVO AGREGADO: ASIGNACIÓN DE EVENTOS BONOS DE REGALO ---
// Apertura
giftcardLink?.addEventListener("click", openGiftcardModal);
// Cierre por botón 'X'
closeGiftcardBtn?.addEventListener("click", closeGiftcardModal);
// Cierre por clic en el fondo
giftcardModal?.addEventListener("click", (e) => {
    if (e.target === giftcardModal) {
        closeGiftcardModal();
    }
});
// Cierre de ambos modales con Escape
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        if (reservasModal?.classList.contains("active")) {
            closeReservasModal();
        }
        if (giftcardModal?.classList.contains("active")) {
            closeGiftcardModal();
        }
    }
});
// --- FIN CÓDIGO NUEVO AGREGADO ---

// --- Pie de Página (Footer) ---
const yearSpan = document.getElementById("year");
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// --- Eventos para la carta (solo si existen categorías) ---
if (categoryLinks.length) {
    // click suave
    categoryLinks.forEach((link) => {
        link.addEventListener("click", handleCategoryClick);
    });

    // resaltar mientras se hace scroll
    window.addEventListener("scroll", setActiveCategoryOnScroll);
    window.addEventListener("load", setActiveCategoryOnScroll);
}

// --- Navbar: activar estado visual según ruta/hash ---
headerNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
        headerNavLinks.forEach((item) => item.classList.remove("active"));
        link.classList.add("active");
    });
});
window.addEventListener("hashchange", setHeaderActiveLink);
window.addEventListener("load", setHeaderActiveLink);
setHeaderActiveLink();
