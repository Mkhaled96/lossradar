import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLanguage } from "../lib/i18n.jsx";
import LanguageToggle from "../components/LanguageToggle.jsx";

export default function LoginPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div style={styles.page}>
      <LanguageToggle />
      <div style={styles.leftPanel}>
        <div style={styles.brandBlock}>
          <div style={styles.brandMark}>
            LOSS<span style={styles.brandAccent}>RADAR</span>
          </div>
        </div>
        <RadarChartSignature />
        <p style={styles.tagline}>{t("login_tagline")}</p>
      </div>

      <div style={styles.rightPanel}>
        <form style={styles.form} onSubmit={handleLogin}>
          <div style={styles.eyebrow}>{t("login_eyebrow")}</div>
          <h1 style={styles.heading}>{t("login_heading")}</h1>

          <label style={styles.label}>{t("login_email")}</label>
          <input
            style={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
          />

          <label style={styles.label}>{t("login_password")}</label>
          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {error && <div style={styles.errorBox}>{error}</div>}

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? t("login_loading") : t("login_button")}
          </button>
        </form>
      </div>
    </div>
  );
}

function RadarChartSignature() {
  const bars = [40, 65, 50, 90, 55, 120];
  const barWidth = 32;
  const gap = 18;
  const chartBaseY = 190;
  const totalWidth = bars.length * (barWidth + gap) - gap;
  const startX = (400 - totalWidth) / 2;

  return (
    <svg viewBox="0 0 400 220" style={styles.routeSvg} xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1={chartBaseY} x2="380" y2={chartBaseY} stroke="#3A4354" strokeWidth="1" />
      {bars.map((h, i) => {
        const x = startX + i * (barWidth + gap);
        const isLossBar = i === bars.length - 1;
        return (
          <rect
            key={i}
            x={x}
            width={barWidth}
            y={chartBaseY}
            height="0"
            rx="3"
            fill={isLossBar ? "#D9762E" : "#4B5768"}
          >
            <animate
              attributeName="height"
              from="0"
              to={h}
              begin={`${0.15 * i}s`}
              dur="0.6s"
              fill="freeze"
              calcMode="spline"
              keySplines="0.25 0.1 0.25 1"
            />
            <animate
              attributeName="y"
              from={chartBaseY}
              to={chartBaseY - h}
              begin={`${0.15 * i}s`}
              dur="0.6s"
              fill="freeze"
              calcMode="spline"
              keySplines="0.25 0.1 0.25 1"
            />
          </rect>
        );
      })}
      <g opacity="0">
        <animate attributeName="opacity" from="0" to="1" begin="1.1s" dur="0.4s" fill="freeze" />
        <circle
          cx={startX + (bars.length - 1) * (barWidth + gap) + barWidth / 2}
          cy={chartBaseY - bars[bars.length - 1] - 26}
          r="16"
          fill="none"
          stroke="#D9762E"
          strokeWidth="1.5"
          opacity="0.6"
        >
          <animate attributeName="r" values="10;22;10" dur="2.4s" begin="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0;0.7" dur="2.4s" begin="1.5s" repeatCount="indefinite" />
        </circle>
        <circle
          cx={startX + (bars.length - 1) * (barWidth + gap) + barWidth / 2}
          cy={chartBaseY - bars[bars.length - 1] - 26}
          r="4"
          fill="#D9762E"
        />
      </g>
    </svg>
  );
}

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    position: "relative",
  },
  leftPanel: {
    flex: 1,
    background: "#1F2937",
    color: "#F4F1EA",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "48px",
    position: "relative",
    overflow: "hidden",
  },
  routeSvg: {
    width: "85%",
    maxWidth: "400px",
    margin: "36px 0",
  },
  brandBlock: {
    textAlign: "center",
  },
  brandMark: {
    fontSize: "36px",
    fontWeight: 800,
    letterSpacing: "3px",
    color: "#F4F1EA",
  },
  brandAccent: {
    color: "#D9762E",
  },
  tagline: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#F4F1EA",
    maxWidth: "340px",
    lineHeight: 1.6,
    textAlign: "center",
    marginTop: "12px",
  },
  rightPanel: {
    flex: 1,
    background: "#F4F1EA",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px",
  },
  form: {
    width: "100%",
    maxWidth: "360px",
    display: "flex",
    flexDirection: "column",
  },
  eyebrow: {
    fontSize: "13px",
    letterSpacing: "2px",
    color: "#D9762E",
    fontWeight: 600,
    marginBottom: "8px",
  },
  heading: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#1F2937",
    marginBottom: "32px",
  },
  label: {
    fontSize: "13px",
    color: "#4B5563",
    marginBottom: "6px",
    fontWeight: 500,
  },
  input: {
    padding: "12px 14px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "1px solid #D8D3C7",
    background: "#FFFFFF",
    fontSize: "15px",
    outline: "none",
  },
  errorBox: {
    background: "#FDECEA",
    color: "#B3261E",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "16px",
  },
  button: {
    padding: "13px",
    borderRadius: "8px",
    border: "none",
    background: "#D9762E",
    color: "#FFFFFF",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "8px",
  },
};
