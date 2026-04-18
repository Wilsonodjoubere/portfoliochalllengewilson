import { useState, useEffect, useRef } from 'react'

function App() {
  const [count, setCount] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [lightMode, setLightMode] = useState(false)
  const [formSent, setFormSent] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [ringPos, setRingPos] = useState({ x: 0, y: 0 })
  const [cursorHover, setCursorHover] = useState(false)
  const [taglineIndex, setTaglineIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const ringRef = useRef({ x: 0, y: 0 })
  const mouseRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef(null)
  const charRef = useRef(0)

  const taglines = [
    'Développeur Web Fullstack basé au Bénin',
    'Expert Interfaces Modernes & Performantes',
    'React · Django · Laravel · Node.js'
  ]

  // Cursor
  useEffect(() => {
    const move = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      setCursorPos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', move)
    const animate = () => {
      ringRef.current.x += (mouseRef.current.x - ringRef.current.x) * 0.12
      ringRef.current.y += (mouseRef.current.y - ringRef.current.y) * 0.12
      setRingPos({ x: ringRef.current.x, y: ringRef.current.y })
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Typewriter
  useEffect(() => {
    const current = taglines[taglineIndex]
    let timeout
    if (!isDeleting) {
      if (charRef.current < current.length) {
        timeout = setTimeout(() => {
          setDisplayText(current.substring(0, charRef.current + 1))
          charRef.current++
        }, 60)
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2000)
      }
    } else {
      if (charRef.current > 0) {
        timeout = setTimeout(() => {
          setDisplayText(current.substring(0, charRef.current - 1))
          charRef.current--
        }, 35)
      } else {
        setIsDeleting(false)
        setTaglineIndex((i) => (i + 1) % taglines.length)
      }
    }
    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, taglineIndex])

  // Reveal on scroll
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } })
    }, { threshold: 0.15 })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  // Skill bars
  useEffect(() => {
    const items = document.querySelectorAll('.skill-bar-item')
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('animated'); obs.unobserve(e.target) } })
    }, { threshold: 0.5 })
    items.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const projects = [
    { id: 1, cat: 'challenge', num: '01', title: 'InnerBuild Portfolio', desc: "Conception d'un portfolio haute performance en 7 jours dans le cadre du challenge FrontForge × InnerBuild S01.", stack: ['React', 'Vite', 'CSS Modern', 'SEO', 'Vercel'], tag: 'Challenge', tagColor: '#4f8ef7', year: '2026', featured: true, github: 'https://github.com/ton-pseudo', live: '#', grad: 'rgba(79,142,247,0.2), rgba(0,212,255,0.1)' },
    { id: 2, cat: 'web-app', num: '02', title: 'StudHelp Platform', desc: "Plateforme d'entraide académique pour étudiants.", stack: ['React', 'Django', 'Figma', 'PostgreSQL'], tag: 'Web App', tagColor: '#a78bfa', year: '2025', featured: false, github: '#', live: null, grad: 'rgba(100,150,255,0.15), rgba(255,100,150,0.08)' },
    { id: 3, cat: 'fullstack', num: '03', title: 'E-Commerce Dashboard', desc: "Tableau de bord complet pour la gestion d'un e-commerce avec analytics en temps réel.", stack: ['Next.js', 'Laravel', 'Tailwind', 'MySQL'], tag: 'Fullstack', tagColor: '#34d399', year: '2025', featured: false, github: '#', live: null, grad: 'rgba(52,211,153,0.15), rgba(14,165,233,0.08)' },
  ]

  const filtered = activeFilter === 'all' ? projects : projects.filter(p => p.cat === activeFilter)

  const hoverOn = () => setCursorHover(true)
  const hoverOff = () => setCursorHover(false)

  return (
    <>
      <style>{`
        :root {
          --bg: ${lightMode ? '#f5f5f0' : '#0a0a0a'};
          --bg2: ${lightMode ? '#eeede8' : '#111111'};
          --bg3: ${lightMode ? '#e8e7e2' : '#1a1a1a'};
          --accent: #4f8ef7;
          --accent2: #00d4ff;
          --white: ${lightMode ? '#111' : '#f0ede6'};
          --muted: ${lightMode ? '#888' : '#555'};
          --border: ${lightMode ? '#ddd' : '#222'};
          --font-display: 'Bebas Neue', sans-serif;
          --font-body: 'DM Sans', sans-serif;
          --font-mono: 'Space Mono', monospace;
        }
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700&family=Space+Mono:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: var(--bg); color: var(--white); font-family: var(--font-body); overflow-x: hidden; cursor: none; line-height: 1.6; }
        body::before { content:''; position:fixed; inset:0; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E"); pointer-events:none; z-index:100; opacity:0.5; }

        .cursor { width:12px; height:12px; background:var(--accent); border-radius:50%; position:fixed; pointer-events:none; z-index:9999; mix-blend-mode:difference; transform:translate(-50%,-50%); transition: width .3s, height .3s; }
        .cursor.hover { width:40px; height:40px; }
        .cursor-ring { width:36px; height:36px; border:1px solid rgba(79,142,247,0.4); border-radius:50%; position:fixed; pointer-events:none; z-index:9998; transform:translate(-50%,-50%); }

        nav { position:fixed; top:0; left:0; right:0; z-index:500; padding:1.2rem 3rem; display:flex; align-items:center; justify-content:space-between; background:rgba(10,10,10,0.7); backdrop-filter:blur(20px); border-bottom:1px solid rgba(255,255,255,0.04); transition:all .3s; }
        nav.scrolled { padding:.8rem 3rem; border-bottom-color:rgba(79,142,247,0.1); }
        .nav-logo { font-family:var(--font-display); font-size:1.6rem; letter-spacing:.05em; color:var(--white); text-decoration:none; }
        .nav-logo span { color:var(--accent); }
        .nav-links { display:flex; gap:2.5rem; list-style:none; }
        .nav-links a { font-family:var(--font-mono); font-size:.72rem; letter-spacing:.12em; text-transform:uppercase; color:var(--muted); text-decoration:none; transition:color .2s; position:relative; }
        .nav-links a::after { content:''; position:absolute; bottom:-4px; left:0; right:100%; height:1px; background:var(--accent); transition:right .3s; }
        .nav-links a:hover { color:var(--white); }
        .nav-links a:hover::after { right:0; }
        .nav-cta { font-family:var(--font-mono); font-size:.72rem; letter-spacing:.1em; text-transform:uppercase; color:var(--bg); background:var(--accent); padding:.6rem 1.4rem; text-decoration:none; transition:all .2s; }
        .nav-cta:hover { background:var(--white); }

        .hamburger { display:none; flex-direction:column; gap:5px; cursor:pointer; padding:4px; background:none; border:none; }
        .hamburger span { width:24px; height:1.5px; background:var(--white); transition:all .3s; display:block; }
        .hamburger.open span:nth-child(1) { transform:rotate(45deg) translate(4.5px,4.5px); }
        .hamburger.open span:nth-child(2) { opacity:0; }
        .hamburger.open span:nth-child(3) { transform:rotate(-45deg) translate(4.5px,-4.5px); }
        .mobile-menu { position:fixed; inset:0; background:var(--bg); z-index:400; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2rem; transform:translateX(100%); transition:transform .4s cubic-bezier(.16,1,.3,1); }
        .mobile-menu.open { transform:translateX(0); }
        .mobile-menu a { font-family:var(--font-display); font-size:3rem; color:var(--white); text-decoration:none; letter-spacing:.05em; transition:color .2s; }
        .mobile-menu a:hover { color:var(--accent); }

        #accueil { min-height:100vh; display:flex; flex-direction:column; justify-content:flex-end; padding:0 3rem 4rem; position:relative; overflow:hidden; }
        .hero-bg { position:absolute; inset:0; background:radial-gradient(ellipse 80% 60% at 70% 40%, rgba(79,142,247,0.06) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 20% 80%, rgba(0,212,255,0.04) 0%, transparent 60%); }
        .hero-grid { position:absolute; inset:0; background-image:linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px); background-size:80px 80px; mask-image:radial-gradient(ellipse at center,black 30%,transparent 80%); }
        .hero-number { font-family:var(--font-display); font-size:clamp(12rem,25vw,22rem); line-height:.8; color:rgba(255,255,255,.03); position:absolute; right:-2rem; top:50%; transform:translateY(-50%); user-select:none; }
        .hero-badge { display:inline-flex; align-items:center; gap:.5rem; font-family:var(--font-mono); font-size:.7rem; letter-spacing:.15em; text-transform:uppercase; color:var(--accent); margin-bottom:1.5rem; }
        .hero-badge::before { content:''; width:6px; height:6px; border-radius:50%; background:var(--accent); animation:pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }
        .hero-name { font-family:var(--font-display); font-size:clamp(4rem,12vw,10rem); line-height:.9; letter-spacing:.02em; color:var(--white); position:relative; z-index:1; }
        .hero-name .accent { color:var(--accent); display:block; }
        .hero-tagline { font-size:clamp(1rem,2vw,1.2rem); color:rgba(240,237,230,.5); margin:1.5rem 0 2.5rem; max-width:480px; font-weight:300; min-height:2em; }
        .hero-tagline .cursor-blink { animation:blink 1s infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .hero-actions { display:flex; gap:1rem; flex-wrap:wrap; align-items:center; }
        .btn-primary { font-family:var(--font-mono); font-size:.78rem; letter-spacing:.1em; text-transform:uppercase; color:var(--bg); background:var(--accent); padding:1rem 2rem; text-decoration:none; display:inline-flex; align-items:center; gap:.6rem; transition:all .25s; position:relative; overflow:hidden; border:none; cursor:pointer; }
        .btn-primary::before { content:''; position:absolute; inset:0; background:var(--accent2); transform:translateX(-100%); transition:transform .3s; }
        .btn-primary:hover::before { transform:translateX(0); }
        .btn-primary span { position:relative; z-index:1; }
        .btn-secondary { font-family:var(--font-mono); font-size:.78rem; letter-spacing:.1em; text-transform:uppercase; color:var(--white); border:1px solid rgba(240,237,230,.2); padding:1rem 2rem; text-decoration:none; transition:all .25s; }
        .btn-secondary:hover { border-color:var(--accent); color:var(--accent); }
        .hero-stats { position:absolute; top:50%; right:3rem; transform:translateY(-50%); display:flex; flex-direction:column; gap:2rem; z-index:1; }
        .hero-stat-num { font-family:var(--font-display); font-size:2rem; color:var(--accent); line-height:1; }
        .hero-stat-label { font-family:var(--font-mono); font-size:.62rem; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); margin-top:.2rem; }
        .hero-scroll { position:absolute; bottom:2rem; right:3rem; display:flex; flex-direction:column; align-items:center; gap:.5rem; font-family:var(--font-mono); font-size:.62rem; letter-spacing:.15em; text-transform:uppercase; color:var(--muted); writing-mode:vertical-rl; }
        .hero-scroll::after { content:''; width:1px; height:60px; background:linear-gradient(to bottom,var(--muted),transparent); animation:scrollLine 2s ease-in-out infinite; }
        @keyframes scrollLine { 0%{transform:scaleY(0);transform-origin:top} 50%{transform:scaleY(1);transform-origin:top} 51%{transform:scaleY(1);transform-origin:bottom} 100%{transform:scaleY(0);transform-origin:bottom} }

        section { padding:8rem 3rem; }
        .section-label { font-family:var(--font-mono); font-size:.68rem; letter-spacing:.2em; text-transform:uppercase; color:var(--accent); display:flex; align-items:center; gap:1rem; margin-bottom:1.5rem; }
        .section-label::before { content:''; width:40px; height:1px; background:var(--accent); }
        .section-title { font-family:var(--font-display); font-size:clamp(3rem,8vw,7rem); line-height:.9; letter-spacing:.02em; color:var(--white); margin-bottom:4rem; }

        #a-propos { background:var(--bg2); }
        .about-layout { display:grid; grid-template-columns:1fr 1fr; gap:6rem; align-items:start; }
        .about-text p { font-size:1.1rem; line-height:1.8; color:rgba(240,237,230,.7); margin-bottom:1.5rem; font-weight:300; }
        .about-text p strong { color:var(--white); font-weight:500; }
        .about-quote { border-left:2px solid var(--accent); padding-left:1.5rem; margin:2rem 0; font-style:italic; color:rgba(240,237,230,.5); font-size:1rem; }
        .about-right { position:sticky; top:8rem; }
        .about-avatar { width:100%; aspect-ratio:3/4; background:var(--bg3); border:1px solid var(--border); position:relative; overflow:hidden; margin-bottom:1.5rem; }
        .about-avatar img { width:100%; height:100%; object-fit:cover; object-position:center top; display:block; }
        .avatar-overlay { position:absolute; bottom:0; left:0; right:0; padding:1.5rem; background:linear-gradient(transparent,rgba(10,10,10,.9)); }
        .avatar-name { font-family:var(--font-display); font-size:1.8rem; color:#fff; line-height:1; }
        .avatar-role { font-family:var(--font-mono); font-size:.65rem; color:var(--accent); letter-spacing:.12em; text-transform:uppercase; margin-top:.3rem; }
        .about-card { background:var(--bg3); border:1px solid var(--border); padding:2rem; position:relative; overflow:hidden; }
        .about-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,var(--accent),var(--accent2)); }
        .about-card-label { font-family:var(--font-mono); font-size:.65rem; letter-spacing:.15em; text-transform:uppercase; color:var(--muted); margin-bottom:1.5rem; }
        .about-info-row { display:flex; justify-content:space-between; align-items:baseline; padding:.8rem 0; border-bottom:1px solid var(--border); font-size:.9rem; }
        .about-info-row:last-child { border-bottom:none; }
        .info-key { color:var(--muted); font-family:var(--font-mono); font-size:.72rem; }
        .info-val { color:var(--white); font-weight:500; }
        .available-badge { display:inline-flex; align-items:center; gap:.5rem; background:rgba(79,142,247,.08); border:1px solid rgba(79,142,247,.2); padding:.5rem 1rem; margin-top:1rem; font-family:var(--font-mono); font-size:.65rem; letter-spacing:.1em; text-transform:uppercase; color:var(--accent); }
        .available-badge::before { content:''; width:6px; height:6px; border-radius:50%; background:var(--accent); animation:pulse 2s infinite; }

        #competences { position:relative; }
        .skills-intro { max-width:560px; font-size:1.1rem; color:rgba(240,237,230,.5); margin-bottom:5rem; font-weight:300; line-height:1.7; }
        .skills-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:var(--border); border:1px solid var(--border); margin-bottom:4rem; }
        .skill-card { background:var(--bg); padding:2.5rem; transition:background .3s; position:relative; overflow:hidden; }
        .skill-card::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(79,142,247,.03),transparent); opacity:0; transition:opacity .3s; }
        .skill-card:hover { background:var(--bg3); }
        .skill-card:hover::before { opacity:1; }
        .skill-icon-wrap { width:48px; height:48px; border:1px solid var(--border); display:flex; align-items:center; justify-content:center; font-size:1.4rem; margin-bottom:1.5rem; transition:border-color .3s; }
        .skill-card:hover .skill-icon-wrap { border-color:var(--accent); }
        .skill-name { font-family:var(--font-display); font-size:1.8rem; color:var(--white); margin-bottom:1rem; letter-spacing:.05em; }
        .skill-tags { display:flex; flex-wrap:wrap; gap:.4rem; }
        .skill-tag { font-family:var(--font-mono); font-size:.65rem; letter-spacing:.08em; padding:.3rem .7rem; border:1px solid var(--border); color:var(--muted); transition:all .2s; }
        .skill-card:hover .skill-tag { border-color:rgba(79,142,247,.2); color:rgba(79,142,247,.8); }
        .proficiency-section { margin-top:4rem; }
        .proficiency-title { font-family:var(--font-mono); font-size:.68rem; letter-spacing:.2em; text-transform:uppercase; color:var(--muted); margin-bottom:2rem; }
        .skill-bar-item { display:grid; grid-template-columns:160px 1fr auto; align-items:center; gap:1.5rem; margin-bottom:1.2rem; }
        .skill-bar-name { font-family:var(--font-mono); font-size:.72rem; color:var(--white); letter-spacing:.05em; }
        .skill-bar-track { height:2px; background:var(--border); position:relative; overflow:hidden; }
        .skill-bar-fill { position:absolute; inset:0; background:var(--accent); transform:scaleX(0); transform-origin:left; transition:transform 1.2s cubic-bezier(.16,1,.3,1); }
        .skill-bar-item.animated .skill-bar-fill { transform:scaleX(1); }
        .skill-bar-pct { font-family:var(--font-mono); font-size:.68rem; color:var(--accent); min-width:36px; text-align:right; }

        #projets { background:var(--bg2); }
        .projects-header { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:4rem; }
        .projects-filter { display:flex; gap:.5rem; }
        .filter-btn { font-family:var(--font-mono); font-size:.65rem; letter-spacing:.12em; text-transform:uppercase; padding:.5rem 1rem; border:1px solid var(--border); background:none; color:var(--muted); cursor:pointer; transition:all .2s; }
        .filter-btn.active, .filter-btn:hover { background:var(--accent); border-color:var(--accent); color:var(--bg); }
        .projects-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1.5rem; }
        .project-card { background:var(--bg3); border:1px solid var(--border); overflow:hidden; transition:all .4s cubic-bezier(.16,1,.3,1); position:relative; cursor:pointer; }
        .project-card:hover { border-color:rgba(79,142,247,.3); transform:translateY(-4px); }
        .project-card.featured { grid-column:span 2; }
        .project-thumb { aspect-ratio:16/9; background:var(--bg); position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center; }
        .project-thumb-bg { position:absolute; inset:0; opacity:.3; transition:opacity .3s, transform .5s cubic-bezier(.16,1,.3,1); }
        .project-card:hover .project-thumb-bg { opacity:.5; transform:scale(1.05); }
        .project-thumb-num { font-family:var(--font-display); font-size:8rem; color:rgba(255,255,255,.05); position:relative; z-index:1; line-height:1; }
        .project-overlay { position:absolute; inset:0; background:rgba(10,10,10,.85); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity .3s; }
        .project-card:hover .project-overlay { opacity:1; }
        .project-overlay-links { display:flex; gap:1rem; }
        .overlay-link { font-family:var(--font-mono); font-size:.68rem; letter-spacing:.12em; text-transform:uppercase; padding:.7rem 1.2rem; border:1px solid var(--accent); color:var(--accent); text-decoration:none; transition:all .2s; }
        .overlay-link:hover { background:var(--accent); color:var(--bg); }
        .project-body { padding:1.8rem; }
        .project-meta { display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; }
        .project-tag-badge { font-family:var(--font-mono); font-size:.62rem; letter-spacing:.12em; text-transform:uppercase; padding:.25rem .6rem; border:1px solid; }
        .project-year { font-family:var(--font-mono); font-size:.62rem; color:var(--muted); }
        .project-title { font-family:var(--font-display); font-size:1.8rem; color:var(--white); margin-bottom:.75rem; letter-spacing:.03em; line-height:1.1; }
        .project-desc { font-size:.9rem; color:rgba(240,237,230,.5); line-height:1.6; margin-bottom:1.5rem; font-weight:300; }
        .project-stack { display:flex; flex-wrap:wrap; gap:.4rem; }
        .stack-tag { font-family:var(--font-mono); font-size:.62rem; letter-spacing:.06em; padding:.2rem .6rem; background:rgba(255,255,255,.04); color:rgba(240,237,230,.4); border:1px solid var(--border); }

        #contact { position:relative; overflow:hidden; }
        .contact-bg { position:absolute; bottom:-10rem; right:-10rem; width:600px; height:600px; border-radius:50%; background:radial-gradient(circle,rgba(79,142,247,.04) 0%,transparent 70%); pointer-events:none; }
        .contact-layout { display:grid; grid-template-columns:1fr 1fr; gap:6rem; }
        .contact-big { font-family:var(--font-display); font-size:clamp(2.5rem,6vw,5.5rem); line-height:.9; color:var(--white); margin-bottom:2rem; letter-spacing:.02em; }
        .contact-big span { color:var(--accent); }
        .contact-desc { font-size:1rem; color:rgba(240,237,230,.5); line-height:1.7; margin-bottom:3rem; font-weight:300; max-width:400px; }
        .contact-channels { display:flex; flex-direction:column; border:1px solid var(--border); }
        .contact-channel { display:flex; align-items:center; justify-content:space-between; padding:1.2rem 1.5rem; border-bottom:1px solid var(--border); text-decoration:none; transition:all .2s; }
        .contact-channel:last-child { border-bottom:none; }
        .contact-channel:hover { background:var(--bg3); }
        .channel-left { display:flex; align-items:center; gap:1rem; }
        .channel-icon { width:36px; height:36px; border:1px solid var(--border); display:flex; align-items:center; justify-content:center; font-size:.9rem; transition:all .2s; }
        .contact-channel:hover .channel-icon { border-color:var(--accent); }
        .channel-label { font-family:var(--font-mono); font-size:.68rem; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); }
        .channel-value { font-size:.85rem; color:var(--white); margin-top:.1rem; }
        .channel-arrow { color:var(--muted); font-size:.9rem; transition:all .2s; }
        .contact-channel:hover .channel-arrow { color:var(--accent); transform:translateX(4px); }
        .contact-form-wrap { background:var(--bg2); border:1px solid var(--border); padding:2.5rem; position:relative; }
        .contact-form-wrap::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,var(--accent),transparent); }
        .form-label-top { font-family:var(--font-mono); font-size:.65rem; letter-spacing:.15em; text-transform:uppercase; color:var(--muted); margin-bottom:2rem; display:block; }
        .form-row { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem; }
        .form-group { margin-bottom:1rem; }
        .form-group label { font-family:var(--font-mono); font-size:.62rem; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); display:block; margin-bottom:.5rem; }
        .form-group input, .form-group textarea, .form-group select { width:100%; background:var(--bg3); border:1px solid var(--border); color:var(--white); padding:.9rem 1rem; font-family:var(--font-body); font-size:.9rem; outline:none; transition:border-color .2s; -webkit-appearance:none; }
        .form-group input:focus, .form-group textarea:focus, .form-group select:focus { border-color:var(--accent); }
        .form-group textarea { resize:vertical; min-height:120px; }
        .form-group select option { background:var(--bg3); color:var(--white); }
        .form-submit { width:100%; font-family:var(--font-mono); font-size:.78rem; letter-spacing:.12em; text-transform:uppercase; color:var(--bg); background:var(--accent); border:none; padding:1.1rem; cursor:pointer; transition:all .2s; margin-top:1rem; display:flex; align-items:center; justify-content:center; gap:.5rem; }
        .form-submit:hover { background:var(--white); }
        .form-success { text-align:center; padding:2rem; font-family:var(--font-mono); font-size:.78rem; letter-spacing:.1em; color:var(--accent); text-transform:uppercase; }
        .encourage-section { text-align:center; padding:3rem; background:rgba(79,142,247,.02); border:1px solid rgba(79,142,247,.08); margin-top:4rem; }
        .encourage-btn { font-family:var(--font-display); font-size:1.5rem; letter-spacing:.05em; background:none; border:2px solid var(--accent); color:var(--accent); padding:1rem 2.5rem; cursor:pointer; transition:all .3s cubic-bezier(.16,1,.3,1); display:inline-flex; align-items:center; gap:.8rem; }
        .encourage-btn:hover { background:var(--accent); color:var(--bg); transform:scale(1.05); }
        .encourage-btn:active { transform:scale(.97); }

        footer { padding:3rem; border-top:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; background:var(--bg2); }
        .footer-left { font-family:var(--font-mono); font-size:.7rem; color:var(--muted); letter-spacing:.08em; }
        .footer-left strong { color:var(--white); }
        .footer-socials { display:flex; gap:1.5rem; }
        .footer-socials a { font-family:var(--font-mono); font-size:.65rem; letter-spacing:.12em; text-transform:uppercase; color:var(--muted); text-decoration:none; transition:color .2s; }
        .footer-socials a:hover { color:var(--accent); }
        .footer-badge { font-family:var(--font-mono); font-size:.62rem; color:var(--accent); background:rgba(79,142,247,.06); padding:.4rem .8rem; border:1px solid rgba(79,142,247,.15); letter-spacing:.08em; }

        .reveal { opacity:0; transform:translateY(30px); transition:opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1); }
        .reveal.visible { opacity:1; transform:translateY(0); }
        .reveal-delay-1 { transition-delay:.1s; }
        .reveal-delay-2 { transition-delay:.2s; }
        .reveal-delay-3 { transition-delay:.3s; }
        .reveal-delay-4 { transition-delay:.4s; }

        .progress-bar { position:fixed; top:0; left:0; height:2px; background:var(--accent); z-index:600; transform-origin:left; }
        .back-top { position:fixed; bottom:2rem; right:2rem; width:44px; height:44px; background:var(--accent); color:var(--bg); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:1.1rem; font-weight:bold; opacity:0; pointer-events:none; transition:all .3s; z-index:400; }
        .back-top.show { opacity:1; pointer-events:all; }
        .back-top:hover { background:var(--white); transform:translateY(-4px); }
        .theme-toggle { position:fixed; bottom:2rem; left:2rem; width:44px; height:44px; background:var(--bg3); border:1px solid var(--border); color:var(--white); cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:1rem; z-index:400; transition:all .2s; }
        .theme-toggle:hover { border-color:var(--accent); }

        @media (max-width:900px) {
          nav { padding:1rem 1.5rem; }
          .nav-links, .nav-cta { display:none; }
          .hamburger { display:flex; }
          section { padding:5rem 1.5rem; }
          #accueil { padding:0 1.5rem 3rem; }
          .about-layout, .contact-layout { grid-template-columns:1fr; gap:3rem; }
          .about-right { position:static; }
          .skills-grid { grid-template-columns:1fr; }
          .projects-grid { grid-template-columns:1fr; }
          .project-card.featured { grid-column:span 1; }
          .form-row { grid-template-columns:1fr; }
          footer { flex-direction:column; gap:1.5rem; text-align:center; }
          .hero-stats, .hero-scroll, .hero-number { display:none; }
          .projects-header { flex-direction:column; align-items:flex-start; gap:1.5rem; }
        }
        @media (max-width:640px) {
          .hero-name { font-size:3.5rem !important; }
          .section-title { font-size:3rem !important; }
          .skill-bar-item { grid-template-columns:100px 1fr auto; }
        }
      `}</style>

      {/* Cursor */}
      <div className={`cursor ${cursorHover ? 'hover' : ''}`} style={{ left: cursorPos.x, top: cursorPos.y }} />
      <div className="cursor-ring" style={{ left: ringPos.x, top: ringPos.y }} />

      {/* Progress bar */}
      <ScrollProgress />

      {/* Back to top */}
      <BackToTop />

      {/* Theme toggle */}
      <button className="theme-toggle" onClick={() => setLightMode(l => !l)}>{lightMode ? '🌙' : '☀'}</button>

      {/* NAV */}
      <nav className={scrolled ? 'scrolled' : ''}>
        <a href="#accueil" className="nav-logo" onMouseEnter={hoverOn} onMouseLeave={hoverOff}>W<span>.</span>O</a>
        <ul className="nav-links">
          {['accueil','a-propos','competences','projets','contact'].map(id => (
            <li key={id}><a href={`#${id}`} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>{id === 'a-propos' ? 'À propos' : id.charAt(0).toUpperCase() + id.slice(1)}</a></li>
          ))}
        </ul>
        <a href="#contact" className="nav-cta" onMouseEnter={hoverOn} onMouseLeave={hoverOff}>Travaillons ensemble</a>
        <button className="hamburger" onClick={() => setMenuOpen(o => !o)} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {['accueil','a-propos','competences','projets','contact'].map(id => (
          <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{id === 'a-propos' ? 'À propos' : id.charAt(0).toUpperCase() + id.slice(1)}</a>
        ))}
      </div>

      {/* HERO */}
      <section id="accueil">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-number">WO</div>
        <div className="hero-stats">
          {[['3+','Ans d\'exp.'],['12+','Projets'],['5+','Stacks']].map(([n,l]) => (
            <div key={l} className="hero-stat"><div className="hero-stat-num">{n}</div><div className="hero-stat-label">{l}</div></div>
          ))}
        </div>
        <div className="hero-badge">Disponible pour missions</div>
        <h1 className="hero-name">Wilson<span className="accent">Odjoubere</span></h1>
        <p className="hero-tagline">{displayText}<span className="cursor-blink">|</span></p>
        <div className="hero-actions">
          <a href="#projets" className="btn-primary" onMouseEnter={hoverOn} onMouseLeave={hoverOff}><span>Voir mes projets</span><span>→</span></a>
          <a href="#contact" className="btn-secondary" onMouseEnter={hoverOn} onMouseLeave={hoverOff}>Me contacter</a>
        </div>
        <div className="hero-scroll">Défiler</div>
      </section>

      {/* À PROPOS */}
      <section id="a-propos">
        <div className="section-label">Qui suis-je</div>
        <h2 className="section-title reveal">À PROPOS</h2>
        <div className="about-layout">
          <div className="about-text">
            <p className="reveal">Je m'appelle <strong>Wilson ODJOUBERE</strong>, développeur web fullstack passionné, basé au Bénin. Je conçois des interfaces web modernes et performantes qui allient rigueur technique et sens du détail visuel.</p>
            <p className="reveal reveal-delay-1">Mon approche du développement est centrée sur l'<strong>expérience utilisateur</strong> : chaque ligne de code a pour but de rendre l'interface plus fluide, plus intuitive, et plus belle.</p>
            <p className="reveal reveal-delay-2">Maîtrisant aussi bien le <strong>frontend</strong> (React, Vite, Tailwind) que le <strong>backend</strong> (Django, Laravel, Node.js), j'interviens sur des projets complets de bout en bout.</p>
            <blockquote className="about-quote reveal reveal-delay-3">"Le code est une forme d'art où la logique rencontre la créativité."</blockquote>
            <a href="#contact" className="btn-primary reveal reveal-delay-4" style={{display:'inline-flex',marginTop:'1rem'}} onMouseEnter={hoverOn} onMouseLeave={hoverOff}><span>Discutons de votre projet</span><span>→</span></a>
          </div>
          <div className="about-right">
            <div className="about-avatar reveal">
              <img src="/photo.png" alt="Wilson ODJOUBERE — Développeur Web Fullstack" />
              <div className="avatar-overlay">
                <div className="avatar-name">Wilson</div>
                <div className="avatar-role">Fullstack Developer</div>
              </div>
            </div>
            <div className="about-card reveal reveal-delay-1">
              <div className="about-card-label">// Informations</div>
              {[['Nom','Wilson ODJOUBERE'],['Basé à','Bénin 🇧🇯'],['Spécialité','Fullstack Web'],['Challenge','InnerBuild S01'],['Langues','FR / EN']].map(([k,v]) => (
                <div key={k} className="about-info-row"><span className="info-key">{k}</span><span className="info-val">{v}</span></div>
              ))}
              <div className="available-badge">Disponible pour missions freelance</div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPÉTENCES */}
      <section id="competences">
        <div className="section-label">Mon arsenal</div>
        <h2 className="section-title reveal">EXPERTISES</h2>
        <p className="skills-intro reveal">Technologies maîtrisées, stacks éprouvées, outils sélectionnés pour construire des produits durables.</p>
        <div className="skills-grid">
          {[
            { icon:'⚛️', name:'Frontend', tags:['React','Vite','Next.js','Tailwind CSS','HTML/CSS','JavaScript'] },
            { icon:'⚙️', name:'Backend', tags:['Django','Laravel','Node.js','REST API','PostgreSQL','MySQL'] },
            { icon:'🚀', name:'DevOps & Outils', tags:['Git/GitHub','Vercel','Netlify','Figma','SEO','Performance'] },
          ].map((s, i) => (
            <div key={s.name} className={`skill-card reveal reveal-delay-${i}`} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
              <div className="skill-icon-wrap">{s.icon}</div>
              <div className="skill-name">{s.name}</div>
              <div className="skill-tags">{s.tags.map(t => <span key={t} className="skill-tag">{t}</span>)}</div>
            </div>
          ))}
        </div>
        <div className="proficiency-section reveal">
          <div className="proficiency-title">// Niveau de maîtrise</div>
          {[['React / Next.js','92'],['HTML / CSS','88'],['Django / Laravel','82'],['Node.js / Express','78'],['UI/UX Design','85']].map(([name, pct]) => (
            <div key={name} className="skill-bar-item">
              <div className="skill-bar-name">{name}</div>
              <div className="skill-bar-track"><div className="skill-bar-fill" style={{width:`${pct}%`}} /></div>
              <div className="skill-bar-pct">{pct}%</div>
            </div>
          ))}
        </div>
      </section>

      {/* PROJETS */}
      <section id="projets">
        <div className="projects-header">
          <div>
            <div className="section-label">Mes réalisations</div>
            <h2 className="section-title reveal" style={{marginBottom:0}}>PROJETS</h2>
          </div>
          <div className="projects-filter reveal">
            {['all','challenge','web-app','fullstack'].map(f => (
              <button key={f} className={`filter-btn ${activeFilter===f?'active':''}`} onClick={() => setActiveFilter(f)} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
                {f === 'all' ? 'Tous' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="projects-grid">
          {filtered.map((p, i) => (
            <article key={p.id} className={`project-card ${p.featured ? 'featured' : ''} reveal reveal-delay-${i}`} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
              <div className="project-thumb">
                <div className="project-thumb-bg" style={{background:`linear-gradient(135deg, ${p.grad})`}} />
                <div className="project-thumb-num">{p.num}</div>
                <div className="project-overlay">
                  <div className="project-overlay-links">
                    <a href={p.github} target="_blank" rel="noreferrer" className="overlay-link">GitHub</a>
                    {p.live && <a href={p.live} className="overlay-link">Live ↗</a>}
                  </div>
                </div>
              </div>
              <div className="project-body">
                <div className="project-meta">
                  <span className="project-tag-badge" style={{color:p.tagColor,borderColor:`${p.tagColor}33`,background:`${p.tagColor}10`}}>{p.tag}</span>
                  <span className="project-year">{p.year}</span>
                </div>
                <h3 className="project-title">{p.title}</h3>
                <p className="project-desc">{p.desc}</p>
                <div className="project-stack">{p.stack.map(t => <span key={t} className="stack-tag">{t}</span>)}</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="contact-bg" />
        <div className="section-label">Travaillons ensemble</div>
        <div className="contact-layout">
          <div>
            <h2 className="contact-big reveal">Prêt à<br /><span>construire</span><br />ensemble ?</h2>
            <p className="contact-desc reveal reveal-delay-1">Une idée de projet, une opportunité freelance ou juste une question — je suis disponible et réponds généralement sous 24h.</p>
            <div className="contact-channels reveal reveal-delay-2">
              {[
                { icon:'✉', label:'Email', value:'wilson.odjoubere@example.com', href:'mailto:wilson.odjoubere@example.com' },
                { icon:'in', label:'LinkedIn', value:'wilson-odjoubere', href:'https://linkedin.com/in/wilson-odjoubere' },
                { icon:'💬', label:'WhatsApp', value:'Écrire un message', href:'https://wa.me/tonNumero' },
                { icon:'GH', label:'GitHub', value:'ton-pseudo', href:'https://github.com/ton-pseudo' },
              ].map(c => (
                <a key={c.label} href={c.href} target="_blank" rel="noreferrer" className="contact-channel" onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
                  <div className="channel-left">
                    <div className="channel-icon" style={{fontSize:c.icon==='GH'?'0.65rem':''}}>{c.icon}</div>
                    <div><div className="channel-label">{c.label}</div><div className="channel-value">{c.value}</div></div>
                  </div>
                  <div className="channel-arrow">→</div>
                </a>
              ))}
            </div>
          </div>
          <div>
            <div className="contact-form-wrap reveal reveal-delay-1">
              <span className="form-label-top">// Envoyer un message direct</span>
              {!formSent ? (
                <>
                  <div className="form-row">
                    <div className="form-group"><label>Prénom</label><input type="text" placeholder="Jean" /></div>
                    <div className="form-group"><label>Nom</label><input type="text" placeholder="Dupont" /></div>
                  </div>
                  <div className="form-group"><label>Email</label><input type="email" placeholder="jean@exemple.com" /></div>
                  <div className="form-group">
                    <label>Sujet</label>
                    <select><option value="">Sélectionner un sujet</option><option>Projet Freelance</option><option>Collaboration</option><option>Stage / Emploi</option><option>Autre</option></select>
                  </div>
                  <div className="form-group"><label>Message</label><textarea placeholder="Décrivez votre projet ou votre demande..." /></div>
                  <button className="form-submit" onClick={() => setFormSent(true)} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>Envoyer le message <span>→</span></button>
                </>
              ) : (
                <div className="form-success">✓ Message envoyé avec succès !<br /><span style={{color:'var(--muted)',fontSize:'0.7rem',display:'block',marginTop:'0.5rem'}}>Je vous réponds sous 24h.</span></div>
              )}
            </div>
            <div className="encourage-section reveal reveal-delay-2">
              <p style={{fontFamily:'var(--font-mono)',fontSize:'0.65rem',letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:'1rem'}}>Un petit encouragement ?</p>
              <button className="encourage-btn" onClick={() => setCount(c => c + 1)} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
                🚀 <span>{count}</span> Encouragements
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-left">© 2026 <strong>Wilson ODJOUBERE</strong> — Fait avec passion au Bénin 🇧🇯<br /><span style={{marginTop:'0.3rem',display:'block'}}>InnerBuild S01 × FrontForge</span></div>
        <div className="footer-socials">
          <a href="https://github.com/ton-pseudo" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://linkedin.com/in/wilson-odjoubere" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="mailto:wilson@exemple.com">Email</a>
        </div>
        <div className="footer-badge">#InnerBuild · S01</div>
      </footer>
    </>
  )
}

// Helper components
function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => {
      const p = window.scrollY / (document.body.scrollHeight - window.innerHeight)
      setProgress(p)
      setShow(window.scrollY > 500)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return <div className="progress-bar" style={{ transform: `scaleX(${progress})` }} />
}

function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return <button className={`back-top ${show ? 'show' : ''}`} onClick={() => window.scrollTo({top:0,behavior:'smooth'})}>↑</button>
}

export default App