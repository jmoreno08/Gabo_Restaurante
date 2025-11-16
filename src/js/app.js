// ====================================================================
//                     1. VARIABLES Y SELECTORES
// ====================================================================

// Selectores del Menú Móvil
const hambtn = document.getElementById("hambtn");
const mobileMenu = document.getElementById("mobileMenu");
const closeBtn = document.getElementById("closeBtn");

// Selectores del Modal de Reservas
const reservasLink = document.querySelector('nav a[href="#reservas"]');
const reservasModal = document.getElementById('reservasModal');
const closeModalBtn = document.getElementById('closeModalBtn');

// Selectores de las Tarjetas de Ubicación
const locationCards = document.querySelectorAll('.location-card');


// ====================================================================
//                   2. FUNCIONES DE MANEJO (UI)
// ====================================================================

// --- Menú Móvil ---
function openMenu(){
    mobileMenu.style.display = "block";
    mobileMenu.setAttribute("aria-hidden","false");
    document.body.style.overflow = "hidden";
}
function closeMenu(){
    mobileMenu.style.display = "none";
    mobileMenu.setAttribute("aria-hidden","true");
    document.body.style.overflow = "";
}

// --- Modal de Reservas ---
function openReservasModal(e) {
    e.preventDefault(); 
    reservasModal.classList.add('active');
    reservasModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeReservasModal() {
    reservasModal.classList.remove('active');
    reservasModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    
    // Opcional: Deseleccionar todas las tarjetas al cerrar el modal
    locationCards.forEach(card => card.classList.remove('selected'));
}

// --- Selección de Tarjeta de Ubicación ---
function selectLocationCard(e) {
    // Busca la tarjeta (el elemento con la clase .location-card) que fue clicada
    const clickedCard = e.currentTarget; 

    // 1. Quitar la clase 'selected' de todas las tarjetas
    locationCards.forEach(card => {
        if (card !== clickedCard) {
            card.classList.remove('selected');
        }
    });

    // 2. Alternar (toggle) la clase 'selected' en la tarjeta clicada
    // Esto permite deseleccionar la tarjeta si se vuelve a hacer clic en ella.
    clickedCard.classList.toggle('selected');
}


// ====================================================================
//                    3. ASIGNACIÓN DE EVENTOS
// ====================================================================

// --- Menú Móvil ---
hambtn?.addEventListener("click", openMenu);
closeBtn?.addEventListener("click", closeMenu);

// --- Modal de Reservas (Apertura y Cierre) ---
reservasLink?.addEventListener('click', openReservasModal);
closeModalBtn?.addEventListener('click', closeReservasModal);

// --- Lógica de Selección de Tarjetas ---
locationCards.forEach(card => {
    card.addEventListener('click', selectLocationCard);
});

// --- Lógica de Accesibilidad para el Modal ---
reservasModal?.addEventListener('click', (e) => {
    // Si el clic se hizo directamente en el fondo del modal (el elemento reservasModal)
    if (e.target === reservasModal) {
        closeReservasModal();
    }
});

document.addEventListener('keydown', (e) => {
    // Si la tecla presionada es 'Escape' y el modal está abierto
    if (e.key === 'Escape' && reservasModal?.classList.contains('active')) {
        closeReservasModal();
    }
});


// --- Pie de Página (Footer) ---
document.getElementById('year').textContent = new Date().getFullYear();