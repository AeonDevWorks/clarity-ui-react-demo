# ClarityUI — Cognitive Decompressor

**A browser-interface transformer powered by multimodal AI.**

> **Mission**: To reimagine how humans interact with overwhelming digital experiences. We aim to reduce cognitive load, increase accessibility, and enable focused action by transforming cluttered webpages into calm, structured, and intuitive views tailored to user cognitive needs.

---

## 📖 Table of Contents
- [Core Problem](#core-problem)
- [The Solution](#the-solution)
- [Product Goals](#product-goals)
- [Key Features](#key-features)
- [Cognitive Modes](#cognitive-modes)
- [System Overview](#system-overview)
- [Supported Use Cases](#supported-use-cases)
- [Visual & UX Principles](#visual--ux-principles)

---

## 🛑 Core Problem
Modern web interfaces prioritize engagement, aggressive layout density, and advertising. As a result:
- **Pages are visually chaotic**
- **Core tasks become buried**
- **Cognitive burden increases**
- **Users experience decision fatigue**
- **Accessibility barriers grow**
- **Essential information becomes hard to find**

Traditional simplification tools (reader modes, ad blockers) do not understand context, intent, or hierarchy. They remove clutter without re-architecting the experience. There is a clear market need for a **cognitive-first browsing experience**.

---

## 💡 The Solution
ClarityUI is a browser interface transformer that accepts:
- A URL
- A screenshot
- A pasted HTML snippet

It produces a **dual-view browsing environment**:
1.  **Before View**: Original page screenshot or rendered HTML (dismissible).
2.  **After View (ClarityUI View)**: A regenerated interface optimized for clarity, calmness, and accessibility.

The ClarityUI View is interactive, allowing users to navigate structured flows where each action updates the simplified UI using the model’s understanding of the page’s underlying semantics.

---

## 🎯 Product Goals

### Primary Goals
- **Provide a calm browsing experience** by re-architecting interfaces according to user cognitive needs.
- **Reduce overwhelm and friction** in completing online tasks.
- **Enable effortless extraction of meaning** from information-heavy pages.
- **Increase accessibility** via optimized UI representations.

### Secondary Goals
- **Explainable transformations**: "Why did you hide this?"
- **Instant comparison**: Compare original and simplified views.
- **Scalability**: Foundation for multiple cognitive profiles.

---

## ✨ Key Features

### A. Inputs
- **URL & Screenshot**: Paste a URL (supported domain list) or upload a screenshot/raw HTML.
- **Preview**: System displays the snapshot in the "Before" panel.

### B. Two-Panel Cognitive Layout
A split view where the width ratio adapts to the cognitive mode:
- **Zen Mode**: 50–50
- **Flow Mode**: 40–60
- **ADHD Mode**: 30–70

The Original View is dismissible for deep focus.

### C. Intelligent Features
- **Cognitive Load Index (CLI)**: Estimates visual complexity.
- **Task Extraction**: Identifies user intent.
- **Noise Reduction**: Removes ads and distractions.
- **Hierarchy Discovery**: Reconstructs relationships.
- **Explainability Toggle**: Provides context for changes.

### D. Theme Personalization
Granular control over visual comfort:
- **6-step theme slider**: High Contrast Light ↔ High Contrast Dark.
- **Consistency**: Applies to both app shell and AI-generated content.
- **Accessibility**: Respects OS-level settings (e.g., reduced motion).

---

## 🧠 Cognitive Modes

| Mode | Description | Layout Ratio |
|------|-------------|--------------|
| **Zen Mode** | Minimal, reading-first, low-stimulation. | 50–50 |
| **Flow Mode** | Transforms complex pages into a logical, 3–5 step wizard. | 40–60 |
| **ADHD Mode** | Hyper-focused single-task view with prominent CTA. | 30–70 |
| **Original Mode** | Returns unmodified content when needed. | N/A |

---

## 🏗 System Overview

### Pipelines
1.  **Input**: URL (headless browse) / Screenshot / HTML.
2.  **Processing**:
    - Vision/DOM extraction.
    - Hierarchy & semantic grouping.
    - Intent inference & Cognitive load scoring.
    - Mode-specific transformation.
3.  **Output**: Dynamic View JSON -> Renderable layout -> State-dependent updates.

### Integration Notes (React + TypeScript)
- **Frontend**: React + TypeScript (.tsx) for predictable build behavior.
- **Cold-Start Mitigation**: "Keep-alive" pings to headless service.
- **Image Transport**: Base64 data URIs to avoid external storage dependencies for the demo.
- **Theme/Gemini Separation**: Gemini controls structure; UI controls style tokens (preventing hallucinations).

### Unified Screenshot Pipeline
Both user uploads and Playwright screenshots enter a unified Gemini 3 pipeline for:
- Visual text extraction
- UI element detection
- Layout segmentation
- PII detection (lightweight backend scan + model masking)

---

## 🚀 Supported Use Cases
- **Cluttered News Sites** → Zen reading mode.
- **E-commerce Product Pages** → Flow mode for decision-making.
- **Dense Government Forms** → Step-by-step wizard mode.
- **Complex Dashboards** → ADHD focus mode.

---

## ✅ Success Criteria
- User gets a transformed UI within seconds from any input.
- Cognitive modes drastically change appearance based on intent.
- Side-by-side views offer clear contrast.
- Transformed view is navigable and preserves intent.

---

## 🎨 Visual & UX Principles
- **High whitespace density**
- **Few focal elements per view**
- **Large, readable text**
- **Hierarchical clarity**
- **Calm color palettes**
- **Accessibility-first**