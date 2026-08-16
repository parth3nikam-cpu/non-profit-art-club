const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

const contactForm = document.getElementById('art-contact-form');
const formStatus = document.getElementById('form-status');
const submitButton = contactForm.querySelector('button[type="submit"]');
const googleFormEndpoint = 'https://docs.google.com/forms/d/e/1FAIpQLSdrF9GERncHdpXyDJ-AYcZgtMpeLrRrkR3J4lhMN-_KDtakPw/formResponse';

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

  const name = contactForm.elements.name.value.trim();
  const responseData = new URLSearchParams({
    'entry.126051849': name,
    'entry.457859474': contactForm.elements.email.value.trim(),
    'entry.1065668010': contactForm.elements.phone.value.trim(),
    'entry.1295080886': contactForm.elements.interest.value.trim()
  });

  submitButton.disabled = true;
  submitButton.innerHTML = 'Sending…';
  formStatus.classList.remove('error');
  formStatus.textContent = '';

  try {
    await fetch(googleFormEndpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: responseData.toString()
    });

    formStatus.textContent = `Thanks, ${name}! Your message was sent successfully. We’ll be in touch soon.`;
    contactForm.reset();
  } catch (error) {
    formStatus.classList.add('error');
    formStatus.textContent = 'We could not send your message. Please check your connection and try again.';
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Send Message <span aria-hidden="true">→</span>';
  }
});
