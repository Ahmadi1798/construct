const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn?.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('hidden') === false;
  menuBtn.setAttribute('aria-expanded', String(open));
});

const buttons = [...document.querySelectorAll('.accordion-btn')];

function setExpanded(btn, expanded) {
  const panelId = btn.getAttribute('aria-controls');
  const panel = document.getElementById(panelId);
  const iconOpen = btn.querySelector('.icon-open');
  const iconClosed = btn.querySelector('.icon-closed');

  btn.setAttribute('aria-expanded', String(expanded));
  iconOpen.classList.toggle('hidden', !expanded);
  iconClosed.classList.toggle('hidden', expanded);

  panel.classList.toggle('hidden', !expanded);
}

// Allow only one open at a time
buttons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    // close all
    buttons.forEach((b) => setExpanded(b, false));
    // toggle clicked
    setExpanded(btn, !isOpen);
  });

  // keyboard support for Enter/Space is native for <button>
});
(function () {
  const form = document.getElementById('contactForm');
  const alertBox = document.getElementById('contactAlert');
  const startField = document.getElementById('startedAt');
  const submitBtn = document.getElementById('submitBtn');

  // Generate math captcha
  const a = Math.floor(Math.random() * 8) + 2; // 2..9
  const b = Math.floor(Math.random() * 8) + 2;
  const answer = a + b;
  document.getElementById('captchaQuestion').textContent = `${a} + ${b} = ?`;

  // record start time
  startField.value = String(Date.now());

  function showAlert(type, msg) {
    alertBox.className = `mb-4 rounded-lg p-3 text-sm ${
      type === 'ok'
        ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
        : 'bg-red-50 text-red-700 ring-1 ring-red-200'
    }`;
    alertBox.textContent = msg;
    alertBox.classList.remove('hidden');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    alertBox.classList.add('hidden');

    const data = new FormData(form);

    // 1) honeypot must be empty
    if ((data.get('company') || '').toString().trim() !== '') {
      showAlert('err', 'Spam detected.');
      return;
    }

    // 2) min fill time
    const started = parseInt(startField.value || '0', 10);
    if (Date.now() - started < 3000) {
      showAlert(
        'err',
        'Please take a moment to complete the form before submitting.'
      );
      return;
    }

    // 3) captcha
    const cap = (data.get('captcha') || '').toString().trim();
    if (parseInt(cap, 10) !== answer) {
      showAlert('err', 'Incorrect answer to the math question.');
      return;
    }

    // 4) simple required checks (HTML5 will do most, this is extra)
    if (!data.get('fullName') || !data.get('email') || !data.get('message')) {
      showAlert('err', 'Please fill out all required fields.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      // TODO: Replace with your real endpoint
      // Example: await fetch('https://formspree.io/f/XXXX', { method:'POST', body:data, headers:{Accept:'application/json'}});
      await new Promise((r) => setTimeout(r, 800)); // simulate success

      form.reset();
      showAlert(
        'ok',
        'Thanks! Your message has been sent. We’ll get back to you shortly.'
      );
    } catch (err) {
      console.log(err);
      showAlert('err', 'Something went wrong. Please try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit';
      // regenerate captcha for another attempt
      window.location.hash = '#contact';
    }
  });
})();
