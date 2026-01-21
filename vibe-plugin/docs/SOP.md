# 📋 Vibe Tokens — Standard Operating Procedure (SOP)

> **Document Version:** 1.0  
> **Last Updated:** 2026-01-20  
> **Target Audience:** Designers, Design System Engineers, Product Teams

---

## 1️⃣ Purpose

This SOP defines the standardized workflow for using **Vibe Tokens** to generate AI-powered design tokens from Figma designs. Following this procedure ensures consistent, high-quality design system outputs.

---

## 2️⃣ Prerequisites Checklist

| Requirement | Status |
|-------------|--------|
| Figma Desktop App installed | ☐ |
| Vibe Tokens plugin imported | ☐ |
| Valid Gemini API Key configured | ☐ |
| Design file with color/shape assets | ☐ |

---

## 3️⃣ Workflow Procedure

### STEP 1: Plugin Initialization

1. Open your Figma design file
2. Navigate to **Plugins → Development → Vibe Tokens**
3. Plugin window opens with `VIBE OS v2.2` header

### STEP 2: API Key Configuration

| Action | Expected Result |
|--------|-----------------|
| Locate `SECURE_KEY_STORAGE` panel | Shows "EMPTY ⚪" initially |
| Paste Gemini API Key | Field auto-saves, shows "LOCKED 🔒" |

> [!WARNING]
> **Security**: API key is stored locally in Figma's `clientStorage`. Never share your API key.

### STEP 3: Design Selection & Scanning

```
┌─────────────────────────────────────────┐
│  SELECTION SCOPE GUIDELINES             │
├─────────────────────────────────────────┤
│  ✅ Full component frames               │
│  ✅ Color palette swatches              │
│  ✅ UI cards with rounded corners       │
│  ❌ Rasterized images (no extraction)   │
│  ❌ Masked/clipped shapes               │
└─────────────────────────────────────────┘
```

**Procedure:**
1. Select target frames/layers in Figma canvas
2. Click `SCAN` button in plugin
3. Verify status shows `Scanned X Items`
4. Panel updates to `X NODES DETECTED`

### STEP 4: Vibe Description Engineering

Write a clear, descriptive vibe prompt:

| Quality | Bad Example | Good Example |
|---------|-------------|--------------|
| **Vague** | "Nice colors" | "Warm, friendly SaaS dashboard with orange accents" |
| **Too Short** | "Dark" | "Cyberpunk dark mode with neon purple and electric blue highlights" |
| **Actionable** | "Modern" | "Clean fintech aesthetic: deep navy, gold accents, sharp typography" |

### STEP 5: Token Generation

1. Click `INITIATE_GENERATION`
2. Status shows `Thinking... 🧠`
3. Wait for processing (5-15 seconds typical)
4. Success: `Success! 🎉`

> [!NOTE]
> If you see "AI Busy", the system will automatically retry up to 3 times with exponential backoff.

### STEP 6: Verification

1. Open Figma's **Local Variables** panel (`Shift + L`)
2. Locate collection named `Vibe AI System`
3. Verify token categories:
   - `Primary/*` — Color tokens
   - `Spacing/*` — Numeric spacing values
   - `Radius/*` — Border radius values
   - `Type/*` — Typography tokens

---

## 4️⃣ Error Resolution Matrix

| Error | Cause | Resolution |
|-------|-------|------------|
| `⚠️ Missing Key` | No API key entered | Enter valid Gemini key |
| `⚠️ No Selection` | No Figma layers selected | Select frames before scanning |
| `AI Syntax Error` | Invalid AI response | Retry generation; simplify vibe description |
| `AI Fail: 429` | Rate limit exceeded | Wait 60 seconds, retry |
| `AI Fail: 503` | Server overloaded | Automatic retry in progress |

---

## 5️⃣ Best Practices

### DO ✅

- Use descriptive, multi-word vibe descriptions
- Select diverse design elements (colors, shapes, text)
- Verify generated tokens before applying to designs
- Export collections for design system documentation

### DON'T ❌

- Rush through scanning without proper selection
- Use single-word vibe descriptions
- Generate tokens without checking existing collections
- Share plugin with embedded API keys

---

## 6️⃣ Maintenance Schedule

| Task | Frequency |
|------|-----------|
| Verify API key validity | Monthly |
| Clear old Variable Collections | Per project |
| Update plugin to latest version | As released |
| Review and refine vibe prompts | Per session |

---

## 7️⃣ Support Escalation

| Issue Level | Contact |
|-------------|---------|
| General usage | Internal design system docs |
| Plugin bugs | GitHub Issues |
| AI quality concerns | Refine prompts or contact lead |
| Security incidents | Security team immediately |

---

**Document Owner:** Design Systems Team  
**Approval Status:** ✅ Approved
