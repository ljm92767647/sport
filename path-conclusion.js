(() => {
 const NS='http://www.w3.org/2000/svg',S=[2,3],T=[5,2],examples=[];
 const reflect=(p,w)=>w==='top'?[p[0],-p[1]]:w==='bottom'?[p[0],8-p[1]]:w==='right'?[16-p[0],p[1]]:[-p[0],p[1]];
 function calculate(sequence){
  let target=[...T];for(const w of [...sequence].reverse())target=reflect(target,w);
  let p=[...S],v=target.map((x,i)=>x-S[i]);const path=[[...S]];
  for(const expected of sequence){const candidates=[];for(const [wall,axis,edge] of [['top',1,0],['bottom',1,4],['left',0,0],['right',0,8]]){if(Math.abs(v[axis])<1e-10)continue;const t=(edge-p[axis])/v[axis];if(t>1e-9)candidates.push({wall,t,axis});}candidates.sort((a,b)=>a.t-b.t);const hit=candidates[0];if(hit.wall!==expected)throw Error('Unexpected cushion');p=p.map((x,i)=>x+hit.t*v[i]);path.push(p);v[hit.axis]*=-1;}
  const d=T.map((x,i)=>x-p[i]);if(Math.abs(d[0]*v[1]-d[1]*v[0])>1e-8||d[0]*v[0]+d[1]*v[1]<=0)throw Error('Target not on final line');path.push([...T]);return {sequence,path,unfolded:target};
 }
 function draw(id,n,sequence){const svg=document.getElementById(id);if(!svg)return;const offset=n===1?160:70,map=p=>[60+p[0]*60,offset+p[1]*60],route=calculate(sequence);examples.push(route);svg.dataset.cushions=n;svg.dataset.path=JSON.stringify(route.path);
  const node=(tag,attrs,text)=>{const e=document.createElementNS(NS,tag);for(const [k,v]of Object.entries(attrs))e.setAttribute(k,v);if(text)e.textContent=text;svg.append(e);return e;};
  const line=(a,b,color,dash='',width=2)=>{const p=map(a),q=map(b);node('line',{x1:p[0],y1:p[1],x2:q[0],y2:q[1],stroke:color,'stroke-width':width,'stroke-dasharray':dash});};
  const label=(p,t,dx=0,dy=0,color='#3b5949')=>{const [x,y]=map(p);node('text',{x:x+dx,y:y+dy,fill:color,'font-size':17,'font-family':'Arial, Malgun Gothic, sans-serif','text-anchor':'middle','paint-order':'stroke',stroke:'#f4f8f6','stroke-width':4,'stroke-linejoin':'round'},t);};
  const ball=(p,color,ghost=false)=>{const [x,y]=map(p);node('circle',{cx:x,cy:y,r:9,fill:ghost?'#fff9de':color,stroke:ghost?'#b28b27':'#526e5c','stroke-width':2,'stroke-dasharray':ghost?'4 3':''});};
  node('title',{},n+'쿠션의 기준선과 진행 순서');node('rect',{x:48,y:offset-12,width:504,height:264,rx:4,fill:'#28533f'});node('rect',{x:60,y:offset,width:480,height:240,fill:'#e2eee6'});
  for(let x=1;x<8;x++)line([x,0],[x,4],'#cadbd0','',1);for(let y=1;y<4;y++)line([0,y],[8,y],'#cadbd0','',1);
  for(let x=0;x<=8;x++)label([x,0],String(x),0,-25,'#72867a');
  for(let y=0;y<=4;y++)label([0,y],String(y),-30,5,'#72867a');
  if(n===1){const mirrored=reflect(T,'top');line(T,mirrored,'#b79840','4 5',1.5);line(S,mirrored,'#b94f45','7 5',2);ball(mirrored,'',true);label(mirrored,'거울 속 목표',0,-19);}
  else{const target=n===3?reflect(T,'bottom'):T,M=S.map((x,i)=>(x+target[i])/2),K=[8,0];line(S,target,'#879b91','3 5',1.5);line(M,K,'#826282','6 4',2.5);const p=map(M);node('circle',{cx:p[0],cy:p[1],r:5,fill:'#826282'});label(M,'중점 M',-20,25,'#755475');label(K,'공통 모서리',20,-44,'#755475');
   if(n===3){line(T,target,'#b79840','4 5',1.5);ball(target,'',true);label(target,'펼친 목표',0,26);}
   line(S,route.path[1],'#b94f45','7 5',5);
  }
  node('polyline',{points:route.path.map(p=>map(p).join(',')).join(' '),fill:'none',stroke:'#25816b','stroke-width':3,'stroke-linejoin':'round'});
  route.path.slice(1,-1).forEach((p,i)=>{const [x,y]=map(p);node('circle',{cx:x,cy:y,r:10,fill:'#fff',stroke:'#25816b','stroke-width':1.5});label(p,String(i+1),0,6,'#25816b');});ball(S,'#fff');label(S,'출발 S',-5,26);ball(T,'#ebc546');label(T,'2구',0,-19);
 }
 draw('path-one-diagram',1,['top']);draw('path-two-diagram',2,['top','right']);draw('path-three-diagram',3,['top','right','bottom']);window.sportsRouteNotes=examples;
})();
