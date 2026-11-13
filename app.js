(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const state = { photos: [], scenes: [], format: 'social', ratio: '9:16', style: 'Trailer', background: '당신의 사진', music: 'Taiko', voice: false, speaker: '한국어 기본 음성', font: 'Inter', logo: null, rendered: null, reorderFrom: -1 };
  const styles = [
    { name: 'Walkaround', desc: '외관, 주요 특징 및 실내를 보여주세요.', duration: 43, photos: 8, sceneCount: 9, labels: ['시작','사진 1','반대편','세부 정보','대시보드','실내 1','실내 2','실내 3','엔딩 카드'] },
    { name: 'Spec Sheet', desc: '차량의 주요 정보를 화면에 하나씩 표시하세요.', duration: 26, photos: 4, sceneCount: 5, labels: ['시작','차량 정보','세부 정보','사양','엔딩 카드'] },
    { name: 'Interior', desc: '대시보드, 좌석 및 실내 세부 사항에 집중하세요.', duration: 35, photos: 7, sceneCount: 8, labels: ['시작','대시보드','운전석','좌석','실내 세부','수납공간','편의 기능','엔딩 카드'] },
    { name: 'Condition', desc: '구매자에게 차량의 상태와 세부 사항을 보여주세요.', duration: 34, photos: 6, sceneCount: 7, labels: ['시작','외관 점검','휠과 타이어','실내 점검','세부 정보','차량 상태','엔딩 카드'] },
    { name: 'Narrated', desc: '음성 설명을 통해 차량에 대한 정보를 제공합니다.', duration: 34, photos: 6, sceneCount: 8, labels: ['시작','외관 소개','주행 정보','실내 공간','주요 사양','편의 기능','요약','엔딩 카드'] },
    { name: 'Trailer', desc: '영화 같은 구도와 극적인 속도감으로 자동차를 공개하세요.', duration: 23, photos: 4, sceneCount: 6, labels: ['영웅','도착','상세 정보','캐빈','사실들','엔딩 카드'], durations: [4,5,2.7,2.3,4.6,4.6] },
    { name: 'Beat', desc: '음악에 맞춰 자동차 사진을 빠르게 연속해서 보여주세요.', duration: 10, photos: 5, sceneCount: 7, labels: ['시작','비트 1','비트 2','비트 3','비트 4','클라이맥스','엔딩'], durations: [1.1,1.1,1.2,1.2,1.3,1.5,2.6] },
    { name: 'Pulse', desc: '차량 정보와 가격을 보여주고 음악으로 전환 속도를 높이세요.', duration: 21, photos: 4, sceneCount: 6, labels: ['시작','외관','가격','주요 특징','실내','엔딩 카드'] },
    { name: 'Journey', desc: '카메라를 천천히 움직여 자동차를 보여준 다음 가격을 보여주세요.', duration: 25, photos: 4, sceneCount: 6, labels: ['시작','도착','외관','주행 정보','실내','엔딩 카드'] },
    { name: 'Deal', desc: '가격을 먼저 제시한 다음, 차량과 주요 특징을 보여주세요.', duration: 27, photos: 4, sceneCount: 7, labels: ['가격','제안','외관','특징','실내','상태','엔딩 카드'] },
    { name: 'Three', desc: '세 가지 특징을 강조하고, 각 특징에 대한 사진을 첨부하세요.', duration: 16, photos: 4, sceneCount: 5, labels: ['시작','특징 1','특징 2','특징 3','엔딩 카드'] },
    { name: 'Cabin', desc: '편안한 분위기의 사진들을 통해 내부를 보여주세요.', duration: 18, photos: 5, sceneCount: 6, labels: ['시작','대시보드','좌석','수납공간','편의 기능','엔딩 카드'] },
  ];
  const styleTitles = { Walkaround:'차량 둘러보기', 'Spec Sheet':'차량 사양', Interior:'실내 소개', Condition:'차량 상태', Narrated:'음성 해설', Trailer:'트레일러', Beat:'비트', Pulse:'펄스', Journey:'여정', Deal:'가격 제안', Three:'세 가지 특징', Cabin:'실내 공간' };
  const backgrounds = [
    ['당신의 사진', '원본 사진'], ['산길', '산길 색감'], ['해안 도로', '해안 색감'], ['야간 도심', '야간 색감'], ['도심 광장', '도시 색감'], ['루프톱', '노을 색감'], ['사막', '따뜻한 색감'], ['숲길', '숲 색감'], ['전원 도로', '자연 색감'], ['전시장', '중성 색감'], ['차고', '차분한 색감'], ['블랙 스튜디오', '어두운 색감'], ['화이트 스튜디오', '밝은 색감'],
  ];
  const tracks = [{ name: 'Taiko', title:'타이코', desc: '트레일러 분위기' }, { name: 'Bram', title:'브람', desc: '웅장하고 차분한 분위기' }, { name: 'Slow strings', title:'느린 현악기', desc: '잔잔한 현악기 분위기' }, { name: 'Choir', title:'합창', desc: '웅장한 합창 분위기' }, { name: 'Neon trailer', title:'네온 트레일러', desc: '도시적인 긴장감' }, { name: 'War drums', title:'전쟁 북소리', desc: '강한 타악기 분위기' }];
  let speakers = [];
  const bgColors = ['#d9d4c8,#a1aaa2', '#9eb5bf,#e0c79a,#758278', '#8db5bc,#d8c8a6,#566f72', '#233342,#687b84,#19262d', '#778b92,#c8b88e,#465251', '#bd9f7e,#536a6e,#35474a', '#ddb68a,#b87655,#756044', '#c1d1c4,#74897d,#b4baa5', '#b6c49a,#dfd3ad,#9aa590', '#c2b9a5,#e2cfaa,#71786e', '#b5b7b0,#737d79,#404c4a', '#242b31,#5b6264,#11181d', '#efede5,#c5cbc4,#7f8f8b'];
  const inputPhotos = $('#photoInput'), photoList = $('#photoList'), dropzone = $('#dropzone');
  function showNotice(title, body) { $('#dialogTitle').textContent = title; $('#dialogBody').textContent = body; $('#noticeDialog').showModal(); }
  async function decodeVin(vin) {
    try {
      const endpoint = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${encodeURIComponent(vin)}?format=json`;
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('VIN 조회 서비스에 연결할 수 없습니다.');
      const payload = await response.json(); const record = payload.Results?.[0];
      if (!record || (record.ErrorCode && record.ErrorCode !== '0')) throw new Error('차량 정보를 찾지 못했습니다. VIN을 확인해 주세요.');
      const name = [record.ModelYear, record.Make, record.Model, record.Trim].filter(Boolean).join(' ');
      if (!name) throw new Error('이 VIN의 차량명 정보를 제공하지 않습니다. 사진 업로드 후 직접 입력해 주세요.');
      $('#carName').value = name; $('#seller').value = '';
      $$('.choice').forEach(x => x.classList.toggle('active', x.dataset.tab === 'photos')); $('#linkPanel').classList.add('hidden'); $('#photoPanel').classList.remove('hidden');
      $('#uploadStatus').textContent = `${name} 정보를 VIN에서 확인했어요. 사진을 올려 계속해 주세요.`;
    } catch (error) {
      showNotice('VIN 정보를 확인할 수 없습니다', `${error.message || '잠시 후 다시 시도해 주세요.'} · VIN은 미국 NHTSA vPIC 조회 서비스로 전송됩니다.`);
    }
  }
  $('#dialogClose').addEventListener('click', () => $('#noticeDialog').close());
  function setStep(step) {
    $$('.step').forEach(el => el.classList.toggle('active', Number(el.dataset.step) <= step));
    $('#stepLabel').textContent = `${step} / 4 · ${['', '목록', '나만의 것으로 만들어보세요', '결제', '동영상'][step]}`;
    $('#stepTitle').textContent = ['','차량을 추가하세요','나만의 것으로 만들어보세요','영상 미리보기','동영상 준비'][step];
    $('.builder-heading').classList.toggle('editor-heading', step === 2);
    $('.steps').classList.toggle('hidden', step === 1);
    $('.price-tag').classList.toggle('hidden', step === 1);
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
    if (!url) return showNotice('매물 링크 입력', '매물 주소 또는 17자리 VIN을 입력해 주세요.');
    if (/^[A-HJ-NPR-Z0-9]{17}$/i.test(url)) {
      $('#parseLink').disabled = true; $('#parseLink').textContent = '확인 중…';
      decodeVin(url).finally(() => { $('#parseLink').disabled = false; $('#parseLink').textContent = '계속하다 →'; });
      return;
    }
    showNotice('사진을 업로드해 주세요', '매물 링크의 사진과 세부 정보는 원본 서비스 서버가 가져옵니다. 이 독립 버전에는 매물 사이트 연동 서버가 연결되어 있지 않으므로, 사진 업로드와 차량 정보를 직접 입력해 계속할 수 있습니다.');
    $$('.choice').forEach(x => x.classList.toggle('active', x.dataset.tab === 'photos')); $('#linkPanel').classList.add('hidden'); $('#photoPanel').classList.remove('hidden');
  });
  $('#toEditor').addEventListener('click', async () => {
    if (state.photos.length < 3) return showNotice('사진을 3장 이상 선택해 주세요', '차량의 전면, 측면, 후면이나 실내 사진을 최소 3장 올리면 영상 장면을 구성할 수 있습니다.');
    if (!$('#carName').value.trim()) return showNotice('차량명을 입력해 주세요', '영상에 표시할 차량명을 입력해 주세요.');
    await Promise.all(state.photos.map(photo=>photo.image.decode().catch(()=>undefined)));
    makeScenes(); updateCarSummary(); drawStyleChoices(); drawBackgroundChoices(); drawMusicChoices(); drawSpeakers(); setStep(2);
  });
  function updateCarSummary() {
    $('#summaryName').textContent = $('#carName').value.trim();
    $('#summaryMeta').textContent = [$('#mileage').value.trim(), $('#price').value.trim()].filter(Boolean).join(' · ') || '차량 정보';
    $('#summaryPhoto').innerHTML = `${state.photos.slice(0,12).map((photo,i)=>`<img src="${photo.url}" alt="차량 사진 ${i+1}">`).join('')}${state.photos.length>12?`<span class="more-photos">+${state.photos.length-12}</span>`:''}`;
    updateSelectionSummary();
  }
  $('#editCar').addEventListener('click', () => setStep(1)); $('#backToUpload').addEventListener('click', () => setStep(1));
  const listingNames = ['Walkaround','Spec Sheet','Interior','Condition','Narrated'];
  const socialNames = ['Trailer','Beat','Pulse','Journey','Deal','Three','Cabin'];
  function drawStyleChoices() {
    const names = state.format === 'social' ? socialNames : listingNames;
    $('#styleGrid').innerHTML = '';
    names.forEach((name, i) => {
      const info = styles.find(x => x.name === name); const button = document.createElement('button');
      const shot = state.photos[i % state.photos.length];
      button.className = `style-option${state.style===name?' active':''}`; button.innerHTML = `<span class="style-cover"><img src="${shot.url}" alt="${styleTitles[name]} 스타일 미리보기"><i>미리보기</i><b>${name === 'Trailer' ? $('#carName').value.trim() : styleTitles[name]}</b></span><span class="style-name">${styleTitles[name]}</span><span class="style-desc">약 ${info.duration}초 · 사진 ${info.photos}장 · 장면 ${info.sceneCount}개</span><span class="style-detail">${info.desc}</span>`;
      button.addEventListener('click', () => { state.style=name; drawStyleChoices(); updateSelectionSummary(); makeScenes(); }); $('#styleGrid').appendChild(button);
    });
  }
  function drawBackgroundChoices() {
    const grid = $('#backgroundGrid'); grid.innerHTML='';
    backgrounds.forEach(([name, desc], i) => { const button=document.createElement('button'); button.className=`bg-option${state.background===name?' active':''}`; button.innerHTML=`<span class="bg-swatch" style="background:linear-gradient(145deg,${bgColors[i]})"></span><span>${name}</span>`; button.title=desc; button.addEventListener('click',()=>{state.background=name; drawBackgroundChoices(); updateSelectionSummary(); updatePreview();}); grid.appendChild(button); });
  }
  function updateSelectionSummary() {
    $('#sumRatio').textContent = state.ratio === '9:16' ? '세로형 · 9:16' : '가로형 · 16:9';
    $('#sumStyle').textContent = styleTitles[state.style] || state.style; $('#sumBackground').textContent = state.background;
    $('#sumFormat').textContent = state.format === 'social' ? '소셜 미디어 게시물용' : '차량 매물 정보';
    $('#sumPrice').textContent = state.format === 'social' ? '이 스타일에서 사용되는 곳에 포함됩니다.' : '가격은 영상에 포함되지 않습니다.';
    $('#sumMusic').textContent = `${tracks.find(track=>track.name===state.music)?.title||state.music} · ${state.voice ? state.speaker : '나레이션 꺼짐'}`;
    $('#sumBrand').textContent = `${state.logo ? $('#logoName').textContent : '로고 없음'} · ${state.font}`;
    $('#voiceSummary').textContent = state.voice ? `${$('#voiceLanguage').selectedOptions[0].textContent} · ${state.speaker}` : '꺼짐 · 나레이션 없음';
    $('.price-tag').textContent = state.style === 'Trailer' ? '영상당 5달러 · 구독료 없음' : `영상당 5달러 · 약 ${styles.find(s=>s.name===state.style)?.duration || 23}초`;
  }
  $$('.seg[data-format]').forEach(button => button.addEventListener('click', () => {
    state.format=button.dataset.format; $$('.seg[data-format]').forEach(x=>x.classList.toggle('active',x===button));
    $('#formatHelp').textContent=state.format==='social'?'차량의 모습, 가격 및 주요 세부 정보를 보여줍니다.':'차량과 주요 특징을 보여주지만 가격은 공개하지 않습니다.';
    state.ratio=state.format==='social'?'9:16':'16:9'; $$('.seg[data-ratio]').forEach(x=>x.classList.toggle('active',x.dataset.ratio===state.ratio));
    $('#ratioHelp').textContent=state.ratio==='9:16'?'9:16 · 인스타그램 릴스 & 스토리, 틱톡, 유튜브 쇼츠.':'16:9 · 목록, 웹사이트 및 YouTube.';
    const choices=state.format==='social'?socialNames:listingNames; if(!choices.includes(state.style)) state.style=choices[0]; drawStyleChoices(); updateSelectionSummary(); makeScenes();
  }));
  $$('.seg[data-ratio]').forEach(button=>button.addEventListener('click',()=>{state.ratio=button.dataset.ratio; $$('.seg[data-ratio]').forEach(x=>x.classList.toggle('active',x===button));$('#ratioHelp').textContent=state.ratio==='9:16'?'9:16 · 인스타그램 릴스 & 스토리, 틱톡, 유튜브 쇼츠.':'16:9 · 목록, 웹사이트 및 YouTube.'; updateSelectionSummary();}));
  function drawMusicChoices() {
    $('#musicGrid').innerHTML=''; tracks.forEach(track=>{const card=document.createElement('div');card.className=`music-option${state.music===track.name?' active':''}`;card.innerHTML=`<button type="button" aria-label="${track.title} 선택"><span>♫</span><b>${track.title}</b><small>${track.desc}</small></button>`;card.querySelector('button').addEventListener('click',()=>{state.music=track.name;drawMusicChoices();updateSelectionSummary();});$('#musicGrid').appendChild(card);});
  }
  function drawSpeakers() {
    const language=$('#voiceLanguage').value;
    const available=('speechSynthesis' in window ? speechSynthesis.getVoices() : []).filter(voice=>voice.lang.toLowerCase().startsWith(language.slice(0,2).toLowerCase()));
    speakers=available.map(voice=>({name:voice.name,desc:`기기 음성 · ${voice.lang}`,lang:voice.lang}));
    if(!speakers.length) speakers=[{name:`${$('#voiceLanguage').selectedOptions[0].textContent} 기본 음성`,desc:'브라우저에서 제공하는 기본 음성',lang:language}];
    if(!speakers.some(x=>x.name===state.speaker)) state.speaker=speakers[0].name;
    $('#speakerGrid').innerHTML=''; speakers.slice(0,8).forEach(speaker=>{const card=document.createElement('button');card.type='button';card.className=`speaker-option${state.speaker===speaker.name?' active':''}`;card.innerHTML=`<span>▶</span><b>${escapeAttr(speaker.name)}</b><small>${escapeAttr(speaker.desc)}</small>`;card.addEventListener('click',()=>{state.speaker=speaker.name;drawSpeakers();updateSelectionSummary();});$('#speakerGrid').appendChild(card);});
  }
  $('#voiceToggle').addEventListener('change',()=>{state.voice=$('#voiceToggle').checked;$('#voiceScript').classList.toggle('hidden',!state.voice);updateSelectionSummary();});
  $('#voiceLanguage').addEventListener('change',()=>{const lang=$('#voiceLanguage').value; speakers.splice(0,speakers.length,...(lang==='ko-KR'?[{name:'한국어 기본 음성',desc:'기기에서 제공하는 자연스러운 음성',lang:'ko-KR'},{name:'한국어 여성 음성',desc:'한국어 여성 음성',lang:'ko-KR'},{name:'한국어 남성 음성',desc:'한국어 남성 음성',lang:'ko-KR'}]:[{name:'기본 음성',desc:'기기에서 제공하는 음성',lang},{name:'음성 2',desc:'기기에서 제공하는 음성',lang}]));state.speaker=speakers[0].name;drawSpeakers();updateSelectionSummary();});
  $('#speakScript').addEventListener('click',()=>{if(!('speechSynthesis'in window))return showNotice('음성 안내를 사용할 수 없습니다','브라우저가 음성 읽기를 지원하지 않습니다.');const utterance=new SpeechSynthesisUtterance($('#scriptText').value||$('#carName').value);utterance.lang=$('#voiceLanguage').value;utterance.voice=speechSynthesis.getVoices().find(voice=>voice.name===state.speaker)||null;utterance.rate=.92;window.speechSynthesis.cancel();window.speechSynthesis.speak(utterance);});
  $('#logoInput').addEventListener('change',e=>{const file=e.target.files[0];if(!file)return;state.logo=URL.createObjectURL(file);$('#logoName').textContent=file.name;updateSelectionSummary();});
  $$('.font-pills button').forEach(button=>button.addEventListener('click',()=>{$$('.font-pills button').forEach(x=>x.classList.toggle('active',x===button));state.font=button.dataset.font;$('#fontSelect').value=state.font;updateSelectionSummary();updatePreview();}));
  const defaultLines = (index) => {
    const name=$('#carName').value.trim(); const seller=$('#seller').value.trim(); const price=$('#price').value.trim(); const mileage=$('#mileage').value.trim();
    const labels=['차량의 첫인상을 확인해 보세요','선명한 외관과 균형 잡힌 디자인','꼼꼼하게 살펴본 실내 공간','차량의 매력을 직접 확인해 보세요','오늘, 새로운 드라이빙을 만나보세요'];
    if(index===0)return `${name} · ${labels[0]}`; if(index===state.photos.length-1)return seller?`${seller}에서 만나보세요`:price?`${price} · 자세한 상담은 문의해 주세요`:labels[4];
    if(index===1&&mileage)return `주행거리 ${mileage} · ${labels[1]}`; return labels[(index+1)%labels.length];
  };
  function makeScenes() {
    const info=styles.find(s=>s.name===state.style)||styles[0]; const count=info.sceneCount;
    const prev=state.scenes; state.scenes=Array.from({length:count},(_,i)=>({ photo: state.photos[Math.min(state.photos.length-1,Math.floor(i*state.photos.length/count))], title: info.labels[i]||`장면 ${i+1}`, caption: prev[i]?.caption || defaultLines(i), duration: info.durations?.[i] ?? Math.round(info.duration/count*10)/10, movement: i===0?'카메라 이동':i%2?'사진 · 슬로우 줌':'사진 · 슬로우 패닝' }));
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
  $('#makePreview').addEventListener('click',()=>{updateSelectionSummary();$('#exportRatio').textContent=state.ratio==='9:16'?'세로형 9:16 · 720 × 1280':'가로형 16:9 · 1280 × 720';$('#renderStage').classList.toggle('landscape',state.ratio==='16:9');$('#exportLength').textContent=`약 ${Math.round(state.scenes.reduce((s,x)=>s+x.duration,0))}초`;setStep(3);});
  $('#checkoutButton').addEventListener('click',()=>showNotice('결제 서비스가 연결되어 있지 않습니다','원본 VanillaSky는 Stripe로 5달러를 결제한 뒤 AI 모션 영상을 제작합니다. 이 독립 버전에서는 결제를 받지 않으며, 아래 무료 브라우저 미리보기와 WebM 다운로드를 사용할 수 있습니다.'));
  $('#changeSettings').addEventListener('click',()=>setStep(2));
  let previewTimer=null, currentScene=0;
  function drawFrame(sceneIndex=0, time=0) {
    const canvas=$('#previewCanvas'); const ctx=canvas.getContext('2d'); const vertical=state.ratio==='9:16'; canvas.width=vertical?720:1280; canvas.height=vertical?1280:720;
    const scene=state.scenes[sceneIndex%state.scenes.length]; if(!scene)return; const img=scene.photo.image; if(!img.complete||!img.naturalWidth)return;
      const w=canvas.width,h=canvas.height, cover=Math.max(w/img.width,h/img.height), progress=(time%3000)/3000, zoom=1.04+progress*.09, sw=w/(cover*zoom),sh=h/(cover*zoom),sx=(img.width-sw)/2+Math.sin(progress*Math.PI)*img.width*.012,sy=(img.height-sh)/2;
      ctx.drawImage(img,sx,sy,sw,sh,0,0,w,h);
      if(state.background!=='당신의 사진'){const palette=bgColors[backgrounds.findIndex(item=>item[0]===state.background)]||bgColors[0];const tint=palette.split(',')[0];ctx.fillStyle=tint+'30';ctx.fillRect(0,0,w,h);}
      const grad=ctx.createLinearGradient(0,0,0,h);grad.addColorStop(0,'rgba(9,17,21,.06)');grad.addColorStop(.47,'rgba(9,17,21,.02)');grad.addColorStop(1,'rgba(9,17,21,.82)');ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
      const pad=vertical?54:68; ctx.textAlign='left';ctx.fillStyle='#fff';ctx.shadowColor='#1119';ctx.shadowBlur=12;
      ctx.font=`600 ${vertical?22:24}px ${$('#fontSelect').value}, sans-serif`;ctx.letterSpacing='3px';ctx.fillText((state.background==='당신의 사진'?'VANILLASKY':state.background.toUpperCase()),pad,h-(vertical?285:200));
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
    const canvas=$('#previewCanvas'); const stream=canvas.captureStream(30);
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
    stream.getTracks().forEach(track=>track.stop());$('#progressLabel').textContent='영상 다운로드가 시작됐어요';$('#progressValue').textContent='완료';$('#progressBar').style.width='100%';$('#downloadVideo').disabled=false;$('#downloadVideo').innerHTML='영상 다시 만들기 <span>↓</span>';$('#downloadAgain').hidden=false;setStep(4);
  }
  const renderSafely=async()=>{try{await renderVideo();}catch(error){$('#downloadVideo').disabled=false;$('#downloadVideo').innerHTML='영상 파일 저장 <span>↓</span>';showNotice('영상 저장에 실패했습니다',error.message||'브라우저를 새로고침한 뒤 다시 시도해 주세요.');}};
  $('#downloadVideo').addEventListener('click',renderSafely);$('#downloadAgain').addEventListener('click',renderSafely);
  $('#linePerScene').addEventListener('change',()=>updatePreview());$('#fontSelect').addEventListener('change',()=>updatePreview());
  $('#menuButton').addEventListener('click',()=>showNotice('VanillaSky','차량을 등록하고 영상 설정을 완료하면 미리보기와 다운로드가 가능합니다.'));
  drawMusicChoices(); drawSpeakers();
  if ('speechSynthesis' in window) speechSynthesis.addEventListener('voiceschanged',drawSpeakers);
  updateSelectionSummary();
})();

