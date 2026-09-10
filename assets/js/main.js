/* SYD Ledger Solutions | Shared behavior and motion. No build step required. */
(() => {
  'use strict';

  // Leave blank for the email-app fallback. On cPanel, set this to 'contact-handler.php'.
  // A full HTTPS endpoint also works when the handler is hosted elsewhere.
  const CONTACT_ENDPOINT = '';
  const CONTACT_EMAIL = 'Sydledgersolutions@gmail.com';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const root = document.documentElement;
  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  let motionContext;
  let pointerCleanup = () => {};
  let pausedByUser = false;
  let updateVideo = () => {};

  // Navigation: Bootstrap collapse with a dependency-free fallback.
  function setupNavigation() {
    const header = qs('.site-header');
    const toggle = qs('.menu-toggle');
    const menu = qs('#site-menu');
    let scrollPending = false;
    const updateHeader = () => {
      header?.classList.toggle('is-scrolled', window.scrollY > 28);
      scrollPending = false;
    };
    window.addEventListener('scroll', () => {
      if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateHeader); }
    }, { passive: true });
    updateHeader();
    if (!toggle || !menu) return;
    const bs = window.bootstrap?.Collapse;
    const collapse = bs ? new bs(menu, { toggle: false }) : null;
    const updateExpanded = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    };
    const close = () => {
      if (collapse) collapse.hide();
      else { menu.classList.remove('show'); updateExpanded(false); }
    };
    toggle.addEventListener('click', () => {
      if (collapse) collapse.toggle();
      else updateExpanded(menu.classList.toggle('show'));
    });
    menu.addEventListener('show.bs.collapse', () => updateExpanded(true));
    menu.addEventListener('hide.bs.collapse', () => updateExpanded(false));
    menu.addEventListener('shown.bs.collapse', () => {
      if (window.gsap && !reducedMotion.matches && !pausedByUser) {
        window.gsap.fromTo(qsa('a',menu),{opacity:0,y:9},{opacity:1,y:0,stagger:.045,duration:.3,clearProps:'all'});
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menu.classList.contains('show')) { close(); toggle.focus(); }
    });
    document.addEventListener('click', (event) => {
      if (menu.classList.contains('show') && !header.contains(event.target)) close();
    });
    window.matchMedia('(min-width: 992px)').addEventListener('change', (event) => { if(event.matches) close(); });
  }

  // Accessible word masks: keep the original heading as its accessible name.
  function splitHeadings() {
    qsa('[data-heading-reveal]').forEach((heading) => {
      if (heading.dataset.split) return;
      heading.dataset.split = 'true';
      heading.setAttribute('aria-label',heading.innerText.replace(/\s+/g,' ').trim());
      const walker = document.createTreeWalker(heading,NodeFilter.SHOW_TEXT);
      const nodes = [];
      while(walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach((node) => {
        const fragment = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach((word) => {
          if (!word.trim()) { fragment.append(document.createTextNode(word)); return; }
          const mask = document.createElement('span');
          mask.className = 'word-mask'; mask.setAttribute('aria-hidden','true');
          const inner = document.createElement('span'); inner.className = 'reveal-word'; inner.textContent = word;
          mask.append(inner); fragment.append(mask);
        });
        node.replaceWith(fragment);
      });
    });
  }

  // Coordinated GSAP entrances, reveals and ambient refraction.
  function setupMotion() {
    motionContext?.revert(); pointerCleanup();
    root.classList.remove('js-motion');
    if (!window.gsap || reducedMotion.matches || pausedByUser) return;
    const { gsap, ScrollTrigger } = window;
    if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    splitHeadings();
    root.classList.add('js-motion');
    const motionToggle = qs('.motion-toggle');
    if(motionToggle) motionToggle.hidden = false;
    motionContext = gsap.context(() => {
      const intro = gsap.timeline({delay:.5,defaults:{duration:.8,ease:'power3.out'}});
      const entrance = (selector,from,to,position) => {
        const elements = qsa(selector);
        if(elements.length) intro.fromTo(elements,from,to,position);
      };
      entrance('.hero-copy .section-label, .page-hero .section-label, .contact-copy .section-label',{opacity:0,y:15},{opacity:1,y:0,clearProps:'all'},0);
      entrance('h1 .reveal-word',{yPercent:110,opacity:0},{yPercent:0,opacity:1,stagger:.035,clearProps:'all'},.06);
      entrance('[data-hero-enter]',{opacity:0,y:20},{opacity:1,y:0,stagger:.1,clearProps:'all'},.27);
      entrance('.finance-visual',{opacity:0,y:26},{opacity:1,y:0,duration:1.2,clearProps:'all'},.15);
      const ambient = (selector,animation) => {const elements=qsa(selector);if(elements.length) gsap.to(elements,animation);};
      ambient('.liquid-orb',{x:20,y:-28,scale:1.07,borderRadius:'60% 40% 40% 60%',opacity:.8,duration:9,repeat:-1,yoyo:true,ease:'sine.inOut',stagger:2});
      ambient('.glass-ring',{y:-15,rotation: -17,duration:6,repeat:-1,yoyo:true,ease:'sine.inOut'});
      ambient('.visual-chip',{y:-8,duration:4.7,repeat:-1,yoyo:true,ease:'sine.inOut',stagger:1});
      ambient('.chart-panel',{y:7,duration:5.3,repeat:-1,yoyo:true,ease:'sine.inOut'});
      if(ScrollTrigger) {
        qsa('[data-reveal-group]').forEach((group) => {
          gsap.from(qsa('[data-reveal]',group),{opacity:0,y:25,duration:.75,stagger:.09,ease:'power2.out',scrollTrigger:{trigger:group,start:'top 90%',once:true},clearProps:'all'});
        });
        qsa('[data-reveal]').filter(el => !el.closest('[data-reveal-group]')).forEach((el) => {
          gsap.from(el,{opacity:0,y:25,duration:.8,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 92%',once:true},clearProps:'all'});
        });
        qsa('h2[data-heading-reveal]').forEach((el) => {
          gsap.from(qsa('.reveal-word',el),{yPercent:105,opacity:0,duration:.65,stagger:.028,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 92%',once:true},clearProps:'all'});
        });
        qsa('[data-parallax]').forEach((el) => {
          gsap.fromTo(el,{y:15},{y:-15,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:1}});
        });
        qsa('.benefit-list').forEach(el => {
          gsap.from(qsa('.icon-box',el),{scale:.8,opacity:0,stagger:.08,duration:.5,scrollTrigger:{trigger:el,start:'top 88%',once:true},clearProps:'all'});
        });
        if(qs('.reading-progress')) gsap.to('.reading-progress',{scaleX:1,ease:'none',scrollTrigger:{trigger:'main',start:'top top',end:'bottom bottom',scrub:true}});
      }
    });
    if(finePointer.matches) setupPointerEffects();
  }

  // Only a few panels tilt. Pointer updates are batched into one animation frame.
  function setupPointerEffects() {
    const handlers = [];
    const { gsap } = window;
    qsa('[data-spotlight], [data-magnetic], [data-tilt]').forEach((el) => {
      let frame = 0, latest;
      const inner = el.hasAttribute('data-magnetic') ? qs('span',el) : null;
      const update = () => {
        frame = 0;
        const bounds = el.getBoundingClientRect();
        const x = latest.clientX - bounds.left, y = latest.clientY - bounds.top;
        el.style.setProperty('--pointer-x',`${x}px`); el.style.setProperty('--pointer-y',`${y}px`);
        if(el.hasAttribute('data-tilt')) gsap.to(el,{rotationX:(.5-y/bounds.height)*3,rotationY:(x/bounds.width-.5)*3,transformPerspective:900,duration:.4,overwrite:'auto'});
        if(inner) gsap.to(inner,{x:(x/bounds.width-.5)*8,y:(y/bounds.height-.5)*6,duration:.3,overwrite:'auto'});
      };
      const move = event => { latest = event; if(!frame) frame = requestAnimationFrame(update); };
      const leave = () => {
        cancelAnimationFrame(frame); frame = 0;
        if(el.hasAttribute('data-tilt')) gsap.to(el,{rotationX:0,rotationY:0,duration:.5,overwrite:'auto'});
        if(inner) gsap.to(inner,{x:0,y:0,duration:.5,overwrite:'auto'});
      };
      el.addEventListener('pointermove',move,{passive:true}); el.addEventListener('pointerleave',leave);
      handlers.push(() => {el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave);cancelAnimationFrame(frame);gsap.killTweensOf(el);if(inner){gsap.killTweensOf(inner);gsap.set(inner,{clearProps:'transform'});} if(el.hasAttribute('data-tilt')) gsap.set(el,{clearProps:'transform'});});
    });
    const hero = qs('.home-hero');
    if(hero) {
      let frame = 0, latest;
      const orb = qs('.orb-one',hero);
      const move = event => { latest = event; if(!frame) frame = requestAnimationFrame(() => {frame=0;const bounds=hero.getBoundingClientRect();if(orb) gsap.to(orb,{x:(latest.clientX/bounds.width-.5)*24,duration:1.5,overwrite:'auto'});});};
      hero.addEventListener('pointermove',move,{passive:true});
      handlers.push(() => {hero.removeEventListener('pointermove',move);cancelAnimationFrame(frame);});
    }
    pointerCleanup = () => { handlers.forEach(cleanup=>cleanup()); pointerCleanup=()=>{}; };
  }

  // Background video respects motion preferences, viewport visibility and user pause.
  function setupBackgroundVideo() {
    const video = qs('.hero-video');
    const toggle = qs('.video-toggle');
    if(!video || !toggle) return;
    let videoPausedByUser = false;
    let heroVisible = true;
    video.muted = true;
    toggle.hidden = false;
    const updateControl = () => {
      toggle.textContent = video.paused ? 'Play video' : 'Pause video';
      toggle.setAttribute('aria-pressed',String(video.paused));
    };
    updateVideo = () => {
      if(reducedMotion.matches || pausedByUser || videoPausedByUser || !heroVisible || document.hidden) {
        video.pause();
        if(reducedMotion.matches) video.currentTime = 0;
        updateControl();
      } else {
        const play = video.play();
        if(play?.catch) play.catch(updateControl);
      }
    };
    toggle.addEventListener('click', () => {
      // Explicit play is allowed while an OS motion preference is set.
      if(video.paused) {
        videoPausedByUser = false;
        video.play().catch(updateControl);
      } else {videoPausedByUser = true;video.pause();}
      updateControl();
    });
    video.addEventListener('play',updateControl);
    video.addEventListener('pause',updateControl);
    video.addEventListener('error',()=>{toggle.hidden=true;});
    document.addEventListener('visibilitychange',updateVideo);
    reducedMotion.addEventListener('change',updateVideo);
    if('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        heroVisible = entries[0].isIntersecting;
        updateVideo();
      },{threshold:.01});
      observer.observe(qs('.home-hero'));
    }
    updateVideo();
  }

  // Front-end validation. An empty endpoint MUST NOT send or pretend to send.
  function setupContactForm() {
    const form = qs('#consultation-form');
    if (!form) return;
    const status = qs('#form-status');
    const submit = qs('button[type="submit"]',form);
    const fields = qsa('input,select,textarea',form);
    const configured = window.location.protocol !== 'file:' && (/^https:\/\//i.test(CONTACT_ENDPOINT) || /^[\w./-]+(?:\?.*)?$/i.test(CONTACT_ENDPOINT));
    const note = qs('#submission-note');
    if(configured) note.textContent = 'Submit your details to request a free 15-minute consultation.';
    else note.textContent = `Your email app will open with the enquiry addressed to ${CONTACT_EMAIL}.`;
    submit.disabled = false;
    form.noValidate = true;
    const validateField = field => {
      field.setCustomValidity('');
      if(field.required && !field.value.trim()) field.setCustomValidity('Please complete this field.');
      field.setAttribute('aria-invalid',String(!field.validity.valid));
      return field.validity.valid;
    };
    fields.forEach(field => field.addEventListener('input', () => {
      if(form.classList.contains('was-validated')) validateField(field);
      if(status.textContent) status.textContent='';
    }));
    form.addEventListener('submit', async event => {
      event.preventDefault();
      form.classList.add('was-validated');
      const valid = fields.map(validateField).every(Boolean);
      if(!valid) {
        status.textContent = 'Please check the highlighted fields.';
        fields.find(field=>!field.validity.valid)?.focus();
        return;
      }
      if(!configured) {
        const data = Object.fromEntries(new FormData(form));
        const subject = encodeURIComponent(`SYD Ledger Solutions consultation enquiry from ${data.fullName}`);
        const body = encodeURIComponent(`Full Name: ${data.fullName}\nEmail: ${data.email}\nCompany/Business Name: ${data.company || 'Not provided'}\nCountry: ${data.country}\nTransactions per Month: ${data.transactionsPerMonth}\nMessage: ${data.message || 'Not provided'}`);
        status.textContent = `Opening your email app addressed to ${CONTACT_EMAIL}…`;
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
        return;
      }
      submit.disabled = true; form.setAttribute('aria-busy','true');
      status.textContent='Sending your consultation request…';
      const controller = new AbortController();
      const timeout = window.setTimeout(()=>controller.abort(),15000);
      try {
        const response = await fetch(CONTACT_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(form))),signal:controller.signal});
        if(!response.ok) throw new Error('Request rejected');
        const result = await response.json();
        if(result.success !== true) throw new Error('Delivery not confirmed');
        status.textContent='Your consultation request has been sent.';
        form.reset(); form.classList.remove('was-validated'); fields.forEach(field=>field.removeAttribute('aria-invalid'));
      } catch {
        status.textContent='Your request could not be confirmed. Your details are still here. Please try again later.';
      } finally {
        clearTimeout(timeout); submit.disabled=false; form.removeAttribute('aria-busy'); status.focus();
      }
    });
  }

  function setupFlagChips() {
    qsa('.flag-chip').forEach((chip) => {
      chip.addEventListener('dragstart', () => chip.classList.add('is-dragging'));
      chip.addEventListener('dragend', () => chip.classList.remove('is-dragging'));
      chip.addEventListener('pointerdown', () => chip.classList.add('is-pressed'));
      chip.addEventListener('pointerup', () => chip.classList.remove('is-pressed'));
      chip.addEventListener('pointercancel', () => chip.classList.remove('is-pressed'));
    });
  }

  function init() {
    setupNavigation(); setupContactForm(); setupBackgroundVideo(); setupFlagChips();
    window.setTimeout(() => qs('.page-loader')?.remove(), 1200);
    try { setupMotion(); } catch { motionContext?.revert(); root.classList.remove('js-motion'); }
    qs('.motion-toggle')?.addEventListener('click',(event)=>{
      pausedByUser = !pausedByUser;
      root.classList.toggle('pause-motion',pausedByUser);
      event.currentTarget.textContent = pausedByUser ? 'Resume motion' : 'Pause motion';
      event.currentTarget.setAttribute('aria-pressed',String(pausedByUser));
      setupMotion();
      updateVideo();
    });
    reducedMotion.addEventListener('change',setupMotion);
    finePointer.addEventListener('change',()=>{pointerCleanup();if(finePointer.matches && window.gsap && !reducedMotion.matches && !pausedByUser) setupPointerEffects();});
    document.addEventListener('visibilitychange',()=>{if(window.gsap) document.hidden ? window.gsap.globalTimeline.pause() : window.gsap.globalTimeline.resume();});
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();

