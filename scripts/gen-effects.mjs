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
