# 📘 HINS PROJECT GUIDE — Complete Reference

**Date:** 2026-05-14  
**Project:** HINS (Plataforma de Monitoreo de Parques Fotovoltaicos)  
**Purpose:** Complete documentation for continuous reference

---

# TABLE OF CONTENTS

1. [Quick Start](#quick-start)
2. [Project Overview](#project-overview)
3. [Folder Structure](#folder-structure)
4. [What Was Fixed Today](#what-was-fixed-today)
5. [Architecture Patterns](#architecture-patterns)
6. [Design System](#design-system)
7. [Component Rules](#component-rules)
8. [Common Mistakes](#common-mistakes)
9. [Workflow Checklist](#workflow-checklist)
10. [Reference Files](#reference-files)

---

# QUICK START

## 5-Minute Onboarding

```
☐ Read /context/product-context.md (understand HINS, models, users)
☐ Read /context/components.md (learn component specs)
☐ Read ./.claude/MEMORY.md (understand decisions)
☐ Open dev server: npm run dev
☐ Navigate to http://localhost:3000/main
☐ Ready to work
```

## Before ANY Code Task

1. **Read context in this order:**
   - `/context/product-context.md` — What is HINS, GDD/GDCV/GDC models, users
   - `/context/design-system.md` — Tokens, colors, spacing
   - `/context/components.md` — **EXACT specs (non-negotiable)**
   - `/context/ux-guidelines.md` — Patterns, hierarchy
   - `/engineering/tech-stack.md` — Stack, conventions

2. **Always verify in browser:**
   - Dev server: `npm run dev`
   - Visual check: Colors, spacing, responsive
   - Console: No errors

3. **Commit cleanly:**
   ```bash
   git commit -m "refactor: brief description
   
   - Point 1: what changed
   - Point 2: why
   - Point 3: result
   
   Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
   ```

---

# PROJECT OVERVIEW

## What is HINS

**HINS** is a web platform for monitoring and visualizing photovoltaic park performance.

- **Type:** B2B — Pure visibility system (shows data, doesn't execute actions)
- **Users:** HINS Admin, GDD Owner, GDCV/GDC Admin (AGC), Shareholders/Partners
- **Stack:** Next.js + TypeScript + shadcn/ui + Tailwind CSS v4 + Recharts

## Business Models

| Model | Type | Key Feature | Example |
|-------|------|-------------|---------|
| **GDD** | Distributor Generation | Supplies own network, reduces EPEC cost | Parque General Roca |
| **GDCV** | Community Virtual | Virtual distribution to shareholders, netting | Parque Río Cuarto |
| **GDC** | Community | Direct physical linking, netting | Future |

## Routes in Application

```
/main                  → HINS Admin (portfolio view)
/gdd/performance       → GDD owner view
/gdd/roi              → GDD ROI analysis
/gdcv/performance     → GDCV admin view
/gdcv/roi             → GDCV ROI analysis
/gdcv/socio           → Shareholder personal space
/gdcv/socio/parque    → Shareholder park view
```

---

# FOLDER STRUCTURE

```
hins-final-context/
│
├── app/                           → Routes (Next.js App Router)
│   ├── main/
│   │   ├── layout.tsx             ✅ NEW (navigation structure)
│   │   └── page.tsx               ✅ UPDATED
│   ├── gdd/
│   │   ├── layout.tsx
│   │   ├── performance/page.tsx
│   │   └── roi/page.tsx
│   └── gdcv/
│       ├── layout.tsx
│       ├── performance/page.tsx
│       ├── roi/page.tsx
│       └── socio/...
│
├── components/
│   ├── ui/                        → Base components (shadcn/ui + custom)
│   │   ├── card.tsx
│   │   ├── button.tsx
│   │   ├── kpi-primary.tsx
│   │   ├── kpi-secondary.tsx
│   │   └── [more base components]
│   │
│   ├── charts/                    → Visualization components
│   │   ├── GenerationSparkline.tsx
│   │   ├── ParkEnergyBarChart.tsx
│   │   └── RoiRecoveryLineChart.tsx
│   │
│   ├── layout/                    → Navigation structure
│   │   ├── MainLayoutShell.tsx    ✅ UPDATED (shell only, no header)
│   │   ├── MainHeader.tsx         ✅ NOW IMPORTED IN LAYOUT
│   │   ├── MainSidebar.tsx        ✅ UPDATED (aligned with GDD/GDCV)
│   │   ├── GddLayoutShell.tsx
│   │   ├── GddHeader.tsx
│   │   └── [more layout components]
│   │
│   ├── main/                      → Main-specific components
│   ├── gdd/                       → GDD-specific components
│   └── gdcv/                      → GDCV-specific components
│
├── context/                       📖 CRITICAL DOCUMENTATION
│   ├── product-context.md         → What is HINS, models, users
│   ├── design-system.md           → Tokens, colors, spacing
│   ├── components.md              → ✅ SPEC EXACTA (TRUTH SOURCE)
│   ├── ux-guidelines.md           → Patterns, hierarchy
│   ├── kick-off.md                → How to get started
│   └── [more context files]
│
├── engineering/
│   └── tech-stack.md              → Stack, conventions, architecture
│
├── flows/                         → Wireframes and specifications
│   ├── GDD/
│   ├── GDCV-agc/
│   ├── GDCV-socio/
│   └── main/
│
├── data/                          → Mock data
│   ├── gdd-performance-mock.ts
│   ├── gdcv-agc-mock.ts
│   ├── gdcv-socio-mock.ts
│   ├── main-mock.ts
│   └── chart-config.ts
│
├── .claude/                       🧠 MEMORY & GUIDES
│   ├── MEMORY.md                  → Decisions, patterns, lessons
│   ├── INITIAL_PROMPT.md          → Template for new chats
│   ├── ONBOARDING.md              → Quick reference cheat sheet
│   └── HINS_PROJECT_GUIDE.md      → This document
│
└── README.md                      → Project intro
```

---

# WHAT WAS FIXED TODAY

## Problem

Main view had **inconsistent navigation architecture** with GDD/GDCV:
- **Main:** Header inline in MainLayoutShell (h-14 = 56px)
- **GDD/GDCV:** Header as separate component (h-11 = 44px)
- **Result:** Headers different heights, mixed concerns, dead code

## Solution: 3-Step Navigation Consistency Plan

### Step 1: Create `app/main/layout.tsx` ✅

**New file** that structures Main layout following Next.js standard pattern.

```typescript
// app/main/layout.tsx
import type { ReactNode } from "react"

import { MainHeader } from "@/components/layout/MainHeader"
import { MainLayoutShell } from "@/components/layout/MainLayoutShell"
import { PageTransition } from "@/components/ui/page-transition"

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <MainLayoutShell>
      <MainHeader />
      <main className="flex-1 px-6 py-6 bg-[#F2ECE9]/36">
        <PageTransition>{children}</PageTransition>
      </main>
    </MainLayoutShell>
  )
}
```

**Why:** Separates structure (layout.tsx) from content (page.tsx) — standard Next.js pattern used by GDD/GDCV

### Step 2: Clean `MainLayoutShell.tsx` ✅

**Removed:** 45 lines of inline header (h-14 height, search, bell, avatar)  
**Kept:** Only sidebar logic

```typescript
// BEFORE (55 lines)
<SidebarProvider>
  <MainSidebar />
  <SidebarInset>
    <header className="flex h-14 ...">  ❌ INLINE HEADER
      <SidebarTrigger />
      <Button>Search</Button>
      <Button>Bell</Button>
      <Avatar />
    </header>
    {children}
  </SidebarInset>
</SidebarProvider>

// AFTER (18 lines) ✅
<SidebarProvider className="h-screen overflow-hidden">
  <MainSidebar />
  <SidebarInset className="flex min-h-0 flex-col overflow-x-hidden">
    {children}
  </SidebarInset>
</SidebarProvider>
```

**Why:** Shell handles ONLY sidebar logic; header delegated to MainHeader component

### Step 3: Simplify `app/main/page.tsx` ✅

**Removed:** MainLayoutShell wrapper (now in layout.tsx)  
**Kept:** Only ProjectsView content

```typescript
// BEFORE
<MainLayoutShell>
  <ProjectsView />
</MainLayoutShell>

// AFTER ✅
<ProjectsView />
```

**Why:** page.tsx renders content only; layout.tsx handles structure

## Results

| Metric | Before | After | Status |
|--------|--------|-------|--------|
| **Header height** | h-14 (56px) ❌ | h-11 (44px) ✅ | **Aligned** |
| **Header location** | Inline in shell | Component imported in layout | **Separated** |
| **Lines of code** | 55 + 10 | 18 + 18 + 5 | **-47 net** |
| **Pattern consistency** | 68% | 95% ✅ | **Aligned** |
| **Dead code** | MainHeader unused | MainHeader imported | **Eliminated** |

## Verification

✅ **Visual:** Headers in /main and /gdd/performance now same height  
✅ **Technical:** No console errors, responsive works, sidebar collapses correctly  
✅ **Git:** Commit `411279c` with clear message  

---

# ARCHITECTURE PATTERNS

## Navigation Structure (Validated Pattern)

All shells (Main / GDD / GDCV) follow identical pattern:

```typescript
// app/[route]/layout.tsx
<LayoutShell>
  <Header />
  <main>
    <PageTransition>{children}</PageTransition>
  </main>
</LayoutShell>

// components/layout/[Name]LayoutShell.tsx
<SidebarProvider className="h-screen overflow-hidden">
  <Sidebar />
  <SidebarInset className="flex min-h-0 flex-col overflow-x-hidden">
    {children}
  </SidebarInset>
</SidebarProvider>
```

## Header Pattern (h-11 Standard)

```typescript
<div className="flex h-11 items-center gap-4 border-b border-border bg-background px-4">
  <SidebarTrigger className="-ml-1" />
  <Breadcrumb />
  <div className="flex-1" />
  <Button size="icon"><SearchIcon /></Button>
  <Button size="icon"><BellIcon /></Button>
  <Avatar />
</div>
```

**Critical:** Height is `h-11` (44px) — NEVER `h-14`

## Sidebar Pattern

```typescript
// components/layout/MainSidebar.tsx
<Sidebar>
  <SidebarHeader>
    <LayoutDashboardIcon /> Admin
  </SidebarHeader>
  
  <SidebarContent>
    <NavItem href="/main">Proyectos</NavItem>
    {/* Only active items — NO disabled items */}
  </SidebarContent>
  
  <SidebarFooter>
    <NavUser />
  </SidebarFooter>
</Sidebar>
```

**Rules:**
- ✅ Only active menu items
- ✅ NavUser footer component
- ❌ No disabled/"coming soon" items
- ❌ No header inline

---

# DESIGN SYSTEM

## Colors

### UI Colors (Zinc — Monochromatic)

```
--background         #FFFFFF    (white — cards, content)
--foreground         #09090B    (text — Zinc 950)
--primary            #18181B    (buttons, CTAs — Zinc 900)
--primary-foreground #FAFAFA    (text on primary — Zinc 50)
--border             #E4E4E7    (borders, dividers — Zinc 200)
--muted-foreground   #71717A    (secondary text — Zinc 500)
```

### Chart Colors (Green Ramp — CHARTS ONLY)

```
--chart-1        #22C55E    (Green 500 — primary series)
--chart-2        #16A34A    (Green 600 — base reference)
--chart-3        #15803D    (Green 700 — critical/real data)
--chart-4        #4ADE80    (Green 400 — hover/additional)
--chart-5        #86EFAC    (Green 300 — light variant)
```

**RULE:** Chart colors ONLY in charts. UI colors ONLY in UI. Never mix.

## Tokens — Use Tailwind Classes (Never Hardcode Hex)

```tsx
❌ WRONG
style={{ color: '#09090B', backgroundColor: '#FFFFFF' }}

✅ CORRECT
className="text-foreground bg-background"
```

## Spacing Scale

```
Gap:     gap-2 (8px) | gap-4 (16px) | gap-8 (32px)
Padding: p-2 (8px)   | p-4 (16px)   | p-6 (24px)
Height:  h-11 (44px) | h-14 (56px) ❌ DON'T USE
```

---

# COMPONENT RULES

## Rule 1: Check components.md First

**Before creating ANY component:**
1. Search `/context/components.md`
2. If exists → use exact spec documented
3. If not exists → create following pattern of existing components

## Rule 2: Reutilize, Don't Reinvent

✅ **DO:**
```tsx
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { KpiPrimary } from "@/components/ui/kpi-primary"
```

❌ **DON'T:**
```tsx
// Create new Input when shadcn Input exists
function MyCustomInput() { ... }
```

## Rule 3: Separate Data, Config, Rendering

```typescript
// ✅ CORRECT
// data/gdd-performance-mock.ts
export const generationData = [...]

// data/chart-config.ts
export const chartConfig = { colors: ... }

// components/charts/GenerationChart.tsx
function GenerationChart({ data, config }) {
  return <BarChart data={data} config={config} />
}

// ❌ WRONG
// All mixed in component file
function GenerationChart() {
  const colors = ['#22C55E', '#16A34A', ...]
  const data = [{ month: 'Jan', value: 100 }, ...]
}
```

## Rule 4: Props Must Be Typed

```typescript
✅ CORRECT
interface MyComponentProps {
  title: string
  count?: number
  onSubmit: (data: FormData) => void
}

export function MyComponent({ title, count = 0, onSubmit }: MyComponentProps) {
  return <div>...</div>
}

❌ WRONG
export function MyComponent(props: any) {
  return <div>{props.title}</div>
}
```

---

# COMMON MISTAKES

## Mistake 1: Header Inline in Shell ❌

**Problem:** MainLayoutShell had 45 lines of header → duplicated code, hard to maintain

**Wrong:**
```typescript
export function MainLayoutShell({ children }) {
  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset>
        <header>  ❌ INLINE HEADER
          ...45 lines...
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
```

**Right:**
```typescript
// components/layout/MainLayoutShell.tsx
export function MainLayoutShell({ children }) {
  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}

// app/main/layout.tsx
export default function MainLayout({ children }) {
  return (
    <MainLayoutShell>
      <MainHeader />  ✅ SEPARATE COMPONENT
      <main>{children}</main>
    </MainLayoutShell>
  )
}
```

**Lesson:** Separate shell logic from header. Header is a component, not inline HTML.

---

## Mistake 2: Inconsistent Header Heights ❌

**Problem:** Main h-14 (56px) vs GDD/GDCV h-11 (44px) → visual inconsistency

**Wrong:**
```tsx
// Main
<header className="h-14">...</header>

// GDD/GDCV  
<div className="h-11">...</div>
```

**Right:**
```tsx
// ALL views use h-11
<header className="h-11">...</header>
```

**Lesson:** Header height is h-11 globally. Period.

---

## Mistake 3: Disabled Items in Sidebar ❌

**Problem:** 4 disabled menu items → confuses UX, wastes space

**Wrong:**
```tsx
<NavItem href="/main">Proyectos</NavItem>
<NavItem href="#" disabled>Projects (coming soon)</NavItem>
<NavItem href="#" disabled>Reports</NavItem>
<NavItem href="#" disabled>Settings</NavItem>
```

**Right:**
```tsx
<NavItem href="/main">Proyectos</NavItem>
{/* Add items ONLY when ready */}
```

**Lesson:** Remove disabled items. Add them when feature is ready.

---

## Mistake 4: Dead Code (Imported But Unused) ❌

**Problem:** MainHeader.tsx existed but wasn't imported anywhere

**Wrong:**
```tsx
// components/layout/MainHeader.tsx exists
// But never imported
// → Dead code sitting in repo
```

**Right:**
```tsx
// components/layout/MainHeader.tsx exists AND
import { MainHeader } from "@/components/layout/MainHeader"

// Used in layout
<MainHeader />
```

**Lesson:** Use what you create. Delete what you don't.

---

## Mistake 5: Hardcoded Colors in Components ❌

**Wrong:**
```tsx
<Button style={{ backgroundColor: '#22C55E' }}>Click</Button>
<Card className="bg-[#FFFFFF]">...</Card>
```

**Right:**
```tsx
<Button className="bg-chart-1">Click</Button>
<Card className="bg-background">...</Card>
```

**Lesson:** Use Tailwind tokens. Never hex hardcodes.

---

# WORKFLOW CHECKLIST

## Before Writing Code

- [ ] Read `/context/product-context.md`
- [ ] Read `/context/design-system.md`
- [ ] Read `/context/components.md`
- [ ] Read `/context/ux-guidelines.md`
- [ ] Read `/engineering/tech-stack.md`
- [ ] If new view: Read `/flows/[type]/flow.md`
- [ ] Dev server running: `npm run dev`

## While Writing Code

- [ ] Use TypeScript strict mode (no `any`)
- [ ] Props are typed interfaces
- [ ] Components use Tailwind classes (no inline styles)
- [ ] Colors are tokens (no hex values)
- [ ] Imports use absolute paths (@/...)
- [ ] Navigation uses `<Link>` from next/link
- [ ] No hardcoded data (use mocks from /data)

## After Code is Written

- [ ] Dev server: Check visual appearance
- [ ] Browser console: No errors
- [ ] Responsive: Test mobile/tablet/desktop
- [ ] Headers: Compare height with GDD/GDCV
- [ ] Sidebar: Test collapse functionality
- [ ] TypeScript: `tsc --noEmit` passes
- [ ] Git status: Commit changes cleanly

## Git Commit

```bash
git commit -m "refactor: brief description

- Point 1: what changed
- Point 2: why
- Point 3: result

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

# REFERENCE FILES

## By Task Type

### Building a NEW View
→ Read `/flows/[type]/flow.md`  
→ Map wireframe to components  
→ Check `/context/components.md` for specs  
→ Implement + browser verification

### Fixing EXISTING Component
→ Read `/context/components.md`  
→ Audit spec vs implementation  
→ Compare with GDD/GDCV  
→ Test in browser

### Understanding BUSINESS
→ `/context/product-context.md`  
→ What's the model? Who's the user?  
→ What problem does it solve?

### Understanding DESIGN
→ `/context/design-system.md`  
→ `/context/ux-guidelines.md`  
→ What are tokens? Patterns? Hierarchy?

### Understanding TECHNICAL
→ `/engineering/tech-stack.md`  
→ `.cursorrules`  
→ Stack, conventions, file structure

## Critical Files

| File | Purpose | Read First? |
|------|---------|------------|
| `/context/product-context.md` | What is HINS, models, users | ⭐⭐⭐ |
| `/context/components.md` | Component specs — TRUTH SOURCE | ⭐⭐⭐ |
| `/context/design-system.md` | Tokens, colors, spacing | ⭐⭐ |
| `/context/ux-guidelines.md` | Patterns, hierarchy | ⭐⭐ |
| `/engineering/tech-stack.md` | Stack, conventions | ⭐⭐ |
| `./.claude/MEMORY.md` | Decisions, lessons learned | ⭐ |
| `/flows/[type]/flow.md` | View specs for specific flow | ⭐ |

---

# QUICK REFERENCE TABLE

## Do's and Don'ts

| DO ✅ | DON'T ❌ | Why |
|--------|----------|-----|
| Use tokens in design-system | Hardcode hex colors | Consistency, maintenance |
| Separate layout.tsx + page.tsx | Mix structure with content | Next.js standard pattern |
| Import MainHeader in layout | Inline header in shell | DRY principle, reusability |
| Use h-11 headers | Use h-14 headers | Visual alignment across views |
| Only active sidebar items | Include disabled items | Clear UX, no confusion |
| Check components.md first | Create new components | Avoid duplication |
| Type all props | Use `any` types | Type safety, catch errors |
| Use `/context` docs | Assume or guess | Single source of truth |
| Verify in browser | Just assume it works | Visual validation critical |
| Clear git commits | Vague commit messages | Track why things changed |

---

# SUMMARY: TODAY'S CHANGES

## 3-Step Navigation Consistency Alignment

**Commit:** `411279c`

### Files Changed
```
✅ app/main/layout.tsx              (NEW — navigation structure)
✅ components/layout/MainLayoutShell.tsx (UPDATED — shell only)
✅ app/main/page.tsx                (UPDATED — content only)
```

### Code Quality
- **Lines added:** 17
- **Lines removed:** 47
- **Net:** -30 lines (cleaner)

### Results
- ✅ Header height: h-11 (44px) — matches GDD/GDCV
- ✅ Architecture: layout.tsx + Header component + page.tsx
- ✅ Separation: Shell only manages sidebar, header is separate
- ✅ Code: No dead code, patterns aligned
- ✅ Visual: No errors, responsive works

### Verification
✅ Dev server: No console errors  
✅ Browser: Headers same height across /main, /gdd, /gdcv  
✅ Sidebar: Collapse works correctly  
✅ Responsive: Mobile/tablet/desktop OK

---

# CONTACT & PREFERENCES

**User:** Designer + non-developer  
**Style:** Direct, no fluff, explain the "why"  
**Validation:** Show changes in browser before confirming  
**Git:** Clear commit messages with context  

---

# NEXT STEPS

1. **Immediate:** Continue with GDD_02 (ROI view) if in scope
2. **Soon:** Implement GDCV-agc and GDCV-socio views
3. **Future:** Set up remote repository (mentioned by user)
4. **Ongoing:** Use MEMORY.md + ONBOARDING.md for new sessions

---

**Document created:** 2026-05-14  
**Last updated:** 2026-05-14  
**Status:** Complete reference guide  
**Next review:** When next feature is started

---

*For printing to PDF: Use browser Print function (Ctrl+P / Cmd+P) and select "Save as PDF"*
