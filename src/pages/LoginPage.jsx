import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLanguage } from "../lib/i18n.jsx";

export default function LoginPage() {
  const { t, lang, toggleLang } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError(t("login_error"));
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profile?.role === "owner" || profile?.role === "admin") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/client";
    }
  }

  return (
    <div className="lr-page">
      <style>{css}</style>
      <ParticleField />

      <button className="lr-lang-toggle" onClick={toggleLang} type="button">
        {lang === "ar" ? "EN" : "AR"}
      </button>

      <div className="lr-layout">
        {/* ===== Showcase panel ===== */}
        <div className="lr-showcase">
          <div className="lr-brand-row">
            <RadarLogo size={40} />
            <div>
              <div className="lr-brand-name">
                loss<span className="lr-accent">radar</span>
              </div>
              <div className="lr-brand-sub">{t("login_subtitle")}</div>
            </div>
          </div>

          <h1 className="lr-hero">
            {t("hero_headline_1")}
            <br />
            {t("hero_headline_2")}
            <br />
            <span className="lr-accent">{t("hero_headline_3")}</span>
          </h1>
          <p className="lr-hero-sub">{t("hero_sub")}</p>

          <div className="lr-mockup-grid">
            <GlowPanel className="lr-mock-card lr-mock-stat">
              <div className="lr-mock-label">{t("stat_total_loss")}</div>
              <div className="lr-mock-value">
                5,749 <span className="lr-mock-unit">EGP</span>
              </div>
              <div className="lr-mock-delta">
                ▲ 12.6% <span className="lr-muted">{t("stat_vs_last")}</span>
              </div>
              <div className="lr-mock-foot">
                38 {t("stat_trips")} · 468 {t("stat_violations")}
              </div>
            </GlowPanel>

            <GlowPanel className="lr-mock-card lr-mock-alert">
              <div className="lr-mock-alert-title">⚠ {t("insight_alert")}</div>
              <div className="lr-mock-alert-body">
                {t("insight_text")} <b className="lr-accent">44.9%</b>
                <br />
                <span className="lr-muted">{t("insight_of_total")}</span>
              </div>
              <div className="lr-mock-link">{t("insight_view")} →</div>
            </GlowPanel>

            <GlowPanel className="lr-mock-card lr-mock-chart">
              <div className="lr-mock-card-title">{t("chart_daily_title")}</div>
              <MiniLineChart />
            </GlowPanel>

            <GlowPanel className="lr-mock-card lr-mock-donut">
              <div className="lr-mock-card-title">{t("donut_title")}</div>
              <div className="lr-donut-row">
                <MiniDonut />
                <div className="lr-donut-legend">
                  <LegendRow color="#F5642A" label={t("cat_deviation")} value="44.9%" />
                  <LegendRow color="#F59E0B" label={t("cat_speeding")} value="16.8%" />
                  <LegendRow color="#B45309" label={t("cat_braking")} value="11.2%" />
                  <LegendRow color="#57534E" label={t("cat_idling")} value="27.1%" />
                </div>
              </div>
            </GlowPanel>
          </div>
        </div>

        {/* ===== Login card ===== */}
        <div className="lr-form-wrap">
          <GlowPanel className="lr-card">
            <div className="lr-card-content">
              <div className="lr-card-brand">
                <RadarLogo size={56} />
                <div className="lr-brand-name lr-brand-name-center">
                  loss<span className="lr-accent">radar</span>
                </div>
                <div className="lr-brand-sub">{t("login_subtitle")}</div>
              </div>

              <h2 className="lr-welcome">{t("login_welcome")}</h2>
              <p className="lr-welcome-sub">{t("login_welcome_sub")}</p>

              <form onSubmit={handleLogin} className="lr-form">
                <label className="lr-label">{t("login_email")}</label>
                <div className="lr-input-wrap">
                  <span className="lr-input-icon">✉</span>
                  <input
                    className="lr-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                  />
                </div>

                <label className="lr-label">{t("login_password")}</label>
                <div className="lr-input-wrap">
                  <span className="lr-input-icon">🔒</span>
                  <input
                    className="lr-input"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="lr-input-eye"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>

                <div className="lr-row-between">
                  <label className="lr-remember">
                    <input type="checkbox" defaultChecked />
                    <span>{t("login_remember")}</span>
                  </label>
                  <a href="#" className="lr-forgot">
                    {t("login_forgot")}
                  </a>
                </div>

                {error && <div className="lr-error">{error}</div>}

                <button className="lr-submit" type="submit" disabled={loading}>
                  {loading ? t("login_loading") : t("login_button")}
                  {!loading && <span className="lr-arrow">→</span>}
                </button>
              </form>
            </div>
          </GlowPanel>
        </div>
      </div>
    </div>
  );
}

// Reusable wrapper: gives any card a cursor-tracked glass "light" glow on hover
function GlowPanel({ className, children }) {
  const ref = useRef(null);

  function handleMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--mx", `${x}%`);
    el.style.setProperty("--my", `${y}%`);
  }

  return (
    <div ref={ref} className={`lr-glowable ${className || ""}`} onMouseMove={handleMove}>
      <div className="lr-glow-overlay" />
      {children}
    </div>
  );
}

function RadarLogo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="20" stroke="#F5642A" strokeWidth="2.2" opacity="0.35" />
      <circle cx="24" cy="24" r="13" stroke="#F5642A" strokeWidth="2.2" opacity="0.6" />
      <circle cx="24" cy="24" r="6.5" fill="#F5642A" />
      <line
        x1="24"
        y1="24"
        x2="38"
        y2="10"
        stroke="#F5642A"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LegendRow({ color, label, value }) {
  return (
    <div className="lr-legend-row">
      <span className="lr-legend-dot" style={{ background: color }} />
      <span className="lr-legend-label">{label}</span>
      <span className="lr-legend-value">{value}</span>
    </div>
  );
}

function MiniLineChart() {
  const points = "0,40 20,32 40,35 60,30 80,26 100,8";
  return (
    <svg viewBox="0 0 100 45" className="lr-linechart" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke="#F5642A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.split(" ").map((p, i) => {
        const [x, y] = p.split(",");
        return <circle key={i} cx={x} cy={y} r="1.6" fill="#F5642A" />;
      })}
    </svg>
  );
}

function MiniDonut() {
  // Segments approximate the reference percentages
  const segments = [
    { color: "#F5642A", pct: 44.9 },
    { color: "#F59E0B", pct: 16.8 },
    { color: "#B45309", pct: 11.2 },
    { color: "#57534E", pct: 27.1 },
  ];
  let offset = 0;
  const circumference = 2 * Math.PI * 15.9155;

  return (
    <svg viewBox="0 0 36 36" className="lr-donut-svg">
      {segments.map((s, i) => {
        const dash = (s.pct / 100) * circumference;
        const el = (
          <circle
            key={i}
            cx="18"
            cy="18"
            r="15.9155"
            fill="none"
            stroke={s.color}
            strokeWidth="4"
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-offset}
          />
        );
        offset += dash;
        return el;
      })}
      <text x="18" y="17" textAnchor="middle" className="lr-donut-total-num">
        5,749
      </text>
      <text x="18" y="22.5" textAnchor="middle" className="lr-donut-total-label">
        EGP
      </text>
    </svg>
  );
}

// Animated drifting particle network — the "moving sky" — with mouse interaction
function ParticleField() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;
    let particles = [];
    let w, h;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      const count = Math.min(90, Math.floor((w * h) / 14000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    }

    function handleMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    function handleMouseLeave() {
      mouseRef.current = { x: -9999, y: -9999 };
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);
      const mouse = mouseRef.current;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }

      // connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 165) {
            ctx.strokeStyle = `rgba(245,100,42,${0.16 * (1 - dist / 165)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // connections from cursor to nearby particles — the "selection" feel
      for (const p of particles) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          ctx.strokeStyle = `rgba(245,100,42,${0.35 * (1 - dist / 160)})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
      }

      // particles — brighter and bigger the closer they are to the cursor
      for (const p of particles) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const proximity = Math.max(0, 1 - dist / 160);
        const radius = 1.4 + proximity * 2.2;
        const alpha = 0.55 + proximity * 0.45;
        ctx.fillStyle = `rgba(245,100,42,${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(tick);
    }

    resize();
    tick();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="lr-particles" />;
}

const css = `
  * { box-sizing: border-box; }
  html, body, #root {
    margin: 0;
    padding: 0;
    background: #0B0D12;
    min-height: 100%;
  }
  .lr-page {
    position: relative;
    min-height: 100vh;
    background: #0B0D12;
    overflow-x: hidden;
    overflow-y: auto;
    font-family: 'Inter', 'Segoe UI', sans-serif;
  }
  .lr-particles {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
  }
  .lr-lang-toggle {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 20;
    padding: 6px 14px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.06);
    color: #E5E7EB;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    backdrop-filter: blur(6px);
  }
  .lr-layout {
    position: relative;
    z-index: 5;
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    min-height: 100vh;
    align-items: stretch;
    gap: 40px;
    padding: 40px 48px;
  }
  .lr-showcase {
    color: #F4F1EA;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 8px;
  }
  .lr-brand-row { display: flex; align-items: center; gap: 14px; margin-bottom: 30px; }
  .lr-brand-name { font-size: 22px; font-weight: 800; color: #F4F1EA; letter-spacing: -0.5px; }
  .lr-brand-name-center { font-size: 26px; margin-top: 10px; }
  .lr-brand-sub { font-size: 12px; color: #9CA3AF; letter-spacing: 1px; }
  .lr-accent { color: #F5642A; }

  .lr-hero { font-size: 40px; line-height: 1.15; font-weight: 800; color: #F4F1EA; margin: 0 0 14px; }
  .lr-hero-sub { color: #A6ADBB; font-size: 15px; margin-bottom: 32px; max-width: 420px; }

  .lr-mockup-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  /* ===== Generic cursor-tracked glow system (used by mock cards AND the login card) ===== */
  .lr-glowable {
    position: relative;
    overflow: hidden;
    --mx: 50%;
    --my: 30%;
  }
  .lr-glow-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(circle at var(--mx) var(--my), rgba(245,100,42,0.20), transparent 55%);
    opacity: 0;
    transition: opacity 0.35s ease;
    z-index: 1;
  }
  .lr-glowable:hover .lr-glow-overlay { opacity: 1; }

  .lr-mock-card {
    background: rgba(255,255,255,0.045);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 14px;
    padding: 18px;
    backdrop-filter: blur(10px);
  }
  .lr-mock-label { font-size: 11px; letter-spacing: 1px; color: #9CA3AF; margin-bottom: 8px; }
  .lr-mock-value { font-size: 26px; font-weight: 800; color: #F4F1EA; }
  .lr-mock-unit { font-size: 13px; color: #9CA3AF; font-weight: 500; }
  .lr-mock-delta { font-size: 12px; color: #F5642A; margin-top: 8px; }
  .lr-muted { color: #6B7280; }
  .lr-mock-foot { font-size: 11px; color: #6B7280; margin-top: 12px; }

  .lr-mock-alert-title { font-size: 11px; letter-spacing: 1px; color: #F59E0B; margin-bottom: 10px; font-weight: 700; }
  .lr-mock-alert-body { font-size: 13px; color: #D1D5DB; line-height: 1.6; }
  .lr-mock-link { font-size: 12px; color: #F5642A; margin-top: 12px; font-weight: 600; }

  .lr-mock-card-title { font-size: 12px; color: #D1D5DB; font-weight: 600; margin-bottom: 12px; }
  .lr-linechart { width: 100%; height: 46px; }

  .lr-donut-row { display: flex; align-items: center; gap: 16px; }
  .lr-donut-svg { width: 70px; height: 70px; flex-shrink: 0; }
  .lr-donut-total-num { fill: #F4F1EA; font-size: 6px; font-weight: 800; }
  .lr-donut-total-label { fill: #9CA3AF; font-size: 3.5px; }
  .lr-donut-legend { flex: 1; display: flex; flex-direction: column; gap: 8px; }
  .lr-legend-row { display: flex; align-items: center; gap: 7px; font-size: 11px; color: #D1D5DB; }
  .lr-legend-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .lr-legend-label { flex: 1; }
  .lr-legend-value { color: #9CA3AF; }

  /* ===== Login card ===== */
  .lr-form-wrap { display: flex; justify-content: center; align-items: center; }
  .lr-card {
    width: 100%;
    max-width: 420px;
    min-height: 660px;
    border-radius: 24px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(20,22,28,0.65);
    backdrop-filter: blur(20px);
    box-shadow: 0 30px 80px rgba(0,0,0,0.55);
  }
  .lr-card-content {
    position: relative;
    z-index: 2;
    padding: 48px 40px;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .lr-card-brand { text-align: center; margin-bottom: 28px; }
  .lr-welcome { text-align: center; font-size: 24px; font-weight: 800; color: #F4F1EA; margin: 0 0 8px; }
  .lr-welcome-sub { text-align: center; font-size: 13px; color: #9CA3AF; margin-bottom: 30px; }

  .lr-form { display: flex; flex-direction: column; flex: 1; }
  .lr-label { font-size: 12px; color: #9CA3AF; margin-bottom: 7px; font-weight: 600; }
  .lr-input-wrap { position: relative; margin-bottom: 20px; }
  .lr-input-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    font-size: 14px; opacity: 0.6;
  }
  .lr-input {
    width: 100%;
    padding: 13px 14px 13px 38px;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.05);
    color: #F4F1EA;
    font-size: 14px;
    outline: none;
  }
  .lr-input::placeholder { color: #6B7280; }
  .lr-input:focus { border-color: #F5642A; }
  .lr-input-eye {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; font-size: 14px;
  }

  .lr-row-between { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
  .lr-remember { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #9CA3AF; }
  .lr-forgot { font-size: 12px; color: #F5642A; text-decoration: none; }

  .lr-error {
    background: rgba(220,38,38,0.12);
    border: 1px solid rgba(220,38,38,0.3);
    color: #FCA5A5;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 13px;
    margin-bottom: 18px;
  }

  .lr-submit {
    width: 100%;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 14px;
    border-radius: 10px;
    border: none;
    background: linear-gradient(135deg, #F5642A, #EA580C);
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 10px 25px rgba(245,100,42,0.3);
    margin-top: auto;
  }
  .lr-arrow { transition: transform 0.2s ease; }
  .lr-submit:hover .lr-arrow { transform: translateX(3px); }

  /* Touch devices register :hover on tap, which would leave the glow stuck on.
     Disable the hover-glow effect entirely on touch-only devices. */
  @media (hover: none) {
    .lr-glow-overlay { display: none; }
  }

  /* ===== Responsive ===== */
  @media (max-width: 1024px) {
    .lr-mockup-grid { grid-template-columns: 1fr; }
    .lr-hero { font-size: 32px; }
  }
  @media (max-width: 900px) {
    .lr-layout { grid-template-columns: 1fr; padding: 24px; min-height: auto; }
    .lr-showcase { display: none; }
    .lr-form-wrap { padding: 40px 0; min-height: 100vh; }
  }
  @media (max-width: 480px) {
    .lr-card { min-height: auto; max-width: 100%; }
    .lr-card-content { padding: 32px 22px; }
    .lr-welcome { font-size: 20px; }
  }
`;
