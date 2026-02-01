// interactions: typing, scroll reveal, tilt, theme, mobile nav, modal, form (demo)
document.addEventListener('DOMContentLoaded', () => {
  // typed text loop
  const typedEl = document.getElementById('typed');
  const words = [
  'scalable software solutions',
  'C# and .NET applications',
  'React and Flutter apps',
  'ERP and shipping software',
  'real-time messaging systems',
  'high-quality code'
];

  let i = 0, j = 0, forward = true;
  function tick(){
    const word = words[i];
    if(forward){
      j++;
      if(j <= word.length) typedEl.textContent = word.slice(0,j);
      if(j === word.length){ forward = false; setTimeout(tick, 900); return; }
    } else {
      j--;
      if(j >= 0) typedEl.textContent = word.slice(0,j);
      if(j === 0){ forward = true; i = (i+1) % words.length; }
    }
    setTimeout(tick, forward ? 80 : 40);
  }
  tick();

  // year
  document.getElementById('year').textContent = new Date().getFullYear();

  // reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      if(ent.isIntersecting) ent.target.classList.add('visible');
    });
  }, {threshold: 0.12});
  reveals.forEach(r => io.observe(r));

  // tilt effect for project cards
  const tiltEls = document.querySelectorAll('[data-tilt], .project-card');
  tiltEls.forEach(el=>{
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rx = (y - 0.5) * 8;
      const ry = (x - 0.5) * -8;
      el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
    });
    el.addEventListener('mouseleave', ()=> el.style.transform = '');
  });

  // THEME TOGGLE: respect saved preference, fall back to system
  const themeBtn = document.getElementById('theme-toggle');
  const body = document.body;
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  const saved = localStorage.getItem('theme'); // "light" or "dark"

  function applyTheme(theme){
    if(theme === 'light') {
      body.classList.add('light');
      themeBtn.textContent = '🌞';
      themeBtn.setAttribute('aria-pressed','true');
    } else {
      body.classList.remove('light');
      themeBtn.textContent = '🌙';
      themeBtn.setAttribute('aria-pressed','false');
    }
  }

  const initial = saved ? saved : (prefersLight ? 'light' : 'dark');
  applyTheme(initial);

  themeBtn.addEventListener('click', () => {
    const isLight = body.classList.toggle('light');
    const theme = isLight ? 'light' : 'dark';
    applyTheme(theme);
    localStorage.setItem('theme', theme);
  });

  // MOBILE NAV (hamburger) - toggles header.open and accessibility attributes
  const burger = document.getElementById('burger');
  const header = document.getElementById('site-header');
  const nav = document.getElementById('nav');

  function closeNav(){
    header.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    nav.setAttribute('aria-hidden', 'true');
  }
  function openNav(){
    header.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    nav.setAttribute('aria-hidden', 'false');
  }
  burger && burger.addEventListener('click', () => {
    const isOpen = header.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(isOpen));
    nav.setAttribute('aria-hidden', String(!isOpen));
  });

  // close mobile nav when a nav link is clicked
  nav && nav.addEventListener('click', (e) => {
    if(e.target.tagName === 'A' && header.classList.contains('open')) closeNav();
  });

  // CONTACT FORM (demo)
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  form && form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.textContent = 'Sending...';
    setTimeout(() => {
      status.textContent = 'Message sent! I will reply shortly.';
      form.reset();
    }, 900);
  });

  // PROJECT MODAL SYSTEM
  const projectData = {
    p1: {
      title: 'Project One — Landing',
      desc: 'A modern landing page with animations, accessibility improvements, and A/B tested CTA flows.',
      media: [
        { type: 'image', src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder' },
        { type: 'image', src: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder' }
      ],
      links: [{label:'Live', href:'#'}, {label:'Code', href:'#'}]
    },
    p2: {
      title: 'Project Two — Dashboard',
      desc: 'Interactive dashboard: charts, filtering, and offline caching. Built for performance and progressive enhancement.',
      media: [
        { type: 'image', src: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder' },
        { type: 'video', src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4' }
      ],
      links: [{label:'Live', href:'#'}, {label:'Case Study', href:'#'}]
    },
    p3: {
      title: 'Project Three — PWA',
      desc: 'Offline-first PWA with background sync and optimized caching strategies for low-bandwidth users.',
      media: [
        { type: 'image', src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder' }
      ],
      links: [{label:'Live', href:'#'}, {label:'Code', href:'#'}]
    }
  };

  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const mediaViewer = document.getElementById('media-viewer');
  const modalLinks = document.getElementById('modal-links');
  const modalClose = document.getElementById('modal-close');
  const mediaPrev = document.querySelector('.media-prev');
  const mediaNext = document.querySelector('.media-next');

  let activeMediaIndex = 0;
  let activeProject = null;

  function renderMedia(project, index = 0){
    mediaViewer.innerHTML = '';
    if(!project || !project.media || project.media.length === 0) return;
    const item = project.media[index];
    if(item.type === 'image'){
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = project.title;
      mediaViewer.appendChild(img);
    } else if(item.type === 'video'){
      const vid = document.createElement('video');
      vid.src = item.src;
      vid.controls = true;
      mediaViewer.appendChild(vid);
    }
  }

  function openModal(id){
    const data = projectData[id];
    if(!data) return;
    activeProject = data;
    activeMediaIndex = 0;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    modalLinks.innerHTML = '';
    if(data.links) data.links.forEach(l => {
      const a = document.createElement('a');
      a.href = l.href;
      a.textContent = l.label;
      a.className = 'chip';
      a.target = '_blank';
      a.rel = 'noopener';
      modalLinks.appendChild(a);
    });
    renderMedia(data, activeMediaIndex);
    modal.setAttribute('aria-hidden','false');
    // simple focus handling: move focus to close button
    modalClose.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeModal(){
    modal.setAttribute('aria-hidden','true');
    activeProject = null;
    document.body.style.overflow = '';
  }

  // navigate media
  mediaPrev && mediaPrev.addEventListener('click', () => {
    if(!activeProject) return;
    activeMediaIndex = (activeMediaIndex - 1 + activeProject.media.length) % activeProject.media.length;
    renderMedia(activeProject, activeMediaIndex);
  });
  mediaNext && mediaNext.addEventListener('click', () => {
    if(!activeProject) return;
    activeMediaIndex = (activeMediaIndex + 1) % activeProject.media.length;
    renderMedia(activeProject, activeMediaIndex);
  });

  // close handlers
  modalClose && modalClose.addEventListener('click', closeModal);
  document.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();

    // open project on Enter when focused on project-card
    if(e.key === 'Enter' && document.activeElement && document.activeElement.classList.contains('project-card')){
      const id = document.activeElement.getAttribute('data-project');
      id && openModal(id);
    }
  });

  // attach click to project cards
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const id = card.getAttribute('data-project');
      id && openModal(id);
    });
  });

  // make sure clicking outside media area doesn't break
  modal && modal.addEventListener('click', (e) => {
    const target = e.target;
    if(target.classList && target.classList.contains('modal-backdrop')) closeModal();
  });

  // keyboard gallery controls when modal open
  document.addEventListener('keydown', (e) => {
    if(modal.getAttribute('aria-hidden') === 'false'){
      if(e.key === 'ArrowLeft') mediaPrev && mediaPrev.click();
      if(e.key === 'ArrowRight') mediaNext && mediaNext.click();
    }
  });

  // sample: close mobile nav on resize to desktop
  window.addEventListener('resize', () => {
    if(window.innerWidth > 980) {
      header.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      nav.setAttribute('aria-hidden', 'false');
    }
  });
});