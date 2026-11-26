(() => {
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const nav = document.querySelector('#site-nav');
  const navToggle = document.querySelector('#nav-toggle');
  const themeToggle = document.querySelector('#theme-toggle');
  const themeLabel = themeToggle?.querySelector('.theme-label');
  const filters = document.querySelectorAll('.filter');
  const testRows = document.querySelectorAll('.test-row');

  const savedTheme = localStorage.getItem('metis-theme');
  if (savedTheme === 'night') {
    root.dataset.theme = 'night';
    themeToggle?.setAttribute('aria-pressed', 'true');
    if (themeLabel) themeLabel.textContent = '霜昼';
  }

  themeToggle?.addEventListener('click', () => {
    const night = root.dataset.theme !== 'night';
    root.dataset.theme = night ? 'night' : '';
    themeToggle.setAttribute('aria-pressed', String(night));
    if (themeLabel) themeLabel.textContent = night ? '霜昼' : '夜境';
    localStorage.setItem('metis-theme', night ? 'night' : 'day');
  });

  navToggle?.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    nav?.classList.toggle('open', !expanded);
  });

  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }));

  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 28);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px' });
  document.querySelectorAll('.reveal').forEach(node => revealObserver.observe(node));

  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.nav a')];
  const sectionObserver = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`));
  }, { threshold: [0.2, 0.5], rootMargin: '-25% 0px -55%' });
  sections.forEach(section => sectionObserver.observe(section));

  filters.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filters.forEach(item => item.classList.toggle('active', item === button));
    testRows.forEach(row => {
      row.hidden = filter !== 'all' && row.dataset.kind !== filter;
    });
  }));
})();
