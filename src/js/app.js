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

// --- INICIO CÓDIGO NUEVO AGREGADO: SELECTORES BONOS DE REGALO ---
const giftcardLink = document.getElementById("openGiftcardModal");
const giftcardModal = document.getElementById("giftcardModal");
const closeGiftcardBtn = document.getElementById("closeGiftcardBtn");
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
}

// --- INICIO CÓDIGO NUEVO AGREGADO: FUNCIONES BONOS DE REGALO ---
function openGiftcardModal(e) {
    if (!giftcardModal) return;
    e.preventDefault();
    giftcardModal.classList.add("active");
    giftcardModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeGiftcardModal() {
    if (!giftcardModal) return;
    giftcardModal.classList.remove("active");
    giftcardModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}
// --- FIN CÓDIGO NUEVO AGREGADO ---

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
