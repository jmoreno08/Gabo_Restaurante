  const hambtn = document.getElementById("hambtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const closeBtn = document.getElementById("closeBtn");

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
  hambtn?.addEventListener("click", openMenu);
  closeBtn?.addEventListener("click", closeMenu);

  // Año dinámico en el footer
  document.getElementById('year').textContent = new Date().getFullYear();