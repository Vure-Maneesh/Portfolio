import { useState, useEffect, useRef } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';

/* ─── CSS ─── */
const getCSS = (dark) => `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Bricolage+Grotesque:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:       ${dark ? "#060610" : "#f4f4ff"};
    --bg2:      ${dark ? "#0b0b1e" : "#eaeaf8"};
    --surface:  ${dark ? "#111128" : "#ffffff"};
    --surface2: ${dark ? "#1a1a35" : "#e0e0f5"};
    --accent:   #7c3aed;
    --accent2:  #06b6d4;
    --accent3:  #f59e0b;
    --text:     ${dark ? "#f0f0ff" : "#0a0a1a"};
    --text2:    ${dark ? "#9898bb" : "#4a4a6a"};
    --text3:    ${dark ? "#5a5a7a" : "#9898bb"};
    --border:   ${dark ? "rgba(124,58,237,0.2)" : "rgba(124,58,237,0.18)"};
    --glow:     0 0 40px rgba(124,58,237,0.3);
    --glow2:    0 0 40px rgba(6,182,212,0.3);
    --nav-bg:   ${dark ? "rgba(6,6,16,0.92)" : "rgba(244,244,255,0.92)"};
    --card-h:   ${dark ? "rgba(124,58,237,0.08)" : "rgba(124,58,237,0.06)"};
    --font-h: 'Syne', sans-serif;
    --font-b: 'Bricolage Grotesque', sans-serif;
  }
  html { scroll-behavior: auto; }
  body { font-family:var(--font-b); background:var(--bg); color:var(--text); overflow-x:hidden; cursor:none; transition:background .4s,color .4s; }

  /* CURSOR */
  .cursor { position:fixed; top:0; left:0; width:12px; height:12px; background:var(--accent); border-radius:50%; pointer-events:none; z-index:9999; transform:translate(-50%,-50%); transition:width .2s,height .2s,background .2s; mix-blend-mode:${dark ? "screen" : "multiply"}; }
  .cursor.grow { width:40px; height:40px; background:var(--accent2); opacity:.5; }
  .cursor-ring { position:fixed; top:0; left:0; width:36px; height:36px; border:1.5px solid rgba(124,58,237,.5); border-radius:50%; pointer-events:none; z-index:9998; transform:translate(-50%,-50%); transition:all .14s ease-out; }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:var(--bg); }
  ::-webkit-scrollbar-thumb { background:var(--accent); border-radius:2px; }

  /* ── NAV ── */
  nav {
    position:fixed; top:0; left:0; width:100%; z-index:300; height:68px;
    padding:0 60px; display:flex; justify-content:space-between; align-items:center;
    background:var(--nav-bg); backdrop-filter:blur(24px) saturate(180%);
    border-bottom:1px solid var(--border);
    transition:background .4s, box-shadow .3s;
    box-shadow: 0 2px 16px rgba(0,0,0,0.08);
  }
  nav.scrolled { box-shadow:0 4px 32px rgba(124,58,237,0.12); }
  .nav-logo { font-family:var(--font-h); font-size:22px; font-weight:800; background:linear-gradient(135deg,var(--accent),var(--accent2)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; cursor:none; user-select:none; }
  .nav-links { display:flex; gap:4px; list-style:none; }
  .nav-links li a {
    display:block; padding:7px 14px; border-radius:8px;
    color:var(--text2); text-decoration:none; font-size:13px; font-weight:500;
    letter-spacing:.4px; text-transform:uppercase; transition:all .25s; cursor:none;
    position:relative;
  }
  .nav-links li a:hover { color:var(--text); background:rgba(124,58,237,.08); }
  .nav-links li a.active {
    color:var(--accent);
    background:rgba(124,58,237,.12);
    font-weight:700;
  }
  .nav-links li a.active::after {
    content:''; position:absolute; bottom:4px; left:50%; transform:translateX(-50%);
    width:20px; height:2px; border-radius:1px;
    background:linear-gradient(90deg,var(--accent),var(--accent2));
  }
  .nav-right { display:flex; align-items:center; gap:10px; }

  /* THEME TOGGLE */
  .theme-toggle {
    width:44px; height:24px; border-radius:12px; cursor:none;
    background:${dark ? "linear-gradient(135deg,var(--accent),var(--accent2))" : "rgba(124,58,237,0.15)"};
    border:1.5px solid var(--border); position:relative; transition:all .3s;
    display:flex; align-items:center; padding:3px; flex-shrink:0;
  }
  .tt-knob {
    width:16px; height:16px; border-radius:50%;
    background:${dark ? "white" : "var(--accent)"};
    transform:translateX(${dark ? "20px" : "0px"});
    transition:transform .3s,background .3s;
    display:flex; align-items:center; justify-content:center;
    font-size:9px; line-height:1;
  }
  .nav-resume {
    padding:9px 20px; background:var(--accent); color:white; border-radius:8px;
    font-size:13px; font-weight:700; cursor:none; transition:all .3s;
    display:flex; align-items:center; gap:6px; border:none; white-space:nowrap;
  }
  .nav-resume:hover { background:var(--accent2); transform:translateY(-2px); box-shadow:var(--glow2); }

  /* HAMBURGER */
  .hamburger { display:none; flex-direction:column; gap:5px; background:none; border:none; cursor:none; padding:4px; }
  .hamburger span { display:block; width:22px; height:2px; border-radius:2px; background:var(--text2); transition:all .3s; }
  .hamburger.open span:nth-child(1) { transform:translateY(7px) rotate(45deg); background:var(--accent); }
  .hamburger.open span:nth-child(2) { opacity:0; }
  .hamburger.open span:nth-child(3) { transform:translateY(-7px) rotate(-45deg); background:var(--accent); }

  /* MOBILE DRAWER */
  .mob-drawer { display:none; position:fixed; top:68px; left:0; right:0; z-index:299;
    background:var(--nav-bg); backdrop-filter:blur(24px); border-bottom:1px solid var(--border);
    flex-direction:column; padding:12px 24px 20px; box-shadow:0 8px 32px rgba(0,0,0,.2); }
  .mob-drawer.open { display:flex; animation:drawerDown .22s ease both; }
  .mob-drawer a { color:var(--text2); text-decoration:none; font-size:14px; font-weight:600;
    text-transform:uppercase; letter-spacing:.5px; padding:13px 0;
    border-bottom:1px solid var(--border); transition:color .2s; cursor:none; }
  .mob-drawer a:last-of-type { border-bottom:none; }
  .mob-drawer a.active { color:var(--accent); }
  @keyframes drawerDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

  /* ── PAGE WRAPPER ── */
  .page-shell { min-height:100vh; display:flex; flex-direction:column; }

  /* ── SECTION TRANSITIONS ── */
  .section-view { flex:1; animation:sectionIn .45s cubic-bezier(.4,0,.2,1) both; }
  @keyframes sectionIn { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }

  /* ── COMMON SECTION STYLES ── */
  .sec-wrap { padding:80px 60px 100px; }
  .slabel { font-size:11px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:var(--accent); margin-bottom:16px; display:flex; align-items:center; gap:12px; }
  .slabel::before { content:''; width:30px; height:2px; background:linear-gradient(90deg,var(--accent),var(--accent2)); border-radius:1px; }
  .stitle { font-family:var(--font-h); font-size:clamp(30px,4.5vw,56px); font-weight:800; letter-spacing:-1.5px; margin-bottom:16px; line-height:1.08; }
  .stitle span { background:linear-gradient(135deg,var(--accent),var(--accent2)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .ssub { color:var(--text2); font-size:16px; max-width:560px; line-height:1.7; margin-bottom:0; }

  /* ── HERO ── */
  .hero-sec { min-height:calc(100vh - 68px); display:grid; grid-template-columns:1fr 1fr; align-items:center; padding:60px 60px 60px; position:relative; overflow:hidden; gap:40px; background:var(--bg); }
  .hero-bg-r { position:absolute; inset:0; z-index:0; background:radial-gradient(ellipse 60% 60% at 80% 50%,rgba(124,58,237,.12) 0%,transparent 70%),radial-gradient(ellipse 40% 40% at 20% 80%,rgba(6,182,212,.08) 0%,transparent 60%); }
  .hero-grid-r { position:absolute; inset:0; background-image:linear-gradient(rgba(124,58,237,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,.04) 1px,transparent 1px); background-size:60px 60px; }
  .hero-content { position:relative; z-index:2; }
  .hero-tag { display:inline-flex; align-items:center; gap:8px; padding:6px 16px; background:rgba(124,58,237,.15); border:1px solid var(--border); border-radius:100px; font-size:12px; font-weight:600; color:var(--accent2); letter-spacing:1px; text-transform:uppercase; margin-bottom:24px; animation:fadeUp .6s .1s both; }
  .hero-tag span { width:6px; height:6px; background:var(--accent2); border-radius:50%; animation:pulse 2s infinite; }
  .hero-title { font-family:var(--font-h); font-size:clamp(44px,6vw,82px); font-weight:800; line-height:1.04; letter-spacing:-2px; margin-bottom:20px; animation:fadeUp .6s .2s both; }
  .hero-title .grad { background:linear-gradient(135deg,var(--accent),var(--accent2),var(--accent3)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-size:200%; animation:gradShift 4s ease infinite; }
  .hero-sub { font-size:16.5px; color:var(--text2); line-height:1.75; max-width:480px; margin-bottom:36px; animation:fadeUp .6s .3s both; }
  .hero-btns { display:flex; gap:16px; flex-wrap:wrap; animation:fadeUp .6s .4s both; }
  .btn-p { padding:13px 30px; background:var(--accent); color:white; border-radius:10px; font-size:15px; font-weight:600; text-decoration:none; transition:all .3s; cursor:none; border:none; }
  .btn-p:hover { background:#6d28d9; transform:translateY(-3px); box-shadow:var(--glow); }
  .btn-s { padding:13px 30px; background:transparent; color:var(--text); border:1.5px solid var(--border); border-radius:10px; font-size:15px; font-weight:600; text-decoration:none; transition:all .3s; cursor:none; }
  .btn-s:hover { border-color:var(--accent2); color:var(--accent2); transform:translateY(-3px); }
  .hero-stats { display:flex; gap:36px; margin-top:52px; animation:fadeUp .6s .5s both; flex-wrap:wrap; }
  .stat-num { font-family:var(--font-h); font-size:34px; font-weight:800; background:linear-gradient(135deg,var(--accent),var(--accent2)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .stat-label { font-size:12px; color:var(--text3); margin-top:2px; text-transform:uppercase; letter-spacing:.5px; }


/* ── 3D SOLAR SYSTEM SCENE ── */
/* ── 3D SOLAR SYSTEM SCENE ── */
  .hero-3d { position:relative; z-index:2; height:520px; display:flex; align-items:center; justify-content:center; animation:fadeUp .8s .3s both; }
  .scene3d { width:520px; height:520px; position:relative; display:flex; align-items:center; justify-content:center; }

  /* Central core orb */
  .core-orb {
    position:absolute; width:130px; height:130px; border-radius:50%; z-index:10;
    background:radial-gradient(circle at 35% 35%,rgba(160,100,255,1),rgba(6,182,212,.8),rgba(124,58,237,.4));
    box-shadow:0 0 60px rgba(124,58,237,.7),0 0 120px rgba(124,58,237,.3),inset 0 0 30px rgba(255,255,255,.1);
    animation:coreFloat 4s ease-in-out infinite, hueShift 10s linear infinite;
    display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1px;
  }
  .core-label-top { font-size:10px; font-weight:800; color:rgba(255,255,255,.75); letter-spacing:2px; text-transform:uppercase; }
  .core-label-main { font-family:var(--font-h); font-size:17px; font-weight:900; color:#fff; letter-spacing:-0.5px; }
  .core-label-bot { font-size:10px; font-weight:700; color:rgba(255,255,255,.6); letter-spacing:1px; text-transform:uppercase; }

  /* Orbit track rings (tilted ellipses) */
  .orbit-track { position:absolute; border-radius:50%; top:50%; left:50%; }
  .track1 { width:230px; height:230px; margin:-115px 0 0 -115px; border:1px solid rgba(124,58,237,.3); }
  .track2 { width:340px; height:340px; margin:-170px 0 0 -170px; border:1px solid rgba(6,182,212,.22); }
  .track3 { width:460px; height:460px; margin:-230px 0 0 -230px; border:1px dashed rgba(245,158,11,.15); }

  /* Each orbit is a rotating wrapper centered at origin */
  .orbit-wrapper {
    position:absolute; top:50%; left:50%;
    width:0; height:0;
    transform-origin:0 0;
  }
  /* The icon bubble — offset to the right by radius using transform */
  .orbit-bubble {
    position:absolute;
    width:46px; height:46px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    background:${dark ? "rgba(15,15,30,.95)" : "rgba(255,255,255,.97)"};
    border:1.5px solid ${dark ? "rgba(124,58,237,.3)" : "rgba(124,58,237,.2)"};
    box-shadow:0 4px 16px rgba(0,0,0,.3), 0 0 10px rgba(124,58,237,.12);
    backdrop-filter:blur(6px);
    top:-23px; /* vertically centre the 46px bubble on the rotation axis */
    /* left is set inline = radius */
    /* counter-rotation so icon stays upright */
    animation:iconUpright linear infinite;
  }
  .orbit-bubble img { width:26px; height:26px; object-fit:contain; display:block; }
  .orbit-bubble svg { width:26px; height:26px; display:block; }
 
  /* Particles */
  .pt { position:absolute; width:3px; height:3px; border-radius:50%; background:var(--accent); opacity:.4; }
 
  @keyframes coreFloat   { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-10px) scale(1.04)} }
  @keyframes hueShift    { from{filter:hue-rotate(0deg)} to{filter:hue-rotate(360deg)} }
  @keyframes orbitSpin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes iconUpright { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
 

  /* ── ABOUT ── */
  .about-sec { background:var(--bg2); }
  .about-inner { margin-top:52px; display:grid; grid-template-columns:1.1fr 1fr; gap:52px; }
  .about-text p { color:var(--text2); font-size:15.5px; line-height:1.88; margin-bottom:18px; }
  .hl { color:var(--accent2); font-weight:700; }
  .about-cards { display:grid; grid-template-columns:1fr 1fr; gap:16px; align-content:start; }
  .asc { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:22px 18px; transition:all .3s; cursor:none; }
  .asc:hover { border-color:var(--accent); transform:translateY(-4px); box-shadow:var(--glow); background:var(--card-h); }
  .asc-icon { font-size:26px; margin-bottom:10px; }
  .asc-num { font-family:var(--font-h); font-size:28px; font-weight:800; background:linear-gradient(135deg,var(--accent),var(--accent2)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .asc-lbl { font-size:12px; color:var(--text2); margin-top:4px; line-height:1.4; }
  .about-tags { display:flex; flex-wrap:wrap; gap:8px; margin-top:24px; }
  .about-tag { padding:5px 13px; background:rgba(124,58,237,.1); border:1px solid rgba(124,58,237,.2); border-radius:20px; font-size:12px; font-weight:600; color:var(--accent); }

  /* ── SKILLS ── */
  .skills-sec { background:var(--bg); }
  .skill-tabs { display:flex; gap:8px; margin:36px 0 28px; flex-wrap:wrap; }
  .skill-tab { padding:9px 20px; border-radius:8px; font-size:13px; font-weight:600; border:1.5px solid var(--border); background:transparent; color:var(--text2); cursor:none; transition:all .3s; }
  .skill-tab.active,.skill-tab:hover { background:var(--accent); border-color:var(--accent); color:white; }
  .skills-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(138px,1fr)); gap:16px; }
  .skill-card { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:22px 14px; text-align:center; transition:all .3s; cursor:none; position:relative; overflow:hidden; }
  .skill-card::before { content:''; position:absolute; inset:0; opacity:0; background:linear-gradient(135deg,rgba(124,58,237,.1),rgba(6,182,212,.1)); transition:opacity .3s; }
  .skill-card:hover { transform:translateY(-6px); border-color:var(--accent); box-shadow:var(--glow); }
  .skill-card:hover::before { opacity:1; }
  .sk-icon { font-size:34px; margin-bottom:10px; display:block; }
  .sk-name { font-size:12.5px; font-weight:600; color:var(--text2); }
  .sk-bar { margin-top:10px; height:3px; background:var(--surface2); border-radius:2px; overflow:hidden; }
  .sk-fill { height:100%; border-radius:2px; background:linear-gradient(90deg,var(--accent),var(--accent2)); transition:width 1.3s ease; }

  /* ── PROJECTS ── */
  .projects-sec { background:var(--bg2); }
  .proj-head { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:52px; flex-wrap:wrap; gap:20px; }
  .proj-filters { display:flex; gap:8px; flex-wrap:wrap; }
  .flt-btn { padding:8px 18px; border-radius:8px; font-size:12px; font-weight:600; border:1.5px solid var(--border); background:transparent; color:var(--text2); cursor:none; transition:all .3s; text-transform:uppercase; letter-spacing:.5px; }
  .flt-btn.active,.flt-btn:hover { background:var(--accent); border-color:var(--accent); color:white; }
  .projects-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(360px,1fr)); gap:28px; }
  .project-card { background:var(--surface); border:1px solid var(--border); border-radius:20px; overflow:hidden; transition:all .4s; cursor:none; }
  .project-card:hover { transform:translateY(-8px); border-color:var(--accent); box-shadow:0 20px 60px rgba(0,0,0,.15),var(--glow); }
  .proj-img { width:100%; height:210px; overflow:hidden; position:relative; }
  .proj-img-in { width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:78px; transition:transform .4s; }
  .project-card:hover .proj-img-in { transform:scale(1.08); }
  .proj-overlay { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; gap:12px; opacity:0; transition:opacity .3s; background:rgba(6,6,16,.78); backdrop-filter:blur(4px); }
  .project-card:hover .proj-overlay { opacity:1; }
  .ov-btn { padding:10px 20px; border-radius:8px; font-size:13px; font-weight:600; text-decoration:none; transition:all .2s; cursor:none; }
  .ov-live { background:var(--accent); color:white; }
  .ov-code { background:transparent; border:1.5px solid white; color:white; }
  .ov-btn:hover { transform:scale(1.05); }
  .proj-body { padding:24px; }
  .proj-cat { font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--accent2); margin-bottom:8px; }
  .proj-name { font-family:var(--font-h); font-size:19px; font-weight:700; margin-bottom:10px; color:var(--text); }
  .proj-desc { font-size:13.5px; color:var(--text2); line-height:1.7; margin-bottom:18px; }
  .tech-stack { display:flex; flex-wrap:wrap; gap:7px; }
  .tech-badge { display:flex; align-items:center; gap:5px; padding:4px 11px; background:var(--surface2); border:1px solid var(--border); border-radius:6px; font-size:12px; font-weight:600; color:var(--text2); transition:all .2s; }
  .tech-badge:hover { border-color:var(--accent); color:var(--accent); }

  /* ── EXPERIENCE ── */
  .exp-sec { background:var(--bg); }
  .timeline { margin-top:52px; position:relative; }
  .timeline::before { content:''; position:absolute; left:20px; top:0; bottom:0; width:2px; background:linear-gradient(180deg,var(--accent),var(--accent2),transparent); }
  .tl-item { padding-left:60px; margin-bottom:44px; position:relative; }
  .tl-dot { position:absolute; left:12px; top:6px; width:18px; height:18px; border-radius:50%; border:3px solid var(--accent); background:var(--bg); box-shadow:0 0 12px var(--accent); }
  .tl-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:26px; transition:all .3s; }
  .tl-card:hover { border-color:var(--accent); transform:translateX(8px); box-shadow:var(--glow); }
  .tl-head { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px; flex-wrap:wrap; gap:8px; }
  .tl-role { font-family:var(--font-h); font-size:17px; font-weight:700; color:var(--text); }
  .tl-period { font-size:12px; color:var(--accent2); font-weight:600; padding:4px 12px; background:rgba(6,182,212,.1); border-radius:6px; border:1px solid rgba(6,182,212,.2); }
  .tl-company { font-size:14px; color:var(--accent); font-weight:600; margin-bottom:10px; }
  .tl-desc { font-size:14px; color:var(--text2); line-height:1.7; }
  .tl-tags { display:flex; flex-wrap:wrap; gap:8px; margin-top:14px; }
  .tl-tag { padding:4px 11px; background:rgba(124,58,237,.1); border:1px solid rgba(124,58,237,.2); border-radius:6px; font-size:12px; color:var(--accent); font-weight:500; }

  /* ── EDUCATION ── */
  .edu-sec { background:var(--bg2); }
  .edu-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(340px,1fr)); gap:24px; margin-top:52px; }
  .edu-card { background:var(--surface); border:1px solid var(--border); border-radius:20px; padding:32px; transition:all .3s; position:relative; overflow:hidden; }
  .edu-card::before { content:''; position:absolute; top:0; left:0; right:0; height:4px; background:linear-gradient(90deg,var(--accent),var(--accent2)); }
  .edu-card:hover { border-color:var(--accent); transform:translateY(-6px); box-shadow:var(--glow); }
  .edu-card-icon { font-size:40px; margin-bottom:16px; }
  .edu-degree { font-family:var(--font-h); font-size:17px; font-weight:800; color:var(--text); margin-bottom:6px; line-height:1.3; }
  .edu-major { font-size:13px; color:var(--accent2); font-weight:600; margin-bottom:12px; }
  .edu-school { font-size:14px; color:var(--text); font-weight:600; margin-bottom:4px; }
  .edu-location { font-size:13px; color:var(--text2); margin-bottom:4px; }
  .edu-period { display:inline-flex; align-items:center; gap:6px; font-size:12px; color:var(--accent); font-weight:600; padding:4px 12px; background:rgba(124,58,237,.1); border:1px solid rgba(124,58,237,.2); border-radius:6px; margin-top:10px; }
  .edu-grade { font-size:13px; color:var(--text2); margin-top:12px; padding-top:12px; border-top:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; }
  .edu-grade-val { font-family:var(--font-h); font-size:18px; font-weight:800; background:linear-gradient(135deg,var(--accent),var(--accent2)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .edu-courses { margin-top:16px; }
  .edu-courses-title { font-size:12px; font-weight:700; color:var(--text3); text-transform:uppercase; letter-spacing:1px; margin-bottom:8px; }
  .edu-course-tags { display:flex; flex-wrap:wrap; gap:6px; }
  .edu-course-tag { padding:3px 10px; background:var(--surface2); border:1px solid var(--border); border-radius:4px; font-size:11px; font-weight:600; color:var(--text2); }

  /* ── CERTIFICATIONS ── */
  .cert-sec { background:var(--bg); }
  .cert-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:20px; margin-top:52px; }
  .cert-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:24px; display:flex; gap:16px; align-items:flex-start; transition:all .3s; cursor:none; }
  .cert-card:hover { border-color:var(--accent); transform:translateY(-4px); box-shadow:var(--glow); }
  .cert-icon { font-size:32px; flex-shrink:0; }
  .cert-name { font-family:var(--font-h); font-size:15px; font-weight:700; color:var(--text); margin-bottom:4px; }
  .cert-org { font-size:13px; color:var(--accent); font-weight:600; margin-bottom:3px; }
  .cert-year { font-size:12px; color:var(--text3); }

  /* ── CONTACT ── */
  .contact-sec { background:var(--bg2); }
  .contact-grid { display:grid; grid-template-columns:1fr 1.4fr; gap:56px; margin-top:52px; align-items:start; }
  .ct-info { background:var(--surface); border:1px solid var(--border); border-radius:20px; padding:36px; }
  .ct-info h3 { font-family:var(--font-h); font-size:21px; font-weight:700; margin-bottom:8px; color:var(--text); }
  .ct-info p { color:var(--text2); font-size:14px; line-height:1.7; margin-bottom:28px; }
  .ct-links { display:flex; flex-direction:column; gap:13px; }
  .ct-link { display:flex; align-items:center; gap:14px; text-decoration:none; color:var(--text); padding:13px 15px; background:var(--surface2); border-radius:12px; border:1px solid var(--border); transition:all .3s; font-size:14px; font-weight:500; cursor:none; }
  .ct-link:hover { border-color:var(--accent); background:var(--card-h); transform:translateX(6px); }
  .ct-icon { width:38px; height:38px; border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:17px; flex-shrink:0; background:rgba(124,58,237,.12); }
  .ct-form { background:var(--surface); border:1px solid var(--border); border-radius:20px; padding:36px; }
  .form-title { font-family:var(--font-h); font-size:21px; font-weight:700; margin-bottom:26px; color:var(--text); }
  .fg { margin-bottom:18px; }
  .frow { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .fg label { display:block; font-size:13px; font-weight:600; color:var(--text2); margin-bottom:7px; }
  .fg input,.fg textarea,.fg select { width:100%; background:var(--surface2); border:1.5px solid var(--border); border-radius:10px; color:var(--text); font-family:var(--font-b); font-size:14px; padding:11px 15px; transition:all .3s; outline:none; }
  .fg input:focus,.fg textarea:focus,.fg select:focus { border-color:var(--accent); box-shadow:0 0 0 3px rgba(124,58,237,.1); }
  .fg textarea { height:110px; resize:none; }
  .fg select option { background:var(--surface2); color:var(--text); }
  .form-btn { width:100%; padding:13px; background:linear-gradient(135deg,var(--accent),var(--accent2)); color:white; border:none; border-radius:10px; font-family:var(--font-b); font-size:15px; font-weight:700; cursor:none; transition:all .3s; display:flex; align-items:center; justify-content:center; gap:8px; }
  .form-btn:hover { transform:translateY(-3px); box-shadow:0 12px 40px rgba(124,58,237,.4); opacity:.9; }
  .form-ok { text-align:center; padding:32px 24px; color:var(--accent2); font-weight:600; font-size:15px; animation:fadeUp .5s both; }

  /* ── RESUME MODAL ── */
  .res-modal { position:fixed; inset:0; z-index:1000; display:flex; flex-direction:column; background:var(--bg); animation:fadeUp .3s both; }
  .res-bar { height:60px; background:var(--nav-bg); backdrop-filter:blur(20px); border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; padding:0 32px; flex-shrink:0; }
  .res-bar-title { font-family:var(--font-h); font-size:16px; font-weight:700; background:linear-gradient(135deg,var(--accent),var(--accent2)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .res-close { padding:8px 20px; background:transparent; border:1.5px solid var(--border); border-radius:8px; color:var(--text2); font-size:13px; font-weight:600; cursor:none; transition:all .3s; }
  .res-close:hover { border-color:var(--accent); color:var(--accent); }
  .res-body { flex:1; overflow:auto; display:flex; align-items:flex-start; justify-content:center; padding:32px; background:var(--bg2); }
  .res-page { background:white; width:800px; max-width:100%; border-radius:8px; box-shadow:0 20px 80px rgba(0,0,0,.3); overflow:hidden; font-family:'Georgia',serif; color:#111; }
  .rp-hdr { background:#0a0a1a; color:#fff; padding:36px 44px 28px; }
  .rp-name { font-size:32px; font-weight:900; letter-spacing:-1px; margin-bottom:4px; font-family:'Syne',sans-serif; }
  .rp-role { font-size:13px; color:rgba(255,255,255,.6); margin-bottom:18px; letter-spacing:.5px; }
  .rp-contacts { display:flex; gap:18px; flex-wrap:wrap; }
  .rp-ct { font-size:12px; color:rgba(255,255,255,.8); display:flex; align-items:center; gap:5px; }
  .rp-body { display:grid; grid-template-columns:1fr 1.6fr; }
  .rp-left { background:#f8f8f8; padding:28px 24px; }
  .rp-right { background:#fff; padding:28px 24px; }
  .rp-sec { margin-bottom:24px; }
  .rp-sec-t { font-size:10px; font-weight:800; letter-spacing:2.5px; text-transform:uppercase; color:#7c3aed; margin-bottom:12px; padding-bottom:5px; border-bottom:2px solid #7c3aed; }
  .rp-stag { display:inline-block; background:#ede9fe; color:#5b21b6; padding:3px 9px; border-radius:4px; font-size:11px; font-weight:600; margin:2px 2px 2px 0; }
  .rp-exp { margin-bottom:18px; }
  .rp-exp-role { font-size:13px; font-weight:700; color:#111; margin-bottom:2px; }
  .rp-exp-co { font-size:12px; color:#7c3aed; font-weight:600; margin-bottom:1px; }
  .rp-exp-per { font-size:11px; color:#888; margin-bottom:6px; }
  .rp-exp-ul { padding-left:14px; }
  .rp-exp-ul li { font-size:12px; color:#444; line-height:1.6; margin-bottom:2px; }
  .rp-proj { margin-bottom:14px; }
  .rp-proj-n { font-size:12px; font-weight:700; color:#111; margin-bottom:2px; }
  .rp-proj-d { font-size:11px; color:#555; line-height:1.6; }
  .rp-edu-deg { font-size:13px; font-weight:700; color:#111; margin-bottom:2px; }
  .rp-edu-sc { font-size:12px; color:#7c3aed; font-weight:600; margin-bottom:1px; }
  .rp-edu-yr { font-size:11px; color:#888; }
  .rp-cert-item { font-size:11px; color:#444; padding:5px 0; border-bottom:1px solid #eee; display:flex; align-items:center; gap:7px; }
  .rp-cert-item:last-child { border-bottom:none; }

  /* ── FOOTER ── */
  footer { background:var(--bg); border-top:1px solid var(--border); }
  .footer-main { display:grid; grid-template-columns:2fr 1fr 1fr 1.2fr; gap:40px; padding:52px 60px 40px; }
  .footer-brand { }
  .f-logo { font-family:var(--font-h); font-size:22px; font-weight:800; background:linear-gradient(135deg,var(--accent),var(--accent2)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; margin-bottom:12px; }
  .f-tagline { font-size:14px; color:var(--text2); line-height:1.7; max-width:260px; margin-bottom:20px; }
  .f-social-row { display:flex; gap:10px; }
  .f-soc { width:36px; height:36px; border-radius:9px; background:var(--surface); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; font-size:16px; text-decoration:none; transition:all .3s; cursor:none; }
  .f-soc:hover { border-color:var(--accent); background:rgba(124,58,237,.12); transform:translateY(-3px); }
  .footer-col-title { font-family:var(--font-h); font-size:13px; font-weight:700; color:var(--text); text-transform:uppercase; letter-spacing:1px; margin-bottom:16px; }
  .footer-links { display:flex; flex-direction:column; gap:10px; }
  .footer-link { color:var(--text2); text-decoration:none; font-size:14px; transition:color .2s; cursor:none; display:flex; align-items:center; gap:6px; }
  .footer-link:hover { color:var(--accent); }
  .footer-link::before { content:'→'; font-size:11px; color:var(--accent); opacity:0; transition:opacity .2s,transform .2s; transform:translateX(-4px); }
  .footer-link:hover::before { opacity:1; transform:translateX(0); }
  .footer-contact-item { display:flex; align-items:flex-start; gap:10px; margin-bottom:14px; }
  .fci-icon { font-size:16px; flex-shrink:0; margin-top:1px; }
  .fci-label { font-size:11px; font-weight:700; color:var(--text3); text-transform:uppercase; letter-spacing:.5px; }
  .fci-val { font-size:13px; color:var(--text2); }
  .footer-bottom { border-top:1px solid var(--border); padding:20px 60px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; }
  .footer-copy { font-size:13px; color:var(--text3); }
  .footer-badges { display:flex; gap:8px; flex-wrap:wrap; }
  .footer-badge { padding:4px 12px; background:rgba(124,58,237,.08); border:1px solid rgba(124,58,237,.15); border-radius:20px; font-size:11px; font-weight:600; color:var(--text3); }
.edu-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.edu-logo {
  width: 62px;
  height: 62px;
  object-fit: contain;
  border-radius: 8px;
  background: #fff;
  padding: 4px;
}

.edu-card-icon {
  font-size: 22px;
}

.cert-highlight {
  display:inline-block;
  font-size:10px;
  background:#7c3aed;
  color:#fff;
  padding:3px 6px;
  border-radius:5px;
  margin:4px 0;
}

.cert-logo {
  width:28px;
  height:28px;
  object-fit:contain;
  margin-bottom:4px;
}

.cert-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(124,58,237,0.25);
}
  .availability {
  font-size: 13px;
  color: #22c55e;
  margin-top: 6px;
}
  .footer-availability {
  font-size: 12px;
  color: #22c55e;
  margin-top: 6px;
}

.proj-image {
  width: 480px;
  height: 500px;
  object-fit: contain;
}
  /* ── KEYFRAMES ── */
  @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes floatOrb { 0%,100%{transform:translate(-50%,-50%) translateY(0)} 50%{transform:translate(-50%,-50%) translateY(-14px)} }
  @keyframes hueShift { from{filter:hue-rotate(0deg)} to{filter:hue-rotate(360deg)} }
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes spin2 { from{transform:rotateX(60deg) rotate(0deg)} to{transform:rotateX(60deg) rotate(360deg)} }
  @keyframes gradShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
  @keyframes fcFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
  @keyframes ptFloat { 0%{transform:translateY(0);opacity:.5} 100%{transform:translateY(-100px) translateX(var(--dx,20px));opacity:0} }
  @keyframes dotOrb { from{transform:rotate(var(--s,0deg)) translateX(var(--r,155px))} to{transform:rotate(calc(var(--s,0deg) + 360deg)) translateX(var(--r,155px))} }







  /* ── RESPONSIVE ── */
  @media(max-width:960px){
    nav { padding:0 20px; }
    .nav-links { display:none; }
    .hamburger { display:flex; }
    .hero-sec { grid-template-columns:1fr; padding:60px 20px 60px; min-height:auto; }
    .hero-3d { height:300px; }
    .sec-wrap { padding:60px 20px 80px; }
    .about-inner { grid-template-columns:1fr; }
    .about-cards { grid-template-columns:1fr 1fr; }
    .contact-grid { grid-template-columns:1fr; }
    .projects-grid { grid-template-columns:1fr; }
    .frow { grid-template-columns:1fr; }
    .rp-body { grid-template-columns:1fr; }
    .res-body { padding:16px; }
    .footer-main { grid-template-columns:1fr 1fr; gap:28px; padding:36px 20px 28px; }
    .footer-bottom { padding:16px 20px; }
    .nav-resume span { display:none; }
  }
  @media(max-width:480px){
    .footer-main { grid-template-columns:1fr; }
    .about-cards { grid-template-columns:1fr; }
  }
`;

/* ─── DATA ─── */
const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "skills", label: "Skills & Experience" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

const skillsData = {

  Languages: [
    { name: "Java", icon: "☕", level: 85 },
    { name: "SQL", icon: "🗄️", level: 80 },
    { name: "JavaScript", icon: "🟨", level: 70 },
    { name: "HTML", icon: "🌐", level: 75 },
    { name: "CSS", icon: "🎨", level: 75 },
  ],

  Frameworks: [
    { name: "Spring Boot", icon: "🌱", level: 85 },
    { name: "Spring REST API", icon: "🔗", level: 82 },
    { name: "Hibernate", icon: "🏔️", level: 78 },
    { name: "Spring Security", icon: "🔒", level: 70 },
    { name: "Angular (Basics)", icon: "🅰️", level: 55 },
  ],

  "DB & Tools": [
    { name: "MySQL", icon: "🐬", level: 82 },
    { name: "PostgreSQL", icon: "🐘", level: 75 },
    { name: "Git", icon: "🔀", level: 80 },
    { name: "GitHub", icon: "🐙", level: 80 },
    { name: "Eclipse", icon: "🌙", level: 75 },
    { name: "VS Code", icon: "💻", level: 82 },
  ],

  Concepts: [
    { name: "OOP", icon: "🧩", level: 85 },
    { name: "SDLC", icon: "🔄", level: 80 },
    { name: "REST Architecture", icon: "🔗", level: 82 },
    { name: "Debugging", icon: "🐞", level: 78 },
    { name: "Testing", icon: "🧪", level: 75 },
    { name: "Agile Scrum", icon: "⚡", level: 80 },
  ],

};

const projects = [

  {
    name: "Food Adda",
    cat: "Web Application",
    emoji: "🍔",
    // logo: "src/assets/jntuh.png",
    bg: "linear-gradient(135deg,#1f2937,#111827)",
    highlight: "Spring Boot Backend",
    desc: "Developed a backend-driven food management system using Spring Boot. Designed RESTful APIs for menu and order processing, and integrated MySQL with JPA/Hibernate for efficient data management.",

    tech: [
      { n: "Java", i: "☕" },
      { n: "Spring Boot", i: "🌱" },
      { n: "REST API", i: "🔗" },
      { n: "MySQL", i: "🐬" },
      { n: "JPA/Hibernate", i: "📦" }
    ],
    link: "https://github.com/Vure-Maneesh/Food-Adda"
  },

  {
    name: "Bank Management System",
    cat: "Backend Application",
    // emoji: "🏦",
    img: "src/assets/bank.png",
    highlight: "Core Java Project",
    bg: "linear-gradient(135deg,#0f172a,#1e293b)",
    desc: "Built a Java-based banking application implementing account management, deposits, withdrawals, and secure login. Applied OOP principles with input validation and exception handling. Additionally developed a basic frontend using Angular, leveraging AI-assisted tools to accelerate UI development.",
    tech: [
      { n: "Java", i: "☕" },
      { n: "OOP", i: "🧩" },
      { n: "Angular (Basics)", i: "🅰️" },
      { n: "Exception Handling", i: "⚠️" },
      { n: "File Handling", i: "📁" }
    ],
    link: "https://github.com/Vure-Maneesh/bankManagmentSystem"
  },

  {
    name: "Semantic Segmentation using U-Net",
    cat: "Machine Learning Project",
    emoji: "🧠",
    bg: "linear-gradient(135deg,#0f172a,#020617)",
    desc: "Implemented a deep learning model using U-Net architecture for image segmentation. Trained the model for pixel-level classification and improved prediction accuracy through preprocessing and optimization techniques.",
    tech: [
      { n: "Python", i: "🐍" },
      { n: "Deep Learning", i: "🧠" },
      { n: "U-Net", i: "🔬" },
      { n: "TensorFlow/Keras", i: "⚙️" },
      { n: "Image Processing", i: "🖼️" }
    ],
    link: "https://github.com/Vure-Maneesh/Semantic-Segmentation-Using-U-NET-Architecture"
  },

  {
    name: "AI Sentiment Analysis for Social Media",
    cat: "Machine Learning Project",
    emoji: "💬",
    bg: "linear-gradient(135deg,#020617,#111827)",
    desc: "Developed a sentiment analysis system to classify social media text into positive, negative, and neutral categories using NLP techniques and machine learning models.",
    tech: [
      { n: "Python", i: "🐍" },
      { n: "Machine Learning", i: "🤖" },
      { n: "NLP", i: "🧾" },
      { n: "Scikit-learn", i: "⚙️" },
      { n: "Text Processing", i: "✍️" }
    ],
    link: "https://github.com/Vure-Maneesh/AI-for-Sentimental-Analysis-for-Social-Media-Text"
  }
];

const experiences = [
  {
    role: "Software Developer Intern",
    company: "Infosys · Internship",
    period: "2025 – Present",
    desc: "Contributing to backend development using Java, Spring Boot, and Hibernate. Designing and testing RESTful APIs, integrating databases using JPA, and applying Agile and SDLC practices while working on real-world application modules.",
    tags: ["☕ Java", " 🌱 Spring Boot", "🔗 REST API", "Hibernate", "JPA", "🗄️ MySQL", "Agile", "SDLC"]
  }
];
const education = [
  {
    icon: "🎓",
    logo: "src/assets/jntuh.png",
    degree: "Bachelor of Technology (B.Tech)",
    major: "Computer Science & Engineering",
    school: "JNTUH University College of Engineering, Sircilla",
    location: "Sircilla, Telangana",
    period: "2021 – 2025",
    grade: "6.83 / 10",
    courses: ["Data Structures", "Database Management Systems", "Operating Systems", "Object-Oriented Programming", "Software Development Life Cycle", "Web Technologies"],
  },
  {
    icon: "🏫",
    logo: "src/assets/candor.png",
    degree: "12th (CBSE)",
    major: "Science (PCM)",
    school: "Candor Shrine Senior Secondary School",
    location: "Hyderabad, Telangana",
    period: "2021",
    grade: "75.20%",
    courses: ["Mathematics", "Physics", "Chemistry", "English", "Physical Education"],
  },
  {
    icon: "🏫",
    logo: "src/assets/candor.png",
    degree: "10th (CBSE)",
    major: "General Studies",
    school: "Candor Shrine Senior Secondary School",
    location: "Hyderabad, Telangana",
    period: "2019",
    grade: "78.20%",
    courses: ["Mathematics", "Science", "Social Studies", "English", "Telugu"],
  },
];
const certifications = [
  {
    icon: "🏅",
    logo: "src/assets/infosys.png",
    name: "Programming using Java",
    org: "Infosys Springboard",
    year: "2025",
    highlight: "Core Java"
  },
  {
    icon: "🏅",
    logo: "src/assets/infosys.png",
    name: "Data Structures & Algorithms using Java",
    org: "Infosys Springboard",
    year: "2025",
    highlight: "DSA"
  },
  {
    icon: "🏅",
    logo: "src/assets/infosys.png",
    name: "Database Management System",
    org: "Infosys Springboard",
    year: "2025",
    highlight: "DBMS"
  },
  {
    icon: "🏅",
    logo: "src/assets/infosys.png",
    name: "Introduction to NoSQL databases",
    org: "Infosys Springboard",
    year: "2025",
    highlight: "DBMS"
  },
  {
    icon: "🏅",
    logo: "src/assets/infosys.png",
    name: "AI-first Software Engineering",
    org: "Infosys Lex",
    year: "2025",
    highlight: "AI"
  },
  {
    icon: "🏅",
    logo: "src/assets/infosys.png",
    name: "Introduction to Agile methodology",
    org: "Infosys Lex",
    year: "2025",
    highlight: "AI"
  },
  {
    icon: "🏅",
    logo: "src/assets/infosys.png",
    name: "Prompt Engineering",
    org: "Infosys Lex",
    year: "2025",
    highlight: "Prompt"
  },
  {
    icon: "🏅",
    logo: "src/assets/infosys.png",
    name: "REST API using Spring",
    org: "Infosys Lex",
    year: "2025",
    highlight: "Spring"
  },
];
const particles = Array.from({ length: 16 }, (_, i) => ({ id: i, left: Math.random() * 100, top: Math.random() * 100, delay: Math.random() * 5, dur: 4 + Math.random() * 6, dx: (Math.random() - .5) * 80 }));
const filterCats = ["All", "Web", "Backend", "Machine Learning"];

/* ─── RESUME ─── */
function ResumeModal({ onClose }) {
  return (
    <div className="res-modal">
      <div className="res-bar">
        <div className="res-bar-title">📄 Vure Maneesh — Résumé</div>
        <button className="res-close" onClick={onClose}>✕ Close</button>
      </div>
      <div className="res-body">
        <div className="res-page">
          <div className="rp-hdr">
            <div className="rp-name">VURE MANEESH</div>
            <div className="rp-role">Software Developer — Java | Spring Boot | REST APIs</div>
            <div className="rp-contacts">
              {[["📧", "maneeshvure1301@gmail.com"], ["📱", "+91 8374343597"], ["🐙", "github.com/Vure-Maneesh"], ["💼", "linkedin.com/in/vuremaneesh"], ["📍", "Chinthapally, India"]].map(([i, v]) => (
                <div key={v} className="rp-ct"><span>{i}</span><span>{v}</span></div>
              ))}
            </div>
          </div>

          <div className="rp-body">
            <div className="rp-left">

              <div className="rp-sec">
                <div className="rp-sec-t">Education</div>
                <div className="rp-edu-deg">B.Tech – Computer Science & Engineering</div>
                <div className="rp-edu-sc">JNTUH University College of Engineering, Sircilla</div>
                <div className="rp-edu-yr">2025 · 6.83 CGPA</div>
              </div>

              <div className="rp-sec">
                <div className="rp-sec-t">Technical Skills</div>
                {[["Programming", ["Java", "SQL"]],
                ["Web", ["HTML", "CSS", "JavaScript"]],
                ["Frameworks", ["Spring Boot", "Spring REST API", "Hibernate"]],
                ["Databases", ["MySQL", "PostgreSQL"]],
                ["Tools", ["Git", "GitHub", "Eclipse", "VS Code"]],
                ["Concepts", ["OOP", "SDLC", "Debugging", "Testing", "Microservices (Basic)"]]
                ].map(([cat, tags]) => (
                  <div key={cat} style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#777', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{cat}</div>
                    {tags.map(s => <span key={s} className="rp-stag">{s}</span>)}
                  </div>
                ))}
              </div>

              <div className="rp-sec">
                <div className="rp-sec-t">Certifications</div>
                {[["🏅", "Programming using Java", "Infosys Springboard"],
                ["🏅", "Data Structures & Algorithms using Java", "Infosys Springboard"],
                ["🏅", "Database Management System", "Infosys Springboard"]
                ].map(([i, n, o]) => (
                  <div key={n} className="rp-cert-item">
                    <span>{i}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 11 }}>{n}</div>
                      <div style={{ fontSize: 10, color: '#888' }}>{o}</div>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            <div className="rp-right">

              <div className="rp-sec">
                <div className="rp-sec-t">Professional Summary</div>
                <p style={{ fontSize: 12.5, color: '#444', lineHeight: 1.7 }}>
                  Aspiring Software Developer with strong knowledge in Java, Spring Boot, SQL, and REST API development. Skilled in OOP, backend logic, debugging, and building maintainable applications. Currently gaining hands-on experience through internship and real-world project development.
                </p>
              </div>

              <div className="rp-sec">
                <div className="rp-sec-t">Experience</div>
                <div className="rp-exp">
                  <div className="rp-exp-role">Software Developer Intern</div>
                  <div className="rp-exp-co">Infosys, Chennai</div>
                  <div className="rp-exp-per">2025 – Present</div>
                  <ul className="rp-exp-ul">
                    <li>Learning and implementing RESTful APIs using Spring Boot and Hibernate.</li>
                    <li>Working with Agile methodology and SDLC practices in training projects.</li>
                    <li>Participating in debugging, testing, and backend module development.</li>
                  </ul>
                </div>
              </div>

              <div className="rp-sec">
                <div className="rp-sec-t">Projects</div>
                {[
                  ["Bank Management System", "Java", "Implemented deposit, withdrawal, login, and account management features using OOP principles with validation and exception handling."],
                  ["Food Adda", "Spring Boot, MySQL, REST API", "Developed backend services with REST APIs and integrated MySQL using JPA for efficient data handling."]
                ].map(([n, t, d]) => (
                  <div key={n} className="rp-proj">
                    <div className="rp-proj-n">{n} — <span style={{ fontWeight: 400, fontSize: 10, color: '#7c3aed' }}>{t}</span></div>
                    <div className="rp-proj-d">{d}</div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── SECTION VIEWS ─── */
function HomeView({ navigate, dark }) {
  return (
    <div>
      {/* ── HERO ── */}
      <div className="hero-sec">
        <div className="hero-bg-r" /><div className="hero-grid-r" />
        <div className="hero-content">
          <div className="hero-tag"><span />Open to Opportunities</div>
          <h1 className="hero-title">Vure<br /><span className="grad">Maneesh</span></h1>
          <p className="hero-sub">
            Backend-focused Software Developer building scalable REST APIs using Java & Spring Boot, with hands-on experience in database integration and real-world application development.
          </p>
          <div className="hero-btns">
            <button className="btn-p" onClick={() => navigate("projects")}>
              🚀 View Projects
            </button>
            <button className="btn-s" onClick={() => navigate("contact")}>
              💼 Hire Me
            </button>
          </div>
          <div className="hero-stats">
            {[["4+", "Projects"], ["1", "Internship"], ["5+", "Certifications"], ["Java", "Core Skill"]].map(([n, l]) => (
              <div key={l}>
                <div className="stat-num">{n}</div>
                <div className="stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Solar System 3D Model */}

        <div className="hero-3d">
          <div className="scene3d">
            {/* Orbit track circles */}
            <div className="orbit-track track1" />
            <div className="orbit-track track2" />
            <div className="orbit-track track3" />

            {/* Central orb */}
            <div className="core-orb">
              <div className="core-label-top">Java</div>
              <div className="core-label-main">FullStack</div>
              <div className="core-label-bot"></div>
            </div>

            {/* ── Tech icon definitions: [label, radius, duration, delay, SVG] ── */}
            {[
              /* ── INNER RING r=115, 9s CW ── */
              {
                r: 115, dur: 9, del: 0,
                svg: <svg viewBox="0 0 128 128"><path fill="#f89820" d="M47.617 98.12s-4.767 2.774 3.397 3.71c9.892 1.128 14.947.967 25.845-1.097 0 0 2.871 1.795 6.873 3.351-24.439 10.47-55.308-.607-36.115-5.964zm-2.988-13.665s-5.348 3.959 2.823 4.805c10.567 1.091 18.91 1.18 33.354-1.6 0 0 1.993 2.025 5.132 3.131-29.542 8.64-62.446.68-41.309-6.336z" /><path fill="#f89820" d="M69.802 61.271c6.025 6.935-1.58 13.17-1.58 13.17s15.289-7.891 8.269-17.777c-6.559-9.215-11.587-13.792 15.635-29.58 0 0-42.731 10.67-22.324 34.187z" /><path fill="#f89820" d="M102.123 108.229s3.529 2.91-3.888 5.159c-14.102 4.272-58.706 5.56-71.094.171-4.451-1.938 3.899-4.625 6.526-5.192 2.739-.593 4.303-.485 4.303-.485-4.953-3.487-32.013 6.85-13.743 9.815 49.821 8.076 90.817-3.637 77.896-9.468zM49.912 70.294s-22.686 5.389-8.033 7.348c6.188.828 18.518.638 30.011-.326 9.39-.789 18.813-2.474 18.813-2.474s-3.308 1.419-5.704 3.053c-23.042 6.07-67.544 3.242-54.731-2.958 10.832-5.239 19.644-4.643 19.644-4.643zm40.697 22.747c23.421-12.167 12.591-23.86 5.032-22.285-1.848.385-2.677.72-2.677.72s.688-1.079 2-1.543c14.953-5.255 26.451 15.503-4.823 23.725 0 .001.359-.327.468-.617z" /><path fill="#f89820" d="M76.491 1.587S89.459 14.563 64.188 34.51c-20.266 16.006-4.621 25.13-.007 35.559-11.831-10.673-20.509-20.07-14.688-28.815C58.041 28.42 81.722 22.195 76.491 1.587z" /><path fill="#f89820" d="M52.214 126.021c22.476 1.437 57-.8 57.817-11.436 0 0-1.571 4.032-18.577 7.231-19.186 3.612-42.854 3.191-56.887.874 0 .001 2.875 2.381 17.647 3.331z" /></svg>
              },
              {
                r: 115, dur: 9, del: -2.25,
                svg: <svg viewBox="0 0 128 128"><path fill="#77bc1f" d="M116.452 6.643h-22.9c-5.978 0-11.249 3.127-14.234 7.823L64.001 34.604 48.684 14.466c-2.986-4.696-8.256-7.823-14.234-7.823h-22.9L64.001 82.14z" /><path fill="#6aad3d" d="M11.55 6.643L64.001 82.14 116.452 6.643z" /><path fill="#77bc1f" d="M116.452 121.358h-22.9c-5.978 0-11.249-3.127-14.234-7.823L64.001 93.397 48.684 113.535c-2.986 4.696-8.256 7.823-14.234 7.823h-22.9L64.001 45.861z" /></svg>
              },
              {
                r: 115, dur: 9, del: -4.5,
                svg: <svg viewBox="0 0 128 128"><path fill="#00618a" d="M0 0h128v128H0z" /><path fill="#fff" d="M25 26h13v76H25zM90 26h13v76H90zM25 58h78v13H25z" /></svg>
              },
              {
                r: 115, dur: 9, del: -6.75,
                svg: <svg viewBox="0 0 128 128"><path fill="#336791" d="M93.809 92.112c-.785-4.346-3.527-7.076-6.287-9.976-1.219-1.267-2.468-2.563-3.534-3.966-2.012-2.711-2.563-5.788-1.697-8.17.868-2.381 3.163-3.947 5.949-4.215.908-.09 1.908-.009 2.976.215 1.143.223 2.143.641 2.979 1.248-.006-.084-.009-.168-.009-.252 0-8.516-7.072-15.432-16.527-16.002-.51-.029-1.022-.044-1.538-.044-8.851 0-16.528 5.04-17.88 12.103-.207 1.063-.31 2.159-.31 3.281 0 3.742 1.211 7.196 3.437 9.985.959 1.218 2.071 2.337 3.221 3.495 2.471 2.488 5.092 5.07 6.52 8.912.268.73.474 1.499.613 2.303.071.406.119.82.145 1.243.203 3.359-.896 6.705-2.979 9.207-2.083 2.502-5.027 4.097-8.201 4.502-.373.048-.75.081-1.13.098-.38.018-.764.027-1.148.027-4.002 0-7.979-1.328-10.842-3.643-2.863-2.315-4.442-5.38-4.299-8.531.003-.078.003-.152.006-.229l.009-.313c.09-3.012.885-5.922 2.239-8.455.553-1.041 1.185-2.061 1.887-3.062.672-.961 1.411-1.91 2.168-2.861.747-.934 1.511-1.868 2.275-2.803 1.338-1.662 2.672-3.326 3.811-5.101 1.17-1.822 2.121-3.76 2.749-5.885.631-2.137.92-4.428.866-6.992-.001-.033-.001-.065-.001-.098v-.084c0-.293.006-.592.016-.897.013-.403.036-.824.068-1.261.093-1.284.297-2.64.617-4.043 1.038-4.567 3.42-8.713 7.18-11.827l.099-.08c2.217-1.811 4.77-3.138 7.557-3.944 2.789-.806 5.804-1.082 8.916-.82 8.455.704 15.625 6.113 18.16 13.716.471 1.404.768 2.847.895 4.308l.007.014c.041.457.067.917.08 1.381.01.341.012.682.008 1.022v.045c0 .025-.001.049-.001.074-.003 1.568-.117 3.061-.344 4.484-.438 2.759-1.321 5.213-2.65 7.387-.694 1.142-1.481 2.227-2.34 3.283-.742.911-1.521 1.812-2.297 2.709-.78.902-1.55 1.803-2.275 2.729-.709.908-1.361 1.846-1.914 2.853-.543 1.004-.977 2.079-1.241 3.265l-.006.025c-.043.189-.079.385-.108.582zm-18.854-77.668c-.41-.219-.84-.392-1.268-.536l-.111-.035c-.377-.113-.75-.2-1.113-.254-.357-.056-.712-.077-1.054-.064-.34.013-.666.068-.973.166-.614.188-1.133.538-1.5 1.027-.356.473-.557 1.089-.557 1.796 0 .357.043.705.131 1.035l.059.215c.17.589.444 1.112.813 1.556.373.45.838.818 1.389 1.092.539.27 1.166.443 1.868.5.7.059 1.473-.004 2.299-.207.836-.205 1.541-.527 2.092-.967.553-.44.948-.981 1.164-1.609.211-.617.236-1.32.067-2.094-.168-.754-.524-1.342-1.065-1.742-.506-.377-1.177-.614-2.006-.679-.085-.007-.17-.014-.256-.018l-.979-.183zM44.16 27.28l-.977.183c-.087.004-.17.011-.255.018-.829.065-1.5.302-2.006.679-.541.4-.897.988-1.065 1.742-.169.773-.144 1.477.067 2.094.216.628.611 1.169 1.164 1.609.551.44 1.256.762 2.092.967.826.203 1.599.266 2.299.207.703-.057 1.33-.23 1.868-.5.552-.274 1.016-.643 1.389-1.092.37-.443.644-.967.814-1.556l.058-.215c.088-.33.131-.678.131-1.035 0-.707-.201-1.323-.557-1.796-.367-.489-.886-.839-1.5-1.027-.307-.098-.633-.153-.973-.166-.342-.013-.697.008-1.054.064-.362.054-.736.141-1.113.254l-.111.035c-.429.144-.858.317-1.268.536l-.978.183zm38.33 62.854z" /></svg>
              },

              /* ── MID RING r=170, 14s CW ── */
              {
                r: 170, dur: 14, del: 0,
                svg: <svg viewBox="0 0 128 128"><path fill="#61dafb" d="M64 34.68C48.36 34.68 34.5 40.38 25.18 48.9 20.24 54.05 17.5 59.65 17.5 65.17c0 5.52 2.74 11.12 7.68 16.27C34.5 89.96 48.36 95.66 64 95.66s29.5-5.7 38.82-14.22c4.94-5.15 7.68-10.75 7.68-16.27 0-5.52-2.74-11.12-7.68-16.27C93.5 40.38 79.64 34.68 64 34.68zm0 5.46c13.8 0 26.67 5.18 35.18 13.04 4.06 4.23 6.14 8.42 6.14 12.02s-2.08 7.79-6.14 12.02C90.67 85.08 77.8 90.2 64 90.2S37.33 85.08 28.82 77.22c-4.06-4.23-6.14-8.42-6.14-12.02s2.08-7.79 6.14-12.02C37.33 45.32 50.2 40.14 64 40.14z" /><path fill="#61dafb" d="M64 54.12c-6.1 0-11.05 4.95-11.05 11.05S57.9 76.22 64 76.22s11.05-4.95 11.05-11.05S70.1 54.12 64 54.12zm0 5.46c3.08 0 5.59 2.51 5.59 5.59s-2.51 5.59-5.59 5.59-5.59-2.51-5.59-5.59 2.51-5.59 5.59-5.59zM48.17 20.51c-2.97 0-5.74.77-8.12 2.21-4.78 2.76-7.79 8.02-8.54 15.04-.55 5.11.24 10.99 2.28 17.24 2.04 6.25 5.26 12.53 9.37 18.27 4.11 5.74 8.84 10.65 13.58 14.2 4.73 3.56 9.34 5.51 13.27 5.51 2.97 0 5.74-.77 8.12-2.21 4.78-2.76 7.79-8.02 8.54-15.04.55-5.11-.24-10.99-2.28-17.24-2.04-6.25-5.26-12.53-9.37-18.27-4.11-5.74-8.84-10.65-13.58-14.2-4.73-3.56-9.34-5.51-13.27-5.51zm0 5.46c2.86 0 6.55 1.66 10.55 4.67 4 3.01 8.17 7.34 11.93 12.6 3.76 5.26 6.7 10.96 8.56 16.63 1.87 5.67 2.57 10.84 2.1 15.22-.59 5.54-2.72 9.41-5.78 11.16-1.31.76-2.8 1.14-4.46 1.14-2.86 0-6.55-1.66-10.55-4.67-4-3.01-8.17-7.34-11.93-12.6-3.76-5.26-6.7-10.96-8.56-16.63-1.87-5.67-2.57-10.84-2.1-15.22.59-5.54 2.72-9.41 5.78-11.16 1.31-.76 2.8-1.14 4.46-1.14z" /><path fill="#61dafb" d="M79.83 20.51c-3.93 0-8.54 1.95-13.27 5.51-4.73 3.56-9.47 8.46-13.58 14.2-4.11 5.74-7.33 12.02-9.37 18.27-2.04 6.25-2.83 12.13-2.28 17.24.75 7.02 3.76 12.28 8.54 15.04 2.38 1.44 5.15 2.21 8.12 2.21 3.93 0 8.54-1.95 13.27-5.51 4.73-3.56 9.47-8.46 13.58-14.2 4.11-5.74 7.33-12.02 9.37-18.27 2.04-6.25 2.83-12.13 2.28-17.24-.75-7.02-3.76-12.28-8.54-15.04-2.38-1.44-5.15-2.21-8.12-2.21zm0 5.46c1.66 0 3.15.38 4.46 1.14 3.06 1.75 5.19 5.62 5.78 11.16.47 4.38-.23 9.55-2.1 15.22-1.87 5.67-4.8 11.37-8.56 16.63-3.76 5.26-7.93 9.59-11.93 12.6-4 3.01-7.69 4.67-10.55 4.67-1.66 0-3.15-.38-4.46-1.14-3.06-1.75-5.19-5.62-5.78-11.16-.47-4.38.23-9.55 2.1-15.22 1.87-5.67 4.8-11.37 8.56-16.63 3.76-5.26 7.93-9.59 11.93-12.6 4-3.01 7.69-4.67 10.55-4.67z" /></svg>
              },
              {
                r: 170, dur: 14, del: -2.33,
                svg: <svg viewBox="0 0 128 128"><linearGradient id="pyGrad" x1="63" y1="6" x2="65" y2="122" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#387eb8" /><stop offset="1" stopColor="#366994" /></linearGradient><linearGradient id="pyGrad2" x1="63" y1="6" x2="65" y2="122" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#ffe052" /><stop offset="1" stopColor="#ffc331" /></linearGradient><path fill="url(#pyGrad)" d="M63.391 1.988c-4.222.02-8.252.379-11.8 1.007-10.45 1.846-12.346 5.71-12.346 12.837v9.411h24.693v3.137H29.977c-7.176 0-13.46 4.313-15.426 12.521-2.268 9.405-2.368 15.275 0 25.096 1.755 7.311 5.947 12.519 13.124 12.519h8.491V67.234c0-8.151 7.051-15.34 15.426-15.34h24.665c6.866 0 12.346-5.654 12.346-12.548V15.833c0-6.693-5.646-11.72-12.346-12.837-4.244-.706-8.645-1.027-12.866-1.008zM50.037 9.557c2.55 0 4.634 2.117 4.634 4.721 0 2.593-2.083 4.69-4.634 4.69-2.56 0-4.633-2.097-4.633-4.69-.001-2.604 2.073-4.721 4.633-4.721z" /><path fill="url(#pyGrad2)" d="M91.682 28.38v10.966c0 8.5-7.208 15.655-15.426 15.655H51.591c-6.756 0-12.346 5.783-12.346 12.549v23.515c0 6.691 5.818 10.628 12.346 12.547 7.816 2.297 15.312 2.713 24.665 0 6.216-1.801 12.346-5.423 12.346-12.547v-9.412H63.938v-3.138h37.012c7.176 0 9.852-5.005 12.348-12.519 2.578-7.735 2.467-15.174 0-25.096-1.774-7.145-5.161-12.521-12.348-12.521h-9.268zM77.809 87.927c2.561 0 4.634 2.097 4.634 4.692 0 2.602-2.074 4.719-4.634 4.719-2.55 0-4.633-2.117-4.633-4.719 0-2.595 2.083-4.692 4.633-4.692z" /></svg>
              },
              {
                r: 170, dur: 14, del: -4.67,
                svg: <svg viewBox="0 0 128 128"><path fill="#83cd29" d="M112.771 30.334L68.674 3.671a9.065 9.065 0 00-9.066 0L16.235 30.334a9.066 9.066 0 00-4.533 7.854v53.224a9.069 9.069 0 004.533 7.854l43.373 25.517a9.067 9.067 0 009.066 0l43.097-25.517a9.067 9.067 0 004.533-7.854V38.188a9.065 9.065 0 00-4.533-7.854z" /><path fill="#fff" d="M90.696 90.5a4.919 4.919 0 01-6.958 2.029l-19.455-11.453a2.459 2.459 0 00-2.542.041L42.586 92.37a4.921 4.921 0 01-5.972-7.834l20.065-15.088a4.921 4.921 0 015.716-.276l19.61 11.541a2.459 2.459 0 002.48-.049l20.065-11.874a2.459 2.459 0 003.362.894 2.459 2.459 0 00.894-3.363L88.4 57.1a2.459 2.459 0 00-2.48-.05l-19.61 11.542a4.921 4.921 0 01-5.716-.276L40.53 53.228a4.921 4.921 0 015.972-7.834l19.655 10.253a2.459 2.459 0 002.542.041l19.455-11.453a4.919 4.919 0 016.958 2.029l.019.033a4.921 4.921 0 01-1.873 6.714l-19.657 11.622a2.457 2.457 0 000 4.254l19.657 11.621a4.921 4.921 0 011.873 6.714z" /></svg>
              },
              {
                r: 170, dur: 14, del: -7,
                svg: <svg viewBox="0 0 128 128"><path fill="#1572b6" d="M19.076 121.41L8.1 0h111.8l-10.986 121.396-45.5 12.6z" /><path fill="#33a9dc" d="M64 118.8l36.8-10.2 9.4-105.4H64z" /><path fill="#fff" d="M64 66.4H49.9l-1-11.4H64V44H36.6l.3 3.3 2.8 32.1H64zm0 21.8l-.05.014-13.4-3.6-.857-9.557H38.943l1.686 18.8 23.32 6.47.051-.014z" /><path fill="#ebebeb" d="M63.7 66.4v11H77l-1.3 14.2-12 3.2v11.5l22-6.1.16-1.9 2.63-29.4.27-3H63.7zM63 44v11h25.4l.21-2.3.48-5.4.27-3.3H63z" /></svg>
              },
              {
                r: 170, dur: 14, del: -9.33,
                svg: <svg viewBox="0 0 128 128"><path fill="#f7df1e" d="M2 2h124v124H2z" /><path d="M116.682 103.2c-.67-4.143-3.574-7.631-10.126-10.903-2.49-1.245-5.215-2.128-6.034-4.168-.309-1.166-.351-1.818-.154-2.51.504-2.065 2.512-2.688 4.173-2.198 1.076.309 2.09.154 3.43 1.9.918-1.19 1.036-1.44 1.036-1.44l-1.024-2.252c-1.027-2.26-1.72-3.065-4.01-3.73-.876-.258-2.136-.388-3.428-.372-3.304.062-5.42 1.453-6.656 3.374-2.226 3.44-1.8 9.056 1.536 11.596 3.566 2.934 8.638 3.593 9.32 6.392.476 2.79-2.116 3.688-4.817 3.358-2.14-.258-3.39-1.36-4.715-3.29-1.32 1.296-1.32 1.296-2.257 1.898-.464.295-.926.59-1.39.894 1.283 2.658 3.175 4.184 5.568 5.126 2.35.918 4.946 1.09 7.58.618 2.8-.516 5.353-2.093 6.617-4.54.72-1.388.873-2.861.654-4.35zm-37.56-34.004v27.476c0 1.476.05 2.9-.31 4.226-1.018 3.778-4.03 4.512-6.512 4.006-2.16-.455-3.59-1.64-4.57-3.626-.21-.47-.39-.97-.55-1.453l-2.34 1.452c-.78.482-1.55.97-2.33 1.453 1.064 2.72 2.612 4.824 4.864 6.204 2.39 1.46 5.25 2.02 8.32 1.76 2.63-.228 5.27-1.108 7.01-3.128 2.27-2.624 2.84-6.204 2.84-9.88V69.196H79.122z" /></svg>
              },
              {
                r: 170, dur: 14, del: -11.67,
                svg: <svg viewBox="0 0 128 128"><path fill="#2396ed" d="M13.74 50.31c0-4.73 3.843-8.573 8.573-8.573s8.573 3.843 8.573 8.573-3.843 8.573-8.573 8.573-8.573-3.843-8.573-8.573zM95.49 79.13c-4.73 0-8.573 3.843-8.573 8.573s3.843 8.573 8.573 8.573 8.573-3.843 8.573-8.573-3.843-8.573-8.573-8.573zM64 13.74c-4.73 0-8.573 3.843-8.573 8.573S59.27 30.886 64 30.886s8.573-3.843 8.573-8.573S68.73 13.74 64 13.74zM64 97.114c-4.73 0-8.573 3.843-8.573 8.573S59.27 114.26 64 114.26s8.573-3.843 8.573-8.573-3.843-8.573-8.573-8.573z" /><path fill="#2396ed" d="M64 41.737c-12.292 0-22.263 9.971-22.263 22.263S51.708 86.263 64 86.263s22.263-9.971 22.263-22.263S76.292 41.737 64 41.737zm0 38.153c-8.771 0-15.89-7.119-15.89-15.89S55.229 48.11 64 48.11s15.89 7.119 15.89 15.89S72.771 79.89 64 79.89z" /><path fill="#2396ed" d="M95.49 41.737c-4.73 0-8.573 3.843-8.573 8.573s3.843 8.573 8.573 8.573 8.573-3.843 8.573-8.573-3.843-8.573-8.573-8.573zM13.74 79.13c0 4.73 3.843 8.573 8.573 8.573s8.573-3.843 8.573-8.573-3.843-8.573-8.573-8.573-8.573 3.843-8.573 8.573z" /></svg>
              },

              /* ── OUTER RING r=230, 22s CCW ── */
              {
                r: 230, dur: 22, del: 0, rev: true,
                svg: <svg viewBox="0 0 128 128"><path fill="#f34f29" d="M124.742 58.8L69.2 3.257a4.405 4.405 0 00-6.232 0L51.162 15.07l15.73 15.73a5.232 5.232 0 016.612 6.677l15.156 15.156a5.232 5.232 0 11-3.143 3.013l-14.13-14.13v37.14a5.235 5.235 0 11-4.307-.118V40.127a5.235 5.235 0 01-2.832-6.865L48.165 19.107 3.257 64.015a4.405 4.405 0 000 6.232l55.543 55.543a4.405 4.405 0 006.232 0l59.71-59.71a4.405 4.405 0 000-6.279z" /></svg>
              },
              {
                r: 230, dur: 22, del: -2.75, rev: true,
                svg: <svg viewBox="0 0 128 128"><path fill="#181616" d="M64 5.103c-33.347 0-60.388 27.04-60.388 60.388 0 26.68 17.303 49.317 41.297 57.303 3.017.56 4.125-1.31 4.125-2.905 0-1.44-.056-6.197-.082-11.243-16.8 3.653-20.345-7.125-20.345-7.125-2.747-6.98-6.705-8.836-6.705-8.836-5.48-3.748.413-3.67.413-3.67 6.063.425 9.257 6.223 9.257 6.223 5.386 9.23 14.127 6.562 17.573 5.02.542-3.903 2.107-6.568 3.834-8.076-13.413-1.525-27.514-6.704-27.514-29.843 0-6.593 2.36-11.98 6.223-16.21-.628-1.52-2.695-7.662.584-15.98 0 0 5.07-1.623 16.61 6.19C53.7 35 58.867 34.327 64 34.304c5.13.023 10.3.694 15.127 2.033 11.526-7.813 16.59-6.19 16.59-6.19 3.287 8.317 1.22 14.46.593 15.98 3.872 4.23 6.215 9.617 6.215 16.21 0 23.194-14.127 28.3-27.574 29.796 2.167 1.874 4.097 5.549 4.097 11.183 0 8.08-.07 14.583-.07 16.572 0 1.607 1.088 3.49 4.148 2.897 23.98-7.994 41.263-30.622 41.263-57.294C124.388 32.14 97.35 5.1 64 5.1z" /></svg>
              },
              {
                r: 230, dur: 22, del: -5.5, rev: true,
                svg: <svg viewBox="0 0 128 128"><path fill="#f90" d="M64 1.7C29.4 1.7 1.7 29.4 1.7 64S29.4 126.3 64 126.3 126.3 98.6 126.3 64 98.6 1.7 64 1.7zm-.6 21.3c8.5 0 14.1 4.3 14.1 4.3l-3.2 3.2s-4.5-3.4-10.9-3.4c-9.7 0-16.3 7.6-16.3 17.8s6.6 17.8 16.3 17.8c6.6 0 10.6-3.1 10.6-3.1V52h-9.4v-4.7h14.4v15.9s-5.4 5.1-15.6 5.1C51.9 68.3 42.8 58.3 42.8 45s9.1-22 20.6-22zm31.6 31c10.4 0 16.1 7 16.1 16.3v2H84.4c.2 7.5 4.9 10.6 10.3 10.6 5.4 0 9.2-3.5 9.2-3.5l2.7 3.6s-4.8 4.5-12.2 4.5c-9.8 0-16.2-7.1-16.2-16.8-.1-9.8 6.3-16.7 16.8-16.7zm-.2 4.4c-5.1 0-9.4 3.5-9.8 9.6h19.3c-.5-5.8-3.8-9.6-9.5-9.6zM42.5 54.1c10.4 0 16.1 7 16.1 16.3v2H31.8c.2 7.5 4.9 10.6 10.3 10.6 5.4 0 9.2-3.5 9.2-3.5l2.7 3.6s-4.8 4.5-12.2 4.5c-9.8 0-16.2-7.1-16.2-16.8-.1-9.8 6.3-16.7 16.9-16.7zm-.2 4.4c-5.1 0-9.4 3.5-9.8 9.6h19.3c-.5-5.8-3.9-9.6-9.5-9.6z" /></svg>
              },
              {
                r: 230, dur: 22, del: -8.25, rev: true,
                svg: <svg viewBox="0 0 128 128"><path fill="#0db7ed" d="M124.8 52.1c-2.7-11.4-9-21.4-18.4-28.9-8.6-6.9-19.1-11.1-30.3-12.1-9.8-.9-19.7.8-28.6 4.9-9.7 4.4-17.9 11.4-23.7 20.1L23.3 37c-3.1 4.8-5.5 10-7.1 15.5-1.8 6.1-2.5 12.5-2 18.8.5 6.2 2.1 12.3 4.9 17.9 2.7 5.4 6.3 10.3 10.8 14.4 4.4 4 9.6 7.2 15.2 9.3 5.8 2.1 11.9 3.1 18 2.9 6.1-.2 12.1-1.5 17.7-3.9 5.4-2.3 10.3-5.7 14.5-9.9 4.1-4.1 7.4-9 9.7-14.4 2.4-5.7 3.5-11.9 3.5-18.1v-1.5l1.2-1.5 14.6-18.7-1.5.3z" /><path fill="#fff" d="M108.2 51.8l-14.6 18.7v1.5c0 6.2-1.1 12.4-3.5 18.1-2.3 5.4-5.6 10.3-9.7 14.4-4.2 4.2-9.1 7.6-14.5 9.9-5.6 2.4-11.6 3.7-17.7 3.9-6.1.2-12.2-.8-18-2.9-5.6-2.1-10.8-5.3-15.2-9.3-4.5-4.1-8.1-9-10.8-14.4-2.8-5.6-4.4-11.7-4.9-17.9-.5-6.3.2-12.7 2-18.8 1.6-5.5 4-10.7 7.1-15.5l.5-.8c5.6-8.6 13.8-15.6 23.5-20C41.2 14.8 51.1 13.1 60.9 14c11.2 1 21.7 5.2 30.3 12.1 9.4 7.5 15.7 17.5 18.4 28.9l-1.4-3.2zM64 42.6c-11.8 0-21.4 9.6-21.4 21.4S52.2 85.4 64 85.4 85.4 75.8 85.4 64 75.8 42.6 64 42.6z" /></svg>
              },
              {
                r: 230, dur: 22, del: -11, rev: true,
                svg: <svg viewBox="0 0 128 128"><path fill="#e44d26" d="M19.037 113.876L9.032 1.661h109.936l-10.016 112.198-45.019 12.48z" /><path fill="#f16529" d="M64 116.8l36.378-10.086 8.559-95.878H64z" /><path fill="#ebebeb" d="M64 52.455H45.788L44.53 38.361H64V24.599H29.489l.33 3.692 3.382 37.927H64zm0 35.743l-.061.017-15.327-4.14-.979-10.975H33.816l1.928 21.609 28.193 7.826.063-.017z" /><path fill="#fff" d="M63.952 52.455v13.763h16.947l-1.597 17.849-15.35 4.143v14.319l28.215-7.82.207-2.325 3.234-36.233.335-3.696H63.952zm0-27.856v13.762h33.244l.277-3.092.628-6.978.329-3.692z" /></svg>
              },
              {
                r: 230, dur: 22, del: -13.75, rev: true,
                svg: <svg viewBox="0 0 128 128"><path fill="#fff" d="M22.67 47h99.67v73.67H22.67z" /><path fill="#f1502f" d="M5.33 22.67h27.11v27.11H5.33z" /><path fill="#fff" d="M5.33 58h27.11v27.11H5.33zm0 36.33h27.11v27.11H5.33zM40.67 5.33h27.11v27.11H40.67zm0 36.34h27.11v27.11H40.67zm0 36.33h27.11v27.11H40.67zM76 27.67h27.11v27.11H76z" /></svg>
              },
              {
                r: 230, dur: 22, del: -16.5, rev: true,
                svg: <svg viewBox="0 0 128 128"><path fill="#ff9900" d="M40.258 68.326s-.625 4.832 5.167 6.625l14.25 4.333 14.917-4.917c0 0 4.5-2.333 3.417-7.083 0 0-.083-15.5 0-16s.083-3.667 2.917-4.833c0 0 2.583-.833 4.583 1.667 0 0 1.167 1 1.417 3.333l-.083 18.083s.917 6.25-5.75 9.5l-19.667 7.583-20-6.917s-6.333-2.5-6.5-9.583c0 0 .083-2.583 0-16.167 0 0 0-3.417 2.583-5.083 0 0 2.083-1.667 4.917-.167 0 0 2.583 1.333 2.75 4.75l.083 14.875z" /><path fill="#232f3e" d="M64 8C33.6 8 9 32.6 9 63s24.6 55 55 55 55-24.6 55-55S94.4 8 64 8zm0 105.5C35.5 113.5 12.5 90.5 12.5 62S35.5 10.5 64 10.5 115.5 33.5 115.5 62 92.5 113.5 64 113.5z" /></svg>
              },
              {
                r: 230, dur: 22, del: -19.25, rev: true,
                svg: <svg viewBox="0 0 128 128"><path fill="#41873f" d="M112.771 30.334L68.674 3.671a9.065 9.065 0 00-9.066 0L16.235 30.334a9.066 9.066 0 00-4.533 7.854v53.224a9.069 9.069 0 004.533 7.854l43.373 25.517a9.067 9.067 0 009.066 0l43.097-25.517a9.067 9.067 0 004.533-7.854V38.188a9.065 9.065 0 00-4.533-7.854zm-32.47 51.348l-5.001 2.913a2.012 2.012 0 01-2.039-.05l-3.826-2.326a2.012 2.012 0 01-.952-1.723v-4.645a2.013 2.013 0 01.952-1.723l3.826-2.326a2.013 2.013 0 012.039-.05l5.001 2.913a2.012 2.012 0 011.026 1.773v4.451a2.013 2.013 0 01-1.026 1.773zm-15.517-6.26c-.13.014-.261.022-.392.022a2.971 2.971 0 01-.392-.022L38.674 66.95a2.951 2.951 0 01-2.557-3.012c.008-.185.032-.369.072-.549a2.953 2.953 0 012.955-2.405c.13 0 .261.01.391.027l25.266 8.498 25.267-8.498c.131-.017.263-.027.391-.027a2.951 2.951 0 013.027 2.954c0 .184-.02.368-.059.549a2.952 2.952 0 01-2.558 3.012z" /></svg>
              },
            ].map(({ r, dur, del, rev, svg }, i) => (
              <div key={i} className="orbit-wrapper" style={{
                animation: `orbitSpin ${dur}s linear infinite ${rev ? "reverse" : ""}`,
                animationDelay: `${del}s`,
              }}>
                <div className="orbit-bubble" style={{
                  left: `${r}px`,
                  animationDuration: `${dur}s`,
                  animationDelay: `${del}s`,
                }}>
                  {svg}
                </div>
              </div>
            ))}

            {/* Ambient particles */}
            {particles.map(p => (
              <div key={p.id} className="pt" style={{ left: `${p.left}%`, top: `${p.top}%`, "--dx": `${p.dx}px`, animation: `ptFloat ${p.dur}s ${p.delay}s linear infinite` }} />
            ))}
          </div>
        </div>
      </div>


      {/* ── ABOUT (merged below hero) ── */}
      <div className="sec-wrap about-sec" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="slabel">Who I Am</div>
        <h2 className="stitle">About <span>Me</span></h2>
        <div className="about-inner">
          <div className="about-text">
            <p>
              Hi! I'm <span className="hl">Vure Maneesh</span>, a Computer Science graduate and Backend-focused Software Developer with strong expertise in Java, Spring Boot, and REST API development.
            </p>

            <p>
              I specialize in building scalable backend systems with clean architecture, focusing on efficient API design, secure data handling, and reliable application performance using technologies like Spring Boot, JPA/Hibernate, and MySQL.
            </p>

            <p>
              Currently working as a <span className="hl">Software Developer Intern at Infosys</span>, where I contribute to backend development, work on RESTful services, and collaborate within Agile Scrum teams to build real-world application modules.
            </p>

            <p>
              I also have experience building responsive user interfaces using HTML and CSS, and leverage modern AI-assisted tools to accelerate frontend development and improve productivity.
            </p>

            <p>
              I am passionate about <span className="hl">designing scalable and production-ready systems</span>, continuously improving my problem-solving skills, and building software that delivers real-world impact.
            </p>

            <div className="about-tags">
              {["Java", "Spring Boot", "REST APIs", "Hibernate", "MySQL", "HTML", "CSS", "AI-assisted Dev", "Agile", "OOP"].map(t => (
                <span key={t} className="about-tag">{t}</span>
              ))}
            </div>
          </div>
          <div className="about-cards">
            {[
              { icon: "🚀", num: "4+", lbl: "Projects\nBuilt" },
              { icon: "🏢", num: "1", lbl: "Internship\nInfosys" },
              { icon: "📚", num: "10+", lbl: "Technologies\nUsed" },
              { icon: "🏅", num: "5+", lbl: "Certifications\nEarned" }
            ].map(c => (
              <div key={c.lbl} className="asc">
                <div className="asc-icon">{c.icon}</div>
                <div className="asc-num">{c.num}</div>
                <div className="asc-lbl" style={{ whiteSpace: "pre-line" }}>{c.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SkillsView() {
  const [tab, setTab] = useState("Languages");
  const [vis, setVis] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    setVis(false);
    const t = setTimeout(() => setVis(true), 60);
    return () => clearTimeout(t);
  }, [tab]);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: .2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div>
      {/* ── SKILLS ── */}
      <div className="sec-wrap skills-sec" ref={ref}>
        <div className="slabel">What I Know</div>
        <h2 className="stitle">My <span>Skills</span></h2>
        <p className="ssub">A curated toolkit honed through real-world projects, internships, and continuous learning.</p>
        <div className="skill-tabs">
          {Object.keys(skillsData).map(t => (
            <button key={t} className={`skill-tab${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
        <div className="skills-grid">
          {skillsData[tab].map((s, i) => (
            <div key={s.name} className="skill-card" style={{ animationDelay: `${i * .06}s`, animation: "fadeUp .5s both" }}>
              <span className="sk-icon">{s.icon}</span>
              <div className="sk-name">{s.name}</div>
              <div className="sk-bar"><div className="sk-fill" style={{ width: vis ? `${s.level}%` : "0%" }} /></div>
            </div>
          ))}
        </div>
      </div>

      {/* ── EXPERIENCE (merged below skills) ── */}
      <div className="sec-wrap exp-sec" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="slabel">My Journey</div>
        <h2 className="stitle">Work <span>Experience</span></h2>
        <p className="ssub">
          Hands-on experience through my internship at Infosys, contributing to backend development using Java, Spring Boot, and REST APIs, along with building responsive frontend interfaces using HTML and CSS.
        </p>
        <div className="timeline">
          {experiences.map((e, i) => (
            <div key={i} className="tl-item" style={{ animation: "fadeUp .6s both", animationDelay: `${i * .15}s` }}>
              <div className="tl-dot" />
              <div className="tl-card">
                <div className="tl-head">
                  <div className="tl-role">{e.role}</div>
                  <div className="tl-period">{e.period}</div>
                </div>
                <div className="tl-company">{e.company}</div>
                <div className="tl-desc">{e.desc}</div>
                <div className="tl-tags">{e.tags.map(t => <span key={t} className="tl-tag">{t}</span>)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectsView() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? projects : projects.filter(p => p.cat.toLowerCase().includes(filter.toLowerCase()));
  return (
    <div className="sec-wrap projects-sec">
      <div className="proj-head">
        <div>
          <div className="slabel">What I've Built</div>
          <h2 className="stitle">Featured <span>Projects</span></h2>
        </div>
        <div className="proj-filters">
          {filterCats.map(f => (
            <button key={f} className={`flt-btn${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>
      <div className="projects-grid">
        {filtered.map((p, i) => (
          <div key={p.name} className="project-card" style={{ animation: "fadeUp .5s both", animationDelay: `${i * .1}s` }}>
            <div className="proj-img">
              <div className="proj-img-in" style={{ background: p.bg }}>
                {p.img ? (
                  <img src={p.img} alt={p.name} className="proj-image" />
                ) : (
                  <span>{p.emoji}</span>
                )}

                <div className="proj-overlay">
                  {p.demo && (
                    <a href={p.demo} target="_blank" rel="noreferrer" className="ov-btn ov-live">
                      🔗 Live Demo
                    </a>
                  )}

                  <a href={p.link} target="_blank" rel="noreferrer" className="ov-btn ov-code">
                    ⌨️ Code
                  </a>
                </div>
              </div>
            </div>
            <div className="proj-body">
              <div className="proj-cat">{p.cat}</div>
              <div className="proj-name">{p.name}</div>
              <div className="proj-desc">{p.desc}</div>
              <div className="tech-stack">{p.tech.map(t => <span key={t.n} className="tech-badge"><span>{t.i}</span>{t.n}</span>)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EducationView() {
  return (
    <div className="sec-wrap edu-sec">
      <div className="slabel">Academic Background</div>
      <h2 className="stitle">My <span>Education</span></h2>
      <p className="ssub">
        Academic foundation in Computer Science and Engineering with focus on core concepts like Java, Data Structures, DBMS, and Object-Oriented Programming.
      </p>
      <div className="edu-grid">
        {education.map((e, i) => (
          <div key={i} className="edu-card" style={{ animation: "fadeUp .55s both", animationDelay: `${i * .12}s` }}>
            <div className="edu-top">
              <img src={e.logo} alt={e.school} className="edu-logo" />

            </div>
            <div className="edu-card-icon">{e.icon}</div>
            <div className="edu-degree">{e.degree}</div>
            <div className="edu-major">{e.major}</div>
            <div className="edu-school">{e.school}</div>
            <div className="edu-location">📍 {e.location}</div>
            <div className="edu-period">📅 {e.period}</div>
            <div className="edu-grade">
              <span style={{ fontSize: 13, color: "var(--text2)" }}>Grade / Score</span>
              <span className="edu-grade-val">{e.grade}</span>
            </div>
            <div className="edu-courses">
              <div className="edu-courses-title">Key Subjects</div>
              <div className="edu-course-tags">
                {e.courses.map(c => <span key={c} className="edu-course-tag">{c}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Certifications inside Education */}
      <div style={{ marginTop: 60 }}>
        <div className="slabel">Credentials</div>
        <h2 className="stitle">My <span>Certifications</span></h2>
        <p className="ssub" style={{ marginBottom: 0 }}>
          Industry-recognized certifications from Infosys Springboard and Lex, demonstrating strong foundations in Java, data structures, and database systems.
        </p>
        <div className="cert-grid">
          {certifications.map((c, i) => (
            <div key={i} className="cert-card" style={{ animation: "fadeUp .5s both", animationDelay: `${i * .1}s` }}>
              <div className="cert-icon">{c.icon}</div>
              <div>
                <img src={c.logo} alt={c.org} className="cert-logo" />
                <div className="cert-name">{c.name}</div>
                <div className="cert-org">{c.org}</div>
                <div className="cert-year">{c.year}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function ContactView() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const sub = e => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setSent(true);
      setLoading(false);
      setForm({ name: "", email: "", subject: "", message: "" });

      setTimeout(() => setSent(false), 5000);
    }, 1500);
  };

  return (
    <div className="sec-wrap contact-sec">
      <div className="slabel">Get In Touch</div>
      <h2 className="stitle">Let's <span>Connect</span></h2>

      <p className="ssub">
        Open to Software Developer roles, internships, and backend development opportunities. Let's build scalable and impactful solutions together.
      </p>

      {/* 🔥 Availability */}
      <p className="availability">🟢 Available for immediate opportunities</p>

      <div className="contact-grid">

        {/* LEFT SIDE */}
        <div className="ct-info">
          <h3>Say Hello 👋</h3>
          <p>
            I'm currently a Software Developer Intern at Infosys, specializing in backend development using Java and Spring Boot.
            I enjoy building scalable applications and  actively seeking opportunities where I can contribute to real-world software systems.
          </p>

          <div className="ct-links">
            {[
              { i: "🐙", l: "GitHub", v: "github.com/Vure-Maneesh", href: "https://github.com/Vure-Maneesh" },
              { i: "💼", l: "LinkedIn", v: "linkedin.com/in/vuremaneesh", href: "https://linkedin.com/in/vuremaneesh" },
              { i: "📧", l: "Email", v: "maneeshvure1301@gmail.com", href: "mailto:maneeshvure1301@gmail.com" },
              { i: "📱", l: "Phone", v: "+91 8374343597", href: "tel:+918374343597" },
              // { i: "💬", l: "WhatsApp", v: "Chat with me", href: "https://wa.me/918374343597" },
              { i: "📄", l: "Resume", v: "Download Resume", href: "https://drive.google.com/file/d/1Wsdon8lVg4QhTaanjVqTWffHaxKEkf1d/view?usp=sharing" }
            ].map(c => (
              <a key={c.l} href={c.href} target="_blank" rel="noreferrer" className="ct-link">
                <div className="ct-icon">{c.i}</div>
                <div>
                  <div style={{ fontWeight: 600 }}>{c.l}</div>
                  <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>{c.v}</div>
                </div>
              </a>
            ))}

            {/* 🔥 Location (non-clickable) */}
            <div className="ct-link">
              <div className="ct-icon">📍</div>
              <div>
                <div style={{ fontWeight: 600 }}>Location</div>
                <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>
                  Chinthapally, India
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="ct-form">
          <div className="form-title">Send a Message ✉️</div>

          {sent ? (
            <div className="form-ok">
              ✅ Message sent successfully! I'll get back to you within 24 hours.
            </div>
          ) : (
            <form onSubmit={sub}>
              <div className="frow">
                <div className="fg">
                  <label>Your Name</label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="fg">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="fg">
                <label>Subject</label>
                <select
                  required
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                >
                  <option value="">Select a topic...</option>
                  <option>🚀 Project Opportunity</option>
                  <option>💼 Job Opportunity</option>
                  <option>🤝 Collaboration</option>
                  <option>💡 General Inquiry</option>
                </select>
              </div>

              <div className="fg">
                <label>Message</label>
                <textarea
                  placeholder="Share details about the opportunity, project, or idea..."
                  required
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                />
              </div>

              <button type="submit" className="form-btn">
                {loading ? "Sending..." : "Send Message 🚀"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
function Footer({ navigate }) {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="footer-main">

        {/* Brand */}
        <div className="footer-brand">
          {/* <div className="f-logo">{"<VM />"}</div> */}

          <p className="f-tagline">
            Backend-focused Software Developer specializing in Java, Spring Boot, and REST API development.
            Passionate about building scalable systems and real-world applications.
          </p>

          {/* 🔥 Availability
          <div className="footer-availability">🟢 Available for immediate opportunities</div> */}

          <div className="f-social-row">
            {[
              { i: "🐙", h: "https://github.com/Vure-Maneesh" },
              { i: "💼", h: "https://linkedin.com/in/vuremaneesh" },
              { i: "📧", h: "mailto:maneeshvure1301@gmail.com" },
              { i: "📱", h: "tel:+918374343597" },
              { i: "💬", h: "https://wa.me/918374343597" },
              { i: "📄", h: "https://drive.google.com/file/d/1Wsdon8lVg4QhTaanjVqTWffHaxKEkf1d/view?usp=sharing.pdf" }
            ].map((s, idx) => (
              <a key={idx} href={s.h} target="_blank" rel="noreferrer" className="f-soc">
                {s.i}
              </a>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <div className="footer-col-title">Navigation</div>
          <div className="footer-links">
            {NAV_ITEMS.map(n => (
              <button
                key={n.id}
                className="footer-link"
                onClick={() => navigate(n.id)}
                style={{ background: "none", border: "none", textAlign: "left", padding: 0, font: "inherit" }}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <div className="footer-col-title">Tech Stack</div>
          <div className="footer-links">
            {[
              "Java · Spring Boot",
              "REST APIs · Hibernate",
              "MySQL · PostgreSQL",
              "HTML · CSS · JavaScript",
              "Git · GitHub",
              "OOP · SDLC"
            ].map(t => (
              <span key={t} className="footer-link" style={{ cursor: "default" }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <div className="footer-col-title">Contact</div>
          {[
            { icon: "📧", label: "Email", val: "maneeshvure1301@gmail.com" },
            { icon: "📱", label: "Phone", val: "+91 8374343597" },
            { icon: "📍", label: "Location", val: "Chinthapally, India" },
            { icon: "🏢", label: "Currently at", val: "Infosys (Software Developer Intern)" },
            { icon: "🎓", label: "Education", val: "B.Tech CSE · JNTUHUCER" }
          ].map(c => (
            <div key={c.label} className="footer-contact-item">
              <div className="fci-icon">{c.icon}</div>
              <div>
                <div className="fci-label">{c.label}</div>
                <div className="fci-val">{c.val}</div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <div className="footer-copy">
          © {year} Vure Maneesh · Built with React
        </div>

        <div className="footer-badges">
          {["Open to Work", "Java Developer", "Spring Boot", "Backend Developer"].map(b => (
            <span key={b} className="footer-badge">{b}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}
/* ─── MAIN ─── */
export default function Portfolio() {
  const prefersDark = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme:dark)").matches;
  const [dark, setDark] = useState(prefersDark);
  const [page, setPage] = useState("home");
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [grow, setGrow] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showResume, setShowResume] = useState(false);

  // CSS injection
  useEffect(() => {
    let el = document.getElementById("pf-style");
    if (!el) { el = document.createElement("style"); el.id = "pf-style"; document.head.appendChild(el); }
    el.textContent = getCSS(dark);
  }, [dark]);

  // System theme listener
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme:dark)");
    const h = e => setDark(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  // Scroll to top on page change
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [page]);

  // Nav scroll shadow
  useEffect(() => {
    const h = () => setNavScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Cursor
  useEffect(() => {
    const mv = e => setPos({ x: e.clientX, y: e.clientY });
    const ov = e => setGrow(!!e.target.closest("a,button,.skill-card,.project-card,.ct-link,.f-soc,.asc,.cert-card,.tl-card,.edu-card,.footer-link,.theme-toggle"));
    window.addEventListener("mousemove", mv);
    window.addEventListener("mouseover", ov);
    return () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseover", ov); };
  }, []);

  // Mobile outside close
  useEffect(() => {
    if (!mobileOpen) return;
    const c = e => { if (!e.target.closest("nav") && !e.target.closest(".mob-drawer")) setMobileOpen(false); };
    document.addEventListener("click", c);
    return () => document.removeEventListener("click", c);
  }, [mobileOpen]);

  const navigate = (id) => { setPage(id); setMobileOpen(false); };

  const renderSection = () => {
    switch (page) {
      case "home": return <div className="section-view"><HomeView navigate={navigate} dark={dark} /></div>;
      case "skills": return <div className="section-view"><SkillsView /></div>;
      case "projects": return <div className="section-view"><ProjectsView /></div>;
      case "education": return <div className="section-view"><EducationView /></div>;
      case "contact": return <div className="section-view"><ContactView /></div>;
      default: return <div className="section-view"><HomeView navigate={navigate} dark={dark} /></div>;
    }
  };

  return (
    <div className="page-shell">
      {showResume && <ResumeModal onClose={() => setShowResume(false)} />}
      <div className={`cursor${grow ? " grow" : ""}`} style={{ left: pos.x, top: pos.y }} />
      <div className="cursor-ring" style={{ left: pos.x, top: pos.y }} />

      {/* NAV */}
      <nav className={navScrolled ? "scrolled" : ""}>
        {/* <div className="nav-logo" onClick={() => navigate("home")}>{"<VM />"}</div> */}
        <ul className="nav-links">
          {NAV_ITEMS.map(n => (
            <li key={n.id}>
              <a href="#" className={page === n.id ? "active" : ""} onClick={e => { e.preventDefault(); navigate(n.id); }}>
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="nav-right">
          <button className="theme-toggle" onClick={() => setDark(d => !d)}>
            <div className="tt-knob">{dark ? "🌙" : "☀️"}</div>
          </button>
          <button className="nav-resume" onClick={() => setShowResume(true)}>
            📄 <span>Resume</span>
          </button>
          <button className={`hamburger${mobileOpen ? " open" : ""}`} onClick={() => setMobileOpen(o => !o)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <div className={`mob-drawer${mobileOpen ? " open" : ""}`}>
        {NAV_ITEMS.map(n => (
          <a key={n.id} href="#" className={page === n.id ? "active" : ""} onClick={e => { e.preventDefault(); navigate(n.id); }}>
            {n.label}
          </a>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <main style={{ paddingTop: 68, flex: 1, display: "flex", flexDirection: "column" }}>
        {renderSection()}
      </main>

      <Footer navigate={navigate} />
    </div>
  );
}
