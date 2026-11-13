(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const state = { photos: [], scenes: [], format: 'listing', ratio: '9:16', style: 'Walkaround', background: '내 사진', music: 'Lift off', logo: null, rendered: null, reorderFrom: -1 };
  const styles = [
    { name: 'Walkaround', desc: '외관과 주요 특징 소개', duration: 18 },
    { name: 'Spec Sheet', desc: '핵심 정보를 한눈에', duration: 17 },
    { name: 'Interior', desc: '실내와 편의 기능 중심', duration: 14 },
    { name: 'Condition', desc: '차량 상태와 디테일', duration: 17 },
    { name: 'Narrated', desc: '장면별 음성 소개', duration: 21 },
    { name: 'Trailer', desc: '세로형 티저 영상', duration: 12 },
    { name: 'Beat', desc: '리듬감 있는 컷 편집', duration: 10 },
    { name: 'Pulse', desc: '강한 첫인상의 숏폼', duration: 13 },
    { name: 'Journey', desc: '차량의 이야기를 따라', duration: 16 },
    { name: 'Deal', desc: '매력적인 조건을 강조', duration: 12 },
    { name: 'Three', desc: '세 장면으로 간결하게', duration: 9 },
    { name: 'Cabin', desc: '실내 감성을 담은 숏폼', duration: 12 },
  ];
  const backgrounds = [
    ['내 사진', '원본 그대로'], ['산길', '산길의 드라이브'], ['해안 도로', '바다를 따라'], ['야간 도심', '네온이 빛나는 밤'], ['도심 광장', '도시적인 분위기'], ['루프톱', '도시의 노을'], ['사막', '넓은 지평선'], ['숲길', '고요한 숲속'], ['전원 도로', '여유로운 시골길'], ['전시장', '전시장 무드'], ['차고', '정돈된 워크숍'], ['블랙 스튜디오', '차분한 스튜디오'], ['화이트 스튜디오', '밝고 깨끗하게'],
  ];
  const tracks = ['Lift off', 'Glide slow', 'Evening', 'Grand tour', 'Highway'];
  const bgColors = ['#d9d4c8,#a1aaa2', '#9eb5bf,#e0c79a,#758278', '#8db5bc,#d8c8a6,#566f72', '#233342,#687b84,#19262d', '#778b92,#c8b88e,#465251', '#bd9f7e,#536a6e,#35474a', '#ddb68a,#b87655,#756044', '#c1d1c4,#74897d,#b4baa5', '#b6c49a,#dfd3ad,#9aa590', '#c2b9a5,#e2cfaa,#71786e', '#b5b7b0,#737d79,#404c4a', '#242b31,#5b6264,#11181d', '#efede5,#c5cbc4,#7f8f8b'];
  const inputPhotos = $('#photoInput'), photoList = $('#photoList'), dropzone = $('#dropzone');
  function showNotice(title, body) { $('#dialogTitle').textContent = title; $('#dialogBody').textContent = body; $('#noticeDialog').showModal(); }
  $('#dialogClose').addEventListener('click', () => $('#noticeDialog').close());
  function setStep(step) {
    $$('.step').forEach(el => el.classList.toggle('active', Number(el.dataset.step) <= step));
    $('#stepLabel').textContent = `${step} / 4 · ${['', '차량 정보', '영상 설정', '미리보기', '다운로드'][step]}`;
    $('#stepTitle').textContent = ['','먼저 차량을 등록해 주세요','영상 스타일을 선택해 주세요','영상 미리보기를 확인해 주세요','영상 파일이 준비됐어요'][step];
    $('#uploadPanel').classList.toggle('hidden', step !== 1);
    $('#editorPanel').classList.toggle('hidden', step !== 2);
    $('#previewPanel').classList.toggle('hidden', step < 3);
    if (step === 3) { updatePreview(); scrollBuilder(); }
    if (step === 4) { updatePreview(); scrollBuilder(); }
  }
  function scrollBuilder() { $('#builder').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  function addFiles(files) {
    const valid = [...files].filter(file => /^image\/(jpeg|png|webp)$/.test(file.type));
    const tooLarge = valid.find(file => file.size > 20 * 1024 * 1024);
    if (tooLarge) { showNotice('파일 크기 확인', '사진 한 장의 크기는 20MB 이하여야 합니다.'); return; }
    if (state.photos.length + valid.length > 20) { showNotice('사진 수 확인', '차량 사진은 최대 20장까지 사용할 수 있습니다.'); return; }
    valid.forEach(file => { const url=URL.createObjectURL(file); const image=new Image(); image.src=url; state.photos.push({ file, url, image, name: file.name }); });
    if (files.length !== valid.length) $('#uploadStatus').textContent = 'JPG, PNG, WebP 사진 파일만 추가했어요.';
    renderPhotos();
  }
  inputPhotos.addEventListener('change', e => addFiles(e.target.files));
  ['dragenter','dragover'].forEach(type => dropzone.addEventListener(type, e => { e.preventDefault(); dropzone.classList.add('dragover'); }));
  ['dragleave','drop'].forEach(type => dropzone.addEventListener(type, e => { e.preventDefault(); dropzone.classList.remove('dragover'); }));
  dropzone.addEventListener('drop', e => addFiles(e.dataTransfer.files));
  function renderPhotos() {
    photoList.innerHTML = '';
    state.photos.forEach((photo, index) => {
      const item = document.createElement('div'); item.className = 'photo-thumb'; item.draggable = true; item.dataset.index = index;
      item.innerHTML = `<img src="${photo.url}" alt="차량 사진 ${index+1}"><button type="button" aria-label="사진 삭제">×</button>`;
      item.querySelector('button').addEventListener('click', () => { URL.revokeObjectURL(photo.url); state.photos.splice(index,1); renderPhotos(); });
      item.addEventListener('dragstart', e => { state.reorderFrom = index; e.dataTransfer.effectAllowed = 'move'; });
      item.addEventListener('dragover', e => e.preventDefault());
      item.addEventListener('drop', e => { e.preventDefault(); const from = state.reorderFrom, to = index; if (from < 0 || from === to) return; const [picked] = state.photos.splice(from,1); state.photos.splice(to,0,picked); state.reorderFrom=-1; renderPhotos(); });
      photoList.appendChild(item);
    });
    $('#uploadStatus').textContent = `${state.photos.length}장의 사진을 선택했어요. 사진은 브라우저를 떠나지 않습니다.`;
  }
  $$('.choice').forEach(button => button.addEventListener('click', () => {
    $$('.choice').forEach(x => x.classList.toggle('active', x === button));
    const link = button.dataset.tab === 'link'; $('#linkPanel').classList.toggle('hidden', !link); $('#photoPanel').classList.toggle('hidden', link);
  }));
  $('#parseLink').addEventListener('click', () => {
    const url = $('#listingUrl').value.trim();
    if (!url) return showNotice('매물 링크 입력', '매물 주소 또는 VIN을 입력한 뒤 확인해 주세요.');
    showNotice('차량 정보를 확인해 주세요', '현재 공개 웹 버전에서는 외부 매물 사이트의 사진과 정보를 자동으로 가져오는 서버가 연결되어 있지 않습니다. 매물 사진을 올리고 차량 정보를 직접 입력해 주세요.');
    $$('.choice').forEach(x => x.classList.toggle('active', x.dataset.tab === 'photos')); $('#linkPanel').classList.add('hidden'); $('#photoPanel').classList.remove('hidden');
  });
  $('#toEditor').addEventListener('click', async () => {
    if (state.photos.length < 3) return showNotice('사진을 3장 이상 선택해 주세요', '차량의 전면, 측면, 후면이나 실내 사진을 최소 3장 올리면 영상 장면을 구성할 수 있습니다.');
    if (!$('#carName').value.trim()) return showNotice('차량명을 입력해 주세요', '영상에 표시할 차량명을 입력해 주세요.');
    await Promise.all(state.photos.map(photo=>photo.image.decode().catch(()=>undefined)));
    makeScenes(); updateCarSummary(); drawStyleChoices(); drawBackgroundChoices(); setStep(2);
  });
  function updateCarSummary() {
    $('#summaryName').textContent = $('#carName').value.trim();
    $('#summaryMeta').textContent = [$('#mileage').value.trim(), $('#price').value.trim(), $('#seller').value.trim()].filter(Boolean).join(' · ') || '차량 정보';
    $('#summaryPhoto').innerHTML = `<img src="${state.photos[0].url}" alt="차량 대표 사진">`;
  }
  $('#editCar').addEventListener('click', () => setStep(1)); $('#backToUpload').addEventListener('click', () => setStep(1));
  const listingNames = ['Walkaround','Spec Sheet','Interior','Condition','Narrated'];
  const socialNames = ['Trailer','Beat','Pulse','Journey','Deal','Three','Cabin'];
  function drawStyleChoices() {
    const names = state.format === 'social' ? socialNames : listingNames;
    $('#styleGrid').innerHTML = '';
    names.forEach((name, i) => {
      const info = styles.find(x => x.name === name); const button = document.createElement('button');
      button.className = `style-option${state.style===name?' active':''}`; button.innerHTML = `<span class="style-cover" style="background-image:linear-gradient(135deg,${bgColors[(i+1)%bgColors.length].split(',').map(x=>x.trim()).join(',')})"></span><span class="style-name">${name}</span><span class="style-desc">${info.desc} · 약 ${info.duration}초</span>`;
      button.addEventListener('click', () => { state.style=name; drawStyleChoices(); updateSelectionSummary(); makeScenes(); }); $('#styleGrid').appendChild(button);
    });
  }
  function drawBackgroundChoices() {
    const grid = $('#backgroundGrid'); grid.innerHTML='';
    backgrounds.forEach(([name, desc], i) => { const button=document.createElement('button'); button.className=`bg-option${state.background===name?' active':''}`; button.innerHTML=`<span class="bg-swatch" style="background:linear-gradient(145deg,${bgColors[i]})"></span><span>${name}</span>`; button.title=desc; button.addEventListener('click',()=>{state.background=name; drawBackgroundChoices(); updateSelectionSummary(); updatePreview();}); grid.appendChild(button); });
  }
  function updateSelectionSummary() {
    $('#sumRatio').textContent = state.ratio === '9:16' ? '세로형 · 9:16' : '가로형 · 16:9'; $('#sumStyle').textContent = state.style; $('#sumBackground').textContent = state.background;
  }
  $$('.seg[data-format]').forEach(button => button.addEventListener('click', () => {
    state.format=button.dataset.format; $$('.seg[data-format]').forEach(x=>x.classList.toggle('active',x===button));
    state.ratio=state.format==='social'?'9:16':'16:9'; $$('.seg[data-ratio]').forEach(x=>x.classList.toggle('active',x.dataset.ratio===state.ratio));
    const choices=state.format==='social'?socialNames:listingNames; if(!choices.includes(state.style)) state.style=choices[0]; drawStyleChoices(); updateSelectionSummary(); makeScenes();
  }));
  $$('.seg[data-ratio]').forEach(button=>button.addEventListener('click',()=>{state.ratio=button.dataset.ratio; $$('.seg[data-ratio]').forEach(x=>x.classList.toggle('active',x===button)); updateSelectionSummary();}));
  $('#musicSelect').addEventListener('change',e=>{state.music=e.target.value.split(' · ')[0];});
  $('#musicPreview').addEventListener('click',()=>{const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return showNotice('미리듣기 지원 불가','현재 브라우저에서 오디오 미리듣기를 지원하지 않습니다.');const ctx=new Ctx(), osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='sine';osc.frequency.value=state.music==='Highway'?196:state.music==='Evening'?146:174;gain.gain.setValueAtTime(.035,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+1.2);osc.connect(gain).connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+1.2);});
  $('#voiceToggle').addEventListener('change',()=>$('#voiceScript').classList.toggle('hidden',!$('#voiceToggle').checked));
  $('#speakScript').addEventListener('click',()=>{if(!('speechSynthesis'in window))return showNotice('음성 안내를 사용할 수 없습니다','브라우저가 한국어 음성 읽기를 지원하지 않습니다.');const utterance=new SpeechSynthesisUtterance($('#scriptText').value||$('#carName').value);utterance.lang='ko-KR';utterance.rate=.92;window.speechSynthesis.cancel();window.speechSynthesis.speak(utterance);});
  $('#logoInput').addEventListener('change',e=>{const file=e.target.files[0];if(!file)return;state.logo=URL.createObjectURL(file);$('#logoName').textContent=file.name;});
  const defaultLines = (index) => {
    const name=$('#carName').value.trim(); const seller=$('#seller').value.trim(); const price=$('#price').value.trim(); const mileage=$('#mileage').value.trim();
    const labels=['차량의 첫인상을 확인해 보세요','선명한 외관과 균형 잡힌 디자인','꼼꼼하게 살펴본 실내 공간','차량의 매력을 직접 확인해 보세요','오늘, 새로운 드라이빙을 만나보세요'];
    if(index===0)return `${name} · ${labels[0]}`; if(index===state.photos.length-1)return seller?`${seller}에서 만나보세요`:price?`${price} · 자세한 상담은 문의해 주세요`:labels[4];
    if(index===1&&mileage)return `주행거리 ${mileage} · ${labels[1]}`; return labels[(index+1)%labels.length];
  };
  function makeScenes() {
    const count=Math.min(state.photos.length, state.style==='Three'?3:state.style==='Narrated'?4:5);
    const prev=state.scenes; state.scenes=Array.from({length:count},(_,i)=>({ photo: state.photos[i%state.photos.length], title: ['오프닝','외관 소개','주요 특징','실내 확인','클로징'][i]||`장면 ${i+1}`, caption: prev[i]?.caption || defaultLines(i), duration:i===0?4:3 }));
    $('#scriptText').value=state.scenes.map(x=>x.caption).join(' '); renderScenes();
    const seconds=state.scenes.reduce((sum,x)=>sum+x.duration,0); $('#sceneDuration').textContent=`${state.scenes.length}개 장면 · 약 ${seconds}초`;
  }
  function renderScenes() {
    const list=$('#sceneList'); list.innerHTML='';
    state.scenes.forEach((scene,i)=>{const card=document.createElement('div');card.className='scene-card';card.draggable=true;card.dataset.index=i;card.innerHTML=`<div class="scene-image"><img src="${scene.photo.url}" alt="${scene.title} 사진"></div><div class="scene-copy"><b>${i+1} · ${scene.title} · ${scene.duration}초</b><input aria-label="장면 ${i+1} 문구" value="${escapeAttr(scene.caption)}"></div><div class="scene-actions"><button title="드래그하여 순서 변경">⠿</button><button title="사진 변경">사진 변경</button></div>`;
      card.querySelector('input').addEventListener('input',e=>{scene.caption=e.target.value;$('#scriptText').value=state.scenes.map(x=>x.caption).join(' ');});
      card.querySelectorAll('button')[1].addEventListener('click',()=>{const choices=state.photos.map((p,j)=>`${j+1}: ${p.name}`).join('\n');const raw=prompt(`이 장면에 사용할 사진 번호를 입력하세요.\n${choices}`,String(state.photos.indexOf(scene.photo)+1));if(raw===null)return;const n=Number(raw)-1;if(state.photos[n]){scene.photo=state.photos[n];renderScenes();}});
      card.addEventListener('dragstart',()=>{state.reorderFrom=i;card.classList.add('dragging');});card.addEventListener('dragend',()=>card.classList.remove('dragging'));card.addEventListener('dragover',e=>e.preventDefault());card.addEventListener('drop',e=>{e.preventDefault();const from=state.reorderFrom,to=i;if(from<0||from===to)return;const [item]=state.scenes.splice(from,1);state.scenes.splice(to,0,item);state.reorderFrom=-1;renderScenes();});list.appendChild(card);
    });
  }
  function escapeAttr(text){return String(text).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');}
  function makePreviewText(){ return $('#linePerScene').checked; }
  $('#makePreview').addEventListener('click',()=>{updateSelectionSummary();$('#exportRatio').textContent=state.ratio==='9:16'?'세로형 9:16 · 720 × 1280':'가로형 16:9 · 1280 × 720';$('#renderStage').classList.toggle('landscape',state.ratio==='16:9');$('#exportLength').textContent=`약 ${state.scenes.reduce((s,x)=>s+x.duration,0)}초`;setStep(3);});
  $('#changeSettings').addEventListener('click',()=>setStep(2));
  let previewTimer=null, currentScene=0;
  function drawFrame(sceneIndex=0, time=0) {
    const canvas=$('#previewCanvas'); const ctx=canvas.getContext('2d'); const vertical=state.ratio==='9:16'; canvas.width=vertical?720:1280; canvas.height=vertical?1280:720;
    const scene=state.scenes[sceneIndex%state.scenes.length]; if(!scene)return; const img=scene.photo.image; if(!img.complete||!img.naturalWidth)return;
      const w=canvas.width,h=canvas.height, cover=Math.max(w/img.width,h/img.height), progress=(time%3000)/3000, zoom=1.04+progress*.09, sw=w/(cover*zoom),sh=h/(cover*zoom),sx=(img.width-sw)/2+Math.sin(progress*Math.PI)*img.width*.012,sy=(img.height-sh)/2;
      ctx.drawImage(img,sx,sy,sw,sh,0,0,w,h);
      if(state.background!=='내 사진'){ctx.fillStyle='rgba(29,43,43,.13)';ctx.fillRect(0,0,w,h);}
      const grad=ctx.createLinearGradient(0,0,0,h);grad.addColorStop(0,'rgba(9,17,21,.06)');grad.addColorStop(.47,'rgba(9,17,21,.02)');grad.addColorStop(1,'rgba(9,17,21,.82)');ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
      const pad=vertical?54:68; ctx.textAlign='left';ctx.fillStyle='#fff';ctx.shadowColor='#1119';ctx.shadowBlur=12;
      ctx.font=`600 ${vertical?22:24}px ${$('#fontSelect').value}, sans-serif`;ctx.letterSpacing='3px';ctx.fillText((state.background==='내 사진'?'VANILLASKY':state.background.toUpperCase()),pad,h-(vertical?285:200));
      ctx.letterSpacing='0px';ctx.font=`700 ${vertical?42:44}px ${$('#fontSelect').value}, sans-serif`;
      const words=makePreviewText()?scene.caption:$('#carName').value.trim(); wrapText(ctx,words,pad,h-(vertical?224:140),w-pad*2,vertical?53:55);
      ctx.font=`500 ${vertical?22:20}px ${$('#fontSelect').value}, sans-serif`;ctx.fillStyle='#ffffffd9';ctx.fillText($('#carName').value.trim(),pad,h-(vertical?90:60));
      if(state.logo){const logo=new Image();logo.onload=()=>{ctx.globalAlpha=.9;ctx.drawImage(logo,w-pad-90,vertical?55:42,90,46);ctx.globalAlpha=1;};logo.src=state.logo;}
      ctx.shadowBlur=0; ctx.fillStyle='#ffffffb8';ctx.font=`500 ${vertical?18:15}px ${$('#fontSelect').value}, sans-serif`;ctx.textAlign='right';ctx.fillText(`${String(sceneIndex+1).padStart(2,'0')} / ${String(state.scenes.length).padStart(2,'0')}`,w-pad,h-32);
  }
  function wrapText(ctx,text,x,y,maxWidth,lineHeight){const words=String(text).split(' ');let line='';const lines=[];for(const word of words){const test=line?`${line} ${word}`:word;if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=word;}else line=test;}if(line)lines.push(line);lines.slice(0,3).forEach((l,i)=>ctx.fillText(l,x,y+i*lineHeight));}
  function updatePreview(){ if(!state.scenes.length)return; drawFrame(currentScene,0); $('#timeline').innerHTML='';state.scenes.forEach((scene,i)=>{const seg=document.createElement('i');seg.className=`timeline-segment${i===currentScene?' active':''}`;seg.addEventListener('click',()=>{currentScene=i;drawFrame(i);$$('.timeline-segment').forEach((x,j)=>x.classList.toggle('active',i===j));});$('#timeline').appendChild(seg);}); }
  $('#prevScene').addEventListener('click',()=>{currentScene=(currentScene-1+state.scenes.length)%state.scenes.length;updatePreview();});$('#nextScene').addEventListener('click',()=>{currentScene=(currentScene+1)%state.scenes.length;updatePreview();});
  $('#playPreview').addEventListener('click',()=>{if(previewTimer){clearInterval(previewTimer);previewTimer=null;$('#playPreview').textContent='▶';return;}$('#playPreview').textContent='Ⅱ';let started=performance.now();previewTimer=setInterval(()=>{const elapsed=performance.now()-started, total=state.scenes.reduce((s,x)=>s+x.duration*1000,0);if(elapsed>total){clearInterval(previewTimer);previewTimer=null;$('#playPreview').textContent='▶';return;}let mark=elapsed/1000;let i=0;while(i<state.scenes.length-1&&mark>=state.scenes[i].duration){mark-=state.scenes[i].duration;i++;}currentScene=i;drawFrame(i,mark*1000);$$('.timeline-segment').forEach((x,j)=>x.classList.toggle('active',i===j));},100);});
  async function renderVideo() {
    if(!window.MediaRecorder||!HTMLCanvasElement.prototype.captureStream)return showNotice('동영상 저장을 지원하지 않습니다','이 브라우저에서는 캔버스 동영상 녹화를 지원하지 않습니다. 최신 Chrome 또는 Edge에서 다시 시도해 주세요.');
    const canvas=$('#previewCanvas'), ctx=canvas.getContext('2d'); const stream=canvas.captureStream(30); let audioContext=null, audioNodes=[];
    try { audioContext=new (window.AudioContext||window.webkitAudioContext)(); await audioContext.resume(); const destination=audioContext.createMediaStreamDestination(); const freq=state.music==='Highway'?196:state.music==='Evening'?146:state.music==='Grand tour'?130:state.music==='Glide slow'?164:174; [1,1.25,1.5].forEach((ratio,index)=>{const osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.type=index===0?'sine':'triangle';osc.frequency.value=freq*ratio;gain.gain.value=index===0?.035:.012;osc.connect(gain).connect(destination);osc.start();audioNodes.push(osc,gain);}); destination.stream.getAudioTracks().forEach(track=>stream.addTrack(track)); } catch { audioContext=null; }
    let mime='video/webm;codecs=vp9';if(!MediaRecorder.isTypeSupported(mime))mime='video/webm;codecs=vp8';if(!MediaRecorder.isTypeSupported(mime))mime='video/webm';
    const recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:4500000}),chunks=[]; recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
    const progress=$('#renderProgress');progress.classList.remove('hidden');$('#downloadVideo').disabled=true;$('#downloadVideo').innerHTML='영상을 만드는 중…';
    const duration=state.scenes.reduce((sum,s)=>sum+s.duration,0)*1000;const started=performance.now();let sceneIndex=0;
    const stopped=new Promise((resolve,reject)=>{recorder.addEventListener('stop',resolve,{once:true});recorder.addEventListener('error',event=>reject(event.error||new Error('WebM 녹화 중 오류가 발생했습니다.')),{once:true});});
    recorder.start(250);
    await new Promise(resolve=>{function frame(){const elapsed=performance.now()-started;let remain=elapsed/1000;sceneIndex=0;while(sceneIndex<state.scenes.length-1&&remain>=state.scenes[sceneIndex].duration){remain-=state.scenes[sceneIndex].duration;sceneIndex++;}currentScene=sceneIndex;drawFrame(sceneIndex,remain*1000);const pct=Math.min(100,Math.floor(elapsed/duration*100));$('#progressValue').textContent=`${pct}%`;$('#progressBar').style.width=`${pct}%`;$('#progressLabel').textContent=`${sceneIndex+1} / ${state.scenes.length} 장면 렌더링`;if(elapsed>=duration){resolve();return;}requestAnimationFrame(frame);}frame();});
    recorder.stop();
    // Some embedded browsers delay MediaRecorder's stop event even after the
    // final frame was captured. Keep the generated chunks and finish the local
    // export after a short bounded wait instead of leaving the UI at 100%.
    await Promise.race([stopped,new Promise(resolve=>setTimeout(resolve,4000))]);
    if(!chunks.length)throw new Error('녹화 데이터가 생성되지 않았습니다. 브라우저를 새로고침한 뒤 다시 시도해 주세요.');
    state.rendered=new Blob(chunks,{type:mime});const url=URL.createObjectURL(state.rendered);const anchor=document.createElement('a');anchor.href=url;const slug=$('#carName').value.trim().replace(/[^a-z0-9가-힣]+/gi,'-').replace(/^-|-$/g,'')||'vanillasky-video';anchor.download=`${slug}-${state.ratio==='9:16'?'shorts':'listing'}.webm`;anchor.click();setTimeout(()=>URL.revokeObjectURL(url),60000);
    stream.getTracks().forEach(track=>track.stop());audioNodes.forEach(node=>{try{node.stop?.();node.disconnect?.();}catch{}});audioContext?.close();$('#progressLabel').textContent='영상 다운로드가 시작됐어요';$('#progressValue').textContent='완료';$('#progressBar').style.width='100%';$('#downloadVideo').disabled=false;$('#downloadVideo').innerHTML='영상 다시 만들기 <span>↓</span>';$('#downloadAgain').hidden=false;setStep(4);
  }
  $('#downloadVideo').addEventListener('click',renderVideo);$('#downloadAgain').addEventListener('click',renderVideo);
  $('#linePerScene').addEventListener('change',()=>updatePreview());$('#fontSelect').addEventListener('change',()=>updatePreview());
  $('#menuButton').addEventListener('click',()=>showNotice('VanillaSky','차량을 등록하고 영상 설정을 완료하면 미리보기와 다운로드가 가능합니다.'));
  // App opens with the reference service's car listing and landscape defaults.
  updateSelectionSummary();
})();
