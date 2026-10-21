(() => {
  const find = selector => document.querySelector(selector);
  const all = selector => [...document.querySelectorAll(selector)];

  // Move existing nodes without replacing their content or event listeners.
  function fold(title, nodes, id) {
    const book = document.createElement('details');
    book.className = 'section-fold';
    book.id = id;
    const summary = document.createElement('summary');
    const label = document.createElement('span');
    label.textContent = title;
    const state = document.createElement('span');
    state.className = 'fold-state';
    for (const [className, text] of [['fold-open', '접기'], ['fold-closed', '펼치기']]) {
      const span = document.createElement('span');
      span.className = className;
      span.textContent = text;
      state.append(span);
    }
    summary.append(label, state);
    const content = document.createElement('div');
    content.className = 'fold-content';
    nodes[0].before(book);
    book.append(summary, content);
    content.append(...nodes);
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'fold-close';
    close.textContent = `${title} 접기`;
    close.addEventListener('click', () => {
      book.open = false;
      summary.focus({preventScroll: true});
      summary.scrollIntoView({block: 'start', behavior: 'instant'});
    });
    content.append(close);
    return book;
  }

  fold('테니스 스윙과 상황별 기술', all('#tennis > .intro, #tennis > .subnav, #forehand, #backhand, #touch, #serve'), 'fold-tennis-swing');
  fold('나의 라켓 스펙', [find('#racket')], 'fold-racket');
  fold('야구 타격 스윙', all('#baseball > .intro, #baseball > .section'), 'fold-baseball-swing');
  fold('골프 스윙 자세', all('#golf > .intro, #golf > .subnav, #golf-basic, #driver'), 'fold-golf-swing');
  for (const [id, title] of [['wedge', '샌드웨지 거리 조절'], ['shape', '드로우 · 페이드 · 벙커 고각샷'], ['lies', '상하좌우 경사면에서의 샷'], ['putter', '퍼터 조절']]) {
    fold(title, [find(`#${id}`)], `fold-${id}`);
  }
  fold('스윙의 기본 · 스트라이크를 위하여', [find('#bowling-strike')], 'fold-bowling-strike');
  const styles = fold('스윙 종류', all('#bowling-styles, #bowling-two-handed, #bowling-one-handed, #bowling-thumbless'), 'fold-bowling-styles');
  for (const [id, title] of [['bowling-styles', '종류 비교'], ['bowling-two-handed', '투핸드'], ['bowling-one-handed', '원핸드'], ['bowling-thumbless', '덤리스']]) {
    fold(title, [find(`#${id}`)], `fold-${id}-item`);
  }
  styles.classList.add('fold-with-children');
  fold('나의 스윙', [find('#bowling-my-swing')], 'fold-bowling-my-swing');
  fold('공의 회전', all('#billiards-spin, #billiards-cushion'), 'fold-billiards-spin');
  fold('위치별 경로 노트', [find('#billiards-routes')], 'fold-billiards-routes');
  fold('그립', [find('#tt-grip')], 'fold-tt-grip');
  fold('드라이브 & 스매싱', all('#tt-drive, #tt-smash, #table-tennis > .rule-source'), 'fold-tt-strokes');

  all('.panel details').forEach(book => { book.open = false; });
  // Deep links opened by the reader reveal every enclosing fold, including bowling's nested folds.
  function reveal(hash) {
    let id;
    try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
    for (let node = document.getElementById(id); node; node = node.parentElement) {
      if (node.tagName === 'DETAILS') node.open = true;
    }
  }
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href^="#"]');
    if (anchor) reveal(anchor.getAttribute('href'));
  });
  window.addEventListener('hashchange', () => reveal(location.hash));
})();
