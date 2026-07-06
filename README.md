# LossRadar

## اللي جوه المجلد ده
- `src/pages/LoginPage.jsx` — صفحة تسجيل الدخول
- `src/pages/AdminDashboard.jsx` — لوحة الأدمن (مبدئية، هتتبني بالتفصيل بعدين)
- `src/pages/ClientPortal.jsx` — بوابة العميل (مبدئية، هتتبني بالتفصيل بعدين)
- `src/lib/supabaseClient.js` — الاتصال بـ Supabase
- `supabase/schema.sql` — قاعدة البيانات (تم تشغيله بالفعل)
- `supabase/functions/sync-fleet-data` — آلية مزامنة الشيت (تم نشرها بالفعل)
- `package.json`, `vite.config.js`, `index.html` — إعدادات المشروع الأساسية اللي بتخلي Vercel يقدر يبني الموقع
- `vercel.json` — يمنع صفحة 404 لما تدخل رابط زي `/admin` مباشرة
- `.env.example` — مكان مفاتيح Supabase

## خطوات الرفع

### 1. ارفع الملفات دي فوق اللي عندك في GitHub
روح على الـ Repository بتاعك (lossradar) على GitHub، دوس Add file -> Upload files، واسحب كل الملفات والمجلدات اللي في الـ ZIP ده، ودوس Commit changes.

### 2. في Vercel
- روح لمشروعك في vercel.com
- روح Settings -> Environment Variables
- ضيف:
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY
  (تلاقيهم في Supabase -> Settings -> API)
- روح Deployments -> دوس على التلات نقط (⋯) جنب آخر Deployment -> Redeploy

بعد ما يخلص Redeploy، هتلاقي الموقع شغال على اللينك بتاع Vercel.
