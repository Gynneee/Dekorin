// Calculate function
function calculate() {
  const p1 = +document.getElementById('p1').value || 0;
  const l1 = +document.getElementById('l1').value || 0;
  const p2 = +document.getElementById('p2').value || 0;
  const l2 = +document.getElementById('l2').value || 0;
  const ppintu = +document.getElementById('ppintu').value || 0;
  const lpintu = +document.getElementById('lpintu').value || 0;
  const pjendela = +document.getElementById('pjendela').value || 0;
  const ljendela = +document.getElementById('ljendela').value || 0;

  const areaDinding = (p1 * l1 + p2 * l2);
  const areaTidakDipakai = (ppintu * lpintu + pjendela * ljendela);
  const totalArea = areaDinding - areaTidakDipakai;
  const pricePerMeter = 60000;
  const totalPrice = totalArea * pricePerMeter;

  document.getElementById('totalArea').textContent = totalArea.toFixed(2) + ' m²';
  document.getElementById('totalPrice').textContent = 'Rp' + totalPrice.toLocaleString('id-ID');
}

// Menu functionality
document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const menuBtn = document.getElementById('menuBtn');
  const profileBtn = document.getElementById('profileBtn');
  const sideMenu = document.getElementById('sideMenu');
  const profileMenu = document.getElementById('profileMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  const closeMenuBtn = document.getElementById('closeMenu');
  const calculateBtn = document.getElementById('calculateBtn');
  const logoutLink = document.getElementById('logoutLink');
  const logoutOverlay = document.getElementById('logoutOverlay');
  const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');
  const cancelLogoutBtn = document.getElementById('cancelLogoutBtn');

  // Open menu helper
  const openMenu = (menu) => {
    menu.classList.add('open');
    menuOverlay.classList.add('open');
    body.classList.add('no-scroll');
  };

  // Close all menus helper
  const closeAllMenus = () => {
    sideMenu.classList.remove('open');
    profileMenu.classList.remove('open');
    menuOverlay.classList.remove('open');
    body.classList.remove('no-scroll');
  };

  // Show logout popup
  const showLogoutPopup = () => {
    logoutOverlay.classList.add('show');
    body.classList.add('no-scroll');
  };

  // Hide logout popup
  const hideLogoutPopup = () => {
    logoutOverlay.classList.remove('show');
    if (!sideMenu.classList.contains('open') && !profileMenu.classList.contains('open')) {
      body.classList.remove('no-scroll');
    }
  };

  // Menu button click
  menuBtn.addEventListener('click', () => {
    if (profileMenu.classList.contains('open')) closeAllMenus();
    openMenu(sideMenu);
  });

  // Profile button click
  if (profileBtn) { // <-- ADD THIS CHECK
    profileBtn.addEventListener('click', () => {
      if (sideMenu.classList.contains('open')) closeAllMenus();
      openMenu(profileMenu);
    });
  }

  // Close menu button
  closeMenuBtn.addEventListener('click', closeAllMenus);

  // Menu overlay click
  menuOverlay.addEventListener('click', closeAllMenus);

  // Calculate button
  calculateBtn.addEventListener('click', calculate);

  // Logout link
  logoutLink.addEventListener('click', (e) => {
    e.preventDefault();
    closeAllMenus();
    showLogoutPopup();
  });

  // Confirm logout
  confirmLogoutBtn.addEventListener('click', () => {
    hideLogoutPopup();
    console.log('User logged out');
    // Add your logout logic here
    // window.location.href = 'login.html';
  });

  // Cancel logout
  cancelLogoutBtn.addEventListener('click', hideLogoutPopup);

  // Click outside popup to close
  logoutOverlay.addEventListener('click', (e) => {
    if (e.target === logoutOverlay) hideLogoutPopup();
  });

  // Sub-menu toggle
  document.querySelectorAll('.has-sub > span').forEach(span => {
    span.addEventListener('click', () => {
      const parent = span.parentElement;
      parent.classList.toggle('active-sub');
    });
  });

  // Active menu item highlighting
  const currentPath = window.location.pathname.split('/').pop().replace('.html', '') || 'loggedin';
  
  document.querySelectorAll('.menu-list a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href !== '#') {
      const linkPath = href.split('/').pop().replace('.html', '');
      if (linkPath === currentPath) {
        const parentLi = link.closest('li');
        parentLi?.classList.add('active');
        
        // If it's in a submenu, expand the parent
        const subMenu = parentLi?.closest('.sub-menu');
        if (subMenu) {
          subMenu.closest('.has-sub')?.classList.add('active-sub');
        }
      }
    }
  });
});