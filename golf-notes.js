(() => {
  const grip = document.createElement('div');
  grip.className = 'motion';
  grip.id = 'golf-grip';
  grip.innerHTML = `<h4>그립</h4><div class="reading">
    <p><strong>왼손등의 방향</strong><span><span class="grip-aside">(왼손등이 살짝 위를 보는 보편적인 그립 대신)</span><br><b>왼손등이 앞을 보게</b> 잡아 스퀘어 감각을 유지한다.</span></p>
    <p><strong>손가락 배치</strong><span><b>왼손 소지(새끼손가락)와 오른손 검지를 교차하지 않고,</b><br>소지 이후 검지로 순차적으로 잡아 스윙 파워를 키운다.</span></p>
    </div><p class="note">나의 그립 기준.</p>`;
  document.querySelector('#golf-basic > h3').after(grip);

  const putter = document.createElement('section');
  putter.id = 'putter';
  putter.className = 'section';
  putter.innerHTML = `<h3>퍼터 조절</h3><p class="lead">왼팔로 직선 궤도를 유지하고, 라이와 임팩트 위치를 함께 살핀다.</p>
    <div class="motion"><h4>손의 위치와 왼팔</h4><div class="reading">
    <p><strong>손의 위치</strong><span>일반적인 클럽 그립과 반대로,<br><b>왼손은 헤드에 가깝게, 오른손은 헤드에서 멀게</b> 잡고 스윙한다.</span></p>
    <p><strong>직선 궤도</strong><span>왼팔을 곧게 뻗어, 왼팔이 스윙의 직선 궤도를 유지하도록 한다.</span></p></div></div>
    <div class="motion"><h4>직진을 기본으로, 라이에 맞춰 조절</h4><p>좌우 스핀 없이 <strong>일정하게 일자로 뻗어 나가는 궤적</strong>을 기본으로 한다. 라이에 따라 스핀과 궤적이 어떻게 바뀔지 예상하고 스윙한다.</p></div>
    <div class="motion"><h4>임팩트 위치로 길이 조절</h4><p>공을 맞히는 <strong>위·아래 위치</strong>를 조절해 굴러가는 길이를 맞춘다.</p><dl class="brief-rows">
    <div><dt>많이 굴리기</dt><dd>탑스핀을 만들어 더 많이 굴러가게 한다.</dd></div>
    <div><dt>정확한 길이</dt><dd>정타 또는 적은 스핀으로 원하는 길이를 보내는 감각을 익힌다.</dd></div></dl></div>
    <p class="note">나의 퍼팅 연습 기준.</p>`;
  document.getElementById('lies').after(putter);
})();
