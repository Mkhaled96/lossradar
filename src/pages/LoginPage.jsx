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
  const cardRef = useRef(null);

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

  function handleCardMouseMove(e) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mx", `${x}%`);
    card.style.setProperty("--my", `${y}%`);
  }

  return (
    <div className="lr-page">
      <style>{css}</style>
      <div className="lr-glow-blob lr-glow-1" />
      <div className="lr-glow-blob lr-glow-2" />
      <div className="lr-glow-blob lr-glow-3" />
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
            <div className="lr-mock-card lr-mock-stat">
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
            </div>

            <div className="lr-mock-card lr-mock-alert">
              <div className="lr-mock-alert-title">⚠ {t("insight_alert")}</div>
              <div className="lr-mock-alert-body">
                {t("insight_text")} <b className="lr-accent">44.9%</b>
                <br />
                <span className="lr-muted">{t("insight_of_total")}</span>
              </div>
              <div className="lr-mock-link">{t("insight_view")} →</div>
            </div>

            <div className="lr-mock-card lr-mock-chart">
              <div className="lr-mock-card-title">{t("chart_daily_title")}</div>
              <MiniLineChart />
            </div>

            <div className="lr-mock-card lr-mock-donut">
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
            </div>
          </div>
        </div>

        {/* ===== Login card ===== */}
        <div className="lr-form-wrap">
          <div className="lr-card" ref={cardRef} onMouseMove={handleCardMouseMove}>
            <div className="lr-card-glow" />
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

                <div className="lr-divider">
                  <span>{t("login_or")}</span>
                </div>

                <button type="button" className="lr-sso">
                  🛡 {t("login_sso")}
                </button>
              </form>

              <div className="lr-footer-note">
                🛡 {t("login_security")} · <span className="lr-accent">{t("login_cert")}</span>
              </div>
              <div className="lr-footer-copy">{t("login_footer")}</div>
            </div>
          </div>
        </div>
      </div>
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

// Animated drifting particle network — the "moving sky"
function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;
    let particles = [];
    let w, h;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      const count = Math.min(70, Math.floor((w * h) / 18000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.strokeStyle = `rgba(245,100,42,${0.12 * (1 - dist / 140)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const p of particles) {
        ctx.fillStyle = "rgba(245,100,42,0.55)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
      animationId = requestAnimationFrame(tick);
    }

    resize();
    tick();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
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
    overflow: hidden;
    font-family: 'Inter', 'Segoe UI', sans-serif;
  }
  .lr-glow-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(90px);
    pointer-events: none;
    z-index: 1;
  }
  .lr-glow-1 { top: -120px; left: -80px; width: 460px; height: 460px; background: rgba(245,100,42,0.22); }
  .lr-glow-2 { top: 30%; right: 5%; width: 380px; height: 380px; background: rgba(180,83,9,0.16); }
  .lr-glow-3 { bottom: -140px; left: 30%; width: 500px; height: 500px; background: rgba(245,100,42,0.10); }
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
    align-items: center;
    gap: 40px;
    padding: 56px 48px;
  }
  .lr-showcase {
    color: #F4F1EA;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .lr-brand-row { display: flex; align-items: center; gap: 14px; margin-bottom: 32px; }
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
    position: relative;
    width: 100%;
    max-width: 380px;
    min-height: 620px;
    border-radius: 24px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(20,22,28,0.65);
    backdrop-filter: blur(20px);
    box-shadow: 0 30px 80px rgba(0,0,0,0.55);
    overflow: hidden;
    --mx: 50%;
    --my: 30%;
  }
  .lr-card-glow {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(circle at var(--mx) var(--my), rgba(245,100,42,0.22), transparent 55%);
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  .lr-card:hover .lr-card-glow { opacity: 1; }
  .lr-card-content {
    position: relative;
    padding: 40px 32px;
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

  .lr-row-between { display: flex; justify-content: space-between; align-items: center; margin-bottom: 22px; }
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

  .lr-divider {
    text-align: center;
    font-size: 11px;
    color: #6B7280;
    margin: 22px 0;
    position: relative;
  }
  .lr-divider::before, .lr-divider::after {
    content: "";
    position: absolute;
    top: 50%;
    width: 40%;
    height: 1px;
    background: rgba(255,255,255,0.1);
  }
  .lr-divider::before { left: 0; }
  .lr-divider::after { right: 0; }

  .lr-sso {
    padding: 13px;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.03);
    color: #E5E7EB;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
  }

  .lr-footer-note { text-align: center; font-size: 11px; color: #6B7280; margin-top: 26px; }
  .lr-footer-copy { text-align: center; font-size: 10px; color: #4B5563; margin-top: 8px; }

  /* ===== Responsive ===== */
  @media (max-width: 1024px) {
    .lr-mockup-grid { grid-template-columns: 1fr; }
    .lr-hero { font-size: 32px; }
  }
  @media (max-width: 900px) {
    .lr-layout { grid-template-columns: 1fr; padding: 24px; }
    .lr-showcase { display: none; }
    .lr-form-wrap { padding: 40px 0; }
  }
  @media (max-width: 480px) {
    .lr-card { min-height: auto; }
    .lr-card-content { padding: 28px 20px; }
    .lr-welcome { font-size: 20px; }
  }
`;
