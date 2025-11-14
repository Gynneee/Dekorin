function calculate() {
  const p1_cm = +document.getElementById('p1').value || 0;
  const l1_cm = +document.getElementById('l1').value || 0;
  const p2_cm = +document.getElementById('p2').value || 0;
  const l2_cm = +document.getElementById('l2').value || 0;
  const ppintu_cm = +document.getElementById('ppintu').value || 0;
  const lpintu_cm = +document.getElementById('lpintu').value || 0;
  const pjendela_cm = +document.getElementById('pjendela').value || 0;
  const ljendela_cm = +document.getElementById('ljendela').value || 0;

  const p1 = p1_cm / 100;
  const l1 = l1_cm / 100;
  const p2 = p2_cm / 100;
  const l2 = l2_cm / 100;
  const ppintu = ppintu_cm / 100;
  const lpintu = lpintu_cm / 100;
  const pjendela = pjendela_cm / 100;
  const ljendela = ljendela_cm / 100;

  const areaDinding = (p1 * l1 + p2 * l2);
  const areaTidakDipakai = (ppintu * lpintu + pjendela * ljendela);
  const totalArea = areaDinding - areaTidakDipakai;
  
  const pricePerMeter = 60000;
  const totalPrice = totalArea * pricePerMeter;

  document.getElementById('totalArea').textContent = totalArea.toFixed(2) + ' m²';
  document.getElementById('totalPrice').textContent = 'Rp' + totalPrice.toLocaleString('id-ID');
}

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

  const openMenu = (menu) => {
    menu.classList.add('open');
    menuOverlay.classList.add('open');
    body.classList.add('no-scroll');
  };

  const closeAllMenus = () => {
    sideMenu.classList.remove('open');
    profileMenu.classList.remove('open');
    menuOverlay.classList.remove('open');
    body.classList.remove('no-scroll');
  };

  const showLogoutPopup = () => {
    logoutOverlay.classList.add('show');
    body.classList.add('no-scroll');
  };

  const hideLogoutPopup = () => {
    logoutOverlay.classList.remove('show');
    if (!sideMenu.classList.contains('open') && !profileMenu.classList.contains('open')) {
      body.classList.remove('no-scroll');
    }
  };

  menuBtn.addEventListener('click', () => {
    if (profileMenu.classList.contains('open')) closeAllMenus();
    openMenu(sideMenu);
  });

  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      if (sideMenu.classList.contains('open')) closeAllMenus();
      openMenu(profileMenu);
    });
  }

  closeMenuBtn.addEventListener('click', closeAllMenus);
  menuOverlay.addEventListener('click', closeAllMenus);
  calculateBtn.addEventListener('click', calculate);

  logoutLink.addEventListener('click', (e) => {
    e.preventDefault();
    closeAllMenus();
    showLogoutPopup();
  });

  confirmLogoutBtn.addEventListener('click', () => {
    hideLogoutPopup();
    console.log('User logged out');
  });

  cancelLogoutBtn.addEventListener('click', hideLogoutPopup);

  logoutOverlay.addEventListener('click', (e) => {
    if (e.target === logoutOverlay) hideLogoutPopup();
  });

  document.querySelectorAll('.has-sub > span').forEach(span => {
    span.addEventListener('click', () => {
      const parent = span.parentElement;
      parent.classList.toggle('active-sub');
    });
  });

  const currentPath = window.location.pathname.split('/').pop().replace('.html', '') || 'loggedin';
  
  document.querySelectorAll('.menu-list a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href !== '#') {
      const linkPath = href.split('/').pop().replace('.html', '');
      if (linkPath === currentPath) {
        const parentLi = link.closest('li');
        parentLi?.classList.add('active');
        
        const subMenu = parentLi?.closest('.sub-menu');
        if (subMenu) {
          subMenu.closest('.has-sub')?.classList.add('active-sub');
        }
      }
    }
  });
});