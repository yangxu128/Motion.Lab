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
