# ⚡ Vibe Plugin for Figma

> **The Symbiotic Design Intelligence Engine.**
> *Architected for the next generation of design systems.*

![Vibe Banner](https://placeholder-banner-url.com) *(Add a banner image here if available)*

---

## 🌌 Overview

**Vibe** is not just a plugin; it's a **Design Intelligence Layer** sitting on top of Figma. It transforms static tokens into a living, breathing semantic graph. built with a **Feature-Sliced Architecture**, Vibe ensures that your design system scales effortlessly from a single file to a multi-brand enterprise system.

### 🚀 Core Capabilities

-   **🧠 Semantic Token Graph**: Visualizes dependencies between variables (Ancestry & Impact analysis).
-   **🎨 Intelligent Color Scales**: Auto-generates harmonic HSL/HCT color scales.
-   **⚡ Omnibox Assistant**: A Spotlight-like command interface for rapid actions.
-   **🛡️ Governance Engine**: Enforces naming conventions, contrast ratios (WCAG), and orphan detection.
-   **🔄 Bi-directional Sync**: Seamlessly syncs tokens between Figma and external sources (GitHub/Supabase).

---

## 🏗️ Architecture (Feature-Sliced)

The codebase follows strict **Domain-Driven Design (DDD)** and **Clean Architecture** principles:

\`\`\`
src/
├── core/               # 🧠 The Kernel (DI Container, Singleton Services)
├── features/           # 📦 Domain Modules (Self-contained business logic)
│   ├── auth/           # Authentication & Gatekeeping
│   ├── tokens/         # Token Management & Operations
│   ├── intelligence/   # AI, Graph Analysis, & Heuristics
│   └── dashboard/      # Analytics & Visualization
├── components/         # 🧩 UI Library
│   ├── ui/             # Atomic Design System (The "Vibe" Look)
│   └── shared/         # Reusable Business Components
└── infrastructure/     # 🔌 Adapters (Figma API, Supabase, Storage)
\`\`\`

---

## 🛠️ Installation & Development

### Prerequisites
-   Node.js v18+
-   Figma Desktop App

### Quick Start

1.  **Clone the repository:**
    \`\`\`bash
    git clone https://github.com/your-username/vibe-plugin.git
    cd vibe-plugin
    \`\`\`

2.  **Install dependencies:**
    \`\`\`bash
    npm install
    # or
    yarn
    \`\`\`

3.  **Start the development server:**
    \`\`\`bash
    npm run dev
    # Runs Vite + TSC + esbuild in parallel
    \`\`\`

4.  **Load in Figma:**
    -   Open Figma -> Plugins -> **Development** -> **Import plugin from manifest...**
    -   Select \`manifest.json\` from the project root.

---

## 🧪 Commands

| Command | Description |
| :--- | :--- |
| \`npm run build\` | Compiles TypeScript and builds the production bundle. |
| \`npm run typecheck\` | Runs a headless TypeScript check. |
| \`npm run lint:fix\` | Auto-fixes code style issues. |
| \`npm test\` | Runs Vitest unit tests. |

---

## 🤝 Contributing

We welcome contributions! Please follow the **Vibe Engineering Standards**:
1.  **Strict Typing**: No \`any\`. Use interfaces for everything.
2.  **Screaming Architecture**: Place files where they belong domain-wise.
3.  **Atomic Commits**: One feature, one commit.

---

## 📄 License

MIT © [Your Name/Organization]
