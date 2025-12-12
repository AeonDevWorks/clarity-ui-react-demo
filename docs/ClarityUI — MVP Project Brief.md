# **ClarityUI — Cognitive Decompressor \- MVP Project Brief**

### **Project Brief (for UI/UX \+ Architecture Tools)**

### **Purpose: Provide full product understanding for generating wireframes, flows, and system design.**

---

## **1\. Mission Statement**

ClarityUI exists to reimagine how humans interact with overwhelming digital experiences.  
 Our mission is to **reduce cognitive load**, **increase accessibility**, and **enable focused action** by transforming cluttered webpages and dense interfaces into calm, structured, and intuitive views — personalized to user cognitive needs.

ClarityUI is built for everyone, but especially for users who struggle with information overload, distraction-heavy interfaces, neurodivergent cognitive patterns (ADHD, autism spectrum), aging populations, and professionals who interact with complex dashboards or form-heavy systems.

---

## **2\. Core Problem**

Modern web interfaces prioritize engagement, aggressive layout density, and advertising. As a result:

* Pages are visually chaotic

* Core tasks become buried

* Cognitive burden increases

* Users experience decision fatigue

* Accessibility barriers grow

* Essential information becomes hard to find

Traditional simplification tools (reader modes, ad blockers) **do not understand context, intent, tasks, or hierarchy**. They remove clutter without re-architecting the experience.

There is a clear market need for a **cognitive-first browsing experience**.

---

## **3\. What We Are Building**

ClarityUI is a **browser-interface transformer** powered by multimodal AI. It accepts:

* A **URL**

* A **screenshot**

* A **pasted HTML snippet**

And produces a **dual-view browsing environment**:

### **Before View:**

* Original page screenshot or rendered HTML

* Option to reveal/hide this view at any time

### **After View (ClarityUI View):**

A regenerated interface optimized for clarity, calmness, and accessibility. This view is based on task intent rather than original layout. It may appear as:

* A **Zen View** (minimal reading mode)

* A **Flow View** (step-by-step wizard)

* An **ADHD Mode** (one actionable item at a time)

* A **Taskboard View** (auto-generated task summaries)

The ClarityUI View is **interactive**, allowing users to click “Next”, “Back”, fill fields, or navigate structured flows. Each action updates the simplified UI using the model’s understanding of the page’s underlying semantics.

---

## **4\. Product Goals**

### **Primary Goals**

1. Provide a **calm browsing experience** by re-architecting interfaces according to user cognitive needs.

2. Reduce overwhelm and friction in completing online tasks.

3. Enable users to extract meaning, complete forms, or navigate information-heavy pages effortlessly.

4. Increase accessibility by delivering alternative UI representations optimized for clarity and simplicity.

### **Secondary Goals**

5. Offer transparent and explainable transformations (“Why did you hide this?”).

6. Allow users to compare original and simplified views instantly.

7. Support a curated set of popular, high-noise websites for smooth navigation.

8. Provide a foundation for a scalable SaaS solution with multiple cognitive profiles.

---

## **5\. Key Features (Demo Application Scope)**

### **A. URL & Screenshot Input**

* User can paste a URL (supported domain list shown below the input).  
* Alternatively, upload a screenshot or paste raw HTML.  
* System fetches or loads the page snapshot and displays it in the “Before” panel.  
* ClarityUI auto-selects a cognitive mode (Zen, Flow, ADHD) before rendering the transformed view.

### **B. Two-Panel Experience**

### **Two-Panel Cognitive Layout**

ClarityUI presents a two-panel layout where the Original Page appears on the left and the AI-generated Clarity View on the right. The width ratio changes based on the cognitive mode to reflect user intent:

* **Zen Mode:** 50–50

* **Flow Mode:** 40–60

* **ADHD Mode:** 30–70

This creates an intuitive visual hierarchy that reinforces the cognitive model of each mode. The Original View is dismissible, allowing the Clarity View to expand to 100% width for deep focus or task execution.

**Before Panel:**

* Original screenshot or rendered HTML preview

* Toggle “Hide Original / Show Original”

**After Panel (ClarityUI):**

* AI-generated, simplified UI

* Clean card-based layout

* Stepper for multi-step flows

* Large buttons, clear typography

* Context-aware semantic grouping

### **C. Cognitive Modes**

1. **Zen Mode** — minimal, reading-first, low-stimulation.

2. **Flow Mode** — transforms complex pages into a logical, 3–5 step wizard.

3. **ADHD Mode** — hyper-focused single-task view with prominent CTA.

4. **Original Mode** — returns unmodified content when needed.

### **D. Interactive Transformation**

* Clicking buttons or editing fields triggers UI refresh via structured action tokens.

* AI recomputes the appropriate next state based on original HTML/screenshot and user intent.

### **E. Intelligent Features**

1. **Cognitive Load Index (CLI)** — heuristic estimation of visual complexity.

2. **Task Extraction** — identifies “what the user is likely trying to do”.

3. **Noise Reduction** — removes ads, unrelated sections, popups, or distracting elements.

4. **Hierarchy Discovery** — reconstructs relationships between items (e.g., main action, supporting details, optional fields).

5. **Explainability Toggle** — “Why did you hide this?” generates contextual reasoning.

### **F. Theme Personalization (Granular Cognitive Comfort Control)**

ClarityUI provides a persistent, highly granular theme personalization system designed to accommodate varied cognitive and visual comfort needs. Users can select between system default or a 6-step theme slider ranging from **High Contrast Light → Standard Light → Mild Light → Mild Dark → Standard Dark → High Contrast Dark**.

The theme selector is always visible within the application shell and applies not only to the overall UI but also to the AI-generated After Panel. This ensures that transformed content aligns with the user’s preferred visual hierarchy, contrast level, and reading comfort.

The system respects OS-level accessibility settings (e.g., High Contrast Mode, prefers-color-scheme, prefers-reduced-motion).  
 Theme changes apply instantly and consistently across all cognitive modes (Zen, Flow, ADHD), ensuring clarity, predictability, and reduced cognitive friction.

---

## **6\. System Overview & Integration Notes**

### **Input Pipeline**

* Accept URL → fetch rendered HTML \+ screenshot via headless browsing

* Or accept user-uploaded screenshot

* Or accept raw HTML

### **Processing Pipeline**

1. Vision/DOM extraction

2. Hierarchy & semantic grouping

3. Intent inference

4. Cognitive load scoring

5. Mode-specific transformation logic (Zen / Flow / ADHD)

6. Dynamic UI synthesis

### **Output Pipeline**

* Dynamic View JSON

* Renderable layout using predefined CSS tokens

* State-dependent updates based on interactions

### **Runtime & Integration Notes (Hackathon — React \+ TypeScript)**

To match AI Studio constraints, the front-end will be implemented in **React \+ TypeScript (.tsx)**. This choice avoids fragile runtime compilation in the demo environment and ensures predictable build behavior for the UI prototypes and the Dynamic View renderer. 

### **Cloud Run Cold-Start Mitigation**

Because Cloud Run can scale to zero, the frontend will issue a lightweight background `OPTIONS` ping to the headless microservice on app load (a “keep-alive” ping). This wakes the service before user interaction, reducing first-action latency in demos. 

### **Image Transport (Hackathon)**

The headless microservice returns screenshots as **Base64 data URIs** inside the `/fetch` JSON response (e.g., `{ screenshot: "data:image/png;base64,..." }`). This avoids S3-like storage for the hackathon demo, keeping the system atomic at the cost of larger payloads — an acceptable trade for the demo.

### **Theme / Gemini Separation of Concerns (Important)**

The model must **not** output literal hex codes. The `UI_Spec.md` enforces color references via `colorToken` keys (CSS variables). The theme slider (client) controls the actual CSS token values; Gemini only controls structure (component types, hierarchy, layout). This prevents hallucinated colors and enforces consistent visual output in the After panel.

### **Unified Screenshot Handling (Multimodal Gemini 3 Pipeline)**

ClarityUI supports two screenshot ingestion paths—user-uploaded images and Playwright-generated screenshots. Both enter a **single unified processing pipeline** powered by Gemini 3’s multimodal perception capabilities.

#### **Screenshot sources**

1. **User-uploaded screenshot**

2. **Playwright screenshot from URL fetch**

#### **Unified Gemini processing**

All screenshots are passed directly to Gemini as multimodal inputs. Gemini performs:

* Visual text extraction

* UI element detection

* Layout region segmentation

* Accessibility interpretation

* PII detection and masking in model output

No OCR service is deployed in the backend. Instead, screenshot images are forwarded directly to the model.

#### **Lightweight backend responsibilities**

* Accept screenshot uploads

* Light PII regex scan for logs (does NOT modify the screenshot)

* TTL-based temporary storage

* Provide consistent metadata to the prompt:

`{`

  `"source_type": "user_screenshot" | "fetched_screenshot",`

  `"snapshot_key": "...",`

  `"screenshot_base64": "...",`

  `"rendered_html": "...", // only for URL mode`

  `"timestamp": "...",`

  `"pii_scan": { ... }`

`}`

#### **Benefits**

* Reduced infra complexity

* Maximum alignment with Gemini’s strengths

* Identical model instructions for both screenshot paths

* Predictable UX for judges and users

---

## **7\. Supported Use Cases (Demo Scope)**

1. **Cluttered news sites** → Zen reading mode

2. **E-commerce product pages** → Flow mode for decision-making

3. **Dense government forms** → Step-by-step wizard mode

4. **Complex dashboards** → ADHD focus mode

---

## **8\. Success Criteria**

* A user pastes a URL from the supported list → gets a transformed gen UI within seconds  
* A user uploads a screenshot → gets a transformed gen UI within seconds  
* A user uploads raw HTML → gets a transformed gen UI within seconds. 

* Cognitive modes drastically change how the same content appears.

* Side-by-side views offer clear “before vs after” contrast.

* The transformed view is navigable and intuitive.

* Interaction loops maintain structural consistency and preserve user intent.

---

## **9\. Visual & UX Principles (for Wireframe Tools)**

* High whitespace density

* Few focal elements per view

* Large, readable text

* Hierarchical clarity (titles \> sections \> details)

* Predictable left-to-right or top-to-bottom flow

* Calm color palette for Zen / ADHD modes

* Clear visual affordances for actions

* Accessibility-first (contrast, sizing, spacing)  
* Theme Personalization (Granular Cognitive Comfort Control)

---

