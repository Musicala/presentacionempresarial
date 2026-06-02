document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('mainNav');
  const menuToggle = document.getElementById('menuToggle');
  const sections = Array.from(document.querySelectorAll('main .section'));
  const links = Array.from(document.querySelectorAll('.nav a'));
  const progressBar = document.getElementById('progressBar');
  const prev = document.getElementById('prevSection');
  const next = document.getElementById('nextSection');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });
  }

  links.forEach(link => {
    link.addEventListener('click', () => {
      if (nav) nav.classList.remove('open');
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  function currentIndex(){
    const top = window.scrollY + 110;
    let index = 0;
    sections.forEach((section, i) => {
      if (section.offsetTop <= top) index = i;
    });
    return index;
  }

  function goTo(index){
    const safe = Math.max(0, Math.min(sections.length - 1, index));
    sections[safe].scrollIntoView({behavior:'smooth', block:'start'});
  }

  if (prev) prev.addEventListener('click', () => goTo(currentIndex() - 1));
  if (next) next.addEventListener('click', () => goTo(currentIndex() + 1));

  document.addEventListener('keydown', event => {
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (event.key === 'ArrowRight' || event.key === 'PageDown') {
      event.preventDefault();
      goTo(currentIndex() + 1);
    }
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
      event.preventDefault();
      goTo(currentIndex() - 1);
    }
  });

  function updateScrollState(){
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight || 1;
    const progress = (doc.scrollTop / max) * 100;
    if (progressBar) progressBar.style.width = `${progress}%`;

    const index = currentIndex();
    const activeId = sections[index] ? sections[index].id : '';
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
    });
    if (prev) prev.disabled = index <= 0;
    if (next) next.disabled = index >= sections.length - 1;
  }

  window.addEventListener('scroll', updateScrollState, {passive:true});
  window.addEventListener('resize', updateScrollState);
  updateScrollState();

  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:.12, rootMargin:'0px 0px -6% 0px'});
    revealElements.forEach(element => observer.observe(element));
  } else {
    revealElements.forEach(element => element.classList.add('in'));
  }
});
