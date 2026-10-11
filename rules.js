(() => {
  document.querySelectorAll('.rulebook-close').forEach(button => {
    button.addEventListener('click', () => {
      const book = button.closest('.rulebook');
      book.open = false;
      book.querySelector('summary').focus({preventScroll:true});
      book.querySelector('summary').scrollIntoView({block:'start',behavior:'instant'});
    });
  });
  function revealRulebook(hash) {
    let id;
    try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
    const book = document.getElementById(id)?.closest('.rulebook');
    if (book) book.open = true;
  }
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href^="#"]');
    if (anchor) revealRulebook(anchor.getAttribute('href'));
  });
  window.addEventListener('hashchange', () => revealRulebook(location.hash));
  revealRulebook(location.hash);
  const modeButtons = [...document.querySelectorAll('[data-court]')];
  const left = document.getElementById('court-left');
  let mode = 'singles-serve';
  function updateCourt() {
    const serve = mode.endsWith('serve');
    const doubles = mode.startsWith('doubles');
    const fromLeft = left.checked;
    const title = `${doubles ? '복식' : '단식'} ${serve ? '서브' : '랠리'}`;
    const copy = serve
      ? `${fromLeft ? '왼쪽에서 오른쪽' : '오른쪽에서 왼쪽'} 대각선 서비스 박스로. ${doubles ? '복식도 같은 박스. 옆 통로는 아웃.' : '선에 닿으면 인.'}`
      : `${doubles ? '바깥쪽 선까지 인. 양쪽 옆 통로도 포함.' : '안쪽 선까지 인. 양쪽 옆 통로는 아웃.'} 깊이는 베이스라인까지.`;
    const rect = document.getElementById('court-in');
    const bounds = serve ? [fromLeft ? 250 : 137.5,185,112.5,175] : [doubles ? 100 : 137.5,35,doubles ? 300 : 225,325];
    ['x','y','width','height'].forEach((key,i) => rect.setAttribute(key,bounds[i]));
    document.getElementById('court-service').style.display = serve ? '' : 'none';
    const serverX = fromLeft ? 160 : 340;
    document.getElementById('court-server').setAttribute('cx',serverX);
    document.getElementById('court-server-label').setAttribute('x',serverX+27);
    document.getElementById('court-serve-path').setAttribute('d',`M${serverX} 725L${fromLeft ? 303 : 197} 280`);
    document.getElementById('court-mode-title').textContent = title;
    document.getElementById('court-title').textContent = `${title}의 인 구역`;
    document.getElementById('court-mode-copy').textContent = copy;
    document.getElementById('court-desc').textContent = copy;
    left.disabled = !serve;
    modeButtons.forEach(b => b.setAttribute('aria-pressed',b.dataset.court===mode));
  }
  modeButtons.forEach(b => b.addEventListener('click',() => {mode=b.dataset.court;updateCourt();}));
  left.addEventListener('change',updateCourt);
  const objectBase = '방향은 주로 맞힌 두께에 따라 달라진다. 위아래 회전은 주로 내 공의 다음 움직임을 바꾼다.';
  const spinData = {
    center:['중앙 · 기본 타점','정면으로 맞히면 속도가 많이 줄어든다. 충돌 때 위아래 회전이 없다면 거의 멈춘다.','맞힌 두께에 따라 방향이 달라진다. 두껍게 맞으면 더 많은 힘이 전달된다.','같은 타점도 공 사이 거리와 힘에 따라 결과가 다르다.'],
    top:['위 · 밀어치기','상대 공을 맞힌 뒤 앞으로 따라가게 만든다.',objectBase,'충돌할 때 전진 회전이 남아 있어야 한다.'],
    bottom:['아래 · 끌어치기','상대 공을 맞힌 뒤 뒤로 돌아오게 만든다.',objectBase,'멀리 있는 공은 역회전이 줄어들어 덜 끌릴 수 있다.'],
    left:['왼쪽 · 좌회전','옆 회전은 쿠션에서 반사 방향을 바꾼다. 충돌 직후 수구가 무조건 왼쪽으로 가는 것은 아니다.','정면으로 맞힐 때 마찰 때문에 약간 오른쪽으로 밀릴 수 있다. 기본 방향은 두께가 결정한다.','공을 맞힌 직후 무조건 왼쪽으로 꺾이는 것이 아니다. 쿠션에 닿은 뒤의 길을 조절하는 용도다.'],
    right:['오른쪽 · 우회전','옆 회전은 쿠션에서 반사 방향을 바꾼다. 충돌 직후 수구가 무조건 오른쪽으로 가는 것은 아니다.','정면으로 맞힐 때 마찰 때문에 약간 왼쪽으로 밀릴 수 있다. 기본 방향은 두께가 결정한다.','공을 맞힌 직후 무조건 오른쪽으로 꺾이는 것이 아니다. 쿠션에 닿은 뒤의 길을 조절하는 용도다.']
  };
  for (const vertical of ['top','bottom']) {
    for (const horizontal of ['left','right']) {
      const v=spinData[vertical], h=spinData[horizontal];
      spinData[`${vertical}-${horizontal}`]=[`${horizontal==='left'?'좌':'우'}${vertical==='top'?'상':'하'}단 · ${vertical==='top'?'밀기':'끌기'} + 옆 회전`,`${v[1]} 쿠션 뒤에는 옆 회전도 영향을 준다.`,h[2],'먼저 위·아래·옆을 따로 익힌 뒤 조합한다. 가장자리를 과하게 치면 큐가 미끄러질 수 있다.'];
    }
  }
  const spinButtons=[...document.querySelectorAll('[data-spin]')];
  spinButtons.forEach(b => b.addEventListener('click',() => {
    const data=spinData[b.dataset.spin];
    ['spin-title','spin-cue','spin-object','spin-note'].forEach((id,i)=>document.getElementById(id).textContent=data[i]);
    spinButtons.forEach(x=>x.setAttribute('aria-pressed',x===b));
  }));
})();
