(function () {
  const modal = document.getElementById('certModal');
  const modalBackdrop = modal ? modal.querySelector('[data-close-modal]') : null;
  const modalClose = modal ? modal.querySelector('.cert-modal-close') : null;
  const modalTitle = document.getElementById('certModalTitle');
  const modalMeta = document.getElementById('certModalMeta');
  const modalFrame = document.getElementById('certModalFrame');

  if (!modal || !modalFrame) return;

  function openModal(payload) {
    const { title, issuer, date, file } = payload;
    modalTitle.textContent = title;
    modalMeta.textContent = issuer + ' - ' + date;
    modalFrame.src = file + '#toolbar=1&navpanes=0&scrollbar=1&view=FitH';
    modal.classList.add('is-open');
    document.body.classList.add('modal-open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    modal.setAttribute('aria-hidden', 'true');
    window.setTimeout(function () {
      modalFrame.src = '';
    }, 220);
  }

  document.querySelectorAll('.cert-card').forEach(function (card) {
    const trigger = card.querySelector('.cert-open');
    const preview = card.querySelector('.cert-preview');
    const file = card.getAttribute('data-file') || '';
    if (!trigger) return;

    if (preview && file && !preview.querySelector('.cert-thumb')) {
      const thumb = document.createElement('iframe');
      thumb.className = 'cert-thumb';
      thumb.loading = 'lazy';
      thumb.title = (card.getAttribute('data-title') || 'Certificate') + ' preview';
      thumb.setAttribute('tabindex', '-1');
      thumb.src = file + '#toolbar=0&navpanes=0&scrollbar=0&view=FitH&page=1';
      preview.insertBefore(thumb, preview.querySelector('.cert-overlay'));
    }

    trigger.addEventListener('click', function () {
      openModal({
        title: card.getAttribute('data-title') || 'Certificate',
        issuer: card.getAttribute('data-issuer') || '',
        date: card.getAttribute('data-date') || '',
        file: file
      });
    });
  });

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeModal);
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
})();
