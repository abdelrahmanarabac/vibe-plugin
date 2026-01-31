# 🎨 Vibe Tokens — AI-Powered Design System Generator

<div align="center">
  <img src="https://img.shields.io/badge/Figma-Plugin-FF7262?style=for-the-badge&logo=figma&logoColor=white" alt="Figma Plugin"/>
  <img src="https://img.shields.io/badge/AI-Gemini%202.5-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI"/>
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19"/>
  <img src="https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License"/>
</div>

---

## 🚀 Overview

**Vibe Tokens** is a state-of-the-art Figma plugin engineered to bridge the gap between abstract design intent and semantic design systems. By leveraging the advanced capabilities of **Google Gemini 2.5 Flash**, it autonomously analyzes design primitives and generates comprehensive, semantically structured token systems.

Simply describe the desired "vibe"—whether it's *"Cyberpunk Neon"* or *"Enterprise SaaS Clean"*—and the intelligent engine constructs a complete variable collection including colors, spacing, typography, and border radii, all fully integrated into Figma's native variables.

---

## ✨ Key Capabilities

| Module | Description |
|--------|-------------|
| **🧠 Intelligence** | Powered by `IntentEngine` and `SemanticIntelligence`, utilizing Gemini 2.5 to interpret user intent and map it to design tokens with context-aware descriptions. |
| **👁️ Perception** | Advanced visual scanner that traverses Figma layers to extract raw primitives (colors, geometry, typography) for analysis. |
| **🎨 Creation** | Automates the generation of Figma Variable Collections, ensuring naming conventions and taxonomy alignment. |
| **🛡️ Security** | Enterprise-grade security with local API key encryption via `SettingsService` and strict data isolation. |
| **🔧 Governance** | Ensures consistency and strict schema validation (Zod) across all generated tokens, preventing malformed data. |
| **📈 Self-Healing** | Includes `RemediationService` to detect and correct token drift, ensuring long-term system integrity. |

---

## 📐 Architecture

Vibe Tokens is built on a robust **Clean Architecture (v2.1)** foundation, ensuring scalability, maintainability, and clear separation of concerns.

```
src/
├── core/                  # 🧠 Domain Entities & Business Rules
├── modules/               # 📦 Feature Capabilities (Intelligence, Perception, Creation, etc.)
├── infrastructure/        # 🔌 External Adapters (Figma API, Storage, Network)
├── shared/                # 🛠️ Shared Utilities & Constants
├── ui/                    # 🎨 React Presentation Layer
└── controller.ts          # 🎮 Main Plugin Controller
```

### 📖 Documentation
For a deep dive into our architecture, mathematical core, and file structure, please refer to:
---

### Data Flow Strategy

1.  **Perception**: The plugin scans the user's selection in Figma.
2.  **Intent Classification**: The `IntentEngine` analyzes the user's textual description.
3.  **Semantic Mapping**: The `SemanticIntelligence` module (powered by Gemini) correlates visual primitives with the intended vibe.
4.  **Tokenization**: Raw values are transformed into semantic tokens.
5.  **Execution**: The `AgentCore` orchestrates the creation of variables in the active Figma document.

---

## 🛠️ Technical Stack

-   **Runtime**: React 19, TypeScript 5.9
-   **Styling**: Tailwind CSS v4 (Glassmorphism UI)
-   **AI Engine**: Google Generative AI (Gemini 2.5 Flash)
-   **Validation**: Zod v4
-   **Build System**: Vite 7, esbuild

---

## 🚀 Getting Started

### Prerequisites

-   Figma Desktop App
-   Google Gemini API Key ([Get API Key](https://aistudio.google.com/app/apikey))

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-org/vibe-tokens.git
    cd vibe-tokens
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Build the project:
    ```bash
    npm run build
    ```
4.  Import into Figma:
    -   Open Figma → Plugins → Development → **Import plugin from manifest...**
    -   Select `manifest.json`.

---

## 👨‍💻 Author

**Abdelrahman Arab**
*Lead Software Engineer & Architect*

> "Crafting intelligent tools that empower designers to build with speed and semantic precision."

---

## 📄 License

This project is licensed under the MIT License.
