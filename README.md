# CodeCraft ⚡
> **"Decode Errors. Build Solutions."**

CodeCraft is a modern, AI-powered coding error solver and automated software debugging engine designed for computer science students, educators, and software engineers. It inspects source code and terminal compiler errors across **C, C++, Python, Java, JavaScript, and HTML/CSS**, pinpoints the exact failure line, explains the issue in clear plain English, and provides verified, corrected code with side-by-side diff comparison.

---

## 🚀 Key Features

1. **Multi-Language Error Solving**:
   - **Python**: IndexErrors, TypeErrors, ZeroDivision, IndentationErrors, KeyErrors.
   - **C**: Segmentation faults, pointer arithmetic, buffer overflows, scanf missing address operator (`&`).
   - **C++**: `std::out_of_range`, vector bounds, infinite recursion, missing semicolons, memory leaks.
   - **Java**: `NullPointerException`, `ArrayIndexOutOfBoundsException`, type casting exceptions.
   - **JavaScript / Node.js**: Uncaught TypeErrors (`Cannot read property of undefined`), async/await mismatches, const reassignment.
   - **HTML/CSS**: Unclosed DOM tags, broken layout hierarchy, flexbox/grid syntax errors.

2. **Advanced Diagnostic Reports**:
   - **Error Classification**: Error name, category (Runtime, Syntax, Memory, Logic), and severity badge.
   - **Beginner-Friendly Explanation**: Plain English reasoning tailored for students.
   - **Root Cause Deep-Dive**: Technical under-the-hood explanation of the computer science concept.
   - **Step-by-Step Action Plan**: Ordered checklist of steps to fix the bug.
   - **Before & After Diff Viewer**: Side-by-side comparison of the original buggy code vs. corrected code.
   - **Prevention & Best Practices**: Practical tips to avoid this pitfall in the future.
   - **Test Case Verification**: Sample commands or inputs to verify the fix works.

3. **Developer-First Code Editor**:
   - Line numbers with error-line highlighting.
   - Tab key indentation support (2 spaces).
   - Dedicated tab for compiler output / terminal stack traces.
   - Source file upload (`.py`, `.c`, `.cpp`, `.java`, `.js`, etc.).
   - One-click copy with celebratory particle feedback.

4. **Curated Beginner Error Library**:
   - Built-in repository of classic real-world beginner errors with one-click loading.

5. **Local Session History**:
   - Error history stored locally in browser `localStorage`.
   - Filter, search, reload past solutions, or export as structured JSON.
   - One-click Markdown diagnostic report export ready for homework or lab submissions.

6. **Secure Server-Side AI Pipeline**:
   - Zero exposure of API keys to the browser bundle.
   - Express server proxy communicating with Google Gemini 3.8 Flash SDK (`@google/genai`).

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti.
- **Syntax Highlighting**: PrismJS with custom dark cyber theme.
- **Backend**: Node.js, Express, tsx.
- **AI Engine**: Google Gemini API (`@google/genai`) using model `gemini-3.8-flash` with structured JSON schema.

---

## 📂 Project Structure

```
├── server.ts                 # Full-stack Express server + Gemini AI proxy
├── index.html                # Entry HTML with developer fonts & SEO tags
├── metadata.json             # Applet metadata & server permissions
├── package.json              # Dependencies and run scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite configuration with Tailwind CSS plugin
├── .env.example              # Environment variables template
├── src/
│   ├── main.tsx              # React DOM mounting
│   ├── App.tsx               # Main application container & state orchestration
│   ├── index.css             # Tailwind v4 styles, Prism tokens, dark theme
│   ├── types/
│   │   └── index.ts          # Comprehensive TypeScript interface declarations
│   ├── data/
│   │   ├── languages.ts      # Language configurations (C, C++, Python, Java, JS, HTML)
│   │   └── examples.ts       # Curated beginner errors dataset
│   ├── utils/
│   │   ├── highlighter.ts    # PrismJS syntax highlighting helper
│   │   └── storage.ts        # LocalStorage persistence & JSON export
│   └── components/
│       ├── Header.tsx        # Top navigation & quick actions
│       ├── LanguageSelector.tsx # 6-Language selector pills
│       ├── CodeEditor.tsx    # Multi-tab code editor with line gutter
│       ├── CodeBlock.tsx     # Syntax-highlighted block with copy & download
│       ├── DiffViewer.tsx    # Side-by-side Before/After code comparison
│       ├── AnalysisLoading.tsx # Animated scanning radar & progress stages
│       ├── AnalysisOutput.tsx # Complete diagnostic report cards
│       ├── ExamplesModal.tsx # Beginner error catalog modal
│       ├── HistoryDrawer.tsx # LocalStorage history drawer
│       └── ProjectInfoModal.tsx # Academic & architectural demonstration modal
```

---

## ⚙️ Setup and Run Instructions

### Prerequisites
- Node.js (version 20 or higher recommended)
- npm or pnpm

### 1. Clone or Extract the Project
```bash
git clone <repository-url>
cd codecraft
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure your Gemini API key is set in `.env`:
```env
GEMINI_API_KEY="your-google-gemini-api-key"
PORT=3000
```

### 4. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 🎓 College Project Evaluation Points

- **Real-World Problem**: Bridges the high attrition and frustration rate in introductory CS courses due to cryptic compiler errors.
- **Architectural Security**: Follows strict production standards where AI inference and API keys are isolated on the server tier.
- **Deterministic Schema**: Employs Google GenAI JSON Schema validation ensuring zero hallucinated response structures.
- **Usability & Accessibility**: Fully responsive across mobile, tablet, and widescreen developer setups with keyboard shortcuts (`Ctrl+Enter`).

---

## 📄 License
Apache-2.0 License. Developed with Google AI Studio.
