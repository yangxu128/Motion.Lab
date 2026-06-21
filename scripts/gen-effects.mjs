#!/usr/bin/env node
// scripts/gen-effects.mjs — Generate data/effects.ts from a compact spec table.
import { writeFileSync } from 'node:fs';

const SPEC = [
  // [id, name, englishName, category, difficulty, description, params, code]
  ['fade-in', '淡入', 'Fade In', 'basic', 1, '元素从透明渐入到不透明,最基础的进入动画。',
    [{ key: 'duration', label: '时长', min: 0.2, max: 3, step: 0.1, default: 0.8, unit: 's' },
     { key: 'delay', label: '延迟', min: 0, max: 2, step: 0.1, default: 0, unit: 's' }],
    { html: '<div class="fade-in">Hello</div>',
      css: '.fade-in { animation: fadeIn var(--duration, 0.8s) ease-out var(--delay, 0s) both; }\n@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }',
      js: '// Pure CSS — no JS needed' }],

  ['fade-in-up', '上滑淡入', 'Fade In Up', 'basic', 1, '元素从下方淡入,常用于列表项。',
    [{ key: 'duration', label: '时长', min: 0.2, max: 3, step: 0.1, default: 0.8, unit: 's' },
     { key: 'distance', label: '距离', min: 10, max: 80, step: 5, default: 20, unit: 'px' }],
    { html: '<div class="fade-in-up">Hello</div>',
      css: '.fade-in-up { animation: fadeInUp var(--duration, 0.8s) ease-out both; }\n@keyframes fadeInUp { from { opacity: 0; transform: translateY(var(--distance, 20px)); } to { opacity: 1; transform: translateY(0); } }',
      js: '// Pure CSS' }],

  ['slide-in-left', '左侧滑入', 'Slide In Left', 'basic', 1, '元素从左侧滑入视口。',
    [{ key: 'duration', label: '时长', min: 0.2, max: 2, step: 0.1, default: 0.6, unit: 's' }],
    { html: '<div class="slide-left">→</div>',
      css: '.slide-left { animation: slideLeft var(--duration, 0.6s) ease-out both; }\n@keyframes slideLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }',
      js: '' }],

  ['slide-in-right', '右侧滑入', 'Slide In Right', 'basic', 1, '元素从右侧滑入视口。',
    [{ key: 'duration', label: '时长', min: 0.2, max: 2, step: 0.1, default: 0.6, unit: 's' }],
    { html: '<div class="slide-right">←</div>',
      css: '.slide-right { animation: slideRight var(--duration, 0.6s) ease-out both; }\n@keyframes slideRight { from { transform: translateX(100%); } to { transform: translateX(0); } }',
      js: '' }],

  ['zoom-bounce', '缩放弹跳', 'Zoom Bounce', 'basic', 1, '元素放大入场,带弹跳回弹。',
    [{ key: 'duration', label: '时长', min: 0.3, max: 2, step: 0.1, default: 0.8, unit: 's' }],
    { html: '<div class="zoom-bounce">●</div>',
      css: '.zoom-bounce { animation: zoomBounce var(--duration, 0.8s) cubic-bezier(0.34, 1.56, 0.64, 1) both; }\n@keyframes zoomBounce { from { transform: scale(0); } to { transform: scale(1); } }',
      js: '' }],

  ['flip-x', '水平翻转', 'Flip X', 'basic', 2, '元素绕 X 轴翻转入场。',
    [{ key: 'duration', label: '时长', min: 0.3, max: 2, step: 0.1, default: 0.8, unit: 's' }],
    { html: '<div class="flip-x">↻</div>',
      css: '.flip-x { animation: flipX var(--duration, 0.8s) ease-out both; transform-origin: center; }\n@keyframes flipX { from { transform: perspective(600px) rotateX(-90deg); opacity: 0; } to { transform: perspective(600px) rotateX(0); opacity: 1; } }',
      js: '' }],

  ['rotate-in', '旋转入场', 'Rotate In', 'basic', 1, '元素从旋转状态回归原位。',
    [{ key: 'duration', label: '时长', min: 0.3, max: 2, step: 0.1, default: 0.7, unit: 's' }],
    { html: '<div class="rotate-in">★</div>',
      css: '.rotate-in { animation: rotateIn var(--duration, 0.7s) ease-out both; }\n@keyframes rotateIn { from { transform: rotate(-180deg) scale(0.3); opacity: 0; } to { transform: rotate(0) scale(1); opacity: 1; } }',
      js: '' }],

  ['pulse', '脉冲', 'Pulse', 'basic', 1, '元素持续放大缩小,吸引注意。',
    [{ key: 'duration', label: '周期', min: 0.5, max: 3, step: 0.1, default: 1.5, unit: 's' },
     { key: 'intensity', label: '强度', min: 0.05, max: 0.4, step: 0.05, default: 0.15 }],
    { html: '<div class="pulse">●</div>',
      css: '.pulse { animation: pulse var(--duration, 1.5s) ease-in-out infinite; }\n@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(calc(1 + var(--intensity, 0.15))); } }',
      js: '' }],

  ['shake', '摇晃', 'Shake', 'basic', 1, '元素左右快速摇晃,常用于表单错误提示。',
    [{ key: 'duration', label: '时长', min: 0.2, max: 1.5, step: 0.1, default: 0.5, unit: 's' }],
    { html: '<div class="shake">!</div>',
      css: '.shake { animation: shake var(--duration, 0.5s); }\n@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }',
      js: '' }],

  ['heartbeat', '心跳', 'Heartbeat', 'basic', 1, '双拍心跳节奏,模拟真实心跳。',
    [{ key: 'duration', label: '周期', min: 0.5, max: 3, step: 0.1, default: 1.2, unit: 's' }],
    { html: '<div class="heartbeat">♥</div>',
      css: '.heartbeat { animation: heartbeat var(--duration, 1.2s) ease-in-out infinite; }\n@keyframes heartbeat { 0%, 100% { transform: scale(1); } 14% { transform: scale(1.3); } 28% { transform: scale(1); } 42% { transform: scale(1.3); } 70% { transform: scale(1); } }',
      js: '' }],

  ['marquee', '跑马灯', 'Marquee', 'basic', 2, '内容从右向左无限滚动。',
    [{ key: 'duration', label: '周期', min: 5, max: 30, step: 1, default: 12, unit: 's' },
     { key: 'direction', label: '方向', options: ['left', 'right'], default: 'left' }],
    { html: '<div class="marquee"><span>Motion.Lab · 动效实验室 · </span><span>Motion.Lab · 动效实验室 · </span></div>',
      css: '.marquee { display: flex; gap: 32px; animation: marquee var(--duration, 12s) linear infinite; white-space: nowrap; }\n@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }',
      js: '' }],

  ['spinner', '加载旋转', 'Spinner', 'basic', 1, '经典加载指示器。',
    [{ key: 'duration', label: '周期', min: 0.3, max: 2, step: 0.1, default: 0.8, unit: 's' }],
    { html: '<div class="spinner"></div>',
      css: '.spinner { width: 32px; height: 32px; border: 3px solid rgba(0,0,0,0.1); border-top-color: var(--accent); border-radius: 50%; animation: spin var(--duration, 0.8s) linear infinite; }\n@keyframes spin { to { transform: rotate(360deg); } }',
      js: '' }],

  ['typewriter', '打字机', 'Typewriter', 'text', 1, '字符逐个出现,模拟键盘输入。',
    [{ key: 'speed', label: '速度', min: 20, max: 200, step: 10, default: 80, unit: 'ms' }],
    { html: '<div id="typewriter"></div>',
      css: '#typewriter { font-family: monospace; border-right: 2px solid currentColor; padding-right: 4px; animation: caret 0.8s step-end infinite; }\n@keyframes caret { 50% { border-color: transparent; } }',
      js: "const el = document.getElementById('typewriter');\nconst text = 'Hello, Motion.Lab!';\nlet i = 0;\nsetInterval(() => { el.textContent = text.slice(0, i++ % (text.length + 1)); }, 80);" }],

  ['wave-text', '波浪文字', 'Wave Text', 'text', 2, '每个字符上下波动形成波浪。',
    [{ key: 'duration', label: '周期', min: 0.8, max: 3, step: 0.1, default: 1.6, unit: 's' }],
    { html: '<span class="wave-text">WAVE</span>',
      css: '.wave-text span { display: inline-block; animation: wave var(--duration, 1.6s) ease-in-out infinite; }\n.wave-text span:nth-child(n) { animation-delay: calc(0.1s * n); }\n@keyframes wave { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }',
      js: "document.querySelectorAll('.wave-text').forEach(el => el.innerHTML = [...el.textContent].map(c => `<span>${c}</span>`).join(''));" }],

  ['mask-reveal', '遮罩揭示', 'Mask Reveal', 'text', 2, '文字从遮罩下方揭示,常用于 hero 标题。',
    [{ key: 'duration', label: '时长', min: 0.4, max: 2.5, step: 0.1, default: 1.2, unit: 's' }],
    { html: '<h1 class="mask-reveal">MOTION</h1>',
      css: '.mask-reveal { clip-path: inset(0 0 100% 0); animation: reveal var(--duration, 1.2s) cubic-bezier(0.65, 0, 0.35, 1) forwards; }\n@keyframes reveal { to { clip-path: inset(0 0 0 0); } }',
      js: '' }],

  ['split-char', '字符分裂', 'Split Character', 'text', 2, '每个字符从上下分开再合拢。',
    [{ key: 'duration', label: '时长', min: 0.4, max: 2, step: 0.1, default: 0.8, unit: 's' }],
    { html: '<h1 class="split-char">SPLIT</h1>',
      css: '.split-char span { display: inline-block; animation: split var(--duration, 0.8s) ease-out both; }\n.split-char span:nth-child(odd) { animation-name: splitTop; }\n.split-char span:nth-child(even) { animation-name: splitBot; }\n@keyframes splitTop { from { transform: translateY(-100%); } to { transform: translateY(0); } }\n@keyframes splitBot { from { transform: translateY(100%); } to { transform: translateY(0); } }',
      js: "[...document.querySelector('.split-char').textContent].forEach(c => { const s = document.createElement('span'); s.textContent = c; c.replaceWith(s); });" }],

  ['gradient-text', '渐变文字', 'Gradient Text', 'text', 1, '文字使用 HSL 渐变背景 + 循环动画。',
    [{ key: 'duration', label: '周期', min: 2, max: 10, step: 0.5, default: 4, unit: 's' }],
    { html: '<h1 class="gradient-text">COLOR</h1>',
      css: '.gradient-text { background: linear-gradient(90deg, hsl(0 90% 60%), hsl(120 90% 60%), hsl(240 90% 60%)); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: hue var(--duration, 4s) linear infinite; }\n@keyframes hue { to { background-position: 200% 0; } }',
      js: '' }],

  ['glitch-text', '故障文字', 'Glitch Text', 'text', 3, 'RGB 分离故障效果,赛博朋克风。',
    [{ key: 'duration', label: '周期', min: 1, max: 5, step: 0.1, default: 2.5, unit: 's' }],
    { html: '<h1 class="glitch" data-text="GLITCH">GLITCH</h1>',
      css: '.glitch { position: relative; }\n.glitch::before, .glitch::after { content: attr(data-text); position: absolute; inset: 0; }\n.glitch::before { color: cyan; animation: glitchA var(--duration, 2.5s) infinite; }\n.glitch::after { color: magenta; animation: glitchB var(--duration, 2.5s) infinite; }\n@keyframes glitchA { 0%, 100% { transform: translate(0); } 20% { transform: translate(-2px, 2px); } 40% { transform: translate(2px, -1px); } }\n@keyframes glitchB { 0%, 100% { transform: translate(0); } 20% { transform: translate(2px, -1px); } 40% { transform: translate(-1px, 2px); } }',
      js: '' }],

  ['scramble', '乱码解码', 'Scramble', 'text', 3, '文字先以乱码出现,逐渐解码为目标文字。',
    [{ key: 'duration', label: '时长', min: 0.5, max: 3, step: 0.1, default: 1.5, unit: 's' }],
    { html: '<span id="scramble"></span>',
      css: '#scramble { font-family: monospace; }',
      js: "const el = document.getElementById('scramble');\nconst target = 'SCRAMBLE';\nconst chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%';\nlet frame = 0;\nconst interval = setInterval(() => {\n  el.textContent = target.split('').map((c, i) => i < frame / 3 ? c : chars[Math.floor(Math.random() * chars.length)]).join('');\n  if (frame++ > target.length * 3) clearInterval(interval);\n}, 50);" }],

  ['count-up', '数字滚动', 'Count Up', 'text', 2, '数字从 0 滚动到目标值。',
    [{ key: 'target', label: '目标值', min: 10, max: 9999, step: 1, default: 1234 }],
    { html: '<span id="count-up">0</span>',
      css: '#count-up { font-variant-numeric: tabular-nums; font-weight: 900; font-size: 48px; }',
      js: "const el = document.getElementById('count-up');\nconst target = 1234;\nconst duration = 1500;\nconst start = performance.now();\nconst tick = (now) => {\n  const t = Math.min(1, (now - start) / duration);\n  el.textContent = Math.floor(target * (1 - Math.pow(1 - t, 3)));\n  if (t < 1) requestAnimationFrame(tick);\n};\nrequestAnimationFrame(tick);" }],

  ['stagger-fade', '错落淡入', 'Stagger Fade', 'text', 2, '多个文字依次淡入,带 stagger 延迟。',
    [{ key: 'duration', label: '单项时长', min: 0.2, max: 1.5, step: 0.1, default: 0.5, unit: 's' },
     { key: 'stagger', label: '间隔', min: 0.05, max: 0.5, step: 0.05, default: 0.1, unit: 's' }],
    { html: '<ul class="stagger"><li>一</li><li>二</li><li>三</li><li>四</li></ul>',
      css: '.stagger li { opacity: 0; animation: fadeIn var(--duration, 0.5s) ease-out forwards; }\n.stagger li:nth-child(1) { animation-delay: 0s; }\n.stagger li:nth-child(2) { animation-delay: var(--stagger, 0.1s); }\n.stagger li:nth-child(3) { animation-delay: calc(var(--stagger, 0.1s) * 2); }\n.stagger li:nth-child(4) { animation-delay: calc(var(--stagger, 0.1s) * 3); }\n@keyframes fadeIn { to { opacity: 1; transform: translateY(0); } }',
      js: '' }],

  ['vertical-marquee', '垂直跑马灯', 'Vertical Marquee', 'text', 2, '文字从下往上垂直滚动。',
    [{ key: 'duration', label: '周期', min: 5, max: 30, step: 1, default: 15, unit: 's' }],
    { html: '<div class="vmarquee"><div>设计 · 设计 · 设计 · 设计</div><div>设计 · 设计 · 设计 · 设计</div></div>',
      css: '.vmarquee { height: 60px; overflow: hidden; }\n.vmarquee > div { animation: vm var(--duration, 15s) linear infinite; }\n@keyframes vm { from { transform: translateY(0); } to { transform: translateY(-100%); } }',
      js: '' }],

  ['magnetic-cursor', '磁吸光标', 'Magnetic Cursor', 'interaction', 2, '光标靠近元素时元素被吸引。',
    [{ key: 'strength', label: '强度', min: 0.1, max: 0.8, step: 0.05, default: 0.4 }],
    { html: '<button class="magnetic">Hover me</button>',
      css: '.magnetic { transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); }',
      js: "const btn = document.querySelector('.magnetic');\nbtn.addEventListener('mousemove', (e) => {\n  const r = btn.getBoundingClientRect();\n  const x = (e.clientX - r.left - r.width / 2) * 0.4;\n  const y = (e.clientY - r.top - r.height / 2) * 0.4;\n  btn.style.transform = `translate(${x}px, ${y}px)`;\n});\nbtn.addEventListener('mouseleave', () => btn.style.transform = '');" }],

  ['three-d-tilt', '3D 倾斜', '3D Tilt', 'interaction', 2, '卡片随鼠标 3D 倾斜。',
    [{ key: 'max', label: '最大角度', min: 5, max: 30, step: 1, default: 15, unit: '°' }],
    { html: '<div class="tilt">TILT</div>',
      css: '.tilt { transform-style: preserve-3d; transition: transform 0.2s; }',
      js: "const el = document.querySelector('.tilt');\nel.addEventListener('mousemove', (e) => {\n  const r = el.getBoundingClientRect();\n  const x = (e.clientX - r.left) / r.width - 0.5;\n  const y = (e.clientY - r.top) / r.height - 0.5;\n  el.style.transform = `perspective(600px) rotateY(${x * 30}deg) rotateX(${-y * 30}deg)`;\n});" }],

  ['ripple-click', '点击波纹', 'Ripple Click', 'interaction', 1, 'Material Design 风格的点击波纹。',
    [{ key: 'duration', label: '时长', min: 0.4, max: 1.5, step: 0.1, default: 0.6, unit: 's' }],
    { html: '<button class="ripple-btn">Click</button>',
      css: '.ripple-btn { position: relative; overflow: hidden; }\n.ripple-btn .ripple { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.5); animation: ripple var(--duration, 0.6s); }\n@keyframes ripple { to { transform: scale(4); opacity: 0; } }',
      js: "document.querySelector('.ripple-btn').addEventListener('click', (e) => {\n  const r = e.currentTarget.getBoundingClientRect();\n  const ripple = document.createElement('span');\n  ripple.className = 'ripple';\n  ripple.style.left = (e.clientX - r.left) + 'px';\n  ripple.style.top = (e.clientY - r.top) + 'px';\n  ripple.style.width = ripple.style.height = '20px';\n  e.currentTarget.appendChild(ripple);\n  setTimeout(() => ripple.remove(), 600);\n});" }],

  ['parallax-mouse', '鼠标视差', 'Parallax Mouse', 'interaction', 2, '多层元素按不同深度响应鼠标。',
    [{ key: 'intensity', label: '强度', min: 5, max: 40, step: 1, default: 20, unit: 'px' }],
    { html: '<div class="parallax"><div class="layer bg" data-depth="1"></div><div class="layer fg" data-depth="3"></div></div>',
      css: '.parallax { position: relative; }\n.layer { position: absolute; inset: 0; transition: transform 0.2s; }',
      js: "document.querySelector('.parallax').addEventListener('mousemove', (e) => {\n  const r = e.currentTarget.getBoundingClientRect();\n  const x = (e.clientX - r.left) / r.width - 0.5;\n  const y = (e.clientY - r.top) / r.height - 0.5;\n  e.currentTarget.querySelectorAll('.layer').forEach(l => {\n    const d = +l.dataset.depth;\n    l.style.transform = `translate(${x * d * 20}px, ${y * d * 20}px)`;\n  });\n});" }],

  ['blob-cursor', '粘性光标', 'Blob Cursor', 'interaction', 2, '光标变成一个跟随的彩色 blob。',
    [{ key: 'size', label: '尺寸', min: 20, max: 80, step: 4, default: 40, unit: 'px' }],
    { html: '<div class="blob"></div>',
      css: '.blob { position: fixed; width: 40px; height: 40px; border-radius: 50%; background: hsl(280 90% 60%); mix-blend-mode: difference; pointer-events: none; transition: transform 0.15s; }',
      js: "const blob = document.querySelector('.blob');\ndocument.addEventListener('mousemove', (e) => {\n  blob.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;\n});" }],

  ['hover-image-distort', '悬停图像畸变', 'Hover Distort', 'interaction', 3, '悬停时图像被 SVG 滤镜畸变。',
    [{ key: 'amount', label: '畸变强度', min: 0, max: 0.05, step: 0.005, default: 0.02 }],
    { html: '<svg width="0" height="0"><filter id="d"><feTurbulence baseFrequency="0.02" numOctaves="2" /><feDisplacementMap in="SourceGraphic" scale="20" /></filter></svg>\n<div class="distort">HOVER</div>',
      css: '.distort { filter: url(#d); transition: filter 0.3s; }',
      js: '' }],

  ['magnetic-button', '磁吸按钮', 'Magnetic Button', 'interaction', 2, '按钮周围区域吸引按钮位移。',
    [{ key: 'radius', label: '吸引半径', min: 30, max: 200, step: 10, default: 80, unit: 'px' }],
    { html: '<button class="mag-btn">PRESS</button>',
      css: '.mag-btn { transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); }',
      js: "const btn = document.querySelector('.mag-btn');\ndocument.addEventListener('mousemove', (e) => {\n  const r = btn.getBoundingClientRect();\n  const dx = e.clientX - (r.left + r.width / 2);\n  const dy = e.clientY - (r.top + r.height / 2);\n  const dist = Math.hypot(dx, dy);\n  if (dist < 80) btn.style.transform = `translate(${dx * 0.3}px, ${dy * 0.3}px)`;\n  else btn.style.transform = '';\n});" }],

  ['sticky-stack', '堆叠翻页', 'Sticky Stack', 'interaction', 3, '滚动时卡片堆叠翻页效果。',
    [{ key: 'count', label: '卡片数', min: 3, max: 8, step: 1, default: 4 }],
    { html: '<div class="stack"><div class="card">1</div><div class="card">2</div><div class="card">3</div></div>',
      css: '.stack .card { position: sticky; top: 80px; padding: 40px; background: white; border-radius: 16px; margin-bottom: 20px; }',
      js: '' }],

  ['drag-scroll', '拖动滚动', 'Drag Scroll', 'interaction', 2, '横向拖动滚动容器。',
    [{ key: 'duration', label: '惯性时长', min: 0.2, max: 1.5, step: 0.1, default: 0.6, unit: 's' }],
    { html: '<div class="drag"><div class="drag-inner"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span></div></div>',
      css: '.drag { overflow: hidden; cursor: grab; user-select: none; }\n.drag:active { cursor: grabbing; }\n.drag-inner { display: flex; gap: 20px; padding: 20px; }',
      js: "const wrap = document.querySelector('.drag');\nlet isDown = false, startX = 0, scrollLeft = 0;\nwrap.addEventListener('mousedown', (e) => { isDown = true; startX = e.pageX; scrollLeft = wrap.scrollLeft; });\nwindow.addEventListener('mouseup', () => isDown = false);\nwrap.addEventListener('mousemove', (e) => { if (!isDown) return; e.preventDefault(); wrap.scrollLeft = scrollLeft - (e.pageX - startX); });" }],

  ['color-picker-hover', '随悬停变色', 'Color Hover', 'interaction', 1, '悬停位置产生彩色光晕。',
    [{ key: 'size', label: '光晕大小', min: 100, max: 600, step: 20, default: 300, unit: 'px' }],
    { html: '<div class="color-hover"></div>',
      css: '.color-hover { background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), hsl(var(--h, 0) 90% 60%), transparent 50%); }',
      js: "const el = document.querySelector('.color-hover');\nel.addEventListener('mousemove', (e) => {\n  const r = el.getBoundingClientRect();\n  el.style.setProperty('--x', (e.clientX - r.left) + 'px');\n  el.style.setProperty('--y', (e.clientY - r.top) + 'px');\n  el.style.setProperty('--h', Math.random() * 360);\n});" }],

  ['gsap-scrollTrigger', '滚动驱动', 'GSAP ScrollTrigger', 'advanced', 3, '使用 GSAP ScrollTrigger 绑定滚动进度。',
    [{ key: 'distance', label: '位移', min: 50, max: 400, step: 10, default: 200, unit: 'px' }],
    { html: '<div class="gsap-target">SCROLL</div>',
      css: '.gsap-target { font-size: 64px; font-weight: 900; }',
      js: "gsap.registerPlugin(ScrollTrigger);\ngsap.to('.gsap-target', { x: 200, scrollTrigger: { trigger: '.gsap-target', start: 'top center', end: 'bottom center', scrub: true } });" }],

  ['three-particles', '粒子系统', 'Three.js Particles', 'advanced', 3, 'Three.js 渲染的几何粒子系统。',
    [{ key: 'count', label: '粒子数', min: 100, max: 5000, step: 100, default: 1500 }],
    { html: '<canvas class="three"></canvas>',
      css: '.three { width: 100%; height: 100%; }',
      js: "import * as THREE from 'three';\nconst scene = new THREE.Scene();\nconst geom = new THREE.BufferGeometry();\nconst positions = new Float32Array(1500 * 3);\nfor (let i = 0; i < 1500 * 3; i++) positions[i] = (Math.random() - 0.5) * 10;\ngeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));\nconst mat = new THREE.PointsMaterial({ color: 0xff00ff, size: 0.05 });\nscene.add(new THREE.Points(geom, mat));" }],

  ['webgl-shader', '着色器', 'WebGL Shader', 'advanced', 3, '自定义 GLSL 片元着色器生成动画。',
    [{ key: 'speed', label: '速度', min: 0.1, max: 3, step: 0.1, default: 1 }],
    { html: '<canvas class="shader"></canvas>',
      css: '.shader { width: 100%; height: 100%; }',
      js: "const frag = `precision mediump float; uniform float u_time; uniform vec2 u_resolution; void main() { vec2 uv = gl_FragCoord.xy / u_resolution.xy; gl_FragColor = vec4(uv, 0.5 + 0.5 * sin(u_time), 1.0); }`;" }],

  ['canvas-confetti', '五彩纸屑', 'Canvas Confetti', 'advanced', 2, '撒花庆祝效果。',
    [{ key: 'count', label: '粒子数', min: 30, max: 300, step: 10, default: 120 }],
    { html: '<canvas class="cv"></canvas>',
      css: '.cv { position: absolute; inset: 0; pointer-events: none; }',
      js: "const cv = document.querySelector('.cv'); const ctx = cv.getContext('2d');\nconst particles = [];\nfor (let i = 0; i < 120; i++) particles.push({ x: 200, y: 200, vx: (Math.random()-0.5)*8, vy: Math.random()*-12, g: 0.3, c: `hsl(${Math.random()*360} 90% 60%)` });\nfunction tick() { ctx.clearRect(0,0,cv.width,cv.height); particles.forEach(p => { p.vy += p.g; p.x += p.vx; p.y += p.vy; ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, 6, 6); }); requestAnimationFrame(tick); } tick();" }],

  ['lottie-loader', 'Lottie 加载', 'Lottie Loader', 'advanced', 2, '使用 Lottie 动画作为加载器。',
    [{ key: 'style', label: '风格', options: ['pulse', 'orbit', 'wave'], default: 'pulse' }],
    { html: '<div class="lottie"></div>',
      css: '.lottie { width: 200px; height: 200px; }',
      js: "import lottie from 'lottie-web';\nlottie.loadAnimation({ container: document.querySelector('.lottie'), renderer: 'svg', loop: true, autoplay: true, path: '/animation.json' });" }],

  ['morph-svg', 'SVG 形变', 'Morph SVG', 'advanced', 3, 'SVG path 之间平滑形变。',
    [{ key: 'duration', label: '时长', min: 0.4, max: 3, step: 0.1, default: 1.5, unit: 's' }],
    { html: '<svg viewBox="0 0 100 100"><path class="p" d="M10 50 Q50 10 90 50 Q50 90 10 50" fill="none" stroke="currentColor" stroke-width="4"/></svg>',
      css: 'svg { width: 200px; height: 200px; }',
      js: "const p = document.querySelector('.p');\nconst paths = ['M10 50 Q50 10 90 50 Q50 90 10 50', 'M10 10 L90 10 L90 90 L10 90 Z'];\nlet i = 0; setInterval(() => { p.setAttribute('d', paths[i++ % 2]); }, 1500);" }],

  ['grid-magnetic', '网格磁吸', 'Grid Magnetic', 'advanced', 3, '网格中每个点对鼠标有磁吸反应。',
    [{ key: 'radius', label: '吸引半径', min: 40, max: 200, step: 10, default: 100, unit: 'px' }],
    { html: '<div class="grid-mag"></div>',
      css: '.grid-mag { position: relative; width: 100%; height: 100%; }\n.grid-mag .dot { position: absolute; width: 4px; height: 4px; background: currentColor; border-radius: 50%; transition: transform 0.2s; }',
      js: "const el = document.querySelector('.grid-mag');\nconst dots = [];\nfor (let r = 0; r < 6; r++) for (let c = 0; c < 12; c++) { const d = document.createElement('div'); d.className = 'dot'; d.style.left = c * 24 + 'px'; d.style.top = r * 24 + 'px'; el.appendChild(d); dots.push(d); }\nel.addEventListener('mousemove', (e) => { dots.forEach(d => { const r = d.getBoundingClientRect(); const dx = e.clientX - (r.left + 2); const dy = e.clientY - (r.top + 2); const dist = Math.hypot(dx, dy); if (dist < 100) d.style.transform = `translate(${dx * 0.3}px, ${dy * 0.3}px)`; else d.style.transform = ''; }); });" }],

  ['sine-wave', '正弦波', 'Sine Wave', 'advanced', 2, 'Canvas 渲染的正弦波。',
    [{ key: 'frequency', label: '频率', min: 0.005, max: 0.05, step: 0.005, default: 0.02 },
     { key: 'amplitude', label: '振幅', min: 10, max: 80, step: 5, default: 30, unit: 'px' }],
    { html: '<canvas class="wave"></canvas>',
      css: '.wave { width: 100%; height: 100%; }',
      js: "const c = document.querySelector('.wave'); const ctx = c.getContext('2d');\nlet t = 0;\nfunction draw() { ctx.clearRect(0, 0, c.width, c.height); ctx.beginPath();\nfor (let x = 0; x < c.width; x++) ctx.lineTo(x, c.height/2 + Math.sin(x * 0.02 + t) * 30);\nctx.stroke(); t += 0.05; requestAnimationFrame(draw); } draw();" }],

  // ============ New 40 effects (10 per category) ============

  // BASIC 13-22
  ['slide-up', '上滑入场', 'Slide Up', 'basic', 1, '元素从下往上滑入并淡入,通用入场动画。',
    [{ key: 'duration', label: '时长', min: 0.2, max: 2, step: 0.1, default: 0.6, unit: 's' },
     { key: 'distance', label: '距离', min: 20, max: 120, step: 5, default: 40, unit: 'px' }],
    { html: '<div class="slide-up">Slide Up</div>',
      css: '.slide-up { animation: slideUp var(--duration, 0.6s) ease-out both; }\n@keyframes slideUp { from { opacity: 0; transform: translateY(var(--distance, 40px)); } to { opacity: 1; transform: translateY(0); } }',
      js: '' }],

  ['slide-down', '下滑入场', 'Slide Down', 'basic', 1, '元素从上往下滑入,适合顶部 banner。',
    [{ key: 'duration', label: '时长', min: 0.2, max: 2, step: 0.1, default: 0.6, unit: 's' },
     { key: 'distance', label: '距离', min: 20, max: 120, step: 5, default: 40, unit: 'px' }],
    { html: '<div class="slide-down">Slide Down</div>',
      css: '.slide-down { animation: slideDown var(--duration, 0.6s) ease-out both; }\n@keyframes slideDown { from { opacity: 0; transform: translateY(calc(var(--distance, 40px) * -1)); } to { opacity: 1; transform: translateY(0); } }',
      js: '' }],

  ['bounce-in', '弹跳入场', 'Bounce In', 'basic', 2, '元素入场时多次反弹,有节奏感。',
    [{ key: 'duration', label: '时长', min: 0.5, max: 2, step: 0.1, default: 1, unit: 's' }],
    { html: '<div class="bounce-in">Bounce</div>',
      css: '.bounce-in { animation: bounceIn var(--duration, 1s) both; }\n@keyframes bounceIn { 0% { transform: scale(0.3); opacity: 0; } 50% { transform: scale(1.1); opacity: 1; } 70% { transform: scale(0.9); } 85% { transform: scale(1.05); } 100% { transform: scale(1); } }',
      js: '' }],

  ['elastic-in', '弹性入场', 'Elastic In', 'basic', 2, '入场时带有明显弹性回弹,生动有趣。',
    [{ key: 'duration', label: '时长', min: 0.5, max: 2.5, step: 0.1, default: 1.2, unit: 's' }],
    { html: '<div class="elastic-in">Elastic</div>',
      css: '.elastic-in { animation: elasticIn var(--duration, 1.2s) cubic-bezier(0.68, -0.55, 0.265, 1.55) both; }\n@keyframes elasticIn { 0% { transform: scale(0) rotate(-180deg); opacity: 0; } 100% { transform: scale(1) rotate(0); opacity: 1; } }',
      js: '' }],

  ['fade-out', '淡出消失', 'Fade Out', 'basic', 1, '元素持续淡出后回弹,适合循环演示。',
    [{ key: 'duration', label: '周期', min: 1, max: 5, step: 0.1, default: 2, unit: 's' }],
    { html: '<div class="fade-out">Fade Out</div>',
      css: '.fade-out { animation: fadeOut var(--duration, 2s) ease-in-out infinite alternate; }\n@keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }',
      js: '' }],

  ['scale-pulse', '缩放呼吸', 'Scale Pulse', 'basic', 1, '元素持续缩放形成呼吸效果,比 pulse 更夸张。',
    [{ key: 'duration', label: '周期', min: 0.6, max: 3, step: 0.1, default: 1.4, unit: 's' },
     { key: 'min', label: '最小', min: 0.4, max: 0.95, step: 0.05, default: 0.7 },
     { key: 'max', label: '最大', min: 1.05, max: 1.6, step: 0.05, default: 1.15 }],
    { html: '<div class="scale-pulse">●</div>',
      css: '.scale-pulse { animation: sp var(--duration, 1.4s) ease-in-out infinite; }\n@keyframes sp { 0%, 100% { transform: scale(var(--min, 0.7)); } 50% { transform: scale(var(--max, 1.15)); } }',
      js: '' }],

  ['rotate-360', '持续旋转', 'Rotate 360', 'basic', 1, '元素持续 360 度旋转,无限循环。',
    [{ key: 'duration', label: '周期', min: 0.5, max: 6, step: 0.1, default: 2, unit: 's' }],
    { html: '<div class="rotate-360">⟳</div>',
      css: '.rotate-360 { display: inline-block; animation: rot360 var(--duration, 2s) linear infinite; }\n@keyframes rot360 { to { transform: rotate(360deg); } }',
      js: '' }],

  ['swing', '钟摆', 'Swing', 'basic', 2, '顶部固定,左右摆动,像钟摆一样。',
    [{ key: 'duration', label: '周期', min: 0.8, max: 3, step: 0.1, default: 1.6, unit: 's' }],
    { html: '<div class="swing">⏰</div>',
      css: '.swing { display: inline-block; transform-origin: top center; animation: swing var(--duration, 1.6s) ease-in-out infinite; }\n@keyframes swing { 0%, 100% { transform: rotate(15deg); } 50% { transform: rotate(-15deg); } }',
      js: '' }],

  ['jello', '果冻', 'Jello', 'basic', 2, '元素呈现果冻般的扭曲抖动,俏皮可爱。',
    [{ key: 'duration', label: '时长', min: 0.6, max: 1.5, step: 0.1, default: 0.9, unit: 's' }],
    { html: '<div class="jello">JELLO</div>',
      css: '.jello { display: inline-block; animation: jello var(--duration, 0.9s) ease-in-out infinite; transform-origin: center; }\n@keyframes jello { 0%, 100% { transform: scale3d(1, 1, 1); } 30% { transform: scale3d(1.25, 0.75, 1); } 40% { transform: scale3d(0.75, 1.25, 1); } 50% { transform: scale3d(1.15, 0.85, 1); } 65% { transform: scale3d(0.95, 1.05, 1); } 75% { transform: scale3d(1.05, 0.95, 1); } }',
      js: '' }],

  ['flash', '闪烁', 'Flash', 'basic', 1, '元素透明度快速闪烁,适合新消息/警告提示。',
    [{ key: 'duration', label: '周期', min: 0.4, max: 2, step: 0.1, default: 0.8, unit: 's' },
     { key: 'color', label: '颜色', options: ['red', 'yellow', 'blue', 'green'], default: 'red' }],
    { html: '<div class="flash">NOTICE</div>',
      css: '.flash { animation: flash var(--duration, 0.8s) ease-in-out infinite; padding: 12px 20px; background: hsl(0 90% 55%); color: white; border-radius: 8px; font-weight: 700; }\n@keyframes flash { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }',
      js: '' }],

  // TEXT 11-20
  ['text-shadow-shift', '阴影偏移', 'Shadow Shift', 'text', 2, '文字阴影循环偏移,产生霓虹闪烁感。',
    [{ key: 'duration', label: '周期', min: 1, max: 4, step: 0.1, default: 2, unit: 's' },
     { key: 'intensity', label: '强度', min: 2, max: 12, step: 1, default: 6, unit: 'px' }],
    { html: '<h1 class="tss">SHADOW</h1>',
      css: '.tss { font-size: 36px; font-weight: 900; color: white; text-shadow: var(--intensity, 6px) 0 hsl(320 90% 60%); animation: tss var(--duration, 2s) ease-in-out infinite alternate; }\n@keyframes tss { from { text-shadow: var(--intensity, 6px) 0 hsl(320 90% 60%); } to { text-shadow: calc(var(--intensity, 6px) * -1) 0 hsl(180 90% 60%); } }',
      js: '' }],

  ['text-3d', '3D 文字', '3D Text', 'text', 2, '多层文字堆叠形成 3D 立体透视效果。',
    [{ key: 'layers', label: '层数', min: 3, max: 12, step: 1, default: 6 },
     { key: 'depth', label: '深度', min: 1, max: 4, step: 1, default: 2, unit: 'px' }],
    { html: '<h1 class="t3d" data-text="3D">3D</h1>',
      css: '.t3d { position: relative; font-size: 56px; font-weight: 900; color: white; }\n.t3d::before, .t3d::after { content: attr(data-text); position: absolute; inset: 0; }\n.t3d::before { color: hsl(320 90% 60%); transform: translate(var(--depth, 2px), var(--depth, 2px)); }\n.t3d::after { color: hsl(200 90% 60%); transform: translate(calc(var(--depth, 2px) * -1), calc(var(--depth, 2px) * -1)); }',
      js: '' }],

  ['text-rotate-in', '字符旋转', 'Char Rotate', 'text', 2, '每个字符依次旋转入场,强调感强。',
    [{ key: 'duration', label: '单项时长', min: 0.3, max: 1.2, step: 0.1, default: 0.6, unit: 's' },
     { key: 'stagger', label: '间隔', min: 0.05, max: 0.4, step: 0.05, default: 0.1, unit: 's' }],
    { html: '<h1 class="tri">ROTATE</h1>',
      css: '.tri span { display: inline-block; opacity: 0; animation: tri var(--duration, 0.6s) ease-out forwards; }\n.tri span:nth-child(1) { animation-delay: 0s; }\n.tri span:nth-child(2) { animation-delay: var(--stagger, 0.1s); }\n.tri span:nth-child(3) { animation-delay: calc(var(--stagger, 0.1s) * 2); }\n@keyframes tri { from { opacity: 0; transform: rotateY(180deg); } to { opacity: 1; transform: rotateY(0); } }',
      js: "[...document.querySelector('.tri').textContent].forEach(c => { const s = document.createElement('span'); s.textContent = c; c.replaceWith(s); });" }],

  ['letter-spacing-wave', '字距呼吸', 'Letter Spacing', 'text', 1, '字间距循环变化,产生呼吸节奏。',
    [{ key: 'duration', label: '周期', min: 1, max: 5, step: 0.1, default: 2.5, unit: 's' },
     { key: 'max', label: '最大间距', min: 4, max: 24, step: 1, default: 12, unit: 'px' }],
    { html: '<h1 class="lsw">BREATHE</h1>',
      css: '.lsw { font-size: 32px; font-weight: 900; letter-spacing: 0; animation: lsw var(--duration, 2.5s) ease-in-out infinite; }\n@keyframes lsw { 0%, 100% { letter-spacing: 0; } 50% { letter-spacing: var(--max, 12px); } }',
      js: '' }],

  ['underline-draw', '下划线', 'Underline Draw', 'text', 1, '下划线从左到右逐段画出,适合链接。',
    [{ key: 'duration', label: '时长', min: 0.4, max: 2, step: 0.1, default: 0.8, unit: 's' }],
    { html: '<a class="ul-draw">HOVER LINK</a>',
      css: '.ul-draw { position: relative; font-size: 28px; font-weight: 700; color: inherit; text-decoration: none; }\n.ul-draw::after { content: ""; position: absolute; left: 0; bottom: -4px; height: 3px; width: 0; background: currentColor; animation: ulDraw var(--duration, 0.8s) ease-out forwards; }\n@keyframes ulDraw { to { width: 100%; } }',
      js: '' }],

  ['highlight-sweep', '高亮扫过', 'Highlight Sweep', 'text', 2, '高亮条从左到右扫过文字,常用于强调。',
    [{ key: 'duration', label: '周期', min: 1.5, max: 4, step: 0.1, default: 2.5, unit: 's' }],
    { html: '<h1 class="hl-sweep">SWEEP</h1>',
      css: '.hl-sweep { position: relative; display: inline-block; font-size: 36px; font-weight: 900; }\n.hl-sweep::before { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, hsl(50 100% 60%), transparent); transform: translateX(-100%); animation: sweep var(--duration, 2.5s) ease-in-out infinite; mix-blend-mode: multiply; }\n@keyframes sweep { 50% { transform: translateX(100%); } }',
      js: '' }],

  ['text-blink-cursor', '闪烁光标', 'Blink Cursor', 'text', 1, '模拟终端的闪烁光标,极简风格。',
    [{ key: 'speed', label: '速度', min: 0.3, max: 1.5, step: 0.1, default: 0.8, unit: 's' }],
    { html: '<span class="cursor-t">输入中</span>',
      css: '.cursor-t { font-family: monospace; font-size: 24px; font-weight: 700; }\n.cursor-t::after { content: "_"; margin-left: 2px; animation: blink var(--speed, 0.8s) step-end infinite; }\n@keyframes blink { 50% { opacity: 0; } }',
      js: '' }],

  ['rainbow-text', '彩虹文字', 'Rainbow Text', 'text', 1, '文字颜色按彩虹色循环变化。',
    [{ key: 'duration', label: '周期', min: 1, max: 6, step: 0.1, default: 3, unit: 's' }],
    { html: '<h1 class="rainbow">RAINBOW</h1>',
      css: '.rainbow { font-size: 40px; font-weight: 900; background: linear-gradient(90deg, hsl(0 90% 60%), hsl(60 90% 60%), hsl(120 90% 60%), hsl(180 90% 60%), hsl(240 90% 60%), hsl(300 90% 60%), hsl(360 90% 60%)); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: rb var(--duration, 3s) linear infinite; }\n@keyframes rb { to { background-position: 200% 0; } }',
      js: '' }],

  ['text-flip-3d', '3D 翻面', 'Flip 3D', 'text', 2, '文字整体绕 Y 轴 360 度翻转,类似卡片。',
    [{ key: 'duration', label: '周期', min: 1, max: 4, step: 0.1, default: 2, unit: 's' }],
    { html: '<div class="flip3d-wrap"><h1 class="flip3d">FLIP</h1></div>',
      css: '.flip3d-wrap { perspective: 600px; }\n.flip3d { font-size: 40px; font-weight: 900; display: inline-block; animation: flip3d var(--duration, 2s) ease-in-out infinite; transform-style: preserve-3d; }\n@keyframes flip3d { 0% { transform: rotateY(0); } 50% { transform: rotateY(360deg); } 100% { transform: rotateY(360deg); } }',
      js: '' }],

  ['number-marquee', '数字翻牌', 'Number Marquee', 'text', 3, '类似时钟翻页的数字滚动效果。',
    [{ key: 'speed', label: '速度', min: 200, max: 1500, step: 100, default: 600, unit: 'ms' }],
    { html: '<div class="nmarquee"><span class="num" data-num="0"></span></div>',
      css: '.nmarquee { display: flex; gap: 8px; font-family: monospace; font-size: 48px; font-weight: 900; height: 60px; overflow: hidden; }\n.nmarquee .num { position: relative; height: 60px; min-width: 40px; text-align: center; }\n.nmarquee .num-track { position: absolute; left: 0; right: 0; transition: transform 0.5s ease; }',
      js: "const numEl = document.querySelector('.num');\nlet cur = 0;\nfunction render() {\n  let track = '';\n  for (let i = 0; i < 10; i++) track += `<div>${i}</div>`;\n  numEl.innerHTML = `<div class=\"num-track\" style=\"transform:translateY(-${cur * 60}px)\">${track}</div>`;\n  cur = (cur + 1) % 10;\n}\nrender();\nsetInterval(render, params.speed);" }],

  // INTERACTION 11-20
  ['button-press', '按钮按下', 'Button Press', 'interaction', 1, '鼠标按下时按钮缩放反馈,有手感。',
    [{ key: 'scale', label: '缩放', min: 0.85, max: 0.98, step: 0.01, default: 0.92 }],
    { html: '<button class="press">CLICK</button>',
      css: '.press { padding: 14px 28px; border: none; background: hsl(280 90% 60%); color: white; font-weight: 700; font-size: 18px; border-radius: 10px; cursor: pointer; transition: transform 0.1s, box-shadow 0.1s; box-shadow: 0 6px 0 hsl(280 90% 35%); }\n.press:active { transform: scale(var(--scale, 0.92)) translateY(4px); box-shadow: 0 2px 0 hsl(280 90% 35%); }',
      js: '' }],

  ['hover-lift', '悬停上浮', 'Hover Lift', 'interaction', 1, 'hover 时元素上浮并加深阴影。',
    [{ key: 'lift', label: '上浮', min: 2, max: 20, step: 1, default: 8, unit: 'px' }],
    { html: '<div class="lift">HOVER ME</div>',
      css: '.lift { padding: 24px 32px; background: white; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); cursor: pointer; transition: transform 0.25s ease, box-shadow 0.25s ease; font-weight: 700; }\n.lift:hover { transform: translateY(calc(var(--lift, 8px) * -1)); box-shadow: 0 16px 32px rgba(0,0,0,0.18); }',
      js: '' }],

  ['tilt-card-strong', '强倾斜', 'Strong Tilt', 'interaction', 2, '比 3D Tilt 更夸张的倾斜效果,带光斑。',
    [{ key: 'max', label: '最大角度', min: 10, max: 45, step: 1, default: 25, unit: '°' }],
    { html: '<div class="tilt-s">STRONG TILT</div>',
      css: '.tilt-s { width: 240px; height: 160px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, hsl(280 90% 65%), hsl(200 90% 60%)); color: white; font-weight: 900; font-size: 24px; border-radius: 16px; cursor: pointer; transform-style: preserve-3d; transition: transform 0.15s; }',
      js: "const el = document.querySelector('.tilt-s');\nel.addEventListener('mousemove', (e) => {\n  const r = el.getBoundingClientRect();\n  const x = (e.clientX - r.left) / r.width - 0.5;\n  const y = (e.clientY - r.top) / r.height - 0.5;\n  el.style.transform = `perspective(800px) rotateY(${x * params.max * 2}deg) rotateX(${-y * params.max * 2}deg)`;\n});\nel.addEventListener('mouseleave', () => el.style.transform = '');" }],

  ['spotlight-follow', '跟随聚光', 'Spotlight', 'interaction', 2, '鼠标位置形成 spotlight 高亮,其余区域变暗。',
    [{ key: 'size', label: '光圈', min: 100, max: 400, step: 20, default: 220, unit: 'px' }],
    { html: '<div class="spot"><div class="spot-inner">SPOTLIGHT</div></div>',
      css: '.spot { position: relative; width: 100%; height: 100%; background: #111; border-radius: 12px; cursor: crosshair; }\n.spot-inner { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; font-weight: 900; letter-spacing: 0.1em; }',
      js: "const spot = document.querySelector('.spot');\nspot.addEventListener('mousemove', (e) => {\n  const r = spot.getBoundingClientRect();\n  const x = e.clientX - r.left;\n  const y = e.clientY - r.top;\n  spot.style.background = `radial-gradient(circle ${params.size}px at ${x}px ${y}px, rgba(255,255,255,0.25), #111 70%)`;\n});\nspot.addEventListener('mouseleave', () => spot.style.background = '#111');" }],

  ['mouse-trail', '鼠标拖尾', 'Mouse Trail', 'interaction', 2, '鼠标移动时留下一串彩色粒子拖尾。',
    [{ key: 'count', label: '粒子数', min: 6, max: 30, step: 1, default: 12 },
     { key: 'size', label: '尺寸', min: 4, max: 16, step: 1, default: 8, unit: 'px' }],
    { html: '<div class="trail-zone"></div>',
      css: '.trail-zone { position: relative; width: 100%; height: 100%; cursor: crosshair; }\n.trail-dot { position: absolute; border-radius: 50%; pointer-events: none; }',
      js: "const zone = document.querySelector('.trail-zone');\nlet dots = [];\nfor (let i = 0; i < params.count; i++) { const d = document.createElement('div'); d.className = 'trail-dot'; d.style.width = d.style.height = params.size + 'px'; d.style.background = `hsl(${i * 30} 90% 60%)`; zone.appendChild(d); dots.push(d); }\nlet history = [];\nzone.addEventListener('mousemove', (e) => { const r = zone.getBoundingClientRect(); history.unshift({ x: e.clientX - r.left, y: e.clientY - r.top }); if (history.length > params.count) history.pop(); dots.forEach((d, i) => { const p = history[i] || history[history.length - 1]; if (!p) return; d.style.left = (p.x - params.size/2) + 'px'; d.style.top = (p.y - params.size/2) + 'px'; d.style.opacity = String(1 - i / params.count); }); });" }],

  ['click-burst', '点击爆开', 'Click Burst', 'interaction', 2, '点击位置爆开一圈彩色粒子。',
    [{ key: 'count', label: '粒子数', min: 8, max: 40, step: 2, default: 20 }],
    { html: '<div class="burst">CLICK ANYWHERE</div>',
      css: '.burst { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #222; color: white; font-weight: 700; border-radius: 12px; cursor: pointer; }',
      js: "const burst = document.querySelector('.burst');\nburst.addEventListener('click', (e) => {\n  const r = burst.getBoundingClientRect();\n  const x = e.clientX - r.left, y = e.clientY - r.top;\n  for (let i = 0; i < params.count; i++) {\n    const p = document.createElement('span');\n    const ang = (i / params.count) * Math.PI * 2;\n    const dist = 40 + Math.random() * 30;\n    p.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:8px;height:8px;border-radius:50%;background:hsl(${Math.random()*360} 90% 60%);transition:all 0.6s cubic-bezier(0.2,0.8,0.2,1);`;\n    burst.appendChild(p);\n    requestAnimationFrame(() => { p.style.transform = `translate(${Math.cos(ang) * dist}px, ${Math.sin(ang) * dist}px) scale(0)`; p.style.opacity = '0'; });\n    setTimeout(() => p.remove(), 700);\n  }\n});" }],

  ['hover-icon-spin', '悬停旋转', 'Icon Spin', 'interaction', 1, 'hover 时图标旋转一周。',
    [{ key: 'duration', label: '时长', min: 0.3, max: 1.5, step: 0.1, default: 0.6, unit: 's' }],
    { html: '<button class="spin-icon"><span>⚙</span></button>',
      css: '.spin-icon { padding: 12px 16px; border: 2px solid currentColor; background: transparent; border-radius: 10px; cursor: pointer; font-size: 18px; color: inherit; }\n.spin-icon span { display: inline-block; transition: transform var(--duration, 0.6s) ease; }\n.spin-icon:hover span { transform: rotate(360deg); }',
      js: '' }],

  ['toggle-flip', '滑动开关', 'Toggle Flip', 'interaction', 2, '可点击切换的左右滑动 toggle。',
    [{ key: 'duration', label: '滑动时长', min: 0.2, max: 0.8, step: 0.05, default: 0.35, unit: 's' }],
    { html: '<div class="toggle" data-on="false"><div class="knob"></div></div>',
      css: '.toggle { position: relative; width: 64px; height: 32px; background: #ccc; border-radius: 999px; cursor: pointer; transition: background var(--duration, 0.35s); }\n.toggle .knob { position: absolute; top: 4px; left: 4px; width: 24px; height: 24px; background: white; border-radius: 50%; transition: transform var(--duration, 0.35s) cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 2px 6px rgba(0,0,0,0.2); }\n.toggle.on { background: hsl(140 80% 50%); }\n.toggle.on .knob { transform: translateX(32px); }',
      js: "const tg = document.querySelector('.toggle');\ntg.addEventListener('click', () => { const on = tg.classList.toggle('on'); tg.dataset.on = String(on); });" }],

  ['accordion-smooth', '手风琴', 'Accordion', 'interaction', 2, '点击展开/收起内容,平滑过渡。',
    [{ key: 'duration', label: '时长', min: 0.2, max: 1, step: 0.05, default: 0.4, unit: 's' }],
    { html: '<div class="acc"><button class="acc-h">Q: 什么是动效？</button><div class="acc-b"><p>动效是界面元素的运动,引导注意力,增强反馈。</p></div></div>',
      css: '.acc { width: 280px; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }\n.acc-h { width: 100%; padding: 14px 18px; background: hsl(280 90% 60%); color: white; border: none; text-align: left; font-weight: 700; cursor: pointer; font-size: 15px; }\n.acc-b { max-height: 0; overflow: hidden; transition: max-height var(--duration, 0.4s) ease; }\n.acc-b p { padding: 14px 18px; margin: 0; font-size: 14px; line-height: 1.6; color: #444; }',
      js: "const h = document.querySelector('.acc-h'); const b = document.querySelector('.acc-b');\nh.addEventListener('click', () => { if (b.style.maxHeight) { b.style.maxHeight = null; } else { b.style.maxHeight = b.scrollHeight + 'px'; } });" }],

  ['range-drag', '滑块拖动', 'Range Drag', 'interaction', 2, '可拖动的圆形滑块,显示当前值。',
    [{ key: 'max', label: '最大值', min: 50, max: 500, step: 10, default: 200 }],
    { html: '<div class="range"><div class="track"><div class="fill"></div><div class="knob"></div></div><div class="val">0</div></div>',
      css: '.range { padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 12px; width: 240px; }\n.range .track { position: relative; width: 200px; height: 6px; background: rgba(0,0,0,0.1); border-radius: 999px; cursor: pointer; }\n.range .fill { position: absolute; left: 0; top: 0; height: 100%; background: hsl(280 90% 60%); border-radius: 999px; width: 50%; }\n.range .knob { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 20px; height: 20px; background: white; border: 3px solid hsl(280 90% 60%); border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.2); cursor: grab; }\n.range .val { font-size: 24px; font-weight: 900; font-variant-numeric: tabular-nums; }',
      js: "const track = document.querySelector('.track'); const fill = document.querySelector('.fill'); const knob = document.querySelector('.knob'); const val = document.querySelector('.val');\nlet dragging = false;\nconst update = (clientX) => { const r = track.getBoundingClientRect(); let pct = (clientX - r.left) / r.width; pct = Math.max(0, Math.min(1, pct)); fill.style.width = (pct * 100) + '%'; knob.style.left = (pct * 100) + '%'; val.textContent = Math.round(pct * params.max); };\ntrack.addEventListener('mousedown', (e) => { dragging = true; update(e.clientX); });\nwindow.addEventListener('mousemove', (e) => { if (dragging) update(e.clientX); });\nwindow.addEventListener('mouseup', () => dragging = false);" }],

  // ADVANCED 9-18
  ['audio-wave', '音频条', 'Audio Wave', 'advanced', 2, '模拟音频可视化的跳动条形。',
    [{ key: 'bars', label: '条数', min: 16, max: 64, step: 4, default: 32 },
     { key: 'speed', label: '速度', min: 0.05, max: 0.3, step: 0.01, default: 0.12 }],
    { html: '<div class="audio"></div>',
      css: '.audio { display: flex; align-items: center; justify-content: center; gap: 3px; width: 100%; height: 100%; }\n.audio .bar { width: 6px; background: linear-gradient(180deg, hsl(280 90% 60%), hsl(200 90% 60%)); border-radius: 3px; }',
      js: "const wrap = document.querySelector('.audio');\nconst bars = [];\nfor (let i = 0; i < params.bars; i++) { const b = document.createElement('div'); b.className = 'bar'; wrap.appendChild(b); bars.push(b); }\nlet t = 0;\nfunction tick() { t += params.speed; bars.forEach((b, i) => { const h = 30 + Math.abs(Math.sin(t + i * 0.4)) * 70; b.style.height = h + '%'; }); requestAnimationFrame(tick); } tick();" }],

  ['fractal-tree', '分形树', 'Fractal Tree', 'advanced', 3, '递归绘制的分形树动画。',
    [{ key: 'depth', label: '深度', min: 5, max: 11, step: 1, default: 8 },
     { key: 'angle', label: '分支角度', min: 15, max: 35, step: 1, default: 22, unit: '°' }],
    { html: '<canvas class="ftree"></canvas>',
      css: '.ftree { width: 100%; height: 100%; }',
      js: "const c = document.querySelector('.ftree'); const ctx = c.getContext('2d');\nconst resize = () => { c.width = c.offsetWidth * 2; c.height = c.offsetHeight * 2; };\nresize();\nwindow.addEventListener('resize', resize);\nlet t = 0;\nfunction branch(x, y, len, ang, d) { if (d <= 0 || len < 2) return; const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.strokeStyle = `hsl(${(10 - d) * 20} 70% 50%)`; ctx.lineWidth = d; ctx.stroke(); branch(x2, y2, len * 0.75, ang - params.angle * Math.PI / 180, d - 1); branch(x2, y2, len * 0.75, ang + params.angle * Math.PI / 180, d - 1); }\nlet raf = 0;\nfunction draw() { ctx.clearRect(0, 0, c.width, c.height); t += 0.01; ctx.save(); ctx.translate(c.width / 2, c.height); branch(0, 0, 200, -Math.PI / 2 + Math.sin(t) * 0.05, params.depth); ctx.restore(); raf = requestAnimationFrame(draw); }\ndraw();\nreturn () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };" }],

  ['noise-flow', '噪声流动', 'Noise Flow', 'advanced', 3, '基于 value-noise 的 2D 流动场。',
    [{ key: 'speed', label: '速度', min: 0.001, max: 0.02, step: 0.001, default: 0.005 },
     { key: 'scale', label: '尺度', min: 0.005, max: 0.05, step: 0.005, default: 0.02 }],
    { html: '<canvas class="nf"></canvas>',
      css: '.nf { width: 100%; height: 100%; }',
      js: "const c = document.querySelector('.nf'); const ctx = c.getContext('2d');\nconst resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };\nresize();\nwindow.addEventListener('resize', resize);\nconst grad = ctx.createLinearGradient(0, 0, 0, c.height);\ngrad.addColorStop(0, '#ff00aa'); grad.addColorStop(1, '#00ddff');\nfunction noise(x, y) { const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453; return s - Math.floor(s); }\nfunction smoothNoise(x, y) { const ix = Math.floor(x), iy = Math.floor(y); const fx = x - ix, fy = y - iy; const a = noise(ix, iy), b = noise(ix + 1, iy), c2 = noise(ix, iy + 1), d = noise(ix + 1, iy + 1); const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy); return a + (b - a) * u + (c2 - a) * v + (a - b - c2 + d) * u * v; }\nlet t = 0; let raf = 0;\nfunction draw() { const img = ctx.createImageData(c.width, c.height); const d = img.data; for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) { const n = smoothNoise(x * params.scale + t, y * params.scale - t); const idx = (y * c.width + x) * 4; const v = Math.floor(n * 255); d[idx] = v < 128 ? 255 - v * 2 : 0; d[idx + 1] = v; d[idx + 2] = 255 - v; d[idx + 3] = 255; } ctx.putImageData(img, 0, 0); t += params.speed * 10; raf = requestAnimationFrame(draw); }\ndraw();\nreturn () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };" }],

  ['metaball', '粘性球', 'Metaball', 'advanced', 3, '模糊叠加形成粘性 metaball 效果。',
    [{ key: 'count', label: '球数', min: 3, max: 10, step: 1, default: 6 },
     { key: 'blur', label: '模糊', min: 10, max: 60, step: 2, default: 28, unit: 'px' }],
    { html: '<div class="mb"></div>',
      css: '.mb { position: relative; width: 100%; height: 100%; background: #0a0a1a; }\n.mb .ball { position: absolute; border-radius: 50%; filter: blur(var(--blur, 28px)); will-change: transform; }',
      js: "const mb = document.querySelector('.mb');\nconst balls = [];\nfor (let i = 0; i < params.count; i++) { const b = document.createElement('div'); b.className = 'ball'; b.style.width = b.style.height = (60 + Math.random() * 40) + 'px'; b.style.background = i % 2 ? 'hsl(280 90% 60%)' : 'hsl(180 90% 55%)'; mb.appendChild(b); balls.push({ el: b, x: 0, y: 0, vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2 }); }\nlet raf = 0;\nconst w = () => mb.offsetWidth, h = () => mb.offsetHeight;\nfunction tick() { balls.forEach(b => { b.x += b.vx; b.y += b.vy; if (b.x < 0 || b.x > w() - 80) b.vx *= -1; if (b.y < 0 || b.y > h() - 80) b.vy *= -1; b.el.style.transform = `translate(${b.x}px, ${b.y}px)`; }); raf = requestAnimationFrame(tick); }\ntick();\nreturn () => cancelAnimationFrame(raf);" }],

  ['physics-spring', '弹簧物理', 'Spring Physics', 'advanced', 3, '弹簧物理仿真,拖动后回弹。',
    [{ key: 'stiffness', label: '刚度', min: 0.02, max: 0.3, step: 0.01, default: 0.12 },
     { key: 'damping', label: '阻尼', min: 0.7, max: 0.98, step: 0.01, default: 0.88 }],
    { html: '<div class="spring-zone"><div class="ball-s"></div></div>',
      css: '.spring-zone { position: relative; width: 100%; height: 100%; background: #f0f0f0; border-radius: 12px; cursor: grab; overflow: hidden; }\n.spring-zone .ball-s { position: absolute; width: 48px; height: 48px; border-radius: 50%; background: radial-gradient(circle, hsl(20 90% 60%), hsl(0 80% 40%)); box-shadow: 0 8px 16px rgba(0,0,0,0.2); top: 50%; left: 50%; transform: translate(-50%, -50%); }',
      js: "const zone = document.querySelector('.spring-zone'); const ball = document.querySelector('.ball-s');\nlet px = zone.offsetWidth / 2, py = zone.offsetHeight / 2, vx = 0, vy = 0, dragging = false;\nlet offX = 0, offY = 0;\nzone.addEventListener('mousedown', (e) => { dragging = true; const r = ball.getBoundingClientRect(); offX = e.clientX - (r.left + 24); offY = e.clientY - (r.top + 24); });\nwindow.addEventListener('mousemove', (e) => { if (!dragging) return; const r = zone.getBoundingClientRect(); px = e.clientX - r.left - offX; py = e.clientY - r.top - offY; });\nwindow.addEventListener('mouseup', () => dragging = false);\nlet raf = 0;\nconst cx = () => zone.offsetWidth / 2, cy = () => zone.offsetHeight / 2;\nfunction tick() { if (!dragging) { const dx = cx() - px, dy = cy() - py; vx += dx * params.stiffness; vy += dy * params.stiffness; vx *= params.damping; vy *= params.damping; px += vx; py += vy; } ball.style.left = (px - 24) + 'px'; ball.style.top = (py - 24) + 'px'; raf = requestAnimationFrame(tick); } tick();\nreturn () => { cancelAnimationFrame(raf); };" }],

  ['trajectory-path', '路径运动', 'Trajectory', 'advanced', 2, '元素沿 SVG 路径平滑运动。',
    [{ key: 'duration', label: '周期', min: 2, max: 8, step: 0.2, default: 4, unit: 's' }],
    { html: '<svg class="traj" viewBox="0 0 200 100"><path class="p" d="M10,80 C40,10 70,90 100,40 S160,90 190,30" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="2" stroke-dasharray="4 4"/><circle class="dot" r="5" fill="hsl(280 90% 60%)"/></svg>',
      css: '.traj { width: 100%; height: 100%; }',
      js: "const path = document.querySelector('.p'); const dot = document.querySelector('.dot');\nconst len = path.getTotalLength();\nlet t = 0; let raf = 0;\nfunction tick() { t += 16 / (params.duration * 1000); if (t > 1) t = 0; const p = path.getPointAtLength(t * len); dot.setAttribute('cx', p.x); dot.setAttribute('cy', p.y); raf = requestAnimationFrame(tick); } tick();\nreturn () => cancelAnimationFrame(raf);" }],

  ['3d-cube-rotate', '立方体', '3D Cube', 'advanced', 2, '纯 CSS 3D 立方体持续旋转。',
    [{ key: 'duration', label: '周期', min: 2, max: 10, step: 0.5, default: 5, unit: 's' }],
    { html: '<div class="cube-wrap"><div class="cube"><div class="face f1">1</div><div class="face f2">2</div><div class="face f3">3</div><div class="face f4">4</div><div class="face f5">5</div><div class="face f6">6</div></div></div>',
      css: '.cube-wrap { perspective: 600px; width: 100px; height: 100px; }\n.cube { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; animation: cubeRot var(--duration, 5s) linear infinite; }\n.cube .face { position: absolute; width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 900; color: white; background: hsl(280 90% 60%); border: 2px solid white; box-sizing: border-box; opacity: 0.85; }\n.cube .f2 { transform: rotateY(180deg); background: hsl(0 90% 60%); }\n.cube .f3 { transform: rotateY(90deg) translateZ(50px); background: hsl(60 90% 60%); }\n.cube .f4 { transform: rotateY(-90deg) translateZ(50px); background: hsl(120 80% 55%); }\n.cube .f5 { transform: rotateX(90deg) translateZ(50px); background: hsl(200 90% 60%); }\n.cube .f6 { transform: rotateX(-90deg) translateZ(50px); background: hsl(320 80% 60%); }\n.cube .f1 { transform: translateZ(50px); }\n@keyframes cubeRot { to { transform: rotateY(360deg) rotateX(360deg); } }',
      js: '' }],

  ['matrix-rain', '数字雨', 'Matrix Rain', 'advanced', 3, 'Matrix 风格绿色字符雨。',
    [{ key: 'speed', label: '速度', min: 1, max: 6, step: 1, default: 3 },
     { key: 'density', label: '密度', min: 0.3, max: 1, step: 0.1, default: 0.7 }],
    { html: '<canvas class="mr"></canvas>',
      css: '.mr { width: 100%; height: 100%; background: #000; }',
      js: "const c = document.querySelector('.mr'); const ctx = c.getContext('2d');\nconst resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };\nresize();\nwindow.addEventListener('resize', resize);\nconst chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789';\nconst fontSize = 14;\nlet cols = Math.floor(c.width / fontSize * params.density);\nlet drops = new Array(cols).fill(0);\nlet raf = 0;\nfunction draw() { ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(0, 0, c.width, c.height); ctx.fillStyle = '#0f0'; ctx.font = fontSize + 'px monospace'; for (let i = 0; i < drops.length; i++) { const ch = chars[Math.floor(Math.random() * chars.length)]; ctx.fillText(ch, i * fontSize, drops[i] * fontSize); if (drops[i] * fontSize > c.height && Math.random() > 0.975) drops[i] = 0; drops[i] += params.speed / 3; } raf = requestAnimationFrame(draw); }\ndraw();\nreturn () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };" }],

  ['ripple-water', '水波涟漪', 'Water Ripple', 'advanced', 2, '点击产生水波涟漪,实时衰减。',
    [{ key: 'duration', label: '衰减时长', min: 1, max: 4, step: 0.2, default: 2, unit: 's' },
     { key: 'count', label: '波纹数', min: 2, max: 6, step: 1, default: 3 }],
    { html: '<div class="water"><span class="hint">CLICK</span></div>',
      css: '.water { position: relative; width: 100%; height: 100%; background: hsl(200 80% 50%); border-radius: 12px; cursor: pointer; overflow: hidden; }\n.water .hint { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 24px; letter-spacing: 0.2em; pointer-events: none; }\n.water .ring { position: absolute; border-radius: 50%; border: 3px solid white; transform: translate(-50%, -50%); pointer-events: none; }',
      js: "const water = document.querySelector('.water');\nwater.addEventListener('click', (e) => { const r = water.getBoundingClientRect(); const x = e.clientX - r.left, y = e.clientY - r.top; for (let i = 0; i < params.count; i++) { const ring = document.createElement('div'); ring.className = 'ring'; ring.style.left = x + 'px'; ring.style.top = y + 'px'; ring.style.width = ring.style.height = '20px'; ring.style.transition = `all ${params.duration}s ease-out ${i * 0.2}s`; water.appendChild(ring); requestAnimationFrame(() => { ring.style.width = ring.style.height = (200 + i * 80) + 'px'; ring.style.opacity = '0'; }); setTimeout(() => ring.remove(), (params.duration + i * 0.2) * 1000 + 200); } });" }],

  ['fluid-distort', '流体畸变', 'Fluid Distort', 'advanced', 3, '使用 feTurbulence + feDisplacementMap 实现流体畸变。',
    [{ key: 'amount', label: '畸变强度', min: 0, max: 60, step: 2, default: 24 },
     { key: 'speed', label: '速度', min: 0, max: 1, step: 0.05, default: 0.3 }],
    { html: '<svg width="0" height="0"><filter id="fd"><feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="3"><animate attributeName="baseFrequency" dur="6s" values="0.02;0.04;0.02" repeatCount="indefinite"/></feTurbulence><feDisplacementMap in="SourceGraphic" scale="24" /></filter></svg><div class="fluid">FLUID</div>',
      css: '.fluid { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 48px; font-weight: 900; color: white; background: linear-gradient(135deg, hsl(280 90% 60%), hsl(200 90% 60%)); border-radius: 12px; filter: url(#fd); }',
      js: '' }],

  // ============ Expansion to 160 (20 per category) ============

  // BASIC 23-42
  ['fade-in-down', '上方淡入', 'Fade In Down', 'basic', 1, '元素从上方淡入下滑,通用入场动画。',
    [{ key: 'duration', label: '时长', min: 0.2, max: 3, step: 0.1, default: 0.8, unit: 's' },
     { key: 'distance', label: '距离', min: 10, max: 80, step: 5, default: 20, unit: 'px' }],
    { html: '<div class="fade-in-down">Hello</div>',
      css: '.fade-in-down { animation: fadeInDown var(--duration, 0.8s) ease-out both; }\n@keyframes fadeInDown { from { opacity: 0; transform: translateY(calc(var(--distance, 20px) * -1)); } to { opacity: 1; transform: translateY(0); } }',
      js: '' }],

  ['fade-in-left', '左侧淡入', 'Fade In Left', 'basic', 1, '元素从左侧淡入滑入,适合横向布局。',
    [{ key: 'duration', label: '时长', min: 0.2, max: 3, step: 0.1, default: 0.8, unit: 's' },
     { key: 'distance', label: '距离', min: 10, max: 80, step: 5, default: 24, unit: 'px' }],
    { html: '<div class="fade-in-left">Hello</div>',
      css: '.fade-in-left { animation: fadeInLeft var(--duration, 0.8s) ease-out both; }\n@keyframes fadeInLeft { from { opacity: 0; transform: translateX(calc(var(--distance, 24px) * -1)); } to { opacity: 1; transform: translateX(0); } }',
      js: '' }],

  ['fade-in-right', '右侧淡入', 'Fade In Right', 'basic', 1, '元素从右侧淡入滑入,横向入场。',
    [{ key: 'duration', label: '时长', min: 0.2, max: 3, step: 0.1, default: 0.8, unit: 's' },
     { key: 'distance', label: '距离', min: 10, max: 80, step: 5, default: 24, unit: 'px' }],
    { html: '<div class="fade-in-right">Hello</div>',
      css: '.fade-in-right { animation: fadeInRight var(--duration, 0.8s) ease-out both; }\n@keyframes fadeInRight { from { opacity: 0; transform: translateX(var(--distance, 24px)); } to { opacity: 1; transform: translateX(0); } }',
      js: '' }],

  ['scale-in', '缩放入场', 'Scale In', 'basic', 1, '元素从较小尺寸缩放到原始大小入场。',
    [{ key: 'duration', label: '时长', min: 0.2, max: 2, step: 0.1, default: 0.6, unit: 's' },
     { key: 'from', label: '起始缩放', min: 0.1, max: 0.9, step: 0.05, default: 0.5 }],
    { html: '<div class="scale-in">Scale</div>',
      css: '.scale-in { animation: scaleIn var(--duration, 0.6s) cubic-bezier(0.34, 1.56, 0.64, 1) both; }\n@keyframes scaleIn { from { opacity: 0; transform: scale(var(--from, 0.5)); } to { opacity: 1; transform: scale(1); } }',
      js: '' }],

  ['scale-out', '缩小归位', 'Scale Out', 'basic', 1, '元素从较大尺寸缩小归位,有收束感。',
    [{ key: 'duration', label: '时长', min: 0.2, max: 2, step: 0.1, default: 0.6, unit: 's' },
     { key: 'from', label: '起始缩放', min: 1.05, max: 2, step: 0.05, default: 1.2 }],
    { html: '<div class="scale-out">Scale</div>',
      css: '.scale-out { animation: scaleOut var(--duration, 0.6s) cubic-bezier(0.34, 1.56, 0.64, 1) both; }\n@keyframes scaleOut { from { opacity: 0; transform: scale(var(--from, 1.2)); } to { opacity: 1; transform: scale(1); } }',
      js: '' }],

  ['flip-y', '垂直翻转', 'Flip Y', 'basic', 2, '元素绕 Y 轴翻转入场,类似翻牌。',
    [{ key: 'duration', label: '时长', min: 0.3, max: 2, step: 0.1, default: 0.8, unit: 's' }],
    { html: '<div class="flip-y">↻</div>',
      css: '.flip-y { animation: flipY var(--duration, 0.8s) ease-out both; transform-origin: center; }\n@keyframes flipY { from { transform: perspective(600px) rotateY(-90deg); opacity: 0; } to { transform: perspective(600px) rotateY(0); opacity: 1; } }',
      js: '' }],

  ['flip-in-3d', '3D 翻转', 'Flip In 3D', 'basic', 2, '元素以 3D 透视翻转加缩放入场,立体感强。',
    [{ key: 'duration', label: '时长', min: 0.4, max: 2, step: 0.1, default: 0.9, unit: 's' }],
    { html: '<div class="flip-in-3d">3D</div>',
      css: '.flip-in-3d { animation: flipIn3d var(--duration, 0.9s) ease-out both; transform-origin: center; }\n@keyframes flipIn3d { from { transform: perspective(800px) rotateX(-90deg) rotateY(-30deg) scale(0.6); opacity: 0; } to { transform: perspective(800px) rotateX(0) rotateY(0) scale(1); opacity: 1; } }',
      js: '' }],

  ['wobble', '摇摆', 'Wobble', 'basic', 2, '元素左右摇摆晃动,俏皮可爱。',
    [{ key: 'duration', label: '时长', min: 0.6, max: 2, step: 0.1, default: 1, unit: 's' }],
    { html: '<div class="wobble">Wobble</div>',
      css: '.wobble { display: inline-block; animation: wobble var(--duration, 1s) ease-in-out infinite; transform-origin: center; }\n@keyframes wobble { 0%, 100% { transform: translateX(0) rotate(0); } 15% { transform: translateX(-12%) rotate(-5deg); } 30% { transform: translateX(10%) rotate(3deg); } 45% { transform: translateX(-8%) rotate(-3deg); } 60% { transform: translateX(6%) rotate(2deg); } 75% { transform: translateX(-3%) rotate(-1deg); } }',
      js: '' }],

  ['tada', '庆祝抖动', 'Tada', 'basic', 2, '元素放大并轻微旋转抖动,庆祝感强。',
    [{ key: 'duration', label: '时长', min: 0.6, max: 2, step: 0.1, default: 1, unit: 's' }],
    { html: '<div class="tada">Tada!</div>',
      css: '.tada { display: inline-block; animation: tada var(--duration, 1s) ease-in-out infinite; transform-origin: center; }\n@keyframes tada { 0%, 100% { transform: scale(1) rotate(0); } 10%, 20% { transform: scale(0.9) rotate(-3deg); } 30%, 50%, 70%, 90% { transform: scale(1.15) rotate(3deg); } 40%, 60%, 80% { transform: scale(1.15) rotate(-3deg); } }',
      js: '' }],

  ['bounce-down', '向下弹跳', 'Bounce Down', 'basic', 2, '元素从上方弹跳落下,带多次反弹。',
    [{ key: 'duration', label: '时长', min: 0.6, max: 2, step: 0.1, default: 1, unit: 's' },
     { key: 'distance', label: '距离', min: 20, max: 120, step: 5, default: 60, unit: 'px' }],
    { html: '<div class="bounce-down">Bounce</div>',
      css: '.bounce-down { animation: bounceDown var(--duration, 1s) cubic-bezier(0.34, 1.56, 0.64, 1) both; }\n@keyframes bounceDown { 0% { transform: translateY(calc(var(--distance, 60px) * -1)); opacity: 0; } 60% { transform: translateY(8px); opacity: 1; } 80% { transform: translateY(-4px); } 100% { transform: translateY(0); } }',
      js: '' }],

  ['slide-fade-corner', '角落滑入', 'Corner Slide', 'basic', 2, '元素从左上角斜向滑入,带淡入。',
    [{ key: 'duration', label: '时长', min: 0.3, max: 2, step: 0.1, default: 0.8, unit: 's' }],
    { html: '<div class="corner-slide">Corner</div>',
      css: '.corner-slide { animation: cornerSlide var(--duration, 0.8s) cubic-bezier(0.34, 1.56, 0.64, 1) both; }\n@keyframes cornerSlide { from { opacity: 0; transform: translate(-40px, -40px) scale(0.8); } to { opacity: 1; transform: translate(0, 0) scale(1); } }',
      js: '' }],

  ['skew-in', '倾斜入场', 'Skew In', 'basic', 2, '元素以倾斜状态滑入归位,动感十足。',
    [{ key: 'duration', label: '时长', min: 0.3, max: 2, step: 0.1, default: 0.7, unit: 's' },
     { key: 'angle', label: '角度', min: 5, max: 30, step: 1, default: 15, unit: '°' }],
    { html: '<div class="skew-in">Skew</div>',
      css: '.skew-in { animation: skewIn var(--duration, 0.7s) ease-out both; }\n@keyframes skewIn { from { opacity: 0; transform: skewX(calc(var(--angle, 15deg) * -1)) translateX(-30px); } to { opacity: 1; transform: skewX(0) translateX(0); } }',
      js: '' }],

  ['blur-in', '模糊入场', 'Blur In', 'basic', 2, '元素从模糊状态渐变到清晰,柔和入场。',
    [{ key: 'duration', label: '时长', min: 0.3, max: 2, step: 0.1, default: 0.8, unit: 's' },
     { key: 'blur', label: '模糊', min: 4, max: 30, step: 1, default: 14, unit: 'px' }],
    { html: '<div class="blur-in">Blur</div>',
      css: '.blur-in { animation: blurIn var(--duration, 0.8s) ease-out both; }\n@keyframes blurIn { from { opacity: 0; filter: blur(var(--blur, 14px)); transform: scale(1.05); } to { opacity: 1; filter: blur(0); transform: scale(1); } }',
      js: '' }],

  ['blur-out', '模糊呼吸', 'Blur Pulse', 'basic', 2, '元素在清晰与模糊间循环呼吸,梦幻感。',
    [{ key: 'duration', label: '周期', min: 1, max: 5, step: 0.1, default: 2.4, unit: 's' },
     { key: 'blur', label: '模糊', min: 2, max: 16, step: 1, default: 8, unit: 'px' }],
    { html: '<div class="blur-out">Pulse</div>',
      css: '.blur-out { animation: blurOut var(--duration, 2.4s) ease-in-out infinite; }\n@keyframes blurOut { 0%, 100% { filter: blur(0); opacity: 1; } 50% { filter: blur(var(--blur, 8px)); opacity: 0.6; } }',
      js: '' }],

  ['grayscale-in', '灰度入场', 'Grayscale In', 'basic', 2, '元素从灰度渐变到彩色,复古转彩色。',
    [{ key: 'duration', label: '时长', min: 0.5, max: 3, step: 0.1, default: 1.2, unit: 's' }],
    { html: '<div class="grayscale-in">Color</div>',
      css: '.grayscale-in { animation: grayscaleIn var(--duration, 1.2s) ease-out both; }\n@keyframes grayscaleIn { from { filter: grayscale(1) brightness(1.2); opacity: 0.4; } to { filter: grayscale(0) brightness(1); opacity: 1; } }',
      js: '' }],

  ['color-cycle', '色彩循环', 'Color Cycle', 'basic', 1, '元素背景色按 HSL 循环变化,霓虹感。',
    [{ key: 'duration', label: '周期', min: 1, max: 8, step: 0.2, default: 3, unit: 's' }],
    { html: '<div class="color-cycle">Cycle</div>',
      css: '.color-cycle { animation: colorCycle var(--duration, 3s) linear infinite; }\n@keyframes colorCycle { 0% { background: hsl(0 90% 60%); } 25% { background: hsl(90 90% 55%); } 50% { background: hsl(180 90% 55%); } 75% { background: hsl(270 90% 60%); } 100% { background: hsl(360 90% 60%); } }',
      js: '' }],

  ['border-draw', '边框画出', 'Border Draw', 'basic', 2, '边框按顺时针逐步画出,勾勒轮廓。',
    [{ key: 'duration', label: '时长', min: 0.6, max: 3, step: 0.1, default: 1.4, unit: 's' }],
    { html: '<div class="border-draw">Draw</div>',
      css: '.border-draw { position: relative; padding: 24px 32px; }\n.border-draw::before { content: ""; position: absolute; inset: 0; padding: 2px; border-radius: 12px; background: linear-gradient(90deg, hsl(280 90% 60%), hsl(200 90% 60%)); -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; background-size: 300% 300%; animation: borderDraw var(--duration, 1.4s) ease-in-out infinite alternate; }\n@keyframes borderDraw { to { background-position: 100% 100%; } }',
      js: '' }],

  ['shadow-grow', '阴影生长', 'Shadow Grow', 'basic', 1, '元素阴影循环生长,产生悬浮呼吸感。',
    [{ key: 'duration', label: '周期', min: 1, max: 4, step: 0.1, default: 2, unit: 's' }],
    { html: '<div class="shadow-grow">Float</div>',
      css: '.shadow-grow { animation: shadowGrow var(--duration, 2s) ease-in-out infinite; }\n@keyframes shadowGrow { 0%, 100% { box-shadow: 0 4px 10px rgba(0,0,0,0.1); transform: translateY(0); } 50% { box-shadow: 0 24px 40px rgba(0,0,0,0.25); transform: translateY(-6px); } }',
      js: '' }],

  ['gradient-shift', '渐变流动', 'Gradient Shift', 'basic', 1, '渐变背景持续流动,色彩柔和过渡。',
    [{ key: 'duration', label: '周期', min: 2, max: 10, step: 0.5, default: 5, unit: 's' }],
    { html: '<div class="gradient-shift">Flow</div>',
      css: '.gradient-shift { background: linear-gradient(120deg, hsl(280 90% 60%), hsl(200 90% 60%), hsl(320 90% 60%), hsl(280 90% 60%)); background-size: 300% 300%; animation: gradientShift var(--duration, 5s) ease infinite; }\n@keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }',
      js: '' }],

  ['typewriter-cursor', '光标打字', 'Typing Cursor', 'basic', 2, '带闪烁光标的打字效果,逐字输入循环。',
    [{ key: 'speed', label: '速度', min: 30, max: 250, step: 10, default: 90, unit: 'ms' }],
    { html: '<span id="tw-cursor"></span>',
      css: '#tw-cursor { font-family: monospace; font-weight: 800; }\n#tw-cursor::after { content: "▌"; margin-left: 2px; animation: blink 0.8s step-end infinite; }\n@keyframes blink { 50% { opacity: 0; } }',
      js: "const el = document.getElementById('tw-cursor');\nconst text = 'Typing...';\nlet i = 0;\nsetInterval(() => { el.textContent = text.slice(0, i++ % (text.length + 1)); }, 90);" }],

  // TEXT 21-40
  ['text-fade-up', '文字上滑', 'Text Fade Up', 'text', 1, '文字从下方淡入上滑,优雅入场。',
    [{ key: 'duration', label: '时长', min: 0.4, max: 2, step: 0.1, default: 0.9, unit: 's' },
     { key: 'distance', label: '距离', min: 10, max: 60, step: 5, default: 24, unit: 'px' }],
    { html: '<h1 class="text-fade-up">MOTION</h1>',
      css: '.text-fade-up { animation: textFadeUp var(--duration, 0.9s) cubic-bezier(0.22, 1, 0.36, 1) both; }\n@keyframes textFadeUp { from { opacity: 0; transform: translateY(var(--distance, 24px)); } to { opacity: 1; transform: translateY(0); } }',
      js: '' }],

  ['text-slide-left', '文字左滑', 'Text Slide Left', 'text', 1, '文字从右侧滑入归位,横向入场。',
    [{ key: 'duration', label: '时长', min: 0.4, max: 2, step: 0.1, default: 0.8, unit: 's' },
     { key: 'distance', label: '距离', min: 20, max: 100, step: 5, default: 40, unit: 'px' }],
    { html: '<h1 class="text-slide-left">SLIDE</h1>',
      css: '.text-slide-left { animation: textSlideLeft var(--duration, 0.8s) cubic-bezier(0.22, 1, 0.36, 1) both; }\n@keyframes textSlideLeft { from { opacity: 0; transform: translateX(var(--distance, 40px)); } to { opacity: 1; transform: translateX(0); } }',
      js: '' }],

  ['text-zoom-in', '文字缩放', 'Text Zoom In', 'text', 1, '文字从远处缩放放大入场,有冲击力。',
    [{ key: 'duration', label: '时长', min: 0.4, max: 2, step: 0.1, default: 0.8, unit: 's' }],
    { html: '<h1 class="text-zoom-in">ZOOM</h1>',
      css: '.text-zoom-in { animation: textZoomIn var(--duration, 0.8s) cubic-bezier(0.34, 1.56, 0.64, 1) both; }\n@keyframes textZoomIn { from { opacity: 0; transform: scale(0.3); letter-spacing: 0.3em; } to { opacity: 1; transform: scale(1); letter-spacing: -0.02em; } }',
      js: '' }],

  ['text-blur-reveal', '模糊揭示', 'Blur Reveal', 'text', 2, '文字从模糊状态揭示为清晰,柔和神秘。',
    [{ key: 'duration', label: '时长', min: 0.5, max: 2.5, step: 0.1, default: 1.2, unit: 's' }],
    { html: '<h1 class="text-blur-reveal">REVEAL</h1>',
      css: '.text-blur-reveal { animation: textBlurReveal var(--duration, 1.2s) ease-out both; }\n@keyframes textBlurReveal { from { opacity: 0; filter: blur(20px); letter-spacing: 0.4em; } to { opacity: 1; filter: blur(0); letter-spacing: -0.02em; } }',
      js: '' }],

  ['text-glitch-rgb', 'RGB 故障', 'RGB Glitch', 'text', 3, '文字 RGB 三通道分离故障,赛博朋克风。',
    [{ key: 'duration', label: '周期', min: 1, max: 5, step: 0.1, default: 2, unit: 's' }],
    { html: '<h1 class="rgb-glitch" data-text="RGB">RGB</h1>',
      css: '.rgb-glitch { position: relative; }\n.rgb-glitch::before, .rgb-glitch::after { content: attr(data-text); position: absolute; inset: 0; mix-blend-mode: screen; }\n.rgb-glitch::before { color: hsl(0 100% 55%); animation: rgbR var(--duration, 2s) infinite; }\n.rgb-glitch::after { color: hsl(180 100% 55%); animation: rgbB var(--duration, 2s) infinite; }\n@keyframes rgbR { 0%, 100% { transform: translate(0); } 20% { transform: translate(-3px, 1px); } 40% { transform: translate(2px, -2px); } 60% { transform: translate(-1px, 2px); } }\n@keyframes rgbB { 0%, 100% { transform: translate(0); } 20% { transform: translate(3px, -1px); } 40% { transform: translate(-2px, 2px); } 60% { transform: translate(1px, -2px); } }',
      js: '' }],

  ['text-neon', '霓虹发光', 'Neon Text', 'text', 2, '文字带霓虹灯发光效果,夜店招牌感。',
    [{ key: 'duration', label: '周期', min: 1, max: 4, step: 0.1, default: 2, unit: 's' }],
    { html: '<h1 class="text-neon">NEON</h1>',
      css: '.text-neon { color: hsl(320 100% 70%); text-shadow: 0 0 6px hsl(320 100% 60%), 0 0 14px hsl(320 100% 55%), 0 0 28px hsl(320 100% 50%), 0 0 50px hsl(320 100% 45%); animation: neonFlicker var(--duration, 2s) ease-in-out infinite; }\n@keyframes neonFlicker { 0%, 100% { opacity: 1; } 92% { opacity: 1; } 93% { opacity: 0.4; } 94% { opacity: 1; } 96% { opacity: 0.6; } 97% { opacity: 1; } }',
      js: '' }],

  ['text-fire', '火焰文字', 'Fire Text', 'text', 3, '文字带火焰渐变与跳动,炽热燃烧感。',
    [{ key: 'duration', label: '周期', min: 1, max: 4, step: 0.1, default: 2, unit: 's' }],
    { html: '<h1 class="text-fire">FIRE</h1>',
      css: '.text-fire { background: linear-gradient(0deg, hsl(0 90% 50%), hsl(20 100% 55%), hsl(45 100% 60%), hsl(0 90% 50%)); background-size: 100% 200%; -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 -2px 6px hsl(20 100% 50%)); animation: fireFlicker var(--duration, 2s) ease-in-out infinite; }\n@keyframes fireFlicker { 0%, 100% { background-position: 0% 0%; } 50% { background-position: 0% 100%; } }',
      js: '' }],

  ['text-ice', '冰霜文字', 'Ice Text', 'text', 3, '文字带冰霜蓝白渐变与结晶光泽,寒冷感。',
    [{ key: 'duration', label: '周期', min: 1, max: 4, step: 0.1, default: 2.5, unit: 's' }],
    { html: '<h1 class="text-ice">ICE</h1>',
      css: '.text-ice { background: linear-gradient(135deg, hsl(190 90% 80%), hsl(210 80% 95%), hsl(200 90% 70%), hsl(220 60% 85%)); background-size: 200% 200%; -webkit-background-clip: text; background-clip: text; color: transparent; text-shadow: 0 0 12px hsl(200 100% 80%); animation: iceShimmer var(--duration, 2.5s) ease-in-out infinite; }\n@keyframes iceShimmer { 0%, 100% { background-position: 0% 0%; } 50% { background-position: 100% 100%; } }',
      js: '' }],

  ['text-metallic', '金属质感', 'Metallic Text', 'text', 3, '文字带金属光泽渐变,质感高级。',
    [{ key: 'duration', label: '周期', min: 1, max: 5, step: 0.1, default: 2.5, unit: 's' }],
    { html: '<h1 class="text-metallic">METAL</h1>',
      css: '.text-metallic { background: linear-gradient(180deg, hsl(0 0% 85%) 0%, hsl(0 0% 35%) 45%, hsl(0 0% 75%) 50%, hsl(0 0% 30%) 55%, hsl(0 0% 80%) 100%); background-size: 100% 200%; -webkit-background-clip: text; background-clip: text; color: transparent; animation: metalShine var(--duration, 2.5s) ease-in-out infinite; }\n@keyframes metalShine { 0%, 100% { background-position: 0% 0%; } 50% { background-position: 0% 100%; } }',
      js: '' }],

  ['text-outline', '描边文字', 'Outline Text', 'text', 2, '文字仅描边显示并循环呼吸,极简风格。',
    [{ key: 'duration', label: '周期', min: 1, max: 4, step: 0.1, default: 2, unit: 's' }],
    { html: '<h1 class="text-outline">OUTLINE</h1>',
      css: '.text-outline { color: transparent; -webkit-text-stroke: 2px hsl(280 90% 60%); animation: outlinePulse var(--duration, 2s) ease-in-out infinite; }\n@keyframes outlinePulse { 0%, 100% { -webkit-text-stroke-color: hsl(280 90% 60%); } 50% { -webkit-text-stroke-color: hsl(200 90% 60%); } }',
      js: '' }],

  ['text-typewriter-multi', '多行打字', 'Multi Typewriter', 'text', 2, '多行文字依次打字输入,循环切换。',
    [{ key: 'speed', label: '速度', min: 30, max: 200, step: 10, default: 80, unit: 'ms' }],
    { html: '<span id="multi-tw"></span>',
      css: '#multi-tw { font-family: monospace; font-weight: 800; }\n#multi-tw::after { content: "▌"; animation: blink 0.8s step-end infinite; }\n@keyframes blink { 50% { opacity: 0; } }',
      js: "const el = document.getElementById('multi-tw');\nconst lines = ['Hello.', 'I am Motion.', 'Built for effects.'];\nlet li = 0, ci = 0, del = false;\nsetInterval(() => {\n  const t = lines[li];\n  ci += del ? -1 : 1;\n  el.textContent = t.slice(0, ci);\n  if (!del && ci >= t.length) { del = true; setTimeout(() => {}, 800); }\n  else if (del && ci <= 0) { del = false; li = (li + 1) % lines.length; }\n}, 90);" }],

  ['text-delete-retype', '删除重打', 'Delete Retype', 'text', 2, '文字打完后删除再重新输入,循环演示。',
    [{ key: 'speed', label: '速度', min: 30, max: 200, step: 10, default: 70, unit: 'ms' }],
    { html: '<span id="del-retype"></span>',
      css: '#del-retype { font-family: monospace; font-weight: 800; }\n#del-retype::after { content: "▌"; animation: blink 0.8s step-end infinite; }\n@keyframes blink { 50% { opacity: 0; } }',
      js: "const el = document.getElementById('del-retype');\nconst text = 'DELETE & RETYPE';\nlet i = 0, del = false;\nsetInterval(() => { i += del ? -1 : 1; el.textContent = text.slice(0, i); if (i >= text.length) del = true; else if (i <= 0) del = false; }, 70);" }],

  ['text-wave-3d', '3D 波浪', 'Wave 3D', 'text', 2, '字符以 3D 透视上下波浪起伏,立体波浪。',
    [{ key: 'duration', label: '周期', min: 1, max: 4, step: 0.1, default: 2, unit: 's' }],
    { html: '<h1 class="wave-3d">WAVE</h1>',
      css: '.wave-3d { perspective: 400px; }\n.wave-3d span { display: inline-block; animation: wave3d var(--duration, 2s) ease-in-out infinite; }\n.wave-3d span:nth-child(n) { animation-delay: calc(0.08s * n); }\n@keyframes wave3d { 0%, 100% { transform: translateY(0) rotateX(0); } 50% { transform: translateY(-14px) rotateX(60deg); } }',
      js: "[...document.querySelector('.wave-3d').textContent].forEach(c => { const s = document.createElement('span'); s.textContent = c; c.replaceWith(s); });" }],

  ['text-bounce', '弹跳文字', 'Bounce Text', 'text', 2, '字符依次弹跳,活泼有趣。',
    [{ key: 'duration', label: '周期', min: 1, max: 3, step: 0.1, default: 1.6, unit: 's' }],
    { html: '<h1 class="text-bounce">BOUNCE</h1>',
      css: '.text-bounce span { display: inline-block; animation: textBounce var(--duration, 1.6s) ease-in-out infinite; }\n.text-bounce span:nth-child(n) { animation-delay: calc(0.1s * n); }\n@keyframes textBounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-18px); } }',
      js: "[...document.querySelector('.text-bounce').textContent].forEach(c => { const s = document.createElement('span'); s.textContent = c; c.replaceWith(s); });" }],

  ['text-rainbow-shift', '彩虹偏移', 'Rainbow Shift', 'text', 1, '文字彩虹色循环并轻微偏移,梦幻。',
    [{ key: 'duration', label: '周期', min: 1, max: 6, step: 0.1, default: 3, unit: 's' }],
    { html: '<h1 class="rainbow-shift">RAINBOW</h1>',
      css: '.rainbow-shift { background: linear-gradient(90deg, hsl(0 90% 60%), hsl(60 90% 60%), hsl(120 90% 60%), hsl(180 90% 60%), hsl(240 90% 60%), hsl(300 90% 60%), hsl(360 90% 60%)); background-size: 300% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: rbShift var(--duration, 3s) linear infinite; }\n@keyframes rbShift { to { background-position: 300% 0; } }',
      js: '' }],

  ['text-shadow-long', '长投影', 'Long Shadow', 'text', 2, '文字带超长投影,层叠立体感强。',
    [{ key: 'depth', label: '深度', min: 4, max: 20, step: 1, default: 10 }],
    { html: '<h1 class="long-shadow">SHADOW</h1>',
      css: '.long-shadow { color: hsl(0 0% 100%); text-shadow: 1px 1px 0 hsl(280 60% 40%), 2px 2px 0 hsl(280 60% 38%), 3px 3px 0 hsl(280 60% 36%), 4px 4px 0 hsl(280 60% 34%), 5px 5px 0 hsl(280 60% 32%), 6px 6px 0 hsl(280 60% 30%), 7px 7px 0 hsl(280 60% 28%), 8px 8px 0 hsl(280 60% 26%), 9px 9px 0 hsl(280 60% 24%), 10px 10px 12px hsl(280 80% 10%); }',
      js: '' }],

  ['text-stroke-animate', '描边动画', 'Stroke Animate', 'text', 3, 'SVG 描边文字按路径逐步绘制,书写感。',
    [{ key: 'duration', label: '时长', min: 1, max: 5, step: 0.2, default: 2.5, unit: 's' }],
    { html: '<svg viewBox="0 0 300 80"><text class="stroke-text" x="150" y="60" text-anchor="middle">STROKE</text></svg>',
      css: '.stroke-text { font-size: 56px; font-weight: 900; fill: transparent; stroke: hsl(280 90% 60%); stroke-width: 2; stroke-dasharray: 600; stroke-dashoffset: 600; animation: strokeDraw var(--duration, 2.5s) ease-out infinite alternate; }\n@keyframes strokeDraw { to { stroke-dashoffset: 0; } }',
      js: '' }],

  ['text-split-reveal', '分裂揭示', 'Split Reveal', 'text', 3, '文字从中间分裂上下展开揭示,戏剧性。',
    [{ key: 'duration', label: '时长', min: 0.6, max: 2.5, step: 0.1, default: 1.2, unit: 's' }],
    { html: '<h1 class="split-reveal" data-text="SPLIT">SPLIT</h1>',
      css: '.split-reveal { position: relative; overflow: hidden; }\n.split-reveal::before { content: attr(data-text); position: absolute; inset: 0; clip-path: inset(0 0 50% 0); transform: translateY(-100%); animation: splitTop var(--duration, 1.2s) cubic-bezier(0.65, 0, 0.35, 1) forwards; }\n@keyframes splitTop { to { transform: translateY(0); } }',
      js: '' }],

  ['text-char-fall', '字符下落', 'Char Fall', 'text', 2, '字符从上方依次下落入位,瀑布感。',
    [{ key: 'duration', label: '时长', min: 0.6, max: 2.5, step: 0.1, default: 1.2, unit: 's' }],
    { html: '<h1 class="char-fall">FALL</h1>',
      css: '.char-fall span { display: inline-block; opacity: 0; animation: charFall var(--duration, 1.2s) cubic-bezier(0.34, 1.56, 0.64, 1) both; }\n.char-fall span:nth-child(n) { animation-delay: calc(0.1s * n); }\n@keyframes charFall { from { opacity: 0; transform: translateY(-60px) rotate(-20deg); } to { opacity: 1; transform: translateY(0) rotate(0); } }',
      js: "[...document.querySelector('.char-fall').textContent].forEach(c => { const s = document.createElement('span'); s.textContent = c; c.replaceWith(s); });" }],

  ['text-word-fly', '词语飞入', 'Word Fly', 'text', 2, '词语依次从远处飞入,带 stagger 延迟。',
    [{ key: 'duration', label: '单项时长', min: 0.4, max: 1.5, step: 0.1, default: 0.7, unit: 's' },
     { key: 'stagger', label: '间隔', min: 0.05, max: 0.4, step: 0.05, default: 0.12, unit: 's' }],
    { html: '<h1 class="word-fly"><span>Motion</span> <span>Lab</span> <span>Effects</span></h1>',
      css: '.word-fly span { display: inline-block; opacity: 0; animation: wordFly var(--duration, 0.7s) cubic-bezier(0.22, 1, 0.36, 1) forwards; }\n.word-fly span:nth-child(1) { animation-delay: 0s; }\n.word-fly span:nth-child(2) { animation-delay: var(--stagger, 0.12s); }\n.word-fly span:nth-child(3) { animation-delay: calc(var(--stagger, 0.12s) * 2); }\n@keyframes wordFly { from { opacity: 0; transform: translateZ(-200px) rotateY(40deg); } to { opacity: 1; transform: translateZ(0) rotateY(0); } }',
      js: '' }],

  // INTERACTION 21-40
  ['hover-scale', '悬停缩放', 'Hover Scale', 'interaction', 1, '鼠标悬停时元素放大,平滑过渡。',
    [{ key: 'scale', label: '缩放', min: 1.05, max: 1.6, step: 0.05, default: 1.15 }],
    { html: '<div class="hover-scale">HOVER</div>',
      css: '.hover-scale { transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); cursor: pointer; }\n.hover-scale:hover { transform: scale(var(--scale, 1.15)); }',
      js: '' }],

  ['hover-rotate', '悬停旋转', 'Hover Rotate', 'interaction', 1, '鼠标悬停时元素旋转,带过渡。',
    [{ key: 'angle', label: '角度', min: 5, max: 180, step: 5, default: 30, unit: '°' }],
    { html: '<div class="hover-rotate">ROTATE</div>',
      css: '.hover-rotate { transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); cursor: pointer; }\n.hover-rotate:hover { transform: rotate(var(--angle, 30deg)); }',
      js: '' }],

  ['hover-skew', '悬停倾斜', 'Hover Skew', 'interaction', 1, '鼠标悬停时元素倾斜变形,动感。',
    [{ key: 'angle', label: '角度', min: 5, max: 30, step: 1, default: 15, unit: '°' }],
    { html: '<div class="hover-skew">SKEW</div>',
      css: '.hover-skew { transition: transform 0.3s ease; cursor: pointer; }\n.hover-skew:hover { transform: skewX(calc(var(--angle, 15deg) * -1)); }',
      js: '' }],

  ['hover-blur', '悬停模糊', 'Hover Blur', 'interaction', 2, '悬停时背景模糊,聚焦前景元素。',
    [{ key: 'blur', label: '模糊', min: 2, max: 16, step: 1, default: 6, unit: 'px' }],
    { html: '<div class="hover-blur"><div class="bg"></div><div class="fg">FOCUS</div></div>',
      css: '.hover-blur { position: relative; cursor: pointer; }\n.hover-blur .bg { transition: filter 0.3s; }\n.hover-blur:hover .bg { filter: blur(var(--blur, 6px)); }',
      js: '' }],

  ['hover-color-change', '悬停变色', 'Hover Color', 'interaction', 1, '悬停时元素背景色平滑过渡。',
    [{ key: 'duration', label: '时长', min: 0.1, max: 1, step: 0.05, default: 0.3, unit: 's' }],
    { html: '<div class="hover-color">CHANGE</div>',
      css: '.hover-color { background: hsl(280 90% 60%); transition: background var(--duration, 0.3s) ease, transform var(--duration, 0.3s) ease; cursor: pointer; }\n.hover-color:hover { background: hsl(200 90% 55%); transform: translateY(-2px); }',
      js: '' }],

  ['hover-border-expand', '边框扩展', 'Border Expand', 'interaction', 2, '悬停时边框从中心向四周扩展。',
    [{ key: 'duration', label: '时长', min: 0.2, max: 1, step: 0.05, default: 0.4, unit: 's' }],
    { html: '<div class="border-expand">EXPAND</div>',
      css: '.border-expand { position: relative; cursor: pointer; }\n.border-expand::before { content: ""; position: absolute; inset: 50% 50%; border: 2px solid hsl(280 90% 60%); border-radius: 12px; transition: inset var(--duration, 0.4s) cubic-bezier(0.2, 0.8, 0.2, 1); }\n.border-expand:hover::before { inset: 0; }',
      js: '' }],

  ['hover-text-reveal', '文字揭示', 'Text Reveal', 'interaction', 2, '悬停时隐藏文字从下方滑入揭示。',
    [{ key: 'duration', label: '时长', min: 0.2, max: 1, step: 0.05, default: 0.4, unit: 's' }],
    { html: '<div class="text-reveal"><span class="label">HOVER</span><span class="hidden">REVEALED</span></div>',
      css: '.text-reveal { position: relative; overflow: hidden; cursor: pointer; }\n.text-reveal .hidden { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; transform: translateY(100%); transition: transform var(--duration, 0.4s) cubic-bezier(0.2, 0.8, 0.2, 1); }\n.text-reveal:hover .hidden { transform: translateY(0); }',
      js: '' }],

  ['hover-image-zoom', '图片放大', 'Image Zoom', 'interaction', 1, '悬停时图片平滑放大,带遮罩。',
    [{ key: 'scale', label: '缩放', min: 1.1, max: 2, step: 0.05, default: 1.3 }],
    { html: '<div class="img-zoom"><div class="img"></div></div>',
      css: '.img-zoom { overflow: hidden; cursor: pointer; }\n.img-zoom .img { width: 100%; height: 100%; background: linear-gradient(135deg, hsl(280 90% 60%), hsl(200 90% 60%)); transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); }\n.img-zoom:hover .img { transform: scale(var(--scale, 1.3)); }',
      js: '' }],

  ['hover-flip-card', '翻转卡片', 'Flip Card', 'interaction', 2, '悬停时卡片 3D 翻转,正反切换。',
    [{ key: 'duration', label: '时长', min: 0.3, max: 1.2, step: 0.05, default: 0.6, unit: 's' }],
    { html: '<div class="flip-card"><div class="flip-inner"><div class="front">FRONT</div><div class="back">BACK</div></div></div>',
      css: '.flip-card { perspective: 800px; cursor: pointer; }\n.flip-inner { position: relative; transform-style: preserve-3d; transition: transform var(--duration, 0.6s); }\n.flip-card:hover .flip-inner { transform: rotateY(180deg); }\n.flip-card .front, .flip-card .back { position: absolute; inset: 0; backface-visibility: hidden; display: flex; align-items: center; justify-content: center; }\n.flip-card .back { transform: rotateY(180deg); }',
      js: '' }],

  ['hover-glow', '悬停发光', 'Hover Glow', 'interaction', 1, '悬停时元素周围发光晕,聚焦感。',
    [{ key: 'intensity', label: '强度', min: 10, max: 60, step: 2, default: 28, unit: 'px' }],
    { html: '<div class="hover-glow">GLOW</div>',
      css: '.hover-glow { transition: box-shadow 0.3s ease, transform 0.3s ease; cursor: pointer; }\n.hover-glow:hover { box-shadow: 0 0 var(--intensity, 28px) hsl(280 90% 60%); transform: translateY(-2px); }',
      js: '' }],

  ['click-ripple-material', 'Material 波纹', 'Material Ripple', 'interaction', 2, 'Material Design 风格点击波纹扩散。',
    [{ key: 'duration', label: '时长', min: 0.4, max: 1.2, step: 0.05, default: 0.6, unit: 's' }],
    { html: '<button class="mat-ripple">CLICK</button>',
      css: '.mat-ripple { position: relative; overflow: hidden; cursor: pointer; }\n.mat-ripple .r { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.5); transform: translate(-50%, -50%) scale(0); animation: matRipple var(--duration, 0.6s) ease-out forwards; pointer-events: none; }\n@keyframes matRipple { to { transform: translate(-50%, -50%) scale(10); opacity: 0; } }',
      js: "const btn = document.querySelector('.mat-ripple');\nbtn.addEventListener('click', (e) => { const r = btn.getBoundingClientRect(); const rip = document.createElement('span'); rip.className = 'r'; rip.style.left = (e.clientX - r.left) + 'px'; rip.style.top = (e.clientY - r.top) + 'px'; rip.style.width = rip.style.height = '20px'; btn.appendChild(rip); setTimeout(() => rip.remove(), 600); });" }],

  ['click-shockwave', '点击冲击波', 'Shockwave', 'interaction', 2, '点击产生扩散冲击波环,强烈反馈。',
    [{ key: 'duration', label: '时长', min: 0.4, max: 1.5, step: 0.05, default: 0.8, unit: 's' }],
    { html: '<div class="shockwave">CLICK</div>',
      css: '.shockwave { position: relative; cursor: pointer; }\n.shockwave .wave { position: absolute; border: 3px solid hsl(280 90% 60%); border-radius: 50%; transform: translate(-50%, -50%) scale(0); animation: shock var(--duration, 0.8s) ease-out forwards; pointer-events: none; }\n@keyframes shock { to { transform: translate(-50%, -50%) scale(8); opacity: 0; border-width: 1px; } }',
      js: "const el = document.querySelector('.shockwave');\nel.addEventListener('click', (e) => { const r = el.getBoundingClientRect(); const w = document.createElement('span'); w.className = 'wave'; w.style.left = (e.clientX - r.left) + 'px'; w.style.top = (e.clientY - r.top) + 'px'; w.style.width = w.style.height = '20px'; el.appendChild(w); setTimeout(() => w.remove(), 800); });" }],

  ['click-emoji-burst', 'Emoji 爆开', 'Emoji Burst', 'interaction', 2, '点击位置爆开一圈 emoji,趣味反馈。',
    [{ key: 'count', label: '数量', min: 6, max: 24, step: 1, default: 12 }],
    { html: '<div class="emoji-burst">CLICK</div>',
      css: '.emoji-burst { position: relative; cursor: pointer; }\n.emoji-burst .e { position: absolute; font-size: 24px; pointer-events: none; transition: transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.7s; }',
      js: "const el = document.querySelector('.emoji-burst');\nconst emojis = ['🎉','✨','⭐','💫','🌟','🎊'];\nel.addEventListener('click', (e) => { const r = el.getBoundingClientRect(); const x = e.clientX - r.left, y = e.clientY - r.top; for (let i = 0; i < 12; i++) { const s = document.createElement('span'); s.className = 'e'; s.textContent = emojis[i % emojis.length]; s.style.left = x + 'px'; s.style.top = y + 'px'; el.appendChild(s); const ang = (i / 12) * Math.PI * 2; const dist = 50 + Math.random() * 30; requestAnimationFrame(() => { s.style.transform = `translate(${Math.cos(ang) * dist}px, ${Math.sin(ang) * dist}px) scale(0)`; s.style.opacity = '0'; }); setTimeout(() => s.remove(), 750); } });" }],

  ['drag-to-reveal', '拖动揭示', 'Drag Reveal', 'interaction', 2, '拖动遮罩揭示下方内容,刮刮卡感。',
    [{ key: 'duration', label: '过渡', min: 0.1, max: 0.6, step: 0.05, default: 0.2, unit: 's' }],
    { html: '<div class="drag-reveal"><div class="cover">DRAG ME</div><div class="under">REVEALED</div></div>',
      css: '.drag-reveal { position: relative; cursor: ew-resize; user-select: none; }\n.drag-reveal .under { display: flex; align-items: center; justify-content: center; }\n.drag-reveal .cover { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; transition: clip-path var(--duration, 0.2s); clip-path: inset(0 0 0 0); }',
      js: "const el = document.querySelector('.drag-reveal'); const cover = el.querySelector('.cover');\nlet dragging = false, startX = 0, startPct = 0;\nconst pct = () => { const m = cover.style.clipPath.match(/inset\\(0 (\\d+)%/); return m ? +m[1] : 0; };\nel.addEventListener('mousedown', (e) => { dragging = true; startX = e.clientX; startPct = pct(); });\nwindow.addEventListener('mousemove', (e) => { if (!dragging) return; const w = el.offsetWidth; let p = startPct + ((e.clientX - startX) / w) * 100; p = Math.max(0, Math.min(100, p)); cover.style.clipPath = `inset(0 ${p}% 0 0)`; });\nwindow.addEventListener('mouseup', () => dragging = false);" }],

  ['drag-rotate', '拖动旋转', 'Drag Rotate', 'interaction', 2, '拖动元素使其 3D 旋转,可交互探索。',
    [{ key: 'sensitivity', label: '灵敏度', min: 0.2, max: 2, step: 0.1, default: 0.6 }],
    { html: '<div class="drag-rotate">DRAG</div>',
      css: '.drag-rotate { transform-style: preserve-3d; cursor: grab; user-select: none; }\n.drag-rotate:active { cursor: grabbing; }',
      js: "const el = document.querySelector('.drag-rotate');\nlet rx = -20, ry = 20, dragging = false, lx = 0, ly = 0;\nel.addEventListener('mousedown', (e) => { dragging = true; lx = e.clientX; ly = e.clientY; });\nwindow.addEventListener('mousemove', (e) => { if (!dragging) return; ry += (e.clientX - lx) * 0.6; rx -= (e.clientY - ly) * 0.6; lx = e.clientX; ly = e.clientY; el.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg)`; });\nwindow.addEventListener('mouseup', () => dragging = false);" }],

  ['scroll-progress', '滚动进度', 'Scroll Progress', 'interaction', 1, '页面滚动进度条,顶部高亮显示。',
    [{ key: 'height', label: '高度', min: 2, max: 10, step: 1, default: 4, unit: 'px' }],
    { html: '<div class="scroll-progress"><div class="bar"></div></div>',
      css: '.scroll-progress { position: fixed; top: 0; left: 0; right: 0; height: 4px; background: rgba(0,0,0,0.1); z-index: 100; }\n.scroll-progress .bar { height: 100%; width: 0; background: linear-gradient(90deg, hsl(280 90% 60%), hsl(200 90% 60%)); transition: width 0.1s; }',
      js: "const bar = document.querySelector('.scroll-progress .bar');\nwindow.addEventListener('scroll', () => { const h = document.documentElement; const p = h.scrollTop / (h.scrollHeight - h.clientHeight); bar.style.width = (p * 100) + '%'; });" }],

  ['scroll-reveal', '滚动揭示', 'Scroll Reveal', 'interaction', 2, '元素进入视口时上滑淡入,常见落地页效果。',
    [{ key: 'distance', label: '位移', min: 10, max: 100, step: 5, default: 40, unit: 'px' }],
    { html: '<div class="scroll-reveal">REVEAL ON SCROLL</div>',
      css: '.scroll-reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.6s, transform 0.6s; }\n.scroll-reveal.in { opacity: 1; transform: translateY(0); }',
      js: "const el = document.querySelector('.scroll-reveal');\nconst io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) el.classList.add('in'); }), { threshold: 0.2 });\nio.observe(el);" }],

  ['scroll-parallax', '滚动视差', 'Scroll Parallax', 'interaction', 2, '多层元素按不同速度响应滚动,纵深感。',
    [{ key: 'speed', label: '速度', min: 0.1, max: 0.8, step: 0.05, default: 0.3 }],
    { html: '<div class="scroll-parallax"><div class="layer" data-d="0.3">BACK</div><div class="layer" data-d="0.6">MID</div><div class="layer" data-d="1">FRONT</div></div>',
      css: '.scroll-parallax { position: relative; }\n.scroll-parallax .layer { transition: transform 0.1s; }',
      js: "const wrap = document.querySelector('.scroll-parallax');\nwindow.addEventListener('scroll', () => { const r = wrap.getBoundingClientRect(); const y = r.top; wrap.querySelectorAll('.layer').forEach(l => { const d = +l.dataset.d; l.style.transform = `translateY(${y * d * 0.3}px)`; }); });" }],

  ['hover-magnetic-text', '磁吸文字', 'Magnetic Text', 'interaction', 2, '文字字符被光标磁吸,逐字位移。',
    [{ key: 'strength', label: '强度', min: 0.1, max: 0.8, step: 0.05, default: 0.35 }],
    { html: '<h1 class="mag-text">MAGNETIC</h1>',
      css: '.mag-text span { display: inline-block; transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1); }',
      js: "const el = document.querySelector('.mag-text');\n[...el.textContent].forEach(c => { const s = document.createElement('span'); s.textContent = c; c.replaceWith(s); });\nel.addEventListener('mousemove', (e) => { el.querySelectorAll('span').forEach(s => { const r = s.getBoundingClientRect(); const dx = e.clientX - (r.left + r.width / 2); const dy = e.clientY - (r.top + r.height / 2); const d = Math.hypot(dx, dy); if (d < 100) s.style.transform = `translate(${dx * 0.35}px, ${dy * 0.35}px)`; else s.style.transform = ''; }); });" }],

  ['hover-follow-cursor', '跟随光标', 'Follow Cursor', 'interaction', 2, '元素平滑跟随光标移动,带惯性。',
    [{ key: 'speed', label: '速度', min: 0.02, max: 0.3, step: 0.02, default: 0.1 }],
    { html: '<div class="follow-zone"><div class="dot"></div></div>',
      css: '.follow-zone { position: relative; cursor: none; }\n.follow-zone .dot { position: absolute; width: 24px; height: 24px; border-radius: 50%; background: hsl(280 90% 60%); pointer-events: none; transform: translate(-50%, -50%); }',
      js: "const zone = document.querySelector('.follow-zone'); const dot = zone.querySelector('.dot');\nlet tx = 0, ty = 0, x = 0, y = 0;\nzone.addEventListener('mousemove', (e) => { const r = zone.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top; });\nfunction tick() { x += (tx - x) * 0.1; y += (ty - y) * 0.1; dot.style.left = x + 'px'; dot.style.top = y + 'px'; requestAnimationFrame(tick); } tick();" }],

  // ADVANCED 19-38
  ['particle-fountain', '粒子喷泉', 'Particle Fountain', 'advanced', 2, 'Canvas 粒子从底部喷涌向上,受重力下落。',
    [{ key: 'count', label: '粒子数', min: 30, max: 300, step: 10, default: 120 }],
    { html: '<canvas class="fountain"></canvas>',
      css: '.fountain { width: 100%; height: 100%; }',
      js: "const c = document.querySelector('.fountain'); const ctx = c.getContext('2d');\nconst ps = [];\nfunction spawn() { return { x: c.width/2, y: c.height, vx: (Math.random()-0.5)*4, vy: -Math.random()*10-4, c: `hsl(${Math.random()*360} 90% 60%)`, s: 3+Math.random()*3 }; }\nfor (let i = 0; i < 120; i++) ps.push(spawn());\nfunction tick() { ctx.fillStyle='rgba(10,10,30,0.2)'; ctx.fillRect(0,0,c.width,c.height); ps.forEach((p,i) => { p.vy += 0.2; p.x += p.vx; p.y += p.vy; if (p.y > c.height) ps[i] = spawn(); ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, p.s, p.s); }); requestAnimationFrame(tick); } tick();" }],

  ['particle-galaxy', '粒子星系', 'Particle Galaxy', 'advanced', 3, 'Three.js 螺旋星系粒子,缓慢自转。',
    [{ key: 'count', label: '粒子数', min: 500, max: 8000, step: 500, default: 3000 }],
    { html: '<canvas class="galaxy"></canvas>',
      css: '.galaxy { width: 100%; height: 100%; }',
      js: "import * as THREE from 'three';\nconst scene = new THREE.Scene();\nconst geom = new THREE.BufferGeometry();\nconst pos = new Float32Array(3000 * 3); const col = new Float32Array(3000 * 3);\nfor (let i = 0; i < 3000; i++) { const r = Math.random() * 5; const a = i * 0.3; pos[i*3] = Math.cos(a) * r; pos[i*3+1] = (Math.random()-0.5)*0.5; pos[i*3+2] = Math.sin(a) * r; }\ngeom.setAttribute('position', new THREE.BufferAttribute(pos, 3));\nconst mat = new THREE.PointsMaterial({ color: 0xff66ff, size: 0.04 });\nscene.add(new THREE.Points(geom, mat));" }],

  ['shader-plasma', '等离子着色器', 'Plasma Shader', 'advanced', 3, 'GLSL 片元着色器生成等离子流动色彩。',
    [{ key: 'speed', label: '速度', min: 0.1, max: 3, step: 0.1, default: 1 }],
    { html: '<canvas class="plasma"></canvas>',
      css: '.plasma { width: 100%; height: 100%; }',
      js: "const frag = `precision mediump float; uniform float u_time; uniform vec2 u_resolution; void main() { vec2 uv = gl_FragCoord.xy / u_resolution; float v = sin(uv.x*10.0 + u_time) + sin(uv.y*10.0 + u_time*1.3) + sin((uv.x+uv.y)*8.0); v = v / 3.0; gl_FragColor = vec4(0.5+0.5*sin(v*3.14), 0.5+0.5*sin(v*3.14+2.0), 0.5+0.5*sin(v*3.14+4.0), 1.0); }`;" }],

  ['shader-fireball', '火球着色器', 'Fireball Shader', 'advanced', 3, 'GLSL 着色器生成燃烧火球纹理。',
    [{ key: 'speed', label: '速度', min: 0.1, max: 3, step: 0.1, default: 1 }],
    { html: '<canvas class="fireball"></canvas>',
      css: '.fireball { width: 100%; height: 100%; }',
      js: "const frag = `precision mediump float; uniform float u_time; uniform vec2 u_resolution; float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5); } void main() { vec2 uv = gl_FragCoord.xy/u_resolution; float n = hash(uv*10.0 + u_time); vec3 col = mix(vec3(1.0,0.8,0.1), vec3(0.8,0.1,0.0), uv.y); gl_FragColor = vec4(col*n*1.5, 1.0); }`;" }],

  ['canvas-snow', '雪花飘落', 'Canvas Snow', 'advanced', 2, 'Canvas 模拟雪花飘落,带风偏移。',
    [{ key: 'count', label: '雪花数', min: 30, max: 300, step: 10, default: 100 }],
    { html: '<canvas class="snow"></canvas>',
      css: '.snow { width: 100%; height: 100%; }',
      js: "const c = document.querySelector('.snow'); const ctx = c.getContext('2d');\nconst flakes = [];\nfor (let i = 0; i < 100; i++) flakes.push({ x: Math.random()*c.width, y: Math.random()*c.height, r: 1+Math.random()*3, s: 0.5+Math.random()*1.5, w: Math.random()*2-1 });\nfunction tick() { ctx.clearRect(0,0,c.width,c.height); ctx.fillStyle = 'white'; flakes.forEach(f => { f.y += f.s; f.x += f.w; if (f.y > c.height) f.y = 0; ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 7); ctx.fill(); }); requestAnimationFrame(tick); } tick();" }],

  ['canvas-fireworks', '烟花', 'Canvas Fireworks', 'advanced', 3, 'Canvas 烟花自动升空爆炸,多彩粒子。',
    [{ key: 'count', label: '粒子数', min: 30, max: 200, step: 10, default: 80 }],
    { html: '<canvas class="fw"></canvas>',
      css: '.fw { width: 100%; height: 100%; }',
      js: "const c = document.querySelector('.fw'); const ctx = c.getContext('2d');\nlet ps = [];\nfunction launch() { const x = Math.random()*c.width; const y = c.height; const hue = Math.random()*360; for (let i = 0; i < 80; i++) { const a = (i/80)*6.28; ps.push({ x, y: c.height*0.4, vx: Math.cos(a)*3, vy: Math.sin(a)*3, c: `hsl(${hue} 90% 60%)`, life: 1 }); } }\nsetInterval(launch, 1200);\nfunction tick() { ctx.fillStyle='rgba(0,0,20,0.2)'; ctx.fillRect(0,0,c.width,c.height); ps = ps.filter(p => p.life > 0); ps.forEach(p => { p.vy += 0.05; p.x += p.vx; p.y += p.vy; p.life -= 0.015; ctx.fillStyle = p.c; ctx.globalAlpha = p.life; ctx.fillRect(p.x, p.y, 3, 3); }); ctx.globalAlpha = 1; requestAnimationFrame(tick); } tick();" }],

  ['canvas-starfield', '星空', 'Canvas Starfield', 'advanced', 2, 'Canvas 3D 星空穿越,星点向四周飞散。',
    [{ key: 'count', label: '星数', min: 100, max: 800, step: 50, default: 300 }],
    { html: '<canvas class="stars"></canvas>',
      css: '.stars { width: 100%; height: 100%; }',
      js: "const c = document.querySelector('.stars'); const ctx = c.getContext('2d');\nconst stars = [];\nfor (let i = 0; i < 300; i++) stars.push({ x: (Math.random()-0.5)*c.width, y: (Math.random()-0.5)*c.height, z: Math.random()*c.width });\nfunction tick() { ctx.fillStyle='black'; ctx.fillRect(0,0,c.width,c.height); ctx.fillStyle='white'; stars.forEach(s => { s.z -= 4; if (s.z <= 0) s.z = c.width; const k = 128 / s.z; const x = s.x*k + c.width/2; const y = s.y*k + c.height/2; const r = (1 - s.z/c.width) * 2; ctx.fillRect(x, y, r, r); }); requestAnimationFrame(tick); } tick();" }],

  ['canvas-ocean', '海浪', 'Canvas Ocean', 'advanced', 3, 'Canvas 多层正弦叠加模拟海浪起伏。',
    [{ key: 'speed', label: '速度', min: 0.01, max: 0.2, step: 0.01, default: 0.05 }],
    { html: '<canvas class="ocean"></canvas>',
      css: '.ocean { width: 100%; height: 100%; }',
      js: "const c = document.querySelector('.ocean'); const ctx = c.getContext('2d');\nlet t = 0;\nfunction wave(y, amp, freq, color) { ctx.beginPath(); ctx.moveTo(0, y); for (let x = 0; x <= c.width; x += 4) ctx.lineTo(x, y + Math.sin(x*freq + t)*amp); ctx.lineTo(c.width, c.height); ctx.lineTo(0, c.height); ctx.fillStyle = color; ctx.fill(); }\nfunction tick() { ctx.fillStyle = '#0a1a3a'; ctx.fillRect(0,0,c.width,c.height); wave(c.height*0.5, 16, 0.02, 'hsl(200 80% 40%)'); wave(c.height*0.62, 12, 0.03, 'hsl(210 80% 50%)'); wave(c.height*0.74, 8, 0.04, 'hsl(200 90% 60%)'); t += 0.05; requestAnimationFrame(tick); } tick();" }],

  ['svg-draw-path', '路径绘制', 'SVG Path Draw', 'advanced', 2, 'SVG 路径按 stroke-dashoffset 逐步绘制。',
    [{ key: 'duration', label: '时长', min: 1, max: 6, step: 0.2, default: 3, unit: 's' }],
    { html: '<svg class="svg-draw" viewBox="0 0 200 100"><path class="p" d="M10,80 C40,10 70,90 100,40 S160,90 190,30" fill="none" stroke="hsl(280 90% 60%)" stroke-width="3"/></svg>',
      css: '.svg-draw { width: 100%; height: 100%; }\n.svg-draw .p { stroke-dasharray: 400; stroke-dashoffset: 400; animation: draw var(--duration, 3s) ease-in-out infinite alternate; }\n@keyframes draw { to { stroke-dashoffset: 0; } }',
      js: '' }],

  ['svg-dash-animate', '虚线动画', 'SVG Dash Animate', 'advanced', 2, 'SVG 虚线沿路径流动,蚂蚁线效果。',
    [{ key: 'duration', label: '周期', min: 0.5, max: 4, step: 0.1, default: 1.5, unit: 's' }],
    { html: '<svg class="svg-dash" viewBox="0 0 200 100"><path class="p" d="M10,50 L60,20 L110,80 L160,30 L190,60" fill="none" stroke="hsl(200 90% 55%)" stroke-width="3" stroke-dasharray="8 6"/></svg>',
      css: '.svg-dash { width: 100%; height: 100%; }\n.svg-dash .p { animation: dash var(--duration, 1.5s) linear infinite; }\n@keyframes dash { to { stroke-dashoffset: -28; } }',
      js: '' }],

  ['3d-sphere', '3D 球体', '3D Sphere', 'advanced', 3, 'Three.js 线框球体自转,带粒子环绕。',
    [{ key: 'detail', label: '细分', min: 8, max: 48, step: 2, default: 24 }],
    { html: '<canvas class="sphere"></canvas>',
      css: '.sphere { width: 100%; height: 100%; }',
      js: "import * as THREE from 'three';\nconst scene = new THREE.Scene();\nconst geom = new THREE.IcosahedronGeometry(1.5, 2);\nconst mat = new THREE.MeshBasicMaterial({ color: 0xaa66ff, wireframe: true });\nscene.add(new THREE.Mesh(geom, mat));" }],

  ['3d-torus', '3D 圆环', '3D Torus', 'advanced', 2, 'Three.js 圆环持续旋转,带光泽材质。',
    [{ key: 'duration', label: '周期', min: 2, max: 12, step: 0.5, default: 6, unit: 's' }],
    { html: '<canvas class="torus"></canvas>',
      css: '.torus { width: 100%; height: 100%; }',
      js: "import * as THREE from 'three';\nconst scene = new THREE.Scene();\nconst geom = new THREE.TorusGeometry(1.2, 0.4, 16, 60);\nconst mat = new THREE.MeshNormalMaterial();\nscene.add(new THREE.Mesh(geom, mat));" }],

  ['gsap-timeline', 'GSAP 时间线', 'GSAP Timeline', 'advanced', 3, 'GSAP 时间线编排多步动画序列。',
    [{ key: 'duration', label: '时长', min: 1, max: 6, step: 0.2, default: 3, unit: 's' }],
    { html: '<div class="gsap-tl"><div class="b b1">1</div><div class="b b2">2</div><div class="b b3">3</div></div>',
      css: '.gsap-tl .b { width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; }\n.gsap-tl .b1 { background: hsl(280 90% 60%); }\n.gsap-tl .b2 { background: hsl(200 90% 60%); }\n.gsap-tl .b3 { background: hsl(320 90% 60%); }',
      js: "const tl = gsap.timeline({ repeat: -1 });\ntl.to('.b1', { x: 60, duration: 1 }).to('.b2', { x: 60, duration: 1 }, '<0.2').to('.b3', { x: 60, duration: 1 }, '<0.2').to('.b', { x: 0, duration: 1 }, '+=0.3');" }],

  ['gsap-stagger', 'GSAP 错落', 'GSAP Stagger', 'advanced', 2, 'GSAP stagger 让多个元素错落入场。',
    [{ key: 'stagger', label: '间隔', min: 0.05, max: 0.5, step: 0.05, default: 0.15, unit: 's' }],
    { html: '<div class="gsap-st"><div class="item">A</div><div class="item">B</div><div class="item">C</div><div class="item">D</div><div class="item">E</div></div>',
      css: '.gsap-st { display: flex; gap: 8px; }\n.gsap-st .item { width: 40px; height: 40px; border-radius: 8px; background: linear-gradient(135deg, hsl(280 90% 60%), hsl(200 90% 60%)); color: white; display: flex; align-items: center; justify-content: center; font-weight: 900; }',
      js: "gsap.from('.gsap-st .item', { y: 40, opacity: 0, duration: 0.6, stagger: 0.15, repeat: -1, repeatDelay: 1 });" }],

  ['lottie-checkmark', 'Lottie 打勾', 'Lottie Checkmark', 'advanced', 2, 'SVG 模拟 Lottie 打勾动画,完成反馈。',
    [{ key: 'duration', label: '时长', min: 0.4, max: 2, step: 0.1, default: 0.8, unit: 's' }],
    { html: '<svg class="check" viewBox="0 0 100 100"><circle class="c" cx="50" cy="50" r="44" fill="none" stroke="hsl(140 80% 50%)" stroke-width="4"/><path class="mark" d="M30 52 L45 66 L72 36" fill="none" stroke="hsl(140 80% 50%)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      css: '.check { width: 120px; height: 120px; }\n.check .c { stroke-dasharray: 276; stroke-dashoffset: 276; animation: drawC var(--duration, 0.8s) ease-out forwards; }\n.check .mark { stroke-dasharray: 60; stroke-dashoffset: 60; animation: drawM var(--duration, 0.8s) ease-out var(--duration, 0.8s) forwards; }\n@keyframes drawC { to { stroke-dashoffset: 0; } }\n@keyframes drawM { to { stroke-dashoffset: 0; } }',
      js: '' }],

  ['physics-gravity', '重力物理', 'Gravity Physics', 'advanced', 3, 'Canvas 多球受重力碰撞弹跳,物理仿真。',
    [{ key: 'gravity', label: '重力', min: 0.1, max: 1, step: 0.05, default: 0.4 }],
    { html: '<canvas class="grav"></canvas>',
      css: '.grav { width: 100%; height: 100%; }',
      js: "const c = document.querySelector('.grav'); const ctx = c.getContext('2d');\nconst balls = [];\nfor (let i = 0; i < 8; i++) balls.push({ x: Math.random()*c.width, y: 50, vx: (Math.random()-0.5)*4, vy: 0, r: 12+Math.random()*8, c: `hsl(${Math.random()*360} 90% 60%)` });\nfunction tick() { ctx.clearRect(0,0,c.width,c.height); balls.forEach(b => { b.vy += 0.4; b.x += b.vx; b.y += b.vy; if (b.y + b.r > c.height) { b.y = c.height - b.r; b.vy *= -0.8; } if (b.x < b.r || b.x > c.width - b.r) b.vx *= -1; ctx.fillStyle = b.c; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 7); ctx.fill(); }); requestAnimationFrame(tick); } tick();" }],

  ['physics-cloth', '布料模拟', 'Cloth Sim', 'advanced', 3, 'Canvas 网格布料模拟,受重力下垂摆动。',
    [{ key: 'resolution', label: '分辨率', min: 6, max: 16, step: 1, default: 10 }],
    { html: '<canvas class="cloth"></canvas>',
      css: '.cloth { width: 100%; height: 100%; }',
      js: "const c = document.querySelector('.cloth'); const ctx = c.getContext('2d');\nconst cols = 10, rows = 10, gap = 16;\nconst pts = [];\nfor (let r = 0; r < rows; r++) for (let col = 0; col < cols; col++) pts.push({ x: col*gap, y: r*gap, px: col*gap, py: r*gap, pin: r === 0 });\nfunction tick() { ctx.clearRect(0,0,c.width,c.height); pts.forEach(p => { if (p.pin) return; const vx = (p.x - p.px)*0.99, vy = (p.y - p.py)*0.99; p.px = p.x; p.py = p.y; p.x += vx; p.y += vy + 0.3; }); ctx.strokeStyle = 'hsl(280 90% 60%)'; for (let r = 0; r < rows; r++) for (let col = 0; col < cols; col++) { const p = pts[r*cols+col]; if (col < cols-1) { const q = pts[r*cols+col+1]; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); } if (r < rows-1) { const q = pts[(r+1)*cols+col]; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); } } requestAnimationFrame(tick); } tick();" }],

  ['fractal-mandelbrot', '曼德博集合', 'Mandelbrot', 'advanced', 3, 'Canvas 渲染曼德博分形集合,自相似图案。',
    [{ key: 'iterations', label: '迭代', min: 30, max: 200, step: 10, default: 80 }],
    { html: '<canvas class="mandel"></canvas>',
      css: '.mandel { width: 100%; height: 100%; }',
      js: "const c = document.querySelector('.mandel'); const ctx = c.getContext('2d');\nconst img = ctx.createImageData(c.width, c.height); const d = img.data;\nfor (let py = 0; py < c.height; py++) for (let px = 0; px < c.width; px++) { let x = 0, y = 0, i = 0; const cx = (px - c.width/2)/120 - 0.5, cy = (py - c.height/2)/120; while (x*x + y*y < 4 && i < 80) { const xt = x*x - y*y + cx; y = 2*x*y + cy; x = xt; i++; } const idx = (py*c.width + px)*4; const v = i === 80 ? 0 : (i*8 % 256); d[idx] = v; d[idx+1] = v*0.5; d[idx+2] = 255 - v; d[idx+3] = 255; }\nctx.putImageData(img, 0, 0);" }],

  ['flow-field', '流场粒子', 'Flow Field', 'advanced', 3, '基于噪声场的粒子流动,有机运动轨迹。',
    [{ key: 'count', label: '粒子数', min: 100, max: 2000, step: 100, default: 600 }],
    { html: '<canvas class="flow"></canvas>',
      css: '.flow { width: 100%; height: 100%; }',
      js: "const c = document.querySelector('.flow'); const ctx = c.getContext('2d');\nconst ps = [];\nfor (let i = 0; i < 600; i++) ps.push({ x: Math.random()*c.width, y: Math.random()*c.height });\nlet t = 0;\nfunction noise(x, y) { return Math.sin(x*0.01 + t)*Math.cos(y*0.01 + t*0.7); }\nfunction tick() { ctx.fillStyle='rgba(10,10,30,0.05)'; ctx.fillRect(0,0,c.width,c.height); ctx.fillStyle = 'hsl(280 90% 70%)'; ps.forEach(p => { const a = noise(p.x, p.y) * 6.28; p.x += Math.cos(a)*1.5; p.y += Math.sin(a)*1.5; if (p.x < 0 || p.x > c.width || p.y < 0 || p.y > c.height) { p.x = Math.random()*c.width; p.y = Math.random()*c.height; } ctx.fillRect(p.x, p.y, 1.5, 1.5); }); t += 0.01; requestAnimationFrame(tick); } tick();" }],

  ['voronoi-art', 'Voronoi 艺术', 'Voronoi Art', 'advanced', 3, 'Canvas 生成 Voronoi 单元艺术图案,彩色拼贴。',
    [{ key: 'count', label: '种子数', min: 10, max: 80, step: 5, default: 30 }],
    { html: '<canvas class="voronoi"></canvas>',
      css: '.voronoi { width: 100%; height: 100%; }',
      js: "const c = document.querySelector('.voronoi'); const ctx = c.getContext('2d');\nconst seeds = [];\nfor (let i = 0; i < 30; i++) seeds.push({ x: Math.random()*c.width, y: Math.random()*c.height, c: `hsl(${Math.random()*360} 70% 60%)` });\nconst img = ctx.createImageData(c.width, c.height); const d = img.data;\nfor (let py = 0; py < c.height; py++) for (let px = 0; px < c.width; px++) { let best = 0, bd = Infinity; for (let i = 0; i < seeds.length; i++) { const dx = px - seeds[i].x, dy = py - seeds[i].y; const dist = dx*dx + dy*dy; if (dist < bd) { bd = dist; best = i; } } const idx = (py*c.width + px)*4; const m = seeds[best].c.match(/hsl\\((\\d+)/); const h = +m[1]; d[idx] = h; d[idx+1] = 150; d[idx+2] = 150; d[idx+3] = 255; }\nctx.putImageData(img, 0, 0);" }],
];

const esc = (s) => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

let out = `// Auto-generated by scripts/gen-effects.mjs — do not edit by hand.
import type { ComponentType } from 'react';

export type EffectCategory = 'basic' | 'text' | 'interaction' | 'advanced';
export type ParamKind = 'range' | 'select';
export type EffectParam =
  | { kind: 'range'; key: string; label: string; min: number; max: number; step: number; default: number; unit?: string }
  | { kind: 'select'; key: string; label: string; options: string[]; default: string };
export interface EffectCode { html: string; css: string; js: string; }
export interface Effect {
  id: string; name: string; englishName: string;
  category: EffectCategory; tags: string[]; description: string;
  difficulty: 1 | 2 | 3; params: EffectParam[]; code: EffectCode;
  preview: () => Promise<{ default: ComponentType<{ params: Record<string, any> }> }>;
}

export const CATEGORIES: { id: EffectCategory | 'all'; name: string; english: string }[] = [
  { id: 'all', name: '全部', english: 'All' },
  { id: 'basic', name: '基础', english: 'Basic' },
  { id: 'text', name: '文字', english: 'Text' },
  { id: 'interaction', name: '交互', english: 'Interaction' },
  { id: 'advanced', name: '高级', english: 'Advanced' },
];

const lz = (id: string) => () => import(\`@/components/effects/\${id}\`);

export const EFFECTS: Effect[] = [
`;

for (const [id, name, englishName, category, difficulty, description, params, code] of SPEC) {
  const paramStrs = params.map((p) => {
    if ('options' in p) {
      return `      { kind: 'select', key: '${p.key}', label: '${p.label}', options: ${JSON.stringify(p.options)}, default: '${p.default}' }`;
    }
    const u = p.unit ? `, unit: '${p.unit}'` : '';
    return `      { kind: 'range', key: '${p.key}', label: '${p.label}', min: ${p.min}, max: ${p.max}, step: ${p.step}, default: ${p.default}${u} }`;
  }).join(',\n');
  out += `  {
    id: '${id}',
    name: '${name}',
    englishName: '${englishName}',
    category: '${category}',
    tags: ['${englishName.toLowerCase().split(' ')[0]}', '${category}'],
    description: '${description}',
    difficulty: ${difficulty},
    params: [
${paramStrs}
    ],
    code: {
      html: \`${esc(code.html)}\`,
      css: \`${esc(code.css)}\`,
      js: \`${esc(code.js)}\`,
    },
    preview: lz('${id}'),
  },
`;
}

out += `];
`;

writeFileSync('data/effects.ts', out, 'utf8');
console.log(`Generated data/effects.ts with ${SPEC.length} effects.`);
