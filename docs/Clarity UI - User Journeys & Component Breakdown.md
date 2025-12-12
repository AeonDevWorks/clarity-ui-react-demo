# Clarity UI \- User Journeys & Component Breakdown

# **1\. USER JOURNEYS & CLICKFLOWS**

(derived directly from requirements in both hackathon documents)

We break the UX into 4 major journeys:

---

## **Journey A — URL → Cognitive Decompressed UI (Primary Demo Flow)**

**Goal:** User pastes a supported URL → sees Before/After → interacts with simplified UI.

### **Step-by-Step Clickflow**

1. **Home Screen**

   * User sees:

     * URL input field

     * Upload screenshot button

     * Paste HTML option

     * Supported domains hint text

     * Mode selector (Zen / Flow / ADHD)

2. **User pastes URL**  
    → Clicks **Fetch Page**

3. **System Action**

   * Headless microservice fetches:

     * Rendered HTML

     * Full-page screenshot

   * Before Panel displays screenshot

4. **User selects Cognitive Mode**

   * Zen / Flow / ADHD  
      → Click **Generate Clarity View**

5. **Model generates:**

   * Short visible “Thinking / Plan” trace

   * After Panel \= simplified UI in chosen mode

6. **User Interacts**

   * Clicks buttons (Next/Back)

   * Opens accordions

   * Edits form fields  
      → Action tokens trigger state update

7. **At any point**

   * User toggles **Show/Hide Original**

---

## **Journey B — Screenshot Upload → Clarity View**

1. User clicks **Upload Screenshot**

2. Drops JPG/PNG

3. Before Panel shows screenshot

4. User selects mode → clicks **Generate View**

5. After Panel appears

6. User interacts with simplified interface

---

## **Journey C — Raw HTML Paste → Clarity View**

1. User expands **Paste HTML** tab

2. Pastes HTML into textbox

3. Click **Render Snapshot**

4. Before Panel shows generated render

5. User selects mode → Generate View

6. After Panel appears

---

## **Journey D — Interaction Loop (Dynamic View Updates)**

Common across all flows:

1. User clicks CTA (Next/Back/Select/Option)

2. Action token is sent to model

3. Model reinterprets:

   * Original screenshot/HTML

   * User action

   * Current mode

4. Updated simplified UI is returned

5. Back-propagation rules remain consistent:

   * Never hallucinate elements

   * Preserve hierarchy

   * Maintain task continuity

---

# **2\. COMPONENT-LEVEL BREAKDOWN**

(What Stitch must have as modular components)

These components are derived from the **Dynamic View Component Library** and UX rules in both project documents.

---

## **A. Shell Components (Global UI)**

| Component | Purpose |
| ----- | ----- |
| **App Header** | Logo \+ tagline or mode selector |
| **URL Input Module** | URL field, upload button, HTML paste |
| **Mode Selector** | Zen / Flow / ADHD |
| **Generate View CTA** | Trigger for transformation |
| **Two-Panel Container** | Holds Before \+ After panels |
| **Show/Hide Original Toggle** | Switch visibility of Before view |

---

## **B. Before Panel Components**

| Component | Description |
| ----- | ----- |
| **Screenshot Viewer** | Static full-page snapshot |
| **HTML Render Frame** | When HTML is pasted |
| **Hint Banner** | “This is the original webpage” |
| **Scrollable Pane** | For long pages |

---

## **C. After Panel (Dynamic View) Components**

| Component | Function |
| ----- | ----- |
| **Header (Title/Subtitles)** | Page title extracted via hierarchy |
| **Text Block** | Summaries, descriptions |
| **Card** | Grouping semantic clusters |
| **Accordion** | Collapsed sections for low-priority info |
| **Call-To-Action Button** | Next / Back / Continue / Select |
| **Stepper** | For multi-step flows (Flow Mode) |
| **Input Fields** | For forms detected |
| **Summary Component** | For final overview in flows |
| **Explainability Toggle** | “Why did you hide this?” (optional for hackathon) |

---

## **D. Mode-Specific UI Tokens**

### **Zen Mode**

* High whitespace

* Single-column layout

* Minimal UI chrome

* Typography-focused

### **Flow Mode**

* Stepper on top

* Cards grouped by task step

* Next/Back CTA at bottom

### **ADHD Mode**

* One dominant element per screen

* Extra-large CTA

* High-contrast focus bubble

* Reduced competing text

---

## **E. System / Scaffolding Components**

* Loading State (“Generating Clarity View…”)

* Plan Trace Overlay

* Error/Unsupported URL Message Modal

* Supported Domains Footer

---

# **UI Specifications for Clarity-UI**

## **Home Screen (URL \+ Mode Selection)**

**Design the Home Screen for ClarityUI.**  
 Show:

* A centered URL input bar with a “Fetch Page” button

* A secondary “Upload Screenshot” button

* A collapsible “Paste HTML” textarea component

* A horizontal Mode Selector with Zen, Flow, ADHD options

* A Generate View button (disabled until a snapshot is loaded)

* A footer area displaying the Supported Domains list

Layout priority: calm, clean, high whitespace.

Create a persistent theme control for ClarityUI: a prominent step-slider in the top-right header and a compact floating pill in the After Panel.

* Slider should show six labeled stops: **High Contrast Light (0)**, **Standard Light (1)**, **Mild Light (2)**, **Mild Dark (3)**, **Standard Dark (4)**, **High Contrast Dark (5)**.

* Include a separate **System** toggle (default on). In System mode, the slider UI shows system state (light/dark) but is disabled until user chooses explicit.

* The control must be keyboard-accessible and screen-reader labeled.

* Add visual preview swatches for the selected stop and a small contrast badge that reads PASS/FAIL based on WCAG.

* Theme control persists across pages (simulate persistence in prototype).

## **Two-Panel Layout** 

**Create a Two-Panel layout:**

* Left: Before Panel showing a screenshot placeholder with scroll

* Right: After Panel showing an empty state that says “Choose a mode and click Generate View”

* Include a Show/Hide Original toggle above the left panel

* Add a persistent header with mode selector

Panels should resize responsively.

In the After Panel wireframes (Zen, Flow, ADHD), ensure every component’s color and surface references theme variables (not absolute colors). Show the mapping of tokens to UI elements in an overlay. Demonstrate the same generated content under each of the six slider stops and System mode.

Add smooth color transition for theme switch, but show alternate prototype state where `prefers-reduced-motion` is on and transitions are disabled.

### **Two-Panel Cognitive Layout**

ClarityUI presents a two-panel layout where the Original Page appears on the left and the AI-generated Clarity View on the right. The width ratio changes based on the cognitive mode to reflect user intent:

Zen Mode: 50–50

Flow Mode: 40–60

ADHD Mode: 30–70 

This creates an intuitive visual hierarchy that reinforces the cognitive model of each mode. The Original View is dismissible, allowing the Clarity View to expand to 100% width for deep focus or task execution.

## After Panel — Zen Mode 

**Generate the simplified UI for Zen Mode:**

* Single-column reading layout

* Title block at top

* Text blocks for content summaries

* Cards for any grouped semantic clusters

* Soft spacing and minimal borders  
  Use skeleton placeholders as dynamic genUI components get loaded

## After Panel — Flow Mode

**Generate the Flow Mode UI:**

* Stepper with 3–5 steps

* A main card for the active step

* Secondary cards below for optional items

* Next / Back buttons at bottom

* Include a summary step layout placeholder 

Emphasize task progression.

## After Panel — ADHD Mode

**Generate ADHD Mode UI:**

* One dominant focal element or CTA

* Minimal supporting text below

* High contrast focus container

* Previous/Next navigation small and unobtrusive

* Large margin whitespace  

This is a focus-first view.

---

## **Two Panel Design** 

All the three two-panel views should follow the base two panel layout.  

The top bar has the Cognitive mode selector at centre and on the right edge it should have the theme intensity step slider followed by the settings & profile icon buttons. 

The left (original) view panel should have the url address and the show original toggle button at the top row of this left panel. 

Similarly, the right (clarity) view panel should have the specific options related to that cognition mode and the compact theme control pill (for panel specific control) at the top row of this right panel. 

For the Zen mode, the secondary options would be the clarity depth (suggestions inferred from prev design: Raw/Struct/Summary/Deep/Flux, Use what’s optimal) 

For the Flow mode, the secondary options would be the visual Step indicator and Step details.  

For the ADHD mode, the secondary options probably would be Reader, ADHD, Dyslexia, etc. (suggestions inferred from prev design, use what’s optimal). They should be highly relevant for the target user and not disrespectful or lack consideration. 

All three modes should have the same overall structure but the ratio of the two panels would be specific to each cognitive mode. 

Zen Mode → 50% / 50%

Zen: Calm reading, balanced typography.

Flow Mode → 40% / 60%

Flow: Structured steps, card hierarchy adapted to wider space. 

ADHD Mode → 30% / 70% 

ADHD: Single primary action element, large focus area.  

The left panel must be dismissible. When dismissed, the right panel expands to 100% width regardless of mode. 

---

## **Two-panel Demo for example use-cases**

Example 1: Cluttered News site  
For a cluttered news site, the user might just use Zen or ADHD for this use-case, but we should have a logical view for the Flow mode in-case the user toggles between them.   
This should provide a clear illustration of how ClarityUI should function in all three cognitive modes for a cluttered news site. 

Example 2: E-commerce product page   
Similarly, we should design the experience for E-commerce product page where all three cognitive modes should help with different levels of information density and CTAs for decision making.  

Example 3: Dense Government Form   
Similarly, either a complex flight search or a dense government form would be best illustrated with the Flow mode, but it should also have logical fallbacks for the Zen and ADHD modes.

Example 4: Complex Dashboard   
Finally, complex dashboards e.g. Google Analytics 4, is the ideal use case for the ADHD mode. And for this as well we should have logical & helpful views for the Zen and Flow modes. 

   
