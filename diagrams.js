const wedgeImages={
 10:['발목 높이','발목 높이'],
 20:['정강이 위·무릎 아래','정강이 위·무릎 아래'],
 30:['골반 높이 · 클럽은 바닥과 수평, 3시','머리 위 12시'],
 40:['팔은 가슴 높이 · 클럽 2시','팔은 가슴 높이 · 클럽 10시'],
 50:['팔은 어깨 높이 · 클럽 12시','팔은 어깨 높이 · 클럽 12시'],
 60:['팔은 어깨 높이 · 클럽 11시','팔은 어깨 높이 · 클럽 1시'],
 70:['정상 풀 파워 스윙 · 클럽 10시','정상 풀 파워 스윙 · 클럽 2시']
};
function updateWedgeImages(distance){
 ['start','finish'].forEach((stage,i)=>{
  const img=document.getElementById('wedge-'+stage);
  img.src='assets/wedge-'+distance+'-'+stage+'.jpg';
  img.alt=distance+'m '+(i?'팔로스루':'시작')+': '+wedgeImages[distance][i];
 });
}
document.querySelectorAll('[data-distance]').forEach(button=>button.addEventListener('click',()=>updateWedgeImages(button.dataset.distance)));
