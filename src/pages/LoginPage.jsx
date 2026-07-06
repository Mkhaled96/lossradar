import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function LoginPage() {
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
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      return;
    }

    // Fetch role to redirect appropriately
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
      <div style={styles.leftPanel}>
        <RouteSignature />
        <div style={styles.brandBlock}>
          <div style={styles.brandMark}>LOSS</div>
          <div style={styles.brandSub}>RADAR</div>
          <p style={styles.tagline}>
            تتبع كل مركبة. تعرف كل خسارة. تتحكم في كل قرار.
          </p>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <form style={styles.form} onSubmit={handleLogin}>
          <div style={styles.eyebrow}>تسجيل الدخول</div>
          <h1 style={styles.heading}>ابدأ المراقبة</h1>

          <label style={styles.label}>البريد الإلكتروني</label>
          <input
            style={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
          />

          <label style={styles.label}>كلمة المرور</label>
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
            {loading ? "جارٍ التحقق..." : "دخول"}
          </button>
        </form>
      </div>
    </div>
  );
}

// A GPS route-line that draws itself on load — the signature element
function RouteSignature() {
  return (
    <svg
      viewBox="0 0 400 240"
      style={styles.routeSvg}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 210 C 80 210, 60 120, 130 110 S 220 40, 260 60 S 340 30, 380 20"
        fill="none"
        stroke="#D9762E"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="600"
        strokeDashoffset="600"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="600"
          to="0"
          dur="2.2s"
          fill="freeze"
          calcMode="spline"
          keySplines="0.25 0.1 0.25 1"
        />
      </path>
      <circle cx="20" cy="210" r="5" fill="#1F2937" />
      <circle cx="380" cy="20" r="6" fill="#D9762E">
        <animate
          attributeName="r"
          values="6;9;6"
          dur="2s"
          begin="2.2s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    direction: "rtl",
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
    width: "80%",
    maxWidth: "380px",
    marginBottom: "24px",
  },
  brandBlock: {
    textAlign: "center",
  },
  brandMark: {
    fontSize: "42px",
    fontWeight: 800,
    letterSpacing: "4px",
    color: "#F4F1EA",
  },
  brandSub: {
    fontSize: "18px",
    fontWeight: 500,
    letterSpacing: "8px",
    color: "#D9762E",
    marginTop: "-6px",
  },
  tagline: {
    marginTop: "24px",
    fontSize: "15px",
    color: "#B8BCC4",
    maxWidth: "320px",
    lineHeight: 1.7,
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
