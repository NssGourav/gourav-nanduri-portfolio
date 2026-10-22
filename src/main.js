import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { content } from './content.js';

const root=document.body, panel=document.querySelector('#detail-panel'), panelContent=document.querySelector('#panel-content');
const signal=document.querySelector('#signal-text'), tourButton=document.querySelector('#tour'), motionButton=document.querySelector('#motion');
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
let current='overview', paused=reduceMotion.matches, tourTimer=null, selectScene=()=>{}, resetScene=()=>{};
const messages={overview:'Select an agent. Discover the work behind it.',projects:'BUILDER → mobile apps, backend APIs, and shipped products.',ai:'EVALUATOR → routing, monitoring, and testing AI behavior.',community:'COMMUNITY → build together. Make the connections.',opensource:'CONTRIBUTOR → small fixes, shared impact.',journey:'EXPERIENCE → learn, build, repeat.',contact:'NEXT CONNECTION → a good conversation starts here.'};
function stopTour(){if(tourTimer)clearTimeout(tourTimer);tourTimer=null;tourButton.setAttribute('aria-pressed','false');tourButton.innerHTML='<span>▶</span> Follow the signal <span>↗</span>'}
function showView(view,{focus=false,tour=false}={}){
 if(!tour)stopTour();current=content[view]?view:'overview';
 document.querySelectorAll('[data-view]').forEach(b=>{b.classList.toggle('active',b.dataset.view===current);b.setAttribute('aria-current',b.dataset.view===current?'page':'false')});
 root.classList.toggle('panel-open',current!=='overview');panel.hidden=current==='overview';signal.textContent=messages[current];
 if(current!=='overview'){
 const d=content[current];document.querySelector('#panel-label').textContent=d.label;panelContent.innerHTML='';
 const h=document.createElement('h2');h.innerHTML=d.title;panelContent.append(h);
 const p=document.createElement('p');p.className='panel-description';p.textContent=d.description;panelContent.append(p);
 for(const item of d.items){const article=document.createElement('article');article.className='content-card';const tag=document.createElement('span');tag.className='card-tag';tag.textContent=item.tag;const title=document.createElement('h3');title.textContent=item.title;const text=document.createElement('p');text.textContent=item.text;article.append(tag,title,text);if(item.chips){const chips=document.createElement('div');chips.className='chips';for(const label of item.chips){const chip=document.createElement('span');chip.textContent=label;chips.append(chip)}article.append(chips)}if(item.url){const a=document.createElement('a');a.href=item.url;a.className='card-link';a.target='_blank';a.rel='noopener noreferrer';a.textContent=item.link;article.append(a)}panelContent.append(article)}
 if(d.links){const links=document.createElement('div');links.className='panel-links';for(const [label,url] of d.links){const a=document.createElement('a');a.href=url;a.textContent=label+' ↗';if(!url.startsWith('mailto:')){a.target='_blank';a.rel='noopener noreferrer'}links.append(a)}panelContent.append(links)}
 if(current==='contact'){const copy=document.createElement('button');copy.className='email-button';copy.textContent='nss.gourav@adypu.edu.in  ⧉';const status=document.createElement('p');status.className='sr-status';status.setAttribute('role','status');copy.onclick=async()=>{try{await navigator.clipboard.writeText('nss.gourav@adypu.edu.in');status.textContent='Email copied.'}catch{status.textContent='Email: nss.gourav@adypu.edu.in'}};panelContent.append(copy,status)}
 panelContent.scrollTop=0;if(focus)panelContent.focus({preventScroll:true});
 }
 selectScene(current);
}
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view,{focus:true})));
document.querySelector('.identity').addEventListener('click',e=>{e.preventDefault();showView('overview')});
document.querySelector('#close-panel').onclick=()=>{showView('overview');document.querySelector('[data-view="overview"]').focus()};
document.addEventListener('keydown',e=>{if(e.key==='Escape'){stopTour();showView('overview')}});
const order=['projects','ai','community','opensource','journey','contact'];
tourButton.onclick=()=>{if(tourTimer){stopTour();return}let i=0;function next(){if(i===order.length){stopTour();showView('overview');return}showView(order[i++],{tour:true});tourButton.setAttribute('aria-pressed','true');tourTimer=setTimeout(next,9000)}next()};
function updateMotion(){motionButton.textContent=paused?'▶ PLAY':'Ⅱ PAUSE';motionButton.setAttribute('aria-label',paused?'Play scene animation':'Pause scene animation')}updateMotion();motionButton.onclick=()=>{paused=!paused;updateMotion()};reduceMotion.addEventListener('change',e=>{paused=e.matches;updateMotion()});
document.querySelector('#reset').onclick=()=>{showView('overview');resetScene()};
function clock(){document.querySelector('#local-clock').textContent=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit'}).format(new Date())+' IST'}clock();setInterval(clock,60000);

const host=document.querySelector('#universe');
try {
 const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0x090c15);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;host.append(renderer.domElement);renderer.domElement.setAttribute('aria-label','3D agent network. Use the section buttons to access all portfolio content.');
 const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x090c15,.025);
 const camera=new THREE.PerspectiveCamera(43,1,.1,100);const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.065;controls.enablePan=false;controls.minDistance=7;controls.maxDistance=24;controls.maxPolarAngle=Math.PI*.49;controls.minPolarAngle=.35;controls.rotateSpeed=.45;controls.zoomSpeed=.65;
 const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));const bloom=new UnrealBloomPass(new THREE.Vector2(1,1),.5,.6,.55);composer.addPass(bloom);composer.addPass(new OutputPass());
 scene.add(new THREE.AmbientLight(0x7c8edb,.75));const light=new THREE.PointLight(0x93a9ff,38,25);light.position.set(0,3,0);scene.add(light);const fill=new THREE.DirectionalLight(0x64d3d7,2);fill.position.set(5,8,2);scene.add(fill);
 const network=new THREE.Group();scene.add(network);const core=new THREE.Group();core.position.set(0,.8,0);network.add(core);
 const sphere=new THREE.Mesh(new THREE.IcosahedronGeometry(.74,3),new THREE.MeshPhysicalMaterial({color:0x4f608e,metalness:.88,roughness:.23,emissive:0x304577,emissiveIntensity:.4,clearcoat:1}));core.add(sphere);
 const coreWire=new THREE.Mesh(new THREE.IcosahedronGeometry(.82,2),new THREE.MeshBasicMaterial({color:0xaabfff,wireframe:true,transparent:true,opacity:.38}));core.add(coreWire);
 const centerGlow=new THREE.Mesh(new THREE.SphereGeometry(.22,20,16),new THREE.MeshBasicMaterial({color:0xc8d9ff}));core.add(centerGlow);
 const ringMaterial=new THREE.MeshBasicMaterial({color:0x9dbeff,transparent:true,opacity:.6});const coreRings=[];for(let i=0;i<3;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(1.05+i*.13,.008,5,128),ringMaterial);ring.rotation.set(.65+i*.6,.4+i*.7,.2);core.add(ring);coreRings.push(ring)}
 const halo=new THREE.Mesh(new THREE.RingGeometry(1.38,1.395,100),new THREE.MeshBasicMaterial({color:0x7b95df,side:THREE.DoubleSide,transparent:true,opacity:.28}));halo.rotation.x=-Math.PI/2;halo.position.y=-.3;core.add(halo);
 function label(text,sub,color){const canvas=document.createElement('canvas');canvas.width=768;canvas.height=192;const ctx=canvas.getContext('2d');ctx.textAlign='center';ctx.fillStyle=color;ctx.font='500 46px monospace';ctx.fillText(text,384,75);ctx.font='23px monospace';ctx.fillStyle='#7686a5';ctx.fillText(sub,384,115);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthTest:false}));sprite.scale.set(2.7,.675,1);return sprite}
 const coreLabel=label('GOURAV','ORCHESTRATOR / BUILDER','#d5ddff');coreLabel.position.set(0,2.45,0);network.add(coreLabel);
 const specs=[['projects','BUILDER','01 / PROJECTS',[-3.8,.25,1.5],0xa8b7ff],['ai','EVALUATOR','02 / AI SYSTEMS',[2.9,.4,-2.8],0x7dcbd6],['community','COMMUNITY','03 / HACKATHONS',[3.8,.25,1.3],0xc2a1ef],['opensource','CONTRIBUTOR','04 / OPEN SOURCE',[-2.6,.15,-2.9],0x8ccab7],['journey','EXPERIENCE','05 / JOURNEY',[-.9,.15,4],0xc9c09c],['contact','CONNECT','06 / CONTACT',[1.7,.2,3.8],0x90bbf0]];
 const agents=[],targets=[],paths=[],packets=[];
 for(const [id,name,sub,pos,color] of specs){const group=new THREE.Group();group.position.set(...pos);network.add(group);const body=new THREE.Mesh(new THREE.OctahedronGeometry(.29,0),new THREE.MeshStandardMaterial({color,metalness:.7,roughness:.3,emissive:color,emissiveIntensity:.32}));body.userData.view=id;group.add(body);targets.push(body);const hit=new THREE.Mesh(new THREE.SphereGeometry(.52,12,8),new THREE.MeshBasicMaterial({visible:false}));hit.userData.view=id;group.add(hit);targets.push(hit);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(.48,.007,4,60),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.52}));ring.rotation.x=Math.PI/2;ring.position.y=-.23;group.add(ring);
 const column=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,-1.9-pos[1],0),new THREE.Vector3(0,-.3,0)]),new THREE.LineBasicMaterial({color,transparent:true,opacity:.13}));group.add(column);
 const sprite=label(name,sub,'#'+new THREE.Color(color).getHexString());sprite.position.y=.95;group.add(sprite);const agent={id,group,body,ring,sprite,baseY:pos[1],color};agents.push(agent);
 const start=core.position.clone(),end=group.position.clone();const mid=start.clone().lerp(end,.5);mid.y+=.7;const curve=new THREE.QuadraticBezierCurve3(start,mid,end);paths.push({id,curve});const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(64)),new THREE.LineBasicMaterial({color,transparent:true,opacity:.23}));network.add(line);agent.line=line;
 for(let j=0;j<3;j++){const packet=new THREE.Mesh(new THREE.SphereGeometry(.025,6,4),new THREE.MeshBasicMaterial({color}));packet.userData={curve,offset:j/3,id};packet.position.copy(curve.getPoint(j/3));network.add(packet);packets.push(packet)}
 }
 // A fine circuit floor gives the network depth without obscuring its content.
 const grid=new THREE.GridHelper(52,52,0x273553,0x172238);grid.position.y=-2;grid.material.transparent=true;grid.material.opacity=.28;scene.add(grid);
 const groundRings=[];for(const r of [2,4.4,6.4]){const ring=new THREE.Mesh(new THREE.RingGeometry(r,r+.008,160),new THREE.MeshBasicMaterial({color:0x5273a6,transparent:true,opacity:.18,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=-1.98;scene.add(ring);groundRings.push(ring)}
 const starPositions=[];for(let i=0;i<370;i++){starPositions.push(Math.sin(i*39.7)*23,Math.cos(i*17.2)*11+3,Math.sin(i*7.3)*22)}const starGeo=new THREE.BufferGeometry();starGeo.setAttribute('position',new THREE.Float32BufferAttribute(starPositions,3));const stars=new THREE.Points(starGeo,new THREE.PointsMaterial({color:0x8497c2,size:.018,transparent:true,opacity:.5}));scene.add(stars);
 const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();let downX=0,downY=0,hover=null;
 function intersect(e){const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);return raycaster.intersectObjects(targets)[0]?.object.userData.view}
 renderer.domElement.addEventListener('pointerdown',e=>{downX=e.clientX;downY=e.clientY});renderer.domElement.addEventListener('pointerup',e=>{if(Math.hypot(e.clientX-downX,e.clientY-downY)<6){const id=intersect(e);if(id)showView(id,{focus:true})}});renderer.domElement.addEventListener('pointermove',e=>{hover=intersect(e);renderer.domElement.style.cursor=hover?'pointer':'grab'});renderer.domElement.addEventListener('pointerleave',()=>{hover=null});
 let transitioning=false;const targetLook=new THREE.Vector3(),targetPosition=new THREE.Vector3();
 function desired(view){const mobile=innerWidth<=650;targetLook.set(view==='overview'?(mobile?-1.15:-1.9):(mobile?0:2.3),mobile?(view==='overview'?2.6:-1.3):.5,0);targetPosition.set(view==='overview'?7:6,mobile?11:8,mobile?19:15);transitioning=true}
 resetScene=()=>desired('overview');selectScene=view=>{desired(view);for(const a of agents){const selected=a.id===view;a.line.material.opacity=selected?.75:.23;a.ring.material.opacity=selected?1:.52;a.sprite.material.opacity=view==='overview'||selected?1:.55;a.body.material.emissiveIntensity=selected?.9:.32}};
 controls.addEventListener('start',()=>{transitioning=false;stopTour()});
 function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h);composer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();desired(current)}window.addEventListener('resize',resize);resize();camera.position.copy(targetPosition);controls.target.copy(targetLook);controls.update();transitioning=false;
 let last=0,t=0,frame;function animate(now){frame=requestAnimationFrame(animate);if(document.hidden||now-last<33)return;const dt=Math.min((now-last)/1000,.05);last=now;if(!paused){t+=dt;coreWire.rotation.y=t*.14;sphere.rotation.y=t*.1;coreRings.forEach((r,i)=>r.rotation.z+=dt*.05*(i%2?1:-1));for(const a of agents){a.group.position.y=a.baseY+Math.sin(t*.7+specs.findIndex(x=>x[0]===a.id))*.09;a.body.rotation.y=t*.22;a.ring.rotation.z=t*.1}for(const p of packets)p.position.copy(p.userData.curve.getPoint((t*.11+p.userData.offset)%1))}for(const a of agents){const size=a.id===hover?1.22:a.id===current?1.13:1;a.body.scale.lerp(new THREE.Vector3(size,size,size),.12)}if(transitioning){const alpha=reduceMotion.matches?1:.065;camera.position.lerp(targetPosition,alpha);controls.target.lerp(targetLook,alpha);if(camera.position.distanceTo(targetPosition)<.025&&controls.target.distanceTo(targetLook)<.025)transitioning=false}controls.update();composer.render()}
 frame=requestAnimationFrame(animate);
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();document.querySelector('#fallback').hidden=false;document.querySelector('#fallback').textContent='The 3D view paused. Use the navigation buttons to continue exploring.'});
 window.addEventListener('pagehide',()=>{cancelAnimationFrame(frame);controls.dispose();composer.dispose();renderer.dispose()});
}catch(error){document.querySelector('#fallback').hidden=false;signal.textContent='Explore every portfolio section using the navigation below.';motionButton.hidden=true;document.querySelector('#reset').hidden=true;document.querySelector('.scene-hint').hidden=true}
