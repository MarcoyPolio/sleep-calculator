/**
 * ============================================================
 * SEO METADATA — paste into your HTML <head> on deployment
 * ============================================================
 * Title:       Sleep Calculator – How Many Hours of Sleep Do I Need?
 * Description: Find your ideal bedtime, wake-up time, and sleep hours
 *              by age. Based on 90-minute sleep cycles and NSF guidelines.
 *              Free, instant, no sign-up.
 * Keywords:    sleep calculator, how many hours of sleep do I need,
 *              bedtime calculator, wake up calculator, sleep cycle calculator,
 *              how much sleep by age, what time should I go to bed,
 *              sleep hours calculator
 * ============================================================
 */

import { useState, useEffect } from "react";

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
`;

const css = `
  ${FONTS}

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html {
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
    scroll-behavior: smooth;
  }

  input, select, button {
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }

  select { -webkit-appearance: none; }

  :root {
    --night:    #07091a;
    --deep:     #0c1028;
    --surface:  rgba(255,255,255,0.04);
    --border:   rgba(255,255,255,0.08);
    --moon:     #c8d8f0;
    --moon-dim: #6b7fa0;
    --moon-mid: #8fa3c4;
    --star:     #a8c0e8;
    --accent:   #7b9cff;
    --accent-dim: rgba(123,156,255,0.15);
    --accent-border: rgba(123,156,255,0.28);
    --glow:     rgba(123,156,255,0.12);
    --green:    #5aaa78;
    --green-dim: rgba(90,170,120,0.12);
    --green-border: rgba(90,170,120,0.3);
    --warn:     #e8a84c;
    --warn-dim: rgba(232,168,76,0.12);
  }

  /* ── APP SHELL ── */
  .app {
    min-height: 100vh;
    background: var(--night);
    font-family: 'DM Sans', sans-serif;
    color: var(--moon);
    overflow-x: hidden;
    position: relative;
  }

  /* ── STARFIELD ── */
  .stars {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    overflow: hidden;
  }
  .star-dot {
    position: absolute;
    border-radius: 50%;
    background: #fff;
    animation: twinkle var(--dur, 3s) ease-in-out infinite var(--delay, 0s);
  }
  @keyframes twinkle {
    0%,100% { opacity: var(--lo, 0.1); transform: scale(1); }
    50%      { opacity: var(--hi, 0.7); transform: scale(1.3); }
  }

  /* Ambient glow */
  .glow-top {
    position: fixed; top: -15%; left: 50%; transform: translateX(-50%);
    width: 80%; height: 55%;
    background: radial-gradient(ellipse, rgba(60,80,180,0.12) 0%, transparent 65%);
    pointer-events: none; z-index: 0;
  }

  /* ── HEADER ── */
  .header {
    position: relative; z-index: 1;
    text-align: center;
    padding: 56px 24px 32px;
  }
  .moon-icon {
    font-size: 42px; margin-bottom: 16px;
    display: block;
    filter: drop-shadow(0 0 18px rgba(200,216,240,0.4));
    animation: moonFloat 6s ease-in-out infinite;
  }
  @keyframes moonFloat {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-6px); }
  }
  .eyebrow {
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.3em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 14px;
  }
  .site-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(30px, 6vw, 58px);
    font-weight: 500; color: var(--moon);
    letter-spacing: -0.01em; line-height: 1.1;
  }
  .site-title em { color: var(--accent); font-style: italic; }
  .site-sub {
    font-size: 13px; color: var(--moon-dim);
    margin-top: 10px; font-weight: 300; line-height: 1.7;
    max-width: 420px; margin-inline: auto;
  }
  .header-line {
    width: 40px; height: 1px; margin: 20px auto 0;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
  }

  /* ── NAV ── */
  .nav {
    position: relative; z-index: 1;
    display: flex; justify-content: center;
    gap: 8px; padding: 0 20px 40px;
    flex-wrap: wrap;
  }
  .nav-btn {
    padding: 11px 20px; border-radius: 100px;
    border: 1px solid var(--accent-border);
    background: transparent; color: var(--moon-dim);
    font-family: 'DM Sans', sans-serif; font-size: 13px;
    font-weight: 500; cursor: pointer; min-height: 44px;
    transition: all 0.25s; letter-spacing: 0.02em;
    display: flex; align-items: center; gap: 7px;
  }
  .nav-btn:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-dim); }
  .nav-btn.active {
    background: linear-gradient(135deg, #5a7de0, #7b9cff);
    border-color: transparent; color: #fff; font-weight: 600;
    box-shadow: 0 4px 22px rgba(123,156,255,0.35);
  }

  /* ── LAYOUT ── */
  .main {
    position: relative; z-index: 1;
    max-width: 680px; margin: 0 auto;
    padding: 0 20px 100px;
  }

  /* ── CARD ── */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 22px; padding: 34px;
    backdrop-filter: blur(24px);
    position: relative; overflow: hidden;
    animation: cardIn 0.4s cubic-bezier(0.16,1,0.3,1);
  }
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent-border), transparent);
  }
  .card-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px; font-weight: 500;
    color: var(--moon); margin-bottom: 4px;
  }
  .card-desc { font-size: 13px; color: var(--moon-dim); font-weight: 300; margin-bottom: 28px; }

  /* ── FORM ── */
  .field { margin-bottom: 18px; }
  .label {
    display: block; font-size: 10px; font-weight: 600;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--moon-dim); margin-bottom: 8px;
  }
  .input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border); border-radius: 11px;
    padding: 14px 16px; color: var(--moon);
    font-family: 'DM Sans', sans-serif;
    font-size: 16px; font-weight: 400;
    outline: none; transition: all 0.2s;
  }
  .input:focus {
    border-color: var(--accent-border);
    background: var(--accent-dim);
    box-shadow: 0 0 0 3px rgba(123,156,255,0.08);
  }
  .input::placeholder { color: #2a3050; }
  select.input {
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%237b9cff' d='M5 7L0 2h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 38px;
  }
  select.input option { background: #0c1028; color: var(--moon); }

  /* ── BUTTON ── */
  .btn {
    width: 100%; padding: 15px; border-radius: 12px; border: none;
    background: linear-gradient(135deg, #5a7de0, #7b9cff);
    color: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 600; letter-spacing: 0.05em;
    cursor: pointer; transition: all 0.25s; min-height: 50px;
  }
  .btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(123,156,255,0.4); }
  .btn:active { transform: translateY(0); }

  /* ── AGE GRID ── */
  .age-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 8px; margin-bottom: 26px;
  }
  .age-btn {
    padding: 12px 8px; border-radius: 11px;
    border: 1px solid var(--border);
    background: transparent; color: var(--moon-dim);
    font-family: 'DM Sans', sans-serif; font-size: 11px;
    font-weight: 500; cursor: pointer; text-align: center;
    line-height: 1.4; transition: all 0.2s; min-height: 52px;
  }
  .age-btn .age-range { font-size: 13px; font-weight: 600; display: block; color: var(--star); }
  .age-btn.active {
    border-color: var(--accent-border);
    background: var(--accent-dim); color: var(--accent);
  }
  .age-btn.active .age-range { color: var(--accent); }

  /* ── RESULTS ── */
  .result { margin-top: 24px; animation: fadeUp 0.35s ease; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Age result */
  .age-result-card {
    padding: 24px; border-radius: 16px;
    background: var(--accent-dim); border: 1px solid var(--accent-border);
    text-align: center; margin-bottom: 14px;
  }
  .rec-label { font-size: 10px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); margin-bottom: 8px; }
  .rec-hours {
    font-family: 'Playfair Display', serif;
    font-size: 52px; font-weight: 500; color: #c0d0ff; line-height: 1;
    margin-bottom: 4px;
  }
  .rec-hours span { font-size: 22px; opacity: 0.6; margin-left: 4px; }
  .rec-sub { font-size: 13px; color: var(--moon-dim); }

  .age-facts {
    display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
  }
  .fact-box {
    padding: 14px; border-radius: 12px;
    background: rgba(255,255,255,0.02); border: 1px solid var(--border);
  }
  .fact-icon { font-size: 18px; margin-bottom: 6px; display: block; }
  .fact-label { font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--moon-dim); margin-bottom: 4px; }
  .fact-val { font-size: 13px; color: var(--star); line-height: 1.5; }

  /* Cycle cards */
  .cycle-grid { display: grid; gap: 10px; }
  .cycle-card {
    padding: 16px 20px; border-radius: 14px;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    transition: border-color 0.2s;
  }
  .cycle-card:hover { border-color: var(--accent-border); }
  .cycle-card.best {
    background: var(--accent-dim); border-color: var(--accent-border);
  }
  .cycle-card.good {
    background: var(--green-dim); border-color: var(--green-border);
  }
  .cycle-left { display: flex; align-items: center; gap: 12px; }
  .cycle-icon { font-size: 20px; }
  .cycle-time {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 500; color: var(--moon);
  }
  .cycle-time small { font-family: 'DM Sans', sans-serif; font-size: 11px; color: var(--moon-dim); margin-left: 4px; font-style: normal; }
  .cycle-info { text-align: right; }
  .cycle-cycles { font-size: 12px; color: var(--moon-mid); }
  .cycle-tag {
    display: inline-block; font-size: 10px; font-weight: 600;
    padding: 2px 8px; border-radius: 20px; margin-top: 3px;
    letter-spacing: 0.08em; text-transform: uppercase;
  }
  .cycle-tag.best { background: var(--accent-dim); color: var(--accent); border: 1px solid var(--accent-border); }
  .cycle-tag.good { background: var(--green-dim); color: var(--green); border: 1px solid var(--green-border); }
  .cycle-tag.ok   { background: var(--warn-dim); color: var(--warn); border: 1px solid rgba(232,168,76,0.3); }

  .cycle-note {
    margin-top: 12px; padding: 12px 16px; border-radius: 10px;
    background: rgba(255,255,255,0.02); border: 1px solid var(--border);
    font-size: 12px; color: var(--moon-dim); line-height: 1.7;
  }
  .cycle-note strong { color: var(--star); font-weight: 500; }

  /* Debt result */
  .debt-card {
    padding: 24px; border-radius: 16px; text-align: center;
  }
  .debt-card.ok   { background: var(--green-dim); border: 1px solid var(--green-border); }
  .debt-card.mild { background: var(--warn-dim);  border: 1px solid rgba(232,168,76,0.3); }
  .debt-card.high { background: rgba(220,80,80,0.08); border: 1px solid rgba(220,80,80,0.25); }
  .debt-num {
    font-family: 'Playfair Display', serif;
    font-size: 50px; font-weight: 500; line-height: 1; margin-bottom: 6px;
  }
  .debt-card.ok   .debt-num { color: var(--green); }
  .debt-card.mild .debt-num { color: var(--warn); }
  .debt-card.high .debt-num { color: #e06060; }
  .debt-msg { font-size: 13px; color: var(--moon-mid); line-height: 1.6; margin-top: 8px; }

  /* ── CTA ── */
  .cta-card {
    margin-top: 36px; padding: 30px 28px; border-radius: 20px;
    background: linear-gradient(135deg, rgba(10,14,40,0.9), rgba(20,28,70,0.8));
    border: 1px solid rgba(123,156,255,0.2);
    position: relative; overflow: hidden;
    animation: cardIn 0.4s ease;
  }
  .cta-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(123,156,255,0.5), transparent);
  }
  .cta-glow {
    position: absolute; top: -30px; right: -30px;
    width: 160px; height: 160px;
    background: radial-gradient(circle, rgba(123,156,255,0.1), transparent 70%);
    pointer-events: none;
  }
  .cta-eyebrow {
    font-size: 9px; font-weight: 700; letter-spacing: 0.25em;
    text-transform: uppercase; color: var(--accent); margin-bottom: 10px;
  }
  .cta-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 500; color: var(--moon);
    line-height: 1.3; margin-bottom: 10px;
  }
  .cta-title em { color: #a0b8ff; font-style: italic; }
  .cta-desc {
    font-size: 13px; color: var(--moon-dim); line-height: 1.7;
    margin-bottom: 20px; font-weight: 300;
  }
  .cta-bullets { margin-bottom: 22px; display: flex; flex-direction: column; gap: 7px; }
  .cta-bullet {
    display: flex; align-items: flex-start; gap: 8px;
    font-size: 13px; color: var(--moon-mid);
  }
  .cta-bullet .bullet-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--accent); margin-top: 6px; flex-shrink: 0;
  }
  .cta-btn {
    display: block; width: 100%; padding: 15px 20px;
    border-radius: 12px; border: none; text-decoration: none;
    background: linear-gradient(135deg, #5a7de0, #7b9cff);
    color: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 600; letter-spacing: 0.04em;
    cursor: pointer; transition: all 0.25s; text-align: center;
    min-height: 50px; display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(123,156,255,0.4); }
  .cta-price {
    text-align: center; margin-top: 10px;
    font-size: 12px; color: var(--moon-dim);
  }
  .cta-price strong { color: var(--moon-mid); }

  /* ── FAQ ── */
  .faq-wrap {
    margin-top: 44px;
    padding-top: 36px;
    border-top: 1px solid rgba(255,255,255,0.05);
  }
  .faq-head {
    display: flex; align-items: center; gap: 10px; margin-bottom: 20px;
  }
  .faq-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 500; color: var(--moon);
  }
  .seo-pill {
    font-size: 9px; font-weight: 700; letter-spacing: 0.15em;
    text-transform: uppercase; padding: 3px 8px; border-radius: 5px;
    background: var(--accent-dim); border: 1px solid var(--accent-border);
    color: var(--accent);
  }
  .faq-item {
    border: 1px solid var(--border); border-radius: 12px;
    overflow: hidden; margin-bottom: 8px; transition: border-color 0.2s;
  }
  .faq-item.open { border-color: var(--accent-border); }
  .faq-q {
    width: 100%; padding: 15px 18px; min-height: 52px;
    background: transparent; border: none; cursor: pointer;
    text-align: left; font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 500; color: var(--moon);
    display: flex; justify-content: space-between; align-items: center; gap: 12px;
    transition: background 0.2s;
  }
  .faq-q:hover { background: rgba(255,255,255,0.02); }
  .faq-item.open .faq-q { color: var(--accent); }
  .faq-chevron { font-size: 11px; color: var(--moon-dim); transition: transform 0.25s; flex-shrink: 0; }
  .faq-item.open .faq-chevron { transform: rotate(180deg); color: var(--accent); }
  .faq-a {
    padding: 0 18px; max-height: 0; overflow: hidden;
    transition: max-height 0.3s ease, padding 0.3s ease;
    font-size: 13px; color: var(--moon-dim); font-weight: 300; line-height: 1.8;
  }
  .faq-item.open .faq-a { max-height: 300px; padding: 0 18px 16px; }

  /* ── CROSS-LINKS ── */
  .crosslinks {
    margin-top: 36px; padding: 28px; border-radius: 20px;
    background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07);
  }
  .crosslinks-label {
    font-size: 10px; font-weight: 600; letter-spacing: 0.25em;
    text-transform: uppercase; color: var(--moon-dim);
    margin-bottom: 16px; text-align: center;
  }
  .crosslinks-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .crosslink-card {
    padding: 18px; border-radius: 14px; text-decoration: none;
    border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.02);
    transition: all 0.25s; display: block;
  }
  .crosslink-card:hover { transform: translateY(-2px); border-color: var(--accent-border); background: var(--accent-dim); }
  .crosslink-icon { font-size: 22px; margin-bottom: 8px; display: block; }
  .crosslink-title { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 500; color: var(--moon); margin-bottom: 4px; }
  .crosslink-desc { font-size: 12px; color: var(--moon-dim); line-height: 1.5; font-weight: 300; }
  @media (max-width: 480px) { .crosslinks-grid { grid-template-columns: 1fr; } }

  /* ── FOOTER ── */
  .footer {
    position: relative; z-index: 1;
    text-align: center; padding: 28px 20px 40px;
    font-size: 11px; color: #1e2240;
    letter-spacing: 0.1em; text-transform: uppercase;
  }

  /* ── EMAIL CAPTURE ── */
  .sleep-ec {
    margin-top: 36px; padding: 30px 28px; border-radius: 20px;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--accent-border);
    position: relative; overflow: hidden;
  }
  .sleep-ec::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent-border), transparent);
  }
  .sleep-ec-glow {
    position: absolute; bottom: -50px; left: -50px;
    width: 200px; height: 200px; border-radius: 50%;
    background: radial-gradient(circle, rgba(123,156,255,0.06), transparent 70%);
    pointer-events: none;
  }
  .sleep-ec-eyebrow {
    font-size: 10px; font-weight: 600; letter-spacing: 0.28em;
    text-transform: uppercase; color: var(--accent); margin-bottom: 10px;
  }
  .sleep-ec-title {
    font-family: 'Playfair Display', serif;
    font-size: 24px; font-weight: 500; color: var(--moon);
    line-height: 1.2; margin-bottom: 8px;
  }
  .sleep-ec-title em { color: var(--accent); font-style: italic; }
  .sleep-ec-sub { font-size: 13px; color: var(--moon-dim); line-height: 1.7; margin-bottom: 18px; }
  .sleep-ec-bullets { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
  .sleep-ec-bullet { display: flex; align-items: flex-start; gap: 9px; font-size: 13px; color: var(--moon-mid); }
  .sleep-ec-check {
    width: 17px; height: 17px; border-radius: 50%;
    background: rgba(123,156,255,0.12); border: 1px solid var(--accent-border);
    display: flex; align-items: center; justify-content: center;
    font-size: 9px; font-weight: 700; color: var(--accent);
    flex-shrink: 0; margin-top: 1px;
  }
  .sleep-ec-form { display: flex; gap: 8px; margin-bottom: 10px; }
  .sleep-ec-input {
    flex: 1; background: rgba(255,255,255,0.04);
    border: 1px solid var(--border); border-radius: 11px;
    padding: 13px 16px; color: var(--moon);
    font-family: 'DM Sans', sans-serif; font-size: 15px;
    outline: none; transition: all 0.2s; min-height: 48px;
  }
  .sleep-ec-input:focus {
    border-color: var(--accent-border);
    background: rgba(123,156,255,0.05);
  }
  .sleep-ec-input::placeholder { color: #2a3050; }
  .sleep-ec-btn {
    padding: 13px 20px; border-radius: 11px; border: none;
    background: linear-gradient(135deg, #5a7de0, var(--accent));
    color: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 600; cursor: pointer;
    transition: all 0.2s; min-height: 48px; white-space: nowrap;
  }
  .sleep-ec-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(123,156,255,0.3); }
  .sleep-ec-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .sleep-ec-lead { font-size: 11px; color: var(--accent); font-weight: 500; margin-bottom: 8px; }
  .sleep-ec-privacy { font-size: 11px; color: #1e2240; margin-top: 6px; }
  .sleep-ec-success {
    padding: 24px; border-radius: 14px; text-align: center;
    background: rgba(90,170,120,0.08); border: 1px solid var(--green-border);
    animation: fadeUp 0.3s ease;
  }
  .sleep-ec-success-icon { font-size: 36px; margin-bottom: 10px; display: block; }
  .sleep-ec-success-text { font-family: 'Playfair Display', serif; font-size: 20px; color: var(--green); margin-bottom: 4px; }
  .sleep-ec-success-sub { font-size: 13px; color: var(--moon-dim); }
  .sleep-ec-err { font-size: 12px; color: #e06060; margin-top: 8px; }
  @media (max-width: 480px) {
    .sleep-ec { padding: 22px 18px; }
    .sleep-ec-form { flex-direction: column; }
    .sleep-ec-btn { width: 100%; }
    .sleep-ec-input { font-size: 16px; }
  }

  /* ══════════════════════════════════
     MOBILE — 480px and below
     ══════════════════════════════════ */
  @media (max-width: 480px) {
    .header { padding: 36px 18px 22px; }
    .moon-icon { font-size: 34px; }
    .nav { gap: 6px; padding: 0 14px 28px; }
    .nav-btn { flex: 1; justify-content: center; padding: 11px 8px; font-size: 12px; }
    .main { padding: 0 14px 80px; }
    .card { padding: 22px 18px; border-radius: 16px; }
    .card-title { font-size: 21px; }
    .age-grid { grid-template-columns: repeat(3, 1fr); gap: 6px; }
    .age-btn { padding: 10px 4px; font-size: 10px; min-height: 54px; }
    .age-btn .age-range { font-size: 12px; }
    .rec-hours { font-size: 42px; }
    .age-facts { grid-template-columns: 1fr 1fr; gap: 8px; }
    .cycle-card { flex-direction: column; align-items: flex-start; gap: 8px; }
    .cycle-info { text-align: left; }
    .cta-card { padding: 24px 18px; }
    .cta-title { font-size: 19px; }
    .faq-q { font-size: 13px; }
    .faq-title { font-size: 19px; }
    .debt-num { font-size: 42px; }
  }
`;

/* ── DATA ──────────────────────────────────────────── */
const AGE_GROUPS = [
  { label:"Newborn",   range:"0–3 mo",  min:14, max:17, ideal:16, note:"Newborns sleep in short bursts throughout the day." },
  { label:"Infant",    range:"4–11 mo", min:12, max:15, ideal:14, note:"Naps + night sleep. Consistent routine helps." },
  { label:"Toddler",   range:"1–2 yrs", min:11, max:14, ideal:12, note:"One daytime nap is still normal at this age." },
  { label:"Preschool", range:"3–5 yrs", min:10, max:13, ideal:11, note:"Naps may be dropping off. Bedtime routine is key." },
  { label:"School",    range:"6–13 yrs",min:9,  max:11, ideal:10, note:"Consistent sleep supports memory and learning." },
  { label:"Teen",      range:"14–17",   min:8,  max:10, ideal:9,  note:"Most teens are chronically sleep-deprived." },
  { label:"Adult",     range:"18–64",   min:7,  max:9,  ideal:8,  note:"7–9 hours is optimal for cognitive performance." },
  { label:"Senior",    range:"65+",     min:7,  max:8,  ideal:7,  note:"Sleep becomes lighter and more fragmented with age." },
];

// 90-min cycles + 14 min to fall asleep
const FALL_ASLEEP = 14;
const CYCLE_MIN   = 90;

function addMinutes(baseMinutes, add) {
  return ((baseMinutes + add) % 1440 + 1440) % 1440;
}
function subMinutes(baseMinutes, sub) {
  return ((baseMinutes - sub) % 1440 + 1440) % 1440;
}
function timeToMin(h, m, ampm) {
  let hr = parseInt(h);
  if (ampm === "PM" && hr !== 12) hr += 12;
  if (ampm === "AM" && hr === 12) hr = 0;
  return hr * 60 + parseInt(m);
}
function minToTime(m) {
  const h = Math.floor(m / 60) % 24;
  const min = m % 60;
  const ampm = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(min).padStart(2,"0")} ${ampm}`;
}

const CYCLE_META = [
  { cycles:1, tag:"ok",   icon:"😴" },
  { cycles:2, tag:"ok",   icon:"😐" },
  { cycles:3, tag:"ok",   icon:"🙂" },
  { cycles:4, tag:"good", icon:"😊" },
  { cycles:5, tag:"best", icon:"🌟" },
  { cycles:6, tag:"best", icon:"✨" },
];

/* ── FAQ ── */
const FAQ_ITEMS = [
  { q:"How many hours of sleep do I need?", a:"Adults generally need 7–9 hours per night according to the National Sleep Foundation. Teens need 8–10 hours, school-age children 9–11 hours, and older adults 7–8 hours. Individual needs vary — some people function well on 7 hours while others need a full 9. Use the By Age tab above to see your specific recommendation." },
  { q:"What is a sleep cycle and why does it matter?", a:"A sleep cycle is approximately 90 minutes long and consists of 4–5 stages including light sleep, deep sleep, and REM (rapid eye movement) sleep. Waking up at the end of a complete cycle — rather than in the middle of deep sleep — is why you feel refreshed on some mornings and groggy on others. Our calculator times your wake-up or bedtime to land at the end of a cycle." },
  { q:"What time should I go to bed if I wake up at 6 AM?", a:"If you need to wake up at 6:00 AM, your ideal bedtimes (accounting for 14 minutes to fall asleep) are: 8:46 PM (6 cycles), 10:16 PM (5 cycles), 11:46 PM (4 cycles), or 1:16 AM (3 cycles). Five or six complete cycles — roughly 7.5 to 9 hours — are ideal for most adults." },
  { q:"Is it better to sleep 7.5 hours or 8 hours?", a:"7.5 hours (5 complete 90-minute cycles) is often better than 8 hours of broken sleep. Waking mid-cycle triggers sleep inertia — the groggy, disoriented feeling that can last 30–60 minutes. If your schedule allows, aim for 6 cycles (9 hours) or 5 cycles (7.5 hours) for the most restorative sleep." },
  { q:"What is sleep debt and can I recover from it?", a:"Sleep debt is the cumulative difference between the sleep you need and the sleep you get. A 2017 study found that chronic short sleep (under 6 hours) impairs performance even after recovery nights. You can partially recover from short-term sleep debt with a few longer nights, but the best approach is consistent, adequate sleep every night." },
  { q:"Why do I still feel tired after 8 hours of sleep?", a:"Feeling tired after 8 hours often means you woke up mid-cycle (in deep sleep), your sleep quality is poor due to interruptions or sleep disorders like apnea, or you're carrying accumulated sleep debt from previous nights. Our Bedtime Calculator helps you time sleep so you wake at a natural cycle endpoint — which dramatically reduces morning grogginess." },
  { q:"Does sleep affect weight loss and metabolism?", a:"Yes — significantly. Sleep deprivation increases ghrelin (the hunger hormone) and decreases leptin (the satiety hormone), leading to increased appetite of up to 24% more calories per day. Poor sleep also reduces insulin sensitivity and impairs fat metabolism. Consistent 7–9 hour sleep supports both weight management and overall metabolic health." },
  { q:"What is the best sleep schedule for health?", a:"The best sleep schedule is consistent: same bedtime and wake time every day, even on weekends. Your circadian rhythm — the internal 24-hour clock — works best with regularity. Irregular sleep timing is linked to higher rates of obesity, depression, and cardiovascular disease, independent of total sleep duration." },
];

/* ── EMAIL CAPTURE ── */
const SLEEP_FORM_ACTION = "https://formspree.io/f/mykllzge";

function SleepEmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    try {
      const res = await fetch(SLEEP_FORM_ACTION, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, source: "sleep-calculator" }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch { setStatus("error"); }
  }

  return (
    <div className="sleep-ec">
      <div className="sleep-ec-glow" />
      {status === "success" ? (
        <div className="sleep-ec-success">
          <span className="sleep-ec-success-icon">✅</span>
          <div className="sleep-ec-success-text">You're in! Sleep tight.</div>
          <div className="sleep-ec-success-sub">Check your inbox for the 7-Night Quick-Start Guide. 🌙</div>
        </div>
      ) : (
        <>
          <div className="sleep-ec-eyebrow">🌙 Free Weekly Newsletter</div>
          <div className="sleep-ec-title">
            Sleep better, <em>starting tonight.</em>
          </div>
          <div className="sleep-ec-sub">
            Evidence-based sleep tips, recovery science, and habits that actually stick — delivered weekly, free.
          </div>
          <div className="sleep-ec-bullets">
            {[
              "Science-backed sleep hacks you can use tonight",
              "The sleep habits most people get completely wrong",
              "Exclusive discounts on health tools & guides",
            ].map((b, i) => (
              <div className="sleep-ec-bullet" key={i}>
                <span className="sleep-ec-check">✓</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
          <form className="sleep-ec-form" onSubmit={handleSubmit}>
            <input
              className="sleep-ec-input"
              type="email"
              placeholder="Your email address…"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button className="sleep-ec-btn" type="submit" disabled={status === "loading"}>
              {status === "loading" ? "…" : "Join →"}
            </button>
          </form>
          <div className="sleep-ec-lead">+ Free 7-Night Quick-Start Guide included</div>
          {status === "error" && <div className="sleep-ec-err">Something went wrong. Please try again.</div>}
          <div className="sleep-ec-privacy">🔒 No spam, ever. Unsubscribe anytime.</div>
        </>
      )}
    </div>
  );
}

/* ── FAQ COMPONENT ── */
function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <div className="faq-wrap">
      <div className="faq-head">
        <div className="faq-title">Common Questions</div>
        <div className="seo-pill">SEO</div>
      </div>
      {FAQ_ITEMS.map((item, i) => (
        <div key={i} className={`faq-item${open===i?" open":""}`}>
          <button className="faq-q" onClick={()=>setOpen(open===i?null:i)}>
            <span>{item.q}</span>
            <span className="faq-chevron">▼</span>
          </button>
          <div className="faq-a">{item.a}</div>
        </div>
      ))}
    </div>
  );
}

/* ── SOFT CTA ── */
function CrossLinks() {
  return (
    <div className="crosslinks">
      <div className="crosslinks-label">More Free Health Tools</div>
      <div className="crosslinks-grid">
        <a className="crosslink-card" href="https://calorie-calculator-two-gold.vercel.app" target="_blank" rel="noopener noreferrer">
          <span className="crosslink-icon">🔥</span>
          <div className="crosslink-title">Calorie Deficit Calculator</div>
          <div className="crosslink-desc">Find your daily calorie target, TDEE, macros, and weight loss timeline.</div>
        </a>
        <a className="crosslink-card" href="https://bmi-calculator-kcfpnqy5m-marcoypolios-projects.vercel.app" target="_blank" rel="noopener noreferrer">
          <span className="crosslink-icon">📊</span>
          <div className="crosslink-title">BMI & Body Fat Calculator</div>
          <div className="crosslink-desc">Calculate your BMI, body fat percentage, and ideal weight range.</div>
        </a>
      </div>
    </div>
  );
}

function GumroadCTA() {
  return (
    <div className="cta-card">
      <div className="cta-glow" />
      <div className="cta-eyebrow">✦ Free Tool → Full System</div>
      <div className="cta-title">
        Ready to <em>actually fix</em> your sleep?
      </div>
      <div className="cta-desc">
        This calculator tells you <em>when</em> to sleep. The Better Sleep Guide shows you <em>how</em> — with a proven 14-night plan designed for burnt-out adults who've tried everything.
      </div>
      <div className="cta-bullets">
        {[
          "14-night step-by-step reset protocol",
          "Evening wind-down routines that work",
          "The sleep environment checklist",
          "How to fix your circadian rhythm in 7 days",
          "What to do when your mind won't shut off",
        ].map((b,i) => (
          <div className="cta-bullet" key={i}>
            <span className="bullet-dot" />
            <span>{b}</span>
          </div>
        ))}
      </div>
      <a
        className="cta-btn"
        href="https://mark203j.gumroad.com/l/vratf"
        target="_blank"
        rel="noopener noreferrer"
      >
        🌙 Get the Better Sleep Guide — $19
      </a>
      <div className="cta-price">
        <strong>One-time purchase.</strong> Instant download. No subscription.
      </div>
    </div>
  );
}

/* ── BY AGE TAB ── */
function ByAge() {
  const [sel, setSel] = useState(6); // default: Adult
  const [shown, setShown] = useState(false);
  const g = AGE_GROUPS[sel];

  function show() { setShown(true); }

  return (
    <div className="card">
      <div className="card-title">Sleep by Age</div>
      <div className="card-desc">NSF-recommended hours for every life stage</div>

      <div className="age-grid">
        {AGE_GROUPS.map((g,i) => (
          <button key={i} className={`age-btn${sel===i?" active":""}`} onClick={()=>{ setSel(i); setShown(false); }}>
            <span className="age-range">{g.range}</span>
            {g.label}
          </button>
        ))}
      </div>

      <button className="btn" onClick={show}>See My Recommendation →</button>

      {shown && (
        <div className="result">
          <div className="age-result-card">
            <div className="rec-label">{g.label} · {g.range}</div>
            <div className="rec-hours">{g.min}–{g.max}<span>hrs</span></div>
            <div className="rec-sub">Ideal target: {g.ideal} hours per night</div>
          </div>
          <div className="age-facts">
            <div className="fact-box">
              <span className="fact-icon">🎯</span>
              <div className="fact-label">Minimum</div>
              <div className="fact-val">{g.min} hours/night for basic function</div>
            </div>
            <div className="fact-box">
              <span className="fact-icon">✨</span>
              <div className="fact-label">Optimal</div>
              <div className="fact-val">{g.ideal} hours for peak performance</div>
            </div>
            <div className="fact-box" style={{gridColumn:"1 / -1"}}>
              <span className="fact-icon">💡</span>
              <div className="fact-label">Know This</div>
              <div className="fact-val">{g.note}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── BEDTIME TAB ── */
function BedtimeCalc() {
  const hours   = Array.from({length:12},(_,i)=> String(i+1));
  const minutes = ["00","05","10","15","20","25","30","35","40","45","50","55"];
  const [wh, setWh] = useState("6");
  const [wm, setWm] = useState("00");
  const [wap,setWap]= useState("AM");
  const [times, setTimes] = useState(null);

  function calculate() {
    const wakeMin = timeToMin(wh, wm, wap);
    const results = CYCLE_META.map(({cycles,tag,icon}) => {
      const sleepMin = subMinutes(wakeMin, cycles * CYCLE_MIN + FALL_ASLEEP);
      return { time: minToTime(sleepMin), cycles, hrs:(cycles*1.5).toFixed(1), tag, icon };
    }).reverse(); // 6 → 1 cycles
    setTimes(results);
  }

  return (
    <div className="card">
      <div className="card-title">Bedtime Calculator</div>
      <div className="card-desc">Enter your wake-up time → get the best bedtimes based on 90-min sleep cycles</div>

      <div className="field">
        <label className="label">I need to wake up at</label>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10}}>
          <select className="input" value={wh} onChange={e=>setWh(e.target.value)}>
            {hours.map(h=><option key={h}>{h}</option>)}
          </select>
          <select className="input" value={wm} onChange={e=>setWm(e.target.value)}>
            {minutes.map(m=><option key={m}>{m}</option>)}
          </select>
          <select className="input" value={wap} onChange={e=>setWap(e.target.value)}>
            <option>AM</option><option>PM</option>
          </select>
        </div>
      </div>

      <button className="btn" onClick={calculate}>Calculate Bedtimes →</button>

      {times && (
        <div className="result">
          <div className="cycle-grid">
            {times.map((t,i)=>(
              <div key={i} className={`cycle-card ${t.tag}`}>
                <div className="cycle-left">
                  <span className="cycle-icon">{t.icon}</span>
                  <div>
                    <div className="cycle-time">
                      {t.time}
                    </div>
                    <div className="cycle-cycles">{t.cycles} cycles · {t.hrs} hours of sleep</div>
                  </div>
                </div>
                <div className="cycle-info">
                  <span className={`cycle-tag ${t.tag}`}>
                    {t.tag==="best"?"Best":t.tag==="good"?"Good":"OK"}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="cycle-note">
            <strong>Note:</strong> These times assume you fall asleep in ~14 minutes. If you fall asleep faster or slower, adjust accordingly. Waking at the <em>end of a sleep cycle</em> is what makes the difference between feeling rested and feeling groggy.
          </div>
        </div>
      )}
    </div>
  );
}

/* ── WAKE-UP TAB ── */
function WakeCalc() {
  const hours   = Array.from({length:12},(_,i)=>String(i+1));
  const minutes = ["00","05","10","15","20","25","30","35","40","45","50","55"];
  const [bh, setBh] = useState("10");
  const [bm, setBm] = useState("00");
  const [bap,setBap]= useState("PM");
  const [times, setTimes] = useState(null);

  function calculate() {
    const bedMin = timeToMin(bh, bm, bap);
    const results = CYCLE_META.map(({cycles,tag,icon}) => {
      const wakeMin = addMinutes(bedMin, cycles * CYCLE_MIN + FALL_ASLEEP);
      return { time: minToTime(wakeMin), cycles, hrs:(cycles*1.5).toFixed(1), tag, icon };
    });
    setTimes(results);
  }

  return (
    <div className="card">
      <div className="card-title">Wake-up Calculator</div>
      <div className="card-desc">Enter your bedtime → find the best times to wake up refreshed</div>

      <div className="field">
        <label className="label">I'm going to bed at</label>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10}}>
          <select className="input" value={bh} onChange={e=>setBh(e.target.value)}>
            {hours.map(h=><option key={h}>{h}</option>)}
          </select>
          <select className="input" value={bm} onChange={e=>setBm(e.target.value)}>
            {minutes.map(m=><option key={m}>{m}</option>)}
          </select>
          <select className="input" value={bap} onChange={e=>setBap(e.target.value)}>
            <option>AM</option><option>PM</option>
          </select>
        </div>
      </div>

      <button className="btn" onClick={calculate}>Calculate Wake Times →</button>

      {times && (
        <div className="result">
          <div className="cycle-grid">
            {times.map((t,i)=>(
              <div key={i} className={`cycle-card ${t.tag}`}>
                <div className="cycle-left">
                  <span className="cycle-icon">{t.icon}</span>
                  <div>
                    <div className="cycle-time">{t.time}</div>
                    <div className="cycle-cycles">{t.cycles} cycles · {t.hrs} hours of sleep</div>
                  </div>
                </div>
                <div className="cycle-info">
                  <span className={`cycle-tag ${t.tag}`}>
                    {t.tag==="best"?"Best":t.tag==="good"?"Good":"OK"}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="cycle-note">
            <strong>Tip:</strong> The <em>Best</em> wake times (5–6 cycles) give you 7.5–9 hours — the sweet spot for most adults. If you need fewer hours, aim for 4 complete cycles (6 hours) rather than 6.5 or 7, which land mid-cycle.
          </div>
        </div>
      )}
    </div>
  );
}

/* ── SLEEP DEBT TAB ── */
function SleepDebt() {
  const [needed, setNeeded] = useState("8");
  const [days,   setDays  ] = useState(
    Array.from({length:7},()=>"")
  );
  const [result, setResult] = useState(null);

  const DAY_LABELS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  function calculate() {
    const n = parseFloat(needed);
    if(isNaN(n)) return;
    const actuals = days.map(d=>parseFloat(d)||0);
    const debt = actuals.reduce((acc,d)=> acc + Math.max(0, n-d), 0);
    const avg  = actuals.reduce((a,b)=>a+b,0) / actuals.filter(Boolean).length || 0;
    const level = debt === 0 ? "ok" : debt <= 5 ? "mild" : "high";
    const msgs = {
      ok:   "You're fully caught up. Your sleep bank is healthy — keep the consistency going.",
      mild: `You're ${debt.toFixed(1)} hours behind this week. A few early nights will clear this. Avoid sleeping in excessively — it disrupts your rhythm.`,
      high: `You're ${debt.toFixed(1)} hours in sleep debt this week — this is significant. Prioritize sleep this weekend and aim to add 1–2 extra hours per night until recovered.`,
    };
    setResult({ debt: debt.toFixed(1), avg: avg.toFixed(1), level, msg: msgs[level] });
  }

  return (
    <div className="card">
      <div className="card-title">Sleep Debt Tracker</div>
      <div className="card-desc">How many hours behind are you this week?</div>

      <div className="field">
        <label className="label">Hours I need per night</label>
        <select className="input" value={needed} onChange={e=>setNeeded(e.target.value)}>
          {["6","6.5","7","7.5","8","8.5","9","9.5","10"].map(v=><option key={v}>{v}</option>)}
        </select>
      </div>

      <div className="field">
        <label className="label">Hours I actually slept each day</label>
        <div style={{display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:6}}>
          {DAY_LABELS.map((d,i)=>(
            <div key={i} style={{textAlign:"center"}}>
              <div style={{fontSize:10,color:"var(--moon-dim)",marginBottom:5,fontWeight:600}}>{d}</div>
              <input
                className="input"
                type="number"
                min="0" max="14" step="0.5"
                placeholder="—"
                value={days[i]}
                style={{padding:"12px 6px", textAlign:"center", fontSize:14}}
                onChange={e=>{
                  const nd=[...days]; nd[i]=e.target.value; setDays(nd);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <button className="btn" onClick={calculate}>Calculate Sleep Debt →</button>

      {result && (
        <div className="result">
          <div className={`debt-card ${result.level}`}>
            <div className="rec-label">Weekly Sleep Debt</div>
            <div className="debt-num">{result.debt}<span style={{fontSize:22,opacity:0.6,marginLeft:4}}>hrs</span></div>
            <div className="rec-sub">Weekly average: {result.avg} hrs/night</div>
            <div className="debt-msg">{result.msg}</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── STARFIELD ── */
function Stars() {
  const dots = Array.from({length:55},(_,i)=>({
    left: `${Math.random()*100}%`,
    top:  `${Math.random()*100}%`,
    size: Math.random()*1.8+0.5,
    dur:  `${2+Math.random()*4}s`,
    delay:`${Math.random()*4}s`,
    lo:   0.05+Math.random()*0.1,
    hi:   0.4+Math.random()*0.5,
  }));
  return (
    <div className="stars">
      {dots.map((d,i)=>(
        <div key={i} className="star-dot" style={{
          left:d.left, top:d.top,
          width:d.size, height:d.size,
          "--dur":d.dur, "--delay":d.delay,
          "--lo":d.lo,   "--hi":d.hi,
        }}/>
      ))}
    </div>
  );
}

/* ── APP ── */
const TABS = [
  { id:"age",   icon:"👤", label:"By Age"   },
  { id:"bed",   icon:"🌙", label:"Bedtime"  },
  { id:"wake",  icon:"⏰", label:"Wake Up"  },
  { id:"debt",  icon:"📊", label:"Sleep Debt"},
];

export default function App() {
  const [tab, setTab] = useState("age");

  useEffect(()=>{
    const metas = [
      { name:"viewport",                        content:"width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" },
      { name:"apple-mobile-web-app-capable",    content:"yes" },
      { name:"apple-mobile-web-app-status-bar-style", content:"black-translucent" },
      { name:"apple-mobile-web-app-title",      content:"Sleep Calculator" },
      { name:"theme-color",                     content:"#07091a" },
      { name:"description",                     content:"Free sleep calculator: find your ideal bedtime, wake-up time, and recommended hours of sleep by age. Based on 90-minute sleep cycles." },
    ];
    metas.forEach(({name,content})=>{
      if(!document.querySelector(`meta[name="${name}"]`)){
        const el=document.createElement("meta");
        el.name=name; el.content=content;
        document.head.appendChild(el);
      }
    });
    document.title="Sleep Calculator – How Many Hours Do I Need?";
  },[]);

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <Stars />
        <div className="glow-top" />

        <header className="header">
          <span className="moon-icon">🌙</span>
          <div className="eyebrow">Free Sleep Tool · Science-Backed</div>
          <h1 className="site-title">Sleep <em>Hours</em> Calculator</h1>
          <p className="site-sub">Find your ideal bedtime, wake-up time, and how many hours you need — based on 90-minute sleep cycles.</p>
          <div className="header-line" />
        </header>

        <nav className="nav">
          {TABS.map(t=>(
            <button key={t.id}
              className={`nav-btn${tab===t.id?" active":""}`}
              onClick={()=>setTab(t.id)}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </nav>

        <main className="main">
          {tab==="age"  && <ByAge />}
          {tab==="bed"  && <BedtimeCalc />}
          {tab==="wake" && <WakeCalc />}
          {tab==="debt" && <SleepDebt />}

          <GumroadCTA />
          <SleepEmailCapture />
          <CrossLinks />
          <FAQ />
        </main>

        <footer className="footer">
          Sleep Calculator · Free Forever · No Sign-up Required
        </footer>
      </div>
    </>
  );
}
