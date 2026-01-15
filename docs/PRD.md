# Plume — Product Requirements Document

## Phase 1: UI/UX Mock Only

**Version:** 1.0  
**Last Updated:** January 15, 2026  
**Status:** Phase 1 — UI Prototype

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Design System & Principles](#2-design-system--principles)
3. [Phase 1 Deliverables](#3-phase-1-deliverables)
4. [Screen-by-Screen UI Specifications](#4-screen-by-screen-ui-specifications)
5. [Component Library Specifications](#5-component-library-specifications)
6. [Acceptance Criteria](#6-acceptance-criteria)
7. [Tech Stack (Phase 1)](#7-tech-stack-phase-1)
8. [Phase 2 Preview](#8-phase-2-preview)

---

## 1. Executive Summary

### 1.1 Product Vision

**Plume** is a lightweight internal contract creation and e-signature platform designed for speed, elegance, and legal defensibility. It enables teams to create contracts from templates, send them for signature, track status, and export evidence bundles—all with an Awwwards-level user experience.

### 1.2 Phase 1 Objective

Build a fully clickable, production-feeling prototype using mock data only. The prototype should be polished enough to win design awards and enable internal user testing before backend integration.

### 1.3 Target Users

| User Type | Description |
|-----------|-------------|
| **Internal Creators** | Sales, Partnerships, Ops, Legal-lite teams who create and send contracts |
| **External Signers** | Counterparties who receive, review, and sign contracts (mobile-first experience) |

### 1.4 Explicit Non-Goals (v1)

- No redlining or negotiation workflows
- No clause library search
- No approvals engine
- No eIDAS AdES/QES claims or QTSP integration
- No payments or notarization
- No complex workflow orchestration

---

## 2. Design System & Principles

### 2.1 Visual Style Direction

| Attribute | Specification |
|-----------|---------------|
| **Primary Aesthetic** | Glassmorphism + Aurora gradients |
| **Feel** | "Calm luxury software" — minimal, crisp, confidence-inspiring |
| **Responsiveness** | Desktop-first, mobile-perfect (especially signer flow) |
| **Depth** | Subtle parallax effects on key surfaces |

#### Color Philosophy

- **Background:** Deep, rich base tones with aurora gradient overlays
- **Glass Surfaces:** Semi-transparent panels with backdrop blur
- **Accents:** Vibrant but restrained accent colors for CTAs and status indicators
- **Contrast:** WCAG AA compliant at all times, even on glass layers

### 2.2 UX Principles

#### "Minimum Steps, Maximum Confidence"

Every interaction should feel intentional and reassuring:

1. **Progress Visibility** — Always show where the user is and what happens next
2. **Micro-Confirmations** — Every action produces a tangible, aesthetically pleasing response
3. **Error Prevention** — Design to prevent errors, not just handle them
4. **Calm Confidence** — The UI should feel trustworthy for legally binding actions

### 2.3 Motion Specifications

| Context | Behavior |
|---------|----------|
| **Page Transitions** | Smooth crossfades with subtle slide (200-300ms) |
| **Micro-interactions** | Springy but restrained (spring: stiffness 300, damping 30) |
| **Loading States** | Graceful skeleton screens with shimmer effect |
| **Success Confirmations** | Celebratory but professional (checkmark bloom, confetti reserved for completion) |
| **Reduced Motion** | Full alternative set with instant transitions, no parallax |

### 2.4 Accessibility Requirements

| Requirement | Target |
|-------------|--------|
| **WCAG Level** | AA compliance minimum |
| **Color Contrast** | 4.5:1 for normal text, 3:1 for large text (even on glass) |
| **Keyboard Navigation** | Full support with visible focus states |
| **Screen Readers** | ARIA labels on all interactive elements |
| **Focus Management** | Logical tab order, focus trapping in modals |
| **Reduced Motion** | `prefers-reduced-motion` fully supported |
| **High Contrast Mode** | Alternative theme with solid backgrounds |

### 2.5 Performance Budgets

| Metric | Target |
|--------|--------|
| **First Contentful Paint** | < 1.2s |
| **Largest Contentful Paint** | < 2.5s |
| **Time to Interactive** | < 3.5s |
| **Cumulative Layout Shift** | < 0.1 |
| **Total Bundle Size (initial)** | < 200KB gzipped |

---

## 3. Phase 1 Deliverables

### 3.1 Deliverable Checklist

| # | Deliverable | Description |
|---|-------------|-------------|
| 1 | **Responsive UI** | Desktop-first with mobile-perfect signer flow |
| 2 | **Creator Flow** | Dashboard → Template → Builder → Prepare → Send → Detail → Evidence |
| 3 | **Signer Flow** | Consent → Verify (mock OTP) → Review → Adopt & Sign → Done |
| 4 | **Design System** | Components, tokens, motion spec documented |
| 5 | **State Variants** | Empty, loading, and error states for all screens |
| 6 | **Copywriting** | Final plain-language, legal-friendly copy |

### 3.2 User Flow Diagrams

#### Creator Flow

```
┌──────────┐    ┌──────────────┐    ┌─────────────────┐    ┌─────────────────┐
│Dashboard │───▶│Template      │───▶│Contract Builder │───▶│Prepare for      │
│          │    │Gallery       │    │(Variables+Preview)│   │Signature        │
└──────────┘    └──────────────┘    └─────────────────┘    └────────┬────────┘
                                                                     │
┌──────────────┐    ┌─────────────────┐    ┌─────────────────┐      │
│Evidence      │◀───│Contract Detail  │◀───│Review & Send    │◀─────┘
│Bundle View   │    │(Timeline+Status)│    │                 │
└──────────────┘    └─────────────────┘    └─────────────────┘
```

#### Signer Flow (Mobile-First)

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│Landing   │───▶│Consent   │───▶│Verify    │───▶│Review    │───▶│Adopt &   │───▶│Confirm-  │
│Page      │    │Screen    │    │(OTP)     │    │Document  │    │Sign      │    │ation     │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
```

---

## 4. Screen-by-Screen UI Specifications

### 4.1 Creator Flow Screens

---

#### 4.1.1 Dashboard

**Purpose:** Central hub for managing all contracts

**Layout:**
- Top: Global navigation bar with search, notifications, user menu
- Left: Collapsible sidebar with filters (status, date range, template type)
- Center: Contract list with toggle between card view and list view
- Right: Quick actions panel (Create New, Recent Templates)

**Components:**

| Component | Specification |
|-----------|---------------|
| **Search Bar** | Glass-style input with search icon, instant filter |
| **View Toggle** | Icon buttons for card/list view with smooth transition |
| **Status Chips** | Draft (gray), Pending (amber), Completed (green), Voided (red) |
| **Contract Cards** | Glass panel with title, signers preview, status, date, quick actions |
| **List Rows** | Compact view with sortable columns |
| **Empty State** | Illustrated placeholder with "Create your first contract" CTA |
| **Loading State** | Skeleton cards/rows with shimmer animation |

**States:**

| State | Behavior |
|-------|----------|
| **Default** | Shows most recent contracts, sorted by updated date |
| **Empty** | Friendly illustration + CTA to create first contract |
| **Loading** | 6 skeleton cards with staggered shimmer |
| **Error** | Toast notification + retry button |
| **Filtered (no results)** | "No contracts match your filters" + clear filters link |

**Animations:**
- Cards appear with staggered fade-up on load
- View toggle: crossfade between card and list layouts
- Hover: subtle lift effect on cards

---

#### 4.1.2 Template Gallery

**Purpose:** Browse and select contract templates

**Layout:**
- Left (60%): Scrollable grid of template cards
- Right (40%): Preview panel showing selected template details

**Components:**

| Component | Specification |
|-----------|---------------|
| **Template Cards** | Thumbnail preview, name, description snippet, "Use" button |
| **Category Tabs** | Horizontal scrollable tabs for template categories |
| **Preview Panel** | Full template preview with variable list, metadata |
| **Use Template Button** | Primary CTA, proceeds to Contract Builder |
| **Search/Filter** | Filter by category, search by name |

**States:**

| State | Behavior |
|-------|----------|
| **Default** | First template selected, preview visible |
| **No Selection** | Preview panel shows "Select a template to preview" |
| **Loading** | Skeleton grid + skeleton preview panel |
| **Empty Category** | "No templates in this category" message |

**Animations:**
- Template selection: preview panel content crossfades
- Hover on cards: subtle scale + glow effect
- "Use Template" click: button transforms to loading, then navigates

---

#### 4.1.3 Contract Builder

**Purpose:** Fill in template variables and preview the resulting contract

**Layout:**
- Left pane (40%): Variables form with grouped inputs
- Right pane (60%): Live PDF preview with variable highlights

**Components:**

| Component | Specification |
|-----------|---------------|
| **Variables Form** | Grouped form fields based on template schema |
| **Field Types** | Text, date picker, dropdown, currency, multi-line |
| **Validation** | Inline validation with helpful error messages |
| **Live Preview** | PDF renderer with highlighted variable regions |
| **Progress Indicator** | Shows completion percentage of required fields |
| **Actions** | Save Draft, Continue to Prepare |

**States:**

| State | Behavior |
|-------|----------|
| **Initial** | Empty form, preview shows template with placeholders |
| **In Progress** | Form partially filled, preview updates in real-time |
| **Complete** | All required fields filled, Continue button enabled |
| **Validation Error** | Inline errors on fields, Continue disabled |
| **Loading Preview** | Skeleton preview while PDF renders |

**Animations:**
- Variable fill: preview region highlights briefly when updated
- Form sections: accordion expand/collapse with spring animation
- Save draft: subtle confirmation toast slides in

---

#### 4.1.4 Prepare for Signature

**Purpose:** Add signers and configure signature placement

**Layout:**
- Top: Signer list with add/remove functionality
- Center: Document preview with draggable signature field placement
- Bottom: Sticky action bar with Send button

**Components:**

| Component | Specification |
|-----------|---------------|
| **Signer Cards** | Name, email, role label, signing order (drag to reorder) |
| **Add Signer** | Button opens modal/inline form |
| **Document Preview** | PDF with overlay for placing signature fields |
| **Signature Fields** | Draggable/resizable signature blocks per signer |
| **Field Types** | Signature, Initials, Date Signed (auto-populated) |
| **Signing Order Toggle** | Enable/disable sequential signing |

**States:**

| State | Behavior |
|-------|----------|
| **No Signers** | Prompt to add at least one signer |
| **Signers Added** | Ready to place fields |
| **Fields Placed** | Continue enabled |
| **Incomplete** | Warning indicator for signers without fields |

**Animations:**
- Drag signer card: lift + shadow effect
- Drop signature field: snap-to-position with spring
- Reorder: smooth list reflow animation

---

#### 4.1.5 Review & Send

**Purpose:** Final review before sending for signatures

**Layout:**
- Center: Summary card with all details
- Document preview thumbnail
- Signer list with order
- Send options (custom message, reminders)
- Primary "Send for Signature" CTA

**Components:**

| Component | Specification |
|-----------|---------------|
| **Summary Card** | Contract title, template used, creation date |
| **Document Thumbnail** | Clickable to open full preview modal |
| **Signer Summary** | List of signers with status badges |
| **Custom Message** | Optional textarea for email body |
| **Reminder Settings** | Dropdown for reminder frequency |
| **Send Button** | Primary action with confirmation dialog |

**States:**

| State | Behavior |
|-------|----------|
| **Ready** | All information complete, Send enabled |
| **Sending** | Button shows loading state, form disabled |
| **Sent** | Success confirmation, redirect to Contract Detail |
| **Error** | Error toast with retry option |

**Animations:**
- Send button: transforms to checkmark on success
- Success: confetti burst (subtle, professional)
- Redirect: smooth page transition

---

#### 4.1.6 Contract Detail

**Purpose:** Track contract status and signer progress

**Layout:**
- Top: Contract header with title, status badge, actions
- Left: Timeline of events (audit trail)
- Right: Signer status cards with progress
- Bottom: Action buttons (Void, Resend, Download)

**Components:**

| Component | Specification |
|-----------|---------------|
| **Status Badge** | Large, prominent status indicator |
| **Timeline** | Vertical timeline with event types and timestamps |
| **Signer Cards** | Name, status, last activity, resend option |
| **Document Preview** | Thumbnail with "View Full" option |
| **Actions Menu** | Void, Resend to specific signer, Download |
| **Evidence Bundle CTA** | Visible when completed |

**Timeline Events:**
- Contract created
- Contract sent
- Email delivered (per signer)
- Document viewed (per signer)
- Signature completed (per signer)
- Contract completed
- Evidence bundle generated

**States:**

| State | Behavior |
|-------|----------|
| **Pending** | Waiting for signatures, shows progress |
| **Partially Signed** | Some signers complete, others pending |
| **Completed** | All signed, evidence bundle available |
| **Voided** | Struck-through appearance, no actions available |

**Animations:**
- Timeline events: staggered fade-in on load
- Status updates: badge pulses briefly on change
- Real-time updates: new events slide in (mock in Phase 1)

---

#### 4.1.7 Evidence Bundle View

**Purpose:** Preview the evidence bundle contents

**Layout:**
- Header: Bundle metadata (created date, hash preview)
- Sections: Expandable panels for each bundle component
- Download: Primary download button

**Components:**

| Component | Specification |
|-----------|---------------|
| **Bundle Header** | Generation date, envelope ID, verification hash |
| **Signed PDF Section** | Thumbnail + metadata |
| **Audit Trail Section** | Timeline summary |
| **Consent Records Section** | Per-signer consent details |
| **Hash Verification** | Visual hash display with copy button |
| **Download Button** | Downloads .zip bundle |

**States:**

| State | Behavior |
|-------|----------|
| **Generating** | Progress indicator with status messages |
| **Ready** | All sections expandable, download enabled |
| **Error** | Error message with regenerate option |

---

### 4.2 Signer Flow Screens (Mobile-First)

---

#### 4.2.1 Landing Page

**Purpose:** Entry point from email link

**Layout:**
- Centered content card on aurora background
- Company/brand header
- Contract summary
- "Review Document" CTA

**Components:**

| Component | Specification |
|-----------|---------------|
| **Brand Header** | Sender's company name/logo |
| **Welcome Message** | "You've been invited to sign: [Contract Title]" |
| **Contract Summary** | Sender name, document name, page count |
| **Security Indicator** | Lock icon with "Secure signing session" |
| **CTA Button** | "Review Document" - large, thumb-friendly |

**States:**

| State | Behavior |
|-------|----------|
| **Valid Link** | Full landing page content |
| **Expired Link** | "This link has expired" with contact info |
| **Already Signed** | "You've already signed" with download option |
| **Loading** | Centered spinner on aurora background |

---

#### 4.2.2 Consent Screen

**Purpose:** Capture electronic signature consent

**Layout:**
- Scrollable consent text
- Checkbox for acceptance
- Continue button (disabled until accepted)

**Components:**

| Component | Specification |
|-----------|---------------|
| **Consent Header** | "Electronic Signature Consent" |
| **Consent Text** | Full disclosure text (scrollable) |
| **Scroll Indicator** | Visual cue if content extends below fold |
| **Acceptance Checkbox** | "I agree to use electronic signatures" |
| **Continue Button** | Enabled only after checkbox |

**States:**

| State | Behavior |
|-------|----------|
| **Initial** | Checkbox unchecked, Continue disabled |
| **Scrolled** | Track that user scrolled through content |
| **Accepted** | Checkbox checked, Continue enabled |

---

#### 4.2.3 Verify (OTP)

**Purpose:** Email verification via one-time passcode

**Layout:**
- Centered verification card
- Email display (masked)
- 6-digit OTP input
- Resend option

**Components:**

| Component | Specification |
|-----------|---------------|
| **Verification Header** | "Verify your email" |
| **Email Display** | Partially masked (j***@example.com) |
| **OTP Input** | 6 individual digit boxes, auto-advance |
| **Resend Link** | "Didn't receive code? Resend" with cooldown |
| **Back Link** | Return to previous step |

**States:**

| State | Behavior |
|-------|----------|
| **Initial** | Empty OTP fields, awaiting input |
| **Entering** | Fields fill as user types |
| **Verifying** | Loading state after 6 digits entered |
| **Success** | Brief checkmark, auto-proceed |
| **Error** | Shake animation, "Invalid code" message, clear fields |
| **Resend Cooldown** | "Resend in 30s" countdown |

**Animations:**
- OTP boxes: scale up slightly on focus
- Auto-advance: smooth focus transition between boxes
- Error: shake animation on input group
- Success: checkmark bloom effect

---

#### 4.2.4 Review Document

**Purpose:** Read and review the contract before signing

**Layout:**
- Full-screen document viewer
- Bottom toolbar with navigation and sign CTA
- Page indicator

**Components:**

| Component | Specification |
|-----------|---------------|
| **Document Viewer** | Pinch-zoom enabled PDF viewer |
| **Page Navigation** | Previous/Next buttons, page indicator |
| **Signature Highlights** | Pulsing indicators where signature needed |
| **Sign CTA** | Fixed bottom button "Continue to Sign" |
| **Download Option** | Download unsigned copy for review |

**States:**

| State | Behavior |
|-------|----------|
| **Loading** | Skeleton document with loading indicator |
| **Viewing** | Full document with navigation |
| **Scrolled to End** | Sign CTA becomes more prominent |

---

#### 4.2.5 Adopt & Sign

**Purpose:** Capture signature with intent confirmation

**Layout:**
- Signature capture area
- Signature options (draw, type, upload)
- Preview of signature
- Final confirmation checkbox
- Sign button

**Components:**

| Component | Specification |
|-----------|---------------|
| **Signature Tabs** | Draw / Type / Upload options |
| **Draw Canvas** | Touch-friendly drawing area |
| **Type Input** | Text input with signature font preview |
| **Signature Preview** | Shows how signature will appear |
| **Clear Button** | Reset signature |
| **Intent Checkbox** | "I agree this is my legal signature" |
| **Sign Button** | "Adopt & Sign" - final action |

**States:**

| State | Behavior |
|-------|----------|
| **No Signature** | Sign button disabled |
| **Signature Captured** | Preview shows, checkbox still required |
| **Ready to Sign** | Checkbox checked, Sign enabled |
| **Signing** | Loading state, prevent double-submit |
| **Complete** | Success animation, proceed to confirmation |

**Animations:**
- Tab switch: crossfade content
- Signature capture: ink trail effect on draw
- Sign button: transforms to checkmark on success

---

#### 4.2.6 Confirmation

**Purpose:** Confirm successful signature and provide next steps

**Layout:**
- Success illustration
- Confirmation message
- Download signed copy option
- Close/exit option

**Components:**

| Component | Specification |
|-----------|---------------|
| **Success Illustration** | Animated checkmark with celebration effect |
| **Confirmation Header** | "Successfully Signed!" |
| **Summary** | Contract name, signed timestamp |
| **Download Button** | "Download Your Copy" |
| **Email Notice** | "A copy has been sent to your email" |
| **Close Button** | "Close this window" |

**Animations:**
- Success checkmark: bloom animation
- Subtle confetti or particle effect
- Staggered fade-in for content elements

---

## 5. Component Library Specifications

### 5.1 Color System

#### Base Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-background-base` | `#0a0a0f` | Page background |
| `--color-background-elevated` | `#12121a` | Card backgrounds |
| `--color-surface-glass` | `rgba(255, 255, 255, 0.05)` | Glass panels |
| `--color-surface-glass-hover` | `rgba(255, 255, 255, 0.08)` | Glass hover state |
| `--color-border-subtle` | `rgba(255, 255, 255, 0.1)` | Subtle borders |
| `--color-border-default` | `rgba(255, 255, 255, 0.15)` | Default borders |

#### Aurora Gradients

| Token | Value | Usage |
|-------|-------|-------|
| `--gradient-aurora-1` | `radial-gradient(ellipse at 20% 50%, #6366f180 0%, transparent 50%)` | Background accent |
| `--gradient-aurora-2` | `radial-gradient(ellipse at 80% 50%, #8b5cf680 0%, transparent 50%)` | Background accent |
| `--gradient-aurora-3` | `radial-gradient(ellipse at 50% 100%, #06b6d480 0%, transparent 50%)` | Background accent |

#### Semantic Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#6366f1` | Primary actions, links |
| `--color-primary-hover` | `#818cf8` | Primary hover state |
| `--color-success` | `#10b981` | Success states |
| `--color-warning` | `#f59e0b` | Warning states |
| `--color-error` | `#ef4444` | Error states |
| `--color-text-primary` | `#ffffff` | Primary text |
| `--color-text-secondary` | `rgba(255, 255, 255, 0.7)` | Secondary text |
| `--color-text-muted` | `rgba(255, 255, 255, 0.5)` | Muted text |

### 5.2 Typography Scale

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `--text-display` | 48px | 600 | 1.1 | Hero headings |
| `--text-h1` | 32px | 600 | 1.2 | Page titles |
| `--text-h2` | 24px | 600 | 1.3 | Section headings |
| `--text-h3` | 20px | 500 | 1.4 | Subsection headings |
| `--text-body-lg` | 18px | 400 | 1.6 | Large body text |
| `--text-body` | 16px | 400 | 1.6 | Default body text |
| `--text-body-sm` | 14px | 400 | 1.5 | Small body text |
| `--text-caption` | 12px | 400 | 1.4 | Captions, labels |

**Font Stack:** `'Inter Variable', 'Inter', system-ui, sans-serif`

### 5.3 Button Variants

#### Primary Button
- Background: `var(--color-primary)`
- Text: White
- Border-radius: 12px
- Padding: 12px 24px
- Hover: `var(--color-primary-hover)` + subtle glow
- Active: Scale 0.98
- Disabled: 50% opacity, no interactions

#### Secondary Button
- Background: `var(--color-surface-glass)`
- Text: `var(--color-text-primary)`
- Border: 1px `var(--color-border-default)`
- Hover: `var(--color-surface-glass-hover)`

#### Ghost Button
- Background: Transparent
- Text: `var(--color-text-secondary)`
- Hover: `var(--color-surface-glass)`

#### Destructive Button
- Background: `var(--color-error)`
- Text: White
- Use for: Void, Delete actions

### 5.4 Input Components

#### Text Input
- Background: `var(--color-surface-glass)`
- Border: 1px `var(--color-border-subtle)`
- Border-radius: 8px
- Padding: 12px 16px
- Focus: Border `var(--color-primary)`, subtle glow
- Error: Border `var(--color-error)`

#### Select/Dropdown
- Same base styling as text input
- Chevron icon on right
- Dropdown panel: glass surface with backdrop blur

#### Checkbox
- Size: 20x20px
- Border-radius: 6px
- Checked: Primary color fill with white checkmark
- Animation: Scale + checkmark draw on check

### 5.5 Cards and Panels

#### Glass Card
```css
.glass-card {
  background: var(--color-surface-glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--color-border-subtle);
  border-radius: 16px;
  padding: 24px;
}
```

#### Elevated Card
- Adds subtle shadow
- Used for interactive cards (hover lift effect)

### 5.6 Status Indicators

| Status | Color | Icon |
|--------|-------|------|
| Draft | `#6b7280` (gray) | File icon |
| Pending | `#f59e0b` (amber) | Clock icon |
| Viewed | `#3b82f6` (blue) | Eye icon |
| Signed | `#10b981` (green) | Check icon |
| Completed | `#10b981` (green) | Double check icon |
| Voided | `#ef4444` (red) | X icon |
| Expired | `#6b7280` (gray) | Clock expired icon |

### 5.7 Modal Dialogs

- Backdrop: `rgba(0, 0, 0, 0.8)` with blur
- Panel: Glass card styling, max-width 500px
- Animation: Fade in backdrop, scale up panel
- Focus trap: Keyboard focus contained within modal
- Close: X button in corner, Escape key, backdrop click

### 5.8 Toast Notifications

- Position: Bottom-right (desktop), bottom-center (mobile)
- Types: Success (green), Error (red), Warning (amber), Info (blue)
- Animation: Slide up, auto-dismiss after 5s
- Progress bar: Shows time until dismiss
- Dismissible: Click X or swipe (mobile)

---

## 6. Acceptance Criteria

### 6.1 Flow Completeness

| Criterion | Test |
|-----------|------|
| **AC-1** | Entire creator flow is clickable end-to-end: Dashboard → Template → Builder → Prepare → Send → Detail → Evidence |
| **AC-2** | Entire signer flow is clickable end-to-end: Landing → Consent → Verify → Review → Sign → Confirmation |
| **AC-3** | Navigation between screens uses realistic page transitions |
| **AC-4** | All CTAs are functional and lead to appropriate next steps |
| **AC-5** | Back navigation works correctly throughout both flows |

### 6.2 State Coverage

| Criterion | Test |
|-----------|------|
| **AC-6** | Each screen includes an empty state design |
| **AC-7** | Each screen includes a loading state with skeleton/spinner |
| **AC-8** | Each screen includes error state handling |
| **AC-9** | Form validation states are implemented (error, success) |
| **AC-10** | Interactive elements have hover, active, focus, and disabled states |

### 6.3 Mobile Experience

| Criterion | Test |
|-----------|------|
| **AC-11** | Signer flow is fully functional on mobile viewport (375px width) |
| **AC-12** | Touch targets are minimum 44x44px |
| **AC-13** | OTP input supports mobile keyboard (numeric) |
| **AC-14** | Document viewer supports pinch-zoom on mobile |
| **AC-15** | Signature drawing works with touch input |

### 6.4 Accessibility

| Criterion | Test |
|-----------|------|
| **AC-16** | All color combinations meet WCAG AA contrast ratios |
| **AC-17** | All interactive elements are keyboard accessible |
| **AC-18** | Focus states are clearly visible |
| **AC-19** | Reduced-motion mode disables animations |
| **AC-20** | High-contrast mode is implemented and functional |
| **AC-21** | Screen reader testing passes with no critical issues |

### 6.5 Design Quality

| Criterion | Test |
|-----------|------|
| **AC-22** | Visual design matches glassmorphism + aurora aesthetic |
| **AC-23** | Animations are smooth (60fps) and appropriately timed |
| **AC-24** | Typography is consistent with design tokens |
| **AC-25** | Spacing and layout are consistent throughout |
| **AC-26** | Copy is final, plain-language, and legally appropriate |

---

## 7. Tech Stack (Phase 1)

### 7.1 Core Framework

| Technology | Purpose |
|------------|---------|
| **Next.js 14+** | React framework with App Router |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Utility-first styling |

### 7.2 UI Components

| Technology | Purpose |
|------------|---------|
| **Radix UI** | Accessible primitives (Dialog, Dropdown, Tabs) |
| **shadcn/ui** | Pre-built component patterns |
| **Framer Motion** | Animation library |

### 7.3 Development Tools

| Technology | Purpose |
|------------|---------|
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **Storybook** | Component documentation (optional) |

### 7.4 Mock Data Strategy

- All data comes from static JSON fixtures
- Simulated API delays (300-800ms) for realistic feel
- State managed with React useState/useReducer
- No backend integration in Phase 1

---

## 8. Phase 2 Preview

Phase 2 transforms the UI prototype into a fully functional application with:

### 8.1 Backend Integration
- Postgres database for metadata and audit events
- S3-compatible object storage for documents
- Real PDF generation from templates
- Email delivery (Postmark/SES) for invites and OTP

### 8.2 Authentication & Security
- Internal user authentication (Auth0/Clerk)
- Single-use magic link signing sessions
- Email OTP verification
- Tenant isolation and RBAC

### 8.3 Document Integrity
- SHA-256 hashing at finalize and completion
- Immutable document storage with versioning
- Tamper detection on export

### 8.4 Evidence Bundle Generation
- Deterministic bundle creation
- Includes: signed PDF, audit trail, consent records, hashes
- Hash-verified exports

### 8.5 Legal Compliance
- US B2B lane (ESIGN/UETA compliant)
- EU simple e-sign lane (eIDAS simple)
- Append-only audit log
- Configurable retention policies

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| **Envelope** | A container for a contract document and its signers |
| **Template** | A reusable contract structure with variable placeholders |
| **Signer** | An external party who must sign the document |
| **Evidence Bundle** | A packaged set of proof artifacts (signed doc, audit trail, hashes) |
| **OTP** | One-Time Passcode for email verification |
| **Magic Link** | Single-use URL for signer access |
| **Canonical PDF** | The finalized, pre-signature version of the document |

---

## Appendix B: Open Questions (Phase 1)

1. **Brand customization:** Should the signer flow support custom logos/colors per tenant in Phase 1 mock?
2. **Multiple signature types:** Should we show initials + full signature options, or simplify to signature only?
3. **Template categories:** What are the initial category names for the template gallery?
4. **Notification preferences:** Should reminder frequency be configurable in Phase 1 UI?

---

*End of Phase 1 PRD*
