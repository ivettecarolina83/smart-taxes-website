

const brandIntro = document.querySelector('.brand-intro');
const introSkipButton = document.querySelector('.intro-skip');

if (brandIntro) {
  const finishBrandIntro = () => {
    brandIntro.classList.add('is-finished');
    document.body.classList.remove('intro-active');
  };

  const skipIntroOnLoad = new URLSearchParams(window.location.search).get('skip-intro') === '1';

  if (skipIntroOnLoad) {
    finishBrandIntro();
  } else {
    introSkipButton?.addEventListener('click', () => {
      brandIntro.classList.add('is-skipping');
      window.setTimeout(finishBrandIntro, 320);
    });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.setTimeout(finishBrandIntro, 350);
    } else {
      brandIntro.addEventListener('animationend', (event) => {
        if (event.animationName === 'intro-overlay-out') finishBrandIntro();
      });
      window.setTimeout(finishBrandIntro, 6200);
    }
  }
}
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


const carousel = document.querySelector('.hero-carousel');

if (carousel) {
  const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
  const dots = Array.from(carousel.querySelectorAll('.carousel-dot'));
  const previousButton = carousel.querySelector('.carousel-prev');
  const nextButton = carousel.querySelector('.carousel-next');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let currentSlide = 0;
  let autoplayTimer;
  let isPaused = prefersReducedMotion;
  let touchStartX = 0;

  function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('active', slideIndex === currentSlide);
    });

    dots.forEach((dot, dotIndex) => {
      const isCurrent = dotIndex === currentSlide;
      dot.classList.toggle('active', isCurrent);
      if (isCurrent) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }

  function stopAutoplay() {
    window.clearInterval(autoplayTimer);
  }

  function startAutoplay() {
    stopAutoplay();
    if (!isPaused) {
      autoplayTimer = window.setInterval(() => showSlide(currentSlide + 1), 3000);
    }
  }

  previousButton.addEventListener('click', () => {
    showSlide(currentSlide - 1);
    startAutoplay();
  });

  nextButton.addEventListener('click', () => {
    showSlide(currentSlide + 1);
    startAutoplay();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      startAutoplay();
    });
  });

  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
  carousel.addEventListener('focusin', stopAutoplay);
  carousel.addEventListener('focusout', startAutoplay);

  carousel.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  carousel.addEventListener('touchend', (event) => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) < 45) return;
    showSlide(currentSlide + (distance < 0 ? 1 : -1));
    startAutoplay();
  }, { passive: true });

  startAutoplay();
}

const consultationDialog = document.querySelector('#consultation-dialog');
const openConsultationButton = document.querySelector('#open-consultation');
const closeConsultationButton = document.querySelector('#close-consultation');

function openConsultationDialog() {
  if (!consultationDialog) return;
  consultationDialog.showModal();
  document.body.classList.add('modal-open');
}

function closeConsultationDialog() {
  if (!consultationDialog?.open) return;
  consultationDialog.close();
}

openConsultationButton?.addEventListener('click', openConsultationDialog);
closeConsultationButton?.addEventListener('click', closeConsultationDialog);

consultationDialog?.addEventListener('click', (event) => {
  if (event.target === consultationDialog) closeConsultationDialog();
});

consultationDialog?.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  openConsultationButton?.focus();
});

consultationDialog?.addEventListener('cancel', () => {
  document.body.classList.remove('modal-open');
});

if (window.location.hash === '#asesoria') {
  openConsultationDialog();
}

const consultationForm = document.querySelector('#consultation-form');
const isEnglishPage = document.documentElement.lang === 'en';
const formMessages = isEnglishPage
  ? {
      invalid: 'Review the required fields before submitting.',
      sensitive: 'For your security, remove any SSN, ITIN, banking, card, identification, or tax-document information before submitting.',
      tooFast: 'Please take a moment to review your information before submitting.',
      rateLimited: 'Please wait a few minutes before sending another request.',
      notConnected: 'The form is ready, but the Google Apps Script URL has not been connected.',
      sending: 'Verifying and sending your request…',
      sent: 'Request confirmed. Check your email for the Smart Taxes confirmation message.',
      failed: 'We could not confirm your request. Your information remains in the form; please try again or use the call or text buttons.',
      submit: 'Submit request',
      submitting: 'Verifying…'
    }
  : {
      invalid: 'Revisa los campos obligatorios antes de enviar.',
      sensitive: 'Por tu seguridad, elimina cualquier SSN, ITIN, dato bancario, número de tarjeta, identificación o información de documentos fiscales antes de enviar.',
      tooFast: 'Tómate un momento para revisar la información antes de enviarla.',
      rateLimited: 'Espera unos minutos antes de enviar otra solicitud.',
      notConnected: 'El formulario está listo, pero falta conectar la URL de Google Apps Script.',
      sending: 'Verificando y enviando tu solicitud…',
      sent: 'Solicitud confirmada. Revisa tu correo para encontrar el mensaje de confirmación de Smart Taxes.',
      failed: 'No pudimos confirmar tu solicitud. Tu información permanece en el formulario; intenta nuevamente o utiliza los botones de llamada o mensaje.',
      submit: 'Enviar solicitud',
      submitting: 'Verificando…'
    };

if (consultationForm) {
  const formStatus = consultationForm.querySelector('#form-status');
  const submitButton = consultationForm.querySelector('.form-submit');
  const messageField = consultationForm.querySelector('[name="mensaje"]');
  const honeypotField = consultationForm.querySelector('[name="website"]');
  const startedAtField = consultationForm.querySelector('[name="form_started_at"]');
  const requestIdField = consultationForm.querySelector('[name="request_id"]');
  const responseFrame = document.querySelector('#consultation-response-frame');
  const sensitivePatterns = [
    /\b\d{6,19}\b/,
    /\b\d{3}[- ]?\d{2}[- ]?\d{4}\b/,
    /\b9\d{2}[- ]?\d{2}[- ]?\d{4}\b/,
    /(?:\d[ -]?){12,19}/
  ];
  let pendingRequestId = '';
  let responseTimer;

  function resetFormTimer() {
    if (startedAtField) startedAtField.value = String(Date.now());
  }

  function finishSubmission() {
    window.clearTimeout(responseTimer);
    submitButton.disabled = false;
    submitButton.textContent = formMessages.submit;
  }

  function isTrustedFormOrigin(origin) {
    try {
      const url = new URL(origin);
      return (
        url.protocol === 'https:' &&
        (url.hostname === 'script.google.com' || url.hostname.endsWith('.googleusercontent.com'))
      );
    } catch (error) {
      return false;
    }
  }

  resetFormTimer();

  window.addEventListener('message', (event) => {
    if (
      !pendingRequestId ||
      !responseFrame ||
      event.source !== responseFrame.contentWindow ||
      !isTrustedFormOrigin(event.origin)
    ) {
      return;
    }

    const payload = event.data;
    if (
      !payload ||
      payload.source !== 'smart-taxes-form' ||
      payload.requestId !== pendingRequestId
    ) {
      return;
    }

    pendingRequestId = '';
    finishSubmission();
    formStatus.className = 'form-status';

    if (payload.ok) {
      consultationForm.reset();
      resetFormTimer();
      formStatus.textContent = formMessages.sent;
      formStatus.classList.add('success');
      return;
    }

    const errorMessages = {
      sensitive: formMessages.sensitive,
      too_fast: formMessages.tooFast,
      rate_limited: formMessages.rateLimited,
      invalid: formMessages.invalid
    };

    formStatus.textContent = errorMessages[payload.code] || formMessages.failed;
    formStatus.classList.add('error');
  });

  consultationForm.addEventListener('submit', (event) => {
    event.preventDefault();
    formStatus.className = 'form-status';

    if (!consultationForm.checkValidity()) {
      consultationForm.reportValidity();
      formStatus.textContent = formMessages.invalid;
      formStatus.classList.add('error');
      return;
    }

    if (honeypotField?.value.trim()) {
      consultationForm.reset();
      resetFormTimer();
      formStatus.textContent = formMessages.sent;
      formStatus.classList.add('success');
      return;
    }

    const elapsed = Date.now() - Number(startedAtField?.value || 0);
    if (!Number.isFinite(elapsed) || elapsed < 1500) {
      formStatus.textContent = formMessages.tooFast;
      formStatus.classList.add('error');
      return;
    }

    const messageValue = messageField?.value.replace(/\s+/g, ' ').trim() || '';
    if (sensitivePatterns.some((pattern) => pattern.test(messageValue))) {
      formStatus.textContent = formMessages.sensitive;
      formStatus.classList.add('error');
      messageField?.focus();
      return;
    }

    const endpoint = consultationForm.dataset.endpoint?.trim();

    if (!endpoint || !responseFrame || !requestIdField) {
      formStatus.textContent = formMessages.notConnected;
      formStatus.classList.add('error');
      return;
    }

    pendingRequestId =
      window.crypto?.randomUUID?.() ||
      String(Date.now()) + '-' + Math.random().toString(36).slice(2);
    requestIdField.value = pendingRequestId;
    consultationForm.action = endpoint;

    submitButton.disabled = true;
    submitButton.textContent = formMessages.submitting;
    formStatus.textContent = formMessages.sending;

    responseTimer = window.setTimeout(() => {
      pendingRequestId = '';
      finishSubmission();
      formStatus.className = 'form-status error';
      formStatus.textContent = formMessages.failed;
    }, 20000);

    HTMLFormElement.prototype.submit.call(consultationForm);
  });
}
