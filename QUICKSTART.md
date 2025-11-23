# ⚡ Quick Start V3

## 5 minute setup!

### 1. Supabase (2 min)

```bash
1. https://supabase.com → Create project
2. SQL Editor → Copy ALL from supabase-schema-fixed.sql → Execute
3. Settings > API → Copy URL + anon key
```

### 2. Install (2 min)

```bash
npm install
cp .env.example .env
# Edit .env with Supabase credentials
```

### 3. Run (1 min)

```bash
npm run dev
```

## ✅ Verify it works

1. Open http://localhost:5173
2. Sign up / Login
3. Check sidebar - should see "General" category
4. Try adding a task
5. Check Console (F12) - should see logs, no errors

## 🐛 If you see errors

See `SETUP_GUIDE.md` for complete troubleshooting!

Common issues:
- **400/422 errors** → Re-run schema-fixed.sql
- **Empty dropdown** → Check categories table
- **Can't add tasks** → Verify RLS policies

---

**Ready in 5 minutes!** 🚀
