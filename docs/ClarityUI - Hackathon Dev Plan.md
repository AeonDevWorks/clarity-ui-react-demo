

---

# **ClarityUI — Cognitive Decompressor**

### **AI Studio Hackathon Project Document (Complete & Self-Contained)**

### **Scope: Only the AI Studio hackathon version — no post-hackathon features included.**

---

# **1\. Vision**

ClarityUI transforms overwhelming, cluttered, and cognitively demanding webpages into calm, structured, accessible interfaces.

It provides users with a **two-panel browsing experience**:

* **Before View:** Original page (screenshot or rendered HTML)

* **After View:** AI-generated, simplified representation optimized for clarity, accessibility, and focused action

The goal is to demonstrate how multimodal reasoning \+ dynamic UI generation can radically improve digital comprehension and cognitive comfort.

---

# **2\. Problem**

Modern websites — especially news portals, e-commerce listings, government forms, and dashboards — are visually dense, confusing, and overloaded with ads, competing visual cues, and fragmented task flows.

This creates:

* Cognitive overload

* Decision fatigue

* Accessibility challenges

* Slower task completion

* High friction for neurodivergent or attention-sensitive users

Traditional "reader modes" or ad blockers fail because they **remove noise** but do **not restructure the interface** based on user goals or cognitive needs.

---

# **3\. What ClarityUI Does (Hackathon Version)**

ClarityUI takes as input:

* A **URL** (from a curated list of supported domains)

* A **screenshot**

* A **pasted HTML snippet**

And produces:

### **A. Two-Panel Before/After UI**

**Before Panel:**

* Shows original screenshot or rendered HTML snapshot

* Can be dismissed by user

**After Panel:**

* The AI-generated "Cognitive Decompressed" interface

* Rendered via Dynamic View components in AI Studio

* Navigation and state updates handled through action tokens

---

# **4\. Supported Cognitive Modes (Hackathon Version)**

### **1\. Zen Mode**

Minimalist, low-stimulus layout. Ideal for reading.

### **2\. Flow Mode**

Converts complex pages into 3–5 step linear flows (e.g., “Summary → Options → Action”).

### **3\. ADHD Mode**

Presents only one primary action or focus element at a time with a large CTA.

(Each mode alters layout rules, composition, and UI density.)

## **Panel Ratio Rules (Cognitive Mode–Driven)**

ClarityUI uses adaptive two-panel width ratios based on cognitive modes:

`export const PANEL_RATIOS = {`

  `zen:   { left: 0.5, right: 0.5 },`

  `flow:  { left: 0.4, right: 0.6 },`

  `adhd:  { left: 0.3, right: 0.7 }`

`};`

When the user hides the Original View, the Clarity View expands to:

`{ left: 0, right: 1 }`

These ratios intentionally convey cognitive intent:

* **Zen** emphasizes readability and before/after comparison.

* **Flow** emphasizes forward progression.

* **ADHD** emphasizes single-focus clarity.

Ratios update automatically on mode change, with layout transitions respecting `prefers-reduced-motion`.

---

# **5\. Core Capabilities (Hackathon Scope)**

### **A. Input Processing**

* Accept URL (supported list displayed below input)

* Accept screenshot upload

* Accept raw HTML input

### **B. Mode Classifier**

ClarityUI auto-selects a cognitive mode (Zen, Flow, ADHD) before rendering the transformed view.  
 This classifier uses a two-stage process:

1. **Deterministic Heuristics** (fast, local, predictable)

2. **Gemini Adjudication** (strict rubric \+ JSON schema) for ambiguous cases

Users may manually override the selection at any time.

(Refer ModeClassifier.md for implementation details)

### **C. URL Handling (Hybrid Approach)**

ClarityUI uses a **hybrid URL strategy**:

1. **Supported URLs:**

   * Fetched on-demand via a *small headless browsing microservice*

   * Returns:

     * Rendered HTML

     * Full-page screenshot

     * Optional accessibility tree

2. **Fallback for unsupported URLs:**

   * User is prompted to upload a screenshot or paste HTML

3. **Pre-captured snapshots for demo reliability:**

   * 3–4 guaranteed working example pages

   * Ensures stable demo when judges test the app

### **D. Transformation Pipeline**

1. Extract layout from screenshot or HTML

2. Identify tasks, sections, CTAs, fields

3. Compute rough “Cognitive Load Index”

4. Determine primary user intent

5. Remove noise & distractions

6. Reconstruct an accessible, structured UI representation

7. Output Dynamic View (JSON) describing the new layout

### **E. Interaction Loop**

* User clicks buttons or fields in the After Panel

* Client sends action token (e.g., `{ action: "next" }`)

* Model reprocesses the input \+ action → returns updated view

### **F. Show/Hide Original**

* User can toggle the Before Panel visibility

* After Panel remains interactive and fully functional

---

# **6\. Technical Architecture (AI Studio Hackathon Version)**

## **High-Level Requirements (React \+ TypeScript / Cloud Run / Base64)**

* **Frontend:** React (.tsx) \+ TypeScript. Use Context API for theme and session state.

* **Microservice:** Playwright headless service on Cloud Run (TypeScript). Endpoint: `POST /fetch` returns `{ screenshot: "data:image/png;base64,...", html: "<sanitized>", title: "..." }`.

* **Cold-start mitigation:** On app load run an `OPTIONS /ping` keep-alive request to Cloud Run to warm the container.

* **Image transport:** Use Base64 Data URI for the screenshot in the `/fetch` JSON response for immediate consumption by the Gemini prompt and the browser.

### **1\. AI Studio Session**

* Gemini 3 Pro

* System Instruction defines all transformation rules

* Context files uploaded at session start

### **2\. Required Context Files**

* **StyleGuide.html:** CSS skeleton for Zen, Flow, ADHD

* **UI\_Spec.md:** Dynamic View JSON schema \+ component library

* **Example Transformations:** 2–3 small before/after samples

* **CognitiveLoad\_Rules.txt:** How to determine low/medium/high complexity

* **3–4 Pre-captured snapshots** (HTML \+ screenshots)

### **3\. Headless Browsing Microservice**

* Small Playwright-based endpoint: `/fetch?url=...`

* Returns screenshot \+ rendered HTML

* Only processes whitelisted domains

* Used for URL navigation demo

### **4\. Dynamic View Rendering**

* All After Panel UIs generated as structured JSON

* AI Studio renders UI accordingly

* All transformations are deterministic via prompt rules

### **5\. Theme Personalization System — Implementation Requirements**

#### **5.1. Theme Model**

### **Theme Model (TypeScript)**

`// src/types/theme.ts`

`export type ThemeMode = 'system' | 'explicit';`

`export interface ThemeState {`

  `mode: ThemeMode;`

  `value: 'system' | 0 | 1 | 2 | 3 | 4 | 5;`

`}`

### **CSS Token Skeleton (`global.css`)**

`:root {`

  `--bg: #ffffff;`

  `--surface: #f7f7f8;`

  `--card-bg: #ffffff;`

  `--text-primary: #0b0b0b;`

  `--text-secondary: #4b4b4b;`

  `--muted: #9a9a9a;`

  `--accent: #0066ff;`

  `--cta-bg: var(--accent);`

  `--cta-text: #ffffff;`

  `--focus-ring: rgba(0,102,255,0.35);`

  `--border: #e6e6e6;`

  `--shadow: 0 1px 4px rgba(0,0,0,0.06);`

`}`

Implement a `getThemeTokens(value: number)` factory to return the six theme token maps and apply them via `document.documentElement.style.setProperty`.

### **Theme apply function (pseudo-TS)**

`function applyTheme(value: number | 'system') {`

  `const tokens = getThemeTokens(value);`

  `Object.entries(tokens).forEach(([k, v]) => {`

    `document.documentElement.style.setProperty(k, v);`

  `});`

  `localStorage.setItem('clarityui:theme', JSON.stringify({ mode: value === 'system' ? 'system' : 'explicit', value }));`

  `// notify AI session/renderer (lightweight): sendActionToken({ action: 'theme.change', payload: { mode: 'explicit', value }});`

`}`

---

#### **5.3. Theme ↔ Gemini Handshake (Strict Contract — must be enforced)**

* **Schema rule**: In `UI_Spec.md`, all color fields must be `colorToken` keys (e.g., `colorToken: "text-primary"`). No hex or literal color values allowed.

* **Dynamic View Requirement**: When Gemini returns JSON, every color-bearing component must include `accessibility` metadata:  
  `"accessibility": {`  
    `"contrastRatio": 7.2,`  
    `"wcag": "AA"`  
  `}`  
* **Contrast Enforcement:** If the generated `contrastRatio` fails WCAG AA for normal text, the server must apply a fallback token (preferably high-contrast preset) and annotate `meta.contrastFixes` in the response. This prevents unreadable Auto-generated UI under a user-selected theme.

### **`theme.change` Action Token (JSON)**

`{`

  `"action": "theme.change",`

  `"payload": { "mode": "explicit", "value": 4 }`

`}`

* `theme.change` should **restyle** the current Dynamic View using token mapping only — **do not** recompute semantics or ask Gemini to re-interpret the page. This keeps theme toggles cheap and deterministic.

#### 

---

#### **5.5. Persistence & Client Behavior**

* The front-end persists explicit theme selections (e.g., in `localStorage`).

* System mode listens for OS preference changes and updates the current theme accordingly.

* Theme transitions should animate smoothly unless `prefers-reduced-motion` is active.

---

#### **5.6. Required UI Components for Theme Control**

The application must include:

* A **persistent theme slider** (0–5)

* A **System default switch**

* A **compact floating theme indicator** in the After Panel

* Keyboard and screen-reader accessible controls

* Live contrast indicator (PASS/FAIL) next to theme preview

---

#### **5.7. Interaction with Cognitive Modes**

Theme personalization must integrate seamlessly with Zen, Flow, and ADHD modes:

* Zen Mode: subtle contrast, calm surface hierarchy

* Flow Mode: consistent card elevations and accent colors

* ADHD Mode: clear focus target without excessive visual stimulation

The theme system must not disrupt cognitive flow or introduce visual noise.

---

## **6\. Cloud Run Keep-Alive Ping (frontend snippet)**

`// on app load (background)`

`async function warmHeadless() {`

  `try {`

    `// OPTIONS is lightweight and allowed by CORS; adjust endpoint if needed`

    `await fetch('https://microservice.example.com/ping', { method: 'OPTIONS', mode: 'no-cors' });`

  `} catch (e) {`

    `// ignore — warming is best effort`

  `}`

`}`

`warmHeadless();`

* Add `GET /ping` or `OPTIONS /ping` route on the microservice that returns 200 quickly.

---

## **7\. Image Transport — Backend Architecture for Screenshots**

### **POST /upload\_screenshot**

Handles user-uploaded screenshots.

**Responsibilities:**

* Validate MIME type & size

* (Optional) client-side compression encouraged

* Base64 encode & assign `snapshot_key`

* Light regex PII scan (emails, phones, SSNs)

* Store in TTL cache

* Return unified `fetched_meta` object

  ### **Playwright /fetch endpoint**

Also returns screenshot\_base64 in same format as uploads.

### **Unified Prompt Interface**

All prompt calls receive:

`{`

  `"fetched_meta": {`

    `"source_type": "user_screenshot" | "fetched_screenshot",`

    `"screenshot_base64": "...",`

    `"rendered_html": "...",` 

    `"pii_scan": {...}`

  `}`

`}`

### **Gemini instructions (system prompt addition)**

Include these rules:

* “When screenshot is provided, use vision reasoning to extract text, layout, and semantics.”

* “Apply PII masking only in your output, not by modifying the screenshot.”

* “For URL mode, use rendered\_html for DOM-like reasoning; screenshot is visual ground truth.”

---

# **7\. System Prompt Outline**

This portion governs ClarityUI’s behavior. Actual detailed text will be finalized during development.

### **System Prompt Key Rules**

1. You are **ClarityUI**, an interface transformer.

2. Input types: screenshot, rendered HTML, or both.

3. Identify layout → infer user tasks → generate simplified UI.

4. Modes: Zen, Flow, ADHD (each with defined rules).

5. Never invent elements not present in the input.

6. Generate a short visible "plan" before final UI.

7. Output Dynamic View JSON using approved components only.

8. On user actions (next/back/click), recompute only the next state.

9. Ensure accessibility: readable text, spacing, minimal cognitive load.

10. Provide “Show Original” button in footer.

---

# **8\. Dynamic View Component Library (Hackathon Scope)**

ClarityUI uses a small, clean set of components:

* **Header**

* **Text**

* **Card**

* **Button**

* **Stepper**

* **Accordion**

* **Input**

* **Summary**

* **Mode Selector**

* **Show Original Toggle**

These components will be styled using `StyleGuide.html`.

---

# **9\. Supported Demo Pages (Recommended)**

These pages must work flawlessly in the demo:

1. **Cluttered News Homepage**

   * Shows Zen Mode & noise removal

2. **E-commerce Product Page**

   * Shows Flow Mode (Summary → Options → Action)

3. **Government Form Page**

   * Shows multi-step wizard transformation

4. **Internal Dashboard Screenshot**

   * Shows ADHD Mode (single focus element)

---

# **10\. Full Demo Flow (What Judges Will See)**

**Step 1:** User pastes a supported URL  
 → Headless service fetches page  
 → Before Panel displays original screenshot

**Step 2:** User selects mode (Zen / Flow / ADHD)

**Step 3:** “Generate Clarity View”  
 → Gemini shows a short visible “Thinking / Planning” trace  
 → After Panel appears with simplified UI

**Step 4:** User clicks “Next” or interacts with elements  
 → Model updates the After Panel accordingly

**Step 5:** User toggles “Show Original”  
 → Before Panel slides in/out

**Step 6:** Switch modes on the same page to show differences

This sequence delivers the “browsing magic” while remaining technically simple.

---

# **11\. Implementation Plan (Hackathon-Friendly)**

### **Phase 1 — Asset Preparation**

* Capture 3–4 sample pages

* Prepare StyleGuide, UI\_Spec, examples

* Set up headless microservice

### **Phase 2 — AI Studio Prompting**

* Upload all context files

* Build System Instruction iteratively

* Test each mode individually

* Add action token handling logic

* Test two-panel rendering

### **Phase 3 — Final Integration**

* Add URL input with supported domain hints

* Bind URL → fetch → before panel

* Connect action tokens to prompt cycle

* Polish mode selector & show-original toggle

### **Phase 4 — Demo Video Creation**

* Film:

  * URL input

  * Magic before/after transformation

  * All three modes

  * Clicking through steps

---

# **12\. Task Tickets for Clarity-UI Development**

\---

### **Phase 1: The Foundation (Backend & Infra)**

#### 

#### **Module 1: The Headless "Eye" (Microservice)**

* **Description:** A lightweight Playwright microservice deployed on Cloud Run.  
* **Tech Stack:** Node.js, TypeScript, Express (or Hono), Playwright.  
* **Dependencies:** None (Standalone).

**Ticket 1.1 — Headless Fetch Endpoint**

* Create Express server with `GET /fetch?url=` implementation per spec. Validate whitelist. Return JSON with `screenshot` (Base64), `html`, `title`, `pii_masked` metadata.  
* Acceptance: `curl '/fetch?url=https://bbc.com'` returns 200 with `screenshot` data URI and `html` field.

**Ticket 1.2 — Dockerize & /ping**

* Add Dockerfile using Playwright official image. Add `GET /ping` route (OPTIONS support). Build locally and run container.  
* Acceptance: container runs locally and `curl /ping` returns 200 immediately.

**Ticket 1.3 — Cloud Run Deploy & Config**

* Deploy with `gcloud run deploy` flags (`--memory 2Gi`, `--cpu 2`). Add environment variable for `ALLOWED_DOMAINS` and `CACHE_TTL_MINUTES`.  
* Acceptance: Cloud Run URL responds and returns fetch result for allowed domain.

**Ticket 1.4 — Caching & TTL**

* Add in-memory cache (lru or redis optional). Cache snapshot\_key \-\> response for TTL. Respect `?force=true` to bypass cache.  
* Acceptance: repeated fetch for same URL returns cached `timestamp` unchanged within TTL.

**Ticket 1.5 — PII Masking & Sanitization**

* Implement regex-based masking for emails, phone numbers, SSNs. Add `masked_fields` array in response.  
* Acceptance: returned `html` contains `__MASKED_EMAIL__` placeholders and `pii_masked: true` when applicable.

**Ticket 1.6 — Whitelist & Pre-captured assets**

* Add config for `PRE_CAPTURED_ASSETS` mapping demo URLs to stored screenshots \+ html. Frontend can check this map before hitting `/fetch`.  
* Acceptance: demo URLs resolve instantly from the map.

**Ticket 1.7 — Unified Screenshot Metadata Schema** 

**Description:**  
 Define the canonical `fetched_meta` object returned by both `/upload_screenshot` and Playwright `/fetch`.

**Must include:**

`{`

  `"source_type": "user_screenshot" | "fetched_screenshot",`

  `"snapshot_key": "...",`

  `"screenshot_base64": "data:image/png;base64,...",`

  `"rendered_html": "<optional sanitized html>",`

  `"timestamp": "...",`

  `"width": 1280,`

  `"height": 720,`

  `"pii_scan": { "emails": n, "phones": n, "ssn": n }`

`}`

**Acceptance:**  
 Both endpoints return the exact same schema (except for source\_type / rendered\_html).

**Ticket 1.8 — POST /upload\_screenshot Endpoint (Replaces older upload tickets)**

**Description:**  
 Handles user screenshot uploads → normalizes them into unified screenshot metadata.

**Requirements:**

* Validate MIME \+ size

* Base64 encode

* Light regex PII scan (mask only *in logs*, not screenshot)

* Assign snapshot\_key

* Store Base64 screenshot in TTL cache (10–30 min)

* Return unified fetched\_meta

**Acceptance:**  
 Uploading an image results in a fetched\_meta object identical to Playwright responses.

**Ticket 1.9 — Playwright /fetch Endpoint (Updated to match unified screenshot flow)**

**Description:**  
 Modify existing `/fetch` endpoint to return screenshot\_base64 \+ rendered\_html in unified format.

**Requirements:**

* Return `source_type: "fetched_screenshot"`

* Return screenshot as data URI

* Return sanitized rendered\_html

* Perform light regex PII scan

**Acceptance:**  
 URL workflows produce the same shape as uploads; frontend uses one pathway for both.

**Ticket 1.10 — Pre-Captured Demo Snapshots**

**Description:**  
 Load 3–4 golden-path snapshots into `PRE_CAPTURED_ASSETS`.

**Acceptance:**  
 These URLs bypass microservice and load instantly in UI.

### 

**Ticket 1.7 — Uploaded HTML Handling & Sanitization (NEW)**

**Description:** Add `POST /upload_html` to accept uploaded `.html` files or raw HTML paste. Sanitize input, compute `snapshot_key`, optionally render a safe screenshot in a network-disabled Playwright sandbox, store TTL cache, and return unified `fetched_meta` with `source_type: "uploaded_html"`.

**Requirements:**

* Validate extension and size.

* Server-side sanitization using allowlist rules; remove `<script>`, `<iframe>`, inline event handlers, `javascript:` URIs.

* Neutralize or placeholder external resources.

* Optional sanitized render to produce `rendered_screenshot_base64` using Playwright with network disabled.

* Return `fetched_meta` schema (see canonical schema).

**Acceptance:**  
 Upload of an `.html` file returns `fetched_meta` with `sanitized_html` and optional `rendered_screenshot_base64`. The UI is able to feed that `fetched_meta` into the Gemini prompt and produce an After view identical in format to other flows.

**Ticket 1.8 — Sanitation Policy & SSRF Defense**

**Description:** Implement server rules and tests to detect and neutralize SSRF and other embedded remote resource patterns within uploaded HTML. Add unit tests for malicious payloads (e.g., `javascript:`, `file://`, `http://169.254.169.254`, inline base64 with scripts).

**Acceptance:**  
 Known-attack vectors are rejected or sanitized; logs show detection, and client receives informative error or sanitized result.

---

\---

### **Phase 2: Frontend & Integration**

#### **Module 2: Client Shell & The "Theme Engine"**

* **Description:** The React application skeleton, Layout, and the rigorous CSS Variable system for the 6-step theme slider.  
* **Tech Stack:** React, TypeScript, Tailwind (or CSS Modules), Context API.  
* **Dependencies:** None.

**Ticket 2.1: Theme Context & Tokens**  
    **Spec:**  
        1\.  Create \`ThemeContext\` tracking \`mode\` (0-5) and \`isSystem\`.  
        2\.  Define CSS Variables in \`global.css\` for all tokens in your brief (\`--bg\`, \`--surface\`, \`--text-primary\`, etc.) for **all 6 distinct themes** (High Contrast Light \-\> High Contrast Dark).  
        3\.  Build the **Theme Slider Component** (Input range 0-5) that updates the Context.  
        4\. add `getThemeTokens` factory and `applyTheme` integration \+ `theme.change` action token emission.	  
    **Success Criteria:** Dragging the slider instantly changes the background and text colors of a dummy card from "Light" to "Dark" to "High Contrast" without page reload.

**Ticket 2.2 — useUrlOrScreenshotInput Hook – supports uploaded\_html**

**Description:**  
 One hook that handles:

* URL input → pre-captured or /fetch  
* Screenshot upload → /upload\_screenshot  
* Raw HTML input → POST /upload\_html 

**Acceptance:**  
 All three input modes return identical fetched\_meta into Gemini pipeline.

**Ticket 2.3 — Before/After two-pane & toggles**

* Implement split layout, show screenshot in Before panel, dynamic renderer in After panel. Add "Hide original" toggle.  
* Acceptance: toggle hides left panel visually while After stays functional and expands to cover 100% of the available viewport.

**Ticket 2.4 — System Prompt update & fetched\_meta handshake**

* Update the system prompt injection to include `fetched_meta` unified schema; enforce rule to not invent new elements and respect PII masks.

**Model instructions:**

* Use vision reasoning for screenshot  
* Treat screenshot as ground truth  
* Use rendered\_html only as structural hint  
* Mask PII *only* in output (Gemini handles this)

Acceptance: Model receives the hint and outputs Dynamic View JSON accordingly.

#### 

#### **Module 3: The Dynamic Renderer (The "After" Panel)**

* **Description:** The React engine that takes JSON and paints the UI.  
* **Tech Stack:** React, TypeScript.  
* **Dependencies:** Module 2 (Theme Tokens).

**Ticket 3.1: Component Library**  
    **Spec:** Build the atomic components defined in your \`UI\_Spec.md\`: \`Card\`, \`Header\`, \`Text\`, \`Button\`, \`Stepper\`, \`Accordion\`.  
    **Constraint:** strictly use the CSS variables (\`var(--surface)\`) from Module 2\. Do not use hardcoded hex values.  
    **Success Criteria:** A Storybook-like page displaying all components reacting to the Theme Slider.

* Implement component library and recursive renderer honoring `colorToken` rules.  
* Acceptance: static sample JSON renders correctly in After panel.

**Ticket 3.2: The Recursive Renderer**  
    **Spec:** 

* Create \`\<DynamicView data={jsonData} /\>\`. 

	   enforce `colorToken` resolution and consume theme tokens at render time; include contrast metadata readout.

* Renderer must accept a screenshot-backed JSON even when no HTML was provided (upload case).

    **Logic:**  
        1\.  Map \`jsonData.type\` to specific React component.  
        2\.  Pass \`jsonData.props\` and \`jsonData.children\` recursively.  
        3\.  Handle \`onClick\` events by bubbling up an "Action Token" ID.  
    **Success Criteria:** Hardcoding a complex JSON tree (nested cards and steppers) renders the correct UI hierarchy.

\---

### **Phase 3: The Cognitive Core and Loop**

#### **Module 4: The "Cognitive Bridge" (Gemini Integration)**

* **Description:** Interfacing with the AI Studio / Gemini API.  
* **Goal:** End-to-end transformation pipeline.   
* **Tech Stack:** Google Generative AI SDK (JS).  
* **Dependencies:** Module 1 (Data), Module 3 (Renderer format).

**Ticket 4.1 Mode Classifier** 

ClarityUI auto-selects a cognitive mode (Zen, Flow, ADHD) before rendering the transformed view.  
 This classifier uses a two-stage process:

1. **Deterministic Heuristics** (fast, local, predictable)  
2. **Gemini Adjudication** (strict rubric \+ JSON schema) for ambiguous cases

(Refer ModeClassifier.md for implementation details)

**Ticket 4.2: Prompt Builder & API Client**  
    **Spec:**  
        1\.  Construct System Prompt: Inject \`StyleGuide\`, \`UI\_Spec\`, and \`Mode Rules\` (Zen/Flow/ADHD).  
        2\.  Construct User Message: \`Input HTML\` \+ \`Screenshot (Base64)\` \+ \`Selected Mode\`.  
        3\.  Call \`gemini-1.5-pro\` (or 3-pro-preview).  
        4\.  Request \`response\_mime\_type: "application/json"\`.

5. Always include screenshot (upload or fetched) in prompt’s multimodal input  
6. If rendered\_html exists, include it as secondary context  
7. If `sanitized_html` exists, Gemini should prefer HTML structural cues but corroborate with visible screenshot for layout and content.  
8. Use system rules for semantic extraction \+ PII masking

    **Success Criteria:**   
Sending a snippet of HTML returns a JSON object that validates against your \`UI\_Spec.md\` schema.   
Model extracts text \+ structure purely from screenshot when no HTML is provided.   
When only sanitized\_html was provided, Gemini still extracts UI semantics correctly.   
When both HTML and rendered screenshot are present, Gemini respects the screenshot as ground truth.

#### **Module 5: The Interaction Loop**

* **Description:** Making the "After" panel alive.  
* **Dependencies:** Module 3 (Renderer), Module 4 (API).

**Ticket 5.1: Action Token Handler**  
    **Spec:**  
        1\.  When user clicks a button in \`DynamicView\`, capture \`{ action: "next", context: "step\_2" }\`.  
        2\.  Append this action to the Gemini Chat History.  
        3\.  Trigger a re-generation.  
        4\.  Show a "Thinking..." trace (skeleton loader) in the After panel.  
    **Success Criteria:** Clicking "Next" in a generated Wizard flow triggers a network call and updates the UI to "Step 2".

* Implement click handlers that produce action tokens appended to the prompt history and re-run the model.  
* Acceptance: clicking Next updates the view (at least 2 steps) using the model.

\---

### **Phase 4: Polish & Demo**

#### **Module 6: Final Integration**

**Ticket 6.1: The Split Pane & Toggle**  
    **Spec:** Combine Module 1 (Before Panel) and Module 5 (After Panel) into the \`TwoPanelLayout\`. Add the "Show/Hide Original" toggle. 

**Ticket 6.2: Integration Edge Case** — *Theme/Gemini Handshake*   
    **Spec:** add schema validation that rejects any Dynamic View JSON containing literal color codes; add automatic fallback and logging.

**Ticket 6.3: Keep-alive ping & cold-start UX**

* Implement frontend `OPTIONS /ping` keep-alive when app loads and show pre-captured image if fetch \> 6s.  
* Acceptance: UI immediately shows pre-captured snapshot while live fetch replaces it when ready.

**Ticket 6.4: Demo Polish**   
    **Spec:** Add the "Supported Domains" hint text under the input. hardcode the 3 "Golden Path" demo URLs.

* Finalize 3–4 demo pages, record script, capture warm instances.  
* Acceptance: demo video covers 2 pre-captured \+ 1 live fetch.

    

---

# **12\. Success Criteria (Checklist for Hackathon Scope)**

ClarityUI succeeds if:

* A user pastes a URL from the supported list → gets a transformed gen UI within seconds  
* A user uploads a screenshot → gets a transformed gen UI within seconds  
* A user uploads raw HTML → gets a transformed gen UI within seconds. 

* Before and After panels provide a compelling contrast

* Zen, Flow, and ADHD modes produce clearly distinct outputs

* The After Panel is interactive (at least 2–3 click steps)

* No elements are hallucinated or improvised  
    
* Theme slider persists and restyles the After Panel instantly (no semantic regeneration).

* `theme.change` action leads to restyling only and returns updated `meta` with contrast checks.

* Base64 screenshot is accepted by Gemini prompt and the After Panel during generating flows.

* Cloud Run cold-start reduced via background OPTIONS/GET ping in 80% of first user flows during demo.

* If Gemini JSON contains literal colors, pipeline rejects and records `theme.handshake.failure` with reason.

* The output feels calm, simple, and intuitive

* The demo video clearly shows the magic moment

# **Acceptance tests (run these)**

1. **Upload HTML basic**

   * Upload a clean `.html` file → `/upload_html` returns `fetched_meta` with `sanitized_html` and `snapshot_key`. Feed into Gemini → After view renders.

2. **Upload HTML with external resources**

   * Upload HTML containing `<img src="https://example.com/cat.jpg">` → sanitized\_html keeps placeholder, no external fetch; if render was requested it was performed with network disabled and produced the screenshot (images will be placeholders).

3. **Malicious payload**

   * Upload HTML with `<script>alert(1)</script>` or `javascript:` links → server rejects those tags or strips them; response contains `sanitized_html` and a log entry that shows a sanitized flag.

4. **Parity test**

   * Provide same page through 3 methods: URL fetch (whitelisted), Playwright fetch → produces screenshot+html; screenshot upload (user screenshot of page); uploaded\_html (downloaded HTML). All three should produce `fetched_meta` that, when given to Gemini, return semantically consistent After views.

5. **TTL & deletion**

   * Confirm file/data stored by `POST /upload_html` is deleted after TTL.

---

# **13\. Deliverables**

* Completed AI Studio project

* Headless browsing microservice (for whitelisted URLs only)

* Context files uploaded directly into AI Studio

* Demo video (2–3 minutes)

* Readme describing purpose & usage

---

