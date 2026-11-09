(() => {
  const sports = [
    ['tennis', 'Tennis', '테니스'], ['baseball', 'Baseball', '야구'],
    ['golf', 'Golf', '골프'], ['bowling', 'Bowling', '볼링'],
    ['billiards', 'Billiards', '당구'], ['table-tennis', 'Table Tennis', '탁구']
  ];
  const nav = document.querySelector('.sportnav');
  const main = document.querySelector('main');
  const footer = document.querySelector('footer');
  document.querySelector('body > header')?.remove();
  document.querySelector('.hero')?.remove();
  for (const id of ['bowling', 'billiards', 'table-tennis']) {
    document.querySelector(`#${id} > .rules-heading`)?.remove();
  }
  const shell = document.createElement('div');
  shell.className = 'sports-shell';
  nav.before(shell);
  const backdrop = document.createElement('div');
  backdrop.className = 'sport-backdrop';
  backdrop.setAttribute('aria-hidden', 'true');
  backdrop.innerHTML = `<div class="sport-backdrop-motion">${sports.map(([id]) =>
    `<img src="assets/sport-background-${id}.webp${id === 'table-tennis' ? '?v=20261109d' : ''}" data-background="${id}" alt="" decoding="async">`
  ).join('')}</div>`;
  shell.before(backdrop);
  shell.append(nav);
  const stage = document.createElement('div');
  stage.className = 'sport-stage';
  stage.tabIndex = 0;
  stage.setAttribute('role', 'region');
  stage.setAttribute('aria-roledescription', 'carousel');
  stage.setAttribute('aria-label', '종목 선택');
  stage.innerHTML = `<h1 class="sports-title glass-title">Sports Note</h1><div class="glass-window"><div class="glass-track">${sports.map(([id, title, korean], i) => `
    <button type="button" class="glass-card" data-card="${i}" aria-label="${korean} 내용 보기" aria-controls="${id}">
      <span class="glass-surface" aria-hidden="true"><span class="glass-glint"></span></span>
      <span class="glass-count" aria-hidden="true">0${i + 1} / 06</span>
      <span class="glass-title">${title}</span><span class="glass-korean">${korean}</span>
    </button>`).join('')}</div></div>
    <button type="button" class="glass-arrow glass-prev" aria-label="이전 종목" title="이전 종목"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="m19 7-9 9 9 9"/></svg></button>
    <button type="button" class="glass-arrow glass-next" aria-label="다음 종목" title="다음 종목"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="m13 7 9 9-9 9"/></svg></button>
    <button type="button" class="stage-return" aria-label="종목 선택 펼치기" title="종목 선택 펼치기" aria-expanded="false"></button>
    <span class="sr-only" role="status" aria-live="polite"></span>`;
  shell.append(stage);
  const track = stage.querySelector('.glass-track');
  const windowElement = stage.querySelector('.glass-window');
  const cards = [...stage.querySelectorAll('.glass-card')];
  const backgrounds = [...backdrop.querySelectorAll('[data-background]')];
  function positionTitle() {
    const navBottom = nav.querySelector('.tabs').getBoundingClientRect().bottom - stage.getBoundingClientRect().top;
    const cardTop = (windowElement.clientHeight - parseFloat(getComputedStyle(cards[0]).height)) / 2;
    stage.style.setProperty('--title-midpoint', `${(navBottom + cardTop) / 2}px`);
  }
  const titleLayout = new ResizeObserver(positionTitle);
  titleLayout.observe(windowElement);
  titleLayout.observe(nav.querySelector('.tabs'));
  titleLayout.observe(cards[0]);
  positionTitle();
  const buttons = [...nav.querySelectorAll('[data-sport]')];
  const previous = stage.querySelector('.glass-prev');
  const next = stage.querySelector('.glass-next');
  const back = stage.querySelector('.stage-return');
  let active = Math.max(0, sports.findIndex(([id]) => document.getElementById(id).hidden === false));
  let reading = false, pointer = null, suppressedUntil = 0;
  const samples = new WeakMap();
  const sampleCanvas = document.createElement('canvas');
  sampleCanvas.width = 96;
  sampleCanvas.height = 64;
  const sampleContext = sampleCanvas.getContext('2d', {willReadFrequently: true});
  let contrastFrame = 0;

  function updateContrast() {
    contrastFrame = 0;
    const image = backgrounds[active];
    const photo = image.getBoundingClientRect();
    const clip = backdrop.getBoundingClientRect();
    let pixels = samples.get(image);
    if (!pixels && image.complete && image.naturalWidth && sampleContext) {
      try {
        sampleContext.drawImage(image, 0, 0, sampleCanvas.width, sampleCanvas.height);
        pixels = sampleContext.getImageData(0, 0, sampleCanvas.width, sampleCanvas.height).data;
      } catch { pixels = null; }
      samples.set(image, pixels || false);
    }
    const scale = Math.max(photo.width / image.naturalWidth, photo.height / image.naturalHeight);
    const width = image.naturalWidth * scale, height = image.naturalHeight * scale;
    const [positionX, positionY] = getComputedStyle(image).objectPosition.split(' ').map(value => parseFloat(value) / 100);
    const left = photo.left + (photo.width - width) * positionX;
    const top = photo.top + (photo.height - height) * positionY;
    const sky = [242, 248, 250];
    const fade = Number(getComputedStyle(backdrop, '::after').opacity);

    // Map each control to the portion of the cover-cropped photo directly behind it.
    function luminance(x, y, glass) {
      const inPhoto = pixels && x >= clip.left && x < clip.right && y >= clip.top && y < clip.bottom && y >= photo.top && y < photo.bottom;
      const ix = Math.max(0, Math.min(95, Math.floor((x - left) / width * 96)));
      const iy = Math.max(0, Math.min(63, Math.floor((y - top) / height * 64)));
      const offset = (iy * 96 + ix) * 4;
      const progress = (y - clip.top) / clip.height;
      const mix = inPhoto ? fade * Math.max(0, Math.min(1, (progress - .19) / .81)) : 1;
      return sky.reduce((sum, channel, i) => {
        const original = inPhoto ? pixels[offset + i] : channel;
        const faded = original * (1 - mix) + channel * mix;
        const s = (glass ? faded * .83 + channel * .17 : faded) / 255;
        return sum + [0.2126, 0.7152, 0.0722][i] * (s <= .04045 ? s / 12.92 : ((s + .055) / 1.055) ** 2.4);
      }, 0);
    }
    for (const control of [...buttons, previous, next]) {
      if (control.hidden) continue;
      const box = control.getBoundingClientRect();
      const glass = buttons.includes(control);
      let sum = 0;
      for (const x of [.3, .5, .7]) for (const y of [.35, .5, .65]) {
        sum += luminance(box.left + box.width * x, box.top + box.height * y, glass);
      }
      const light = !control.matches('[aria-selected=true]') && (pixels === false && !reading || sum / 9 < .21);
      control.style.setProperty('--control-ink', light ? '#fff' : '#14252d');
      control.style.setProperty('--control-shadow', light ? '#101f28' : '#ffffffb8');
    }
  }

  function scheduleContrast() {
    if (!contrastFrame) contrastFrame = requestAnimationFrame(updateContrast);
  }
  backgrounds.forEach(image => image.addEventListener('load', scheduleContrast));
  backdrop.addEventListener('transitionend', scheduleContrast);
  window.addEventListener('resize', scheduleContrast);
  window.addEventListener('scroll', scheduleContrast, {passive: true});

  function choose(index, focusTab = false) {
    active = Math.max(0, Math.min(sports.length - 1, index));
    const [id, , korean] = sports[active];
    selectSport(id, focusTab);
    history.replaceState(null, '', `#${id}`);
    track.style.setProperty('--active', active);
    backgrounds.forEach((image, i) => image.classList.toggle('is-current', i === active));
    cards.forEach((card, i) => {
      card.classList.toggle('is-current', i === active);
      card.style.setProperty('--side', Math.sign(i - active));
      card.tabIndex = i === active && !reading ? 0 : -1;
    });
    previous.disabled = active === 0;
    next.disabled = active === sports.length - 1;
    scheduleContrast();
    stage.querySelector('[role="status"]').textContent = `${active + 1} / 6 · ${korean}`;
    if (reading) window.scrollTo({top: 0, behavior: 'instant'});
  }
  function setReading(value) {
    reading = value;
    document.body.classList.toggle('reading-mode', value);
    main.hidden = !value;
    footer.hidden = !value;
    windowElement.inert = value;
    previous.hidden = next.hidden = value;
    stage.tabIndex = value ? -1 : 0;
    back.setAttribute('aria-expanded', String(!value));
    back.hidden = !value;
    scheduleContrast();
    cards.forEach((card, i) => { card.tabIndex = i === active && !value ? 0 : -1; });
    window.scrollTo({top: 0, behavior: 'instant'});
    if (value) {
      document.querySelector(`#${sports[active][0]} > details > summary`)?.focus({preventScroll: true});
    } else {
      stage.focus({preventScroll: true});
    }
  }
  buttons.forEach((button, i) => {
    button.addEventListener('click', event => {
      event.stopImmediatePropagation();
      choose(i);
      setReading(false);
      button.focus({preventScroll: true});
    }, true);
    button.addEventListener('keydown', event => {
      let index;
      if (event.key === 'ArrowRight') index = (i + 1) % sports.length;
      if (event.key === 'ArrowLeft') index = (i + sports.length - 1) % sports.length;
      if (event.key === 'Home') index = 0;
      if (event.key === 'End') index = sports.length - 1;
      if (index !== undefined) {
        event.preventDefault();
        event.stopImmediatePropagation();
        choose(index, true);
        setReading(false);
        buttons[index].focus({preventScroll: true});
      }
    }, true);
  });
  cards.forEach((card, i) => {
    card.addEventListener('click', () => { choose(i); setReading(true); });
    card.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse' || pointer?.moved) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--light-x', `${100 * (event.clientX - rect.left) / rect.width}%`);
      card.style.setProperty('--light-y', `${100 * (event.clientY - rect.top) / rect.height}%`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('--light-x');
      card.style.removeProperty('--light-y');
    });
  });
  previous.addEventListener('click', () => choose(active - 1));
  next.addEventListener('click', () => choose(active + 1));
  back.addEventListener('click', () => setReading(false));
  stage.addEventListener('keydown', event => {
    if (reading || event.ctrlKey || event.metaKey || event.altKey) return;
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      choose(event.key === 'Home' ? 0 : event.key === 'End' ? 5 : active + (event.key === 'ArrowRight' ? 1 : -1));
      stage.focus({preventScroll: true});
    }
    if (event.key === 'Enter' && event.target === stage) { event.preventDefault(); setReading(true); }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && reading && !event.target.closest('input,textarea,select')) setReading(false);
  });
  stage.addEventListener('pointerdown', event => {
    if (reading || event.button !== 0 || event.target.closest('.glass-arrow')) return;
    pointer = {id: event.pointerId, x: event.clientX, y: event.clientY, moved: false};
  });
  stage.addEventListener('pointermove', event => {
    if (!pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x;
    if (!pointer.moved && Math.abs(dx) > 7 && Math.abs(dx) > Math.abs(event.clientY - pointer.y)) {
      pointer.moved = true;
      stage.setPointerCapture(event.pointerId);
      stage.classList.add('is-dragging');
    }
    if (pointer.moved) track.style.setProperty('--drag-x', `${dx * ((active === 0 && dx > 0) || (active === 5 && dx < 0) ? .25 : 1)}px`);
  });
  function finish(event, cancelled = false) {
    if (!pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x;
    if (pointer.moved) {
      suppressedUntil = performance.now() + 400;
      if (!cancelled && Math.abs(dx) > Math.min(80, innerWidth * .16)) choose(active + (dx < 0 ? 1 : -1));
    }
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    pointer = null;
    stage.classList.remove('is-dragging');
    track.style.setProperty('--drag-x', '0px');
  }
  stage.addEventListener('pointerup', event => finish(event));
  stage.addEventListener('pointercancel', event => finish(event, true));
  stage.addEventListener('click', event => {
    if (performance.now() < suppressedUntil) { event.preventDefault(); event.stopImmediatePropagation(); }
  }, true);
  let wheelTotal = 0, lockedUntil = 0, lastWheel = 0;
  stage.addEventListener('wheel', event => {
    if (reading || event.ctrlKey || event.metaKey) return;
    event.preventDefault();
    const now = performance.now();
    if (now < lockedUntil || pointer) return;
    if (now - lastWheel > 160) wheelTotal = 0;
    lastWheel = now;
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    wheelTotal += delta * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerWidth : 1);
    if (Math.abs(wheelTotal) >= 38) {
      choose(active + (wheelTotal > 0 ? 1 : -1));
      wheelTotal = 0;
      lockedUntil = now + 520;
    }
  }, {passive: false});
  window.addEventListener('hashchange', () => {
    const panel = document.getElementById(location.hash.slice(1))?.closest('.panel');
    if (panel) { choose(sports.findIndex(([id]) => id === panel.id)); setReading(true); }
  });
  choose(active);
  setReading(false);
  document.body.classList.add('sports-ready');
})();
