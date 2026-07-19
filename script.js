const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
const servicesDropdown = document.querySelector('.nav-dropdown');
const servicesButton = document.querySelector('.services-toggle');

function closeServicesMenu() {
  if (!servicesDropdown || !servicesButton) return;
  servicesDropdown.classList.remove('open');
  servicesButton.setAttribute('aria-expanded', 'false');
}

function closeMenu() {
  closeServicesMenu();
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}

servicesButton?.addEventListener('click', (event) => {
  event.stopPropagation();
  const isOpen = servicesDropdown.classList.toggle('open');
  servicesButton.setAttribute('aria-expanded', String(isOpen));
});

document.addEventListener('click', (event) => {
  if (servicesDropdown && !servicesDropdown.contains(event.target)) closeServicesMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeServicesMenu();
});

menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('menu-open', isOpen);
});

navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) closeMenu();
});

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

document.querySelectorAll('.accordion details').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;

    document.querySelectorAll('.accordion details').forEach((otherItem) => {
      if (otherItem !== item) otherItem.removeAttribute('open');
    });
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();
