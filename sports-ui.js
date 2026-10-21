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
  const buttons = [...nav.querySelectorAll('[data-sport]')];
  const previous = stage.querySelector('.glass-prev');
  const next = stage.querySelector('.glass-next');
  const back = stage.querySelector('.stage-return');
  let active = Math.max(0, sports.findIndex(([id]) => document.getElementById(id).hidden === false));
  let reading = false, pointer = null, suppressedUntil = 0;

  function choose(index, focusTab = false) {
    active = Math.max(0, Math.min(sports.length - 1, index));
    const [id, , korean] = sports[active];
    selectSport(id, focusTab);
    history.replaceState(null, '', `#${id}`);
    track.style.setProperty('--active', active);
    cards.forEach((card, i) => {
      card.classList.toggle('is-current', i === active);
      card.style.setProperty('--side', Math.sign(i - active));
      card.tabIndex = i === active && !reading ? 0 : -1;
    });
    previous.disabled = active === 0;
    next.disabled = active === sports.length - 1;
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
