# Google Docs Clone — Master Build Spec & Prompt

> **How to use this file:** Paste the whole document into a new Claude Code / AI session as the project brief. It contains the locked tech stack, architecture, data models, file structures, reusable components, and a phase-by-phase build plan. Tell the assistant which **Phase** to build next. Build **backend-first within each phase**, then wire the frontend.

---

## 1. Project Overview

Build a **Google Docs clone** — a collaborative rich-text document editor — as a portfolio project. It must support real-time multi-user editing, comments/mentions, organizations, templates, and export.

**Author context:** Fresher building this for portfolio + interviews. Prefer clear, well-structured, reusable code over cleverness. JavaScript (not TypeScript).

---

## 2. Final Tech Stack (LOCKED — do not substitute)

| Layer | Choice |
|---|---|
| Frontend | **React (Vite) + JavaScript** (no TypeScript) |
| UI | **Shadcn UI + Tailwind CSS** |
| Client data fetching | **TanStack Query + Axios** |
| Client UI state | **Zustand** |
| Rich text editor | **Tiptap** (ProseMirror-based) |
| Real-time collaboration | **Liveblocks** (hosted Yjs sync) via `@liveblocks/react-tiptap` |
| Backend API | **Node + Express + JavaScript** (ES Modules) |
| Database | **MongoDB Atlas + Mongoose** |
| Auth + Organizations + Invites + Roles | **Clerk** (Google OAuth enabled inside Clerk) |
| Image storage | **Cloudinary** |
| Email (if needed beyond Clerk) | Resend |
| PDF export | Server-side **Puppeteer** |
| Package manager | npm |
| Deployment | Client → **Vercel** · API → **Vercel or Render** |

**Key rules:**
- JavaScript everywhere, ES Modules (`import`/`export`).
- Clerk handles auth AND organizations/invites/roles — **do NOT build custom org models.**
- Liveblocks hosts real-time — **do NOT build a WebSocket server.** (Yjs runs under the hood.)
- Keep the Liveblocks provider isolated in ONE file (`lib/collaboration.js`) so it can be swapped for self-hosted Hocuspocus later without touching the editor.

---

## 3. Architecture

**Two repositories**, both inside `e:\Volume E\GoogleDOCs\`:
- `gdocs-client/` — React frontend
- `gdocs-server/` — Express REST API

```
Browser (React on Vercel)
  │  HTTPS  → gdocs-server (Express API)  → MongoDB Atlas   (docs, comments, notifications, templates)
  │  WSS    → Liveblocks cloud (real-time sync + presence)  (Liveblocks hosts this)
  │  Auth   → Clerk (login, sessions, orgs, invites)
  │  Images → Cloudinary (via signed upload through Express)
```

**Auth flow:** Clerk logs the user in on the client. The client sends the Clerk session token to Express; Express verifies it with `@clerk/express`. A Clerk **webhook** syncs users into MongoDB (so comments/mentions can reference a DB user). For real-time, the client hits `POST /api/liveblocks-auth` on Express, which mints a Liveblocks token scoped to the document room using the Clerk user's identity.

---

## 3.5. How Frontend & Backend Connect (per phase)

**They connect from Phase 0, and every phase after — never "at the end."** Within each phase: build the backend endpoint first, then wire the frontend to it and test that feature live before the phase ends.

**The permanent bridge (set up once in Phase 0):**
1. **Server:** Express enables **CORS** for `CLIENT_URL` (`http://localhost:5173` in dev).
2. **Client:** one **Axios instance** in `lib/api.js` pointed at `VITE_API_URL`, with a **Clerk-token interceptor** that attaches the logged-in user's token to every request.
3. **Verify:** client calls protected `GET /api/me` → server verifies Clerk token → returns the user. If this works, the pipe is live for the whole project.

After Phase 0, every phase adds one endpoint + one hook that calls it, through the same Axios pipe:

| Phase | Backend adds | Frontend connects it via |
|---|---|---|
| 0 | `/api/me` | Axios + Clerk interceptor → confirms pipe works |
| 1 | `/api/documents` CRUD | `useDocuments()` / `useDocument()` (TanStack Query) |
| 2 | `/api/uploads` (Cloudinary) | Editor image button; `contentJSON` autosave |
| 3 | `/api/liveblocks-auth` | `lib/collaboration.js` joins the Liveblocks room |
| 4 | `/api/comments` | `useComments()` in comment sidebar |
| 5 | `/api/notifications` | `useNotifications()` in `NotificationBell` |
| 7 | `/api/templates`, `/api/export` | Template gallery + Export menu |

**Two channels (Phase 3 onward):** all normal data goes client → Express → MongoDB over HTTP. Real-time editing is a **second channel**: the client calls `/api/liveblocks-auth` on Express to get a room token, then talks **directly to Liveblocks cloud over WSS** for live edits/cursors. Express only issues the token; editing traffic does not pass through it.

```
client ──HTTP──▶ gdocs-server (Express) ──▶ MongoDB   (docs, comments, notifications…)
client ──HTTP──▶ /api/liveblocks-auth → room token
client ──WSS───▶ Liveblocks cloud                     (live editing + cursors)
```

**Rule:** never build UI against fake/mock data and "connect later." Each phase's feature must work end-to-end (real endpoint ↔ real UI) before moving on.

---

## 4. Feature → Provider Map (20 features)

| Feature | Provided by |
|---|---|
| 🔒 Authentication | Clerk |
| 👥 User Profiles | Clerk (+ synced User doc in Mongo) |
| 🏢 Organization Workspaces | Clerk Organizations |
| ✉️ Organization Invites | Clerk Organizations |
| 📝 Rich Text Editor | Tiptap |
| 🎨 Text Formatting Tools | Tiptap + custom toolbar |
| 📝 Lists and Checklists | Tiptap extensions |
| 🔗 Link Embedding | Tiptap Link extension |
| 📊 Table Support | Tiptap Table extension |
| 🖼️ Image Uploads | Tiptap Image + Cloudinary |
| 📏 Margin Controls | Custom (stored on Document) |
| ↩️ Undo/Redo History | Tiptap history |
| 📋 Copy/Paste Formatting | Tiptap (mostly built-in) |
| 🤝 Real-time Collaboration | Liveblocks + Tiptap |
| 🎯 Cursor Tracking | Liveblocks presence |
| 💭 Comments and Mentions | Custom (Comment model) OR Liveblocks Comments |
| 🔔 Notifications System | Custom (Notification model) |
| 📑 Document Templates | Custom (Template model) |
| ⬇️ Export (PDF/HTML/TXT/JSON) | Custom (Puppeteer + transforms) |
| 📱 Responsive Design | Tailwind |

---

## 5. Data Models (MongoDB / Mongoose)

Only document-side data lives in Mongo. Orgs/users are owned by Clerk (users mirrored via webhook).

```js
// User  (synced from Clerk via webhook)
{ clerkId, email, name, avatarUrl, createdAt }

// Document
{
  _id, title, ownerId,          // ownerId = Clerk user id
  orgId,                         // Clerk org id, or null = personal doc
  contentJSON,                   // Tiptap JSON snapshot (for export/search/preview)
  liveblocksRoomId,              // room id used by Liveblocks
  margins: { top, bottom, left, right },
  collaborators: [{ userId, role }],   // viewer | editor
  isTemplate: Boolean,
  createdAt, updatedAt
}

// Comment
{ _id, documentId, authorId, body, anchorId,   // anchorId = Tiptap mark id
  mentions: [clerkUserId], parentId, resolved, createdAt }

// Notification
{ _id, userId, type,            // mention | comment | share | invite
  actorId, documentId, read, createdAt }

// Template
{ _id, name, description, thumbnailUrl, contentJSON, category, isPublic }
```

> Note: the **content source of truth for live editing is the Liveblocks/Yjs room.** The `contentJSON` on Document is a snapshot saved on debounce for export, search, and previews.

---

## 6. File Structure — gdocs-server (Express API)

```
gdocs-server/
├── src/
│   ├── index.js                    # express app entry
│   ├── config/
│   │   ├── db.js                   # mongoose connect
│   │   ├── env.js                  # validated env vars
│   │   └── cloudinary.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Document.js
│   │   ├── Comment.js
│   │   ├── Notification.js
│   │   └── Template.js
│   ├── modules/                    # feature-based (each: routes + controller + service)
│   │   ├── documents/
│   │   ├── comments/
│   │   ├── notifications/
│   │   ├── templates/
│   │   ├── uploads/                # Cloudinary signed uploads
│   │   ├── liveblocks/             # POST /api/liveblocks-auth
│   │   └── webhooks/               # Clerk user-sync webhook
│   ├── middleware/
│   │   ├── requireAuth.js          # Clerk token verification
│   │   ├── requireDocAccess.js
│   │   ├── errorHandler.js
│   │   └── validate.js             # zod request validation
│   ├── utils/
│   │   ├── asyncHandler.js
│   │   └── export/                 # pdf (puppeteer), html, txt, json
│   └── routes/index.js             # mounts all module routes
├── .env / .env.example
└── package.json
```

## 7. File Structure — gdocs-client (React)

```
gdocs-client/
├── src/
│   ├── main.jsx                    # ClerkProvider + QueryClient + Router
│   ├── App.jsx
│   ├── routes/index.jsx
│   ├── pages/
│   │   ├── auth/ (SignIn.jsx, SignUp.jsx)
│   │   ├── Dashboard.jsx           # doc list (personal + org)
│   │   ├── DocumentEditor.jsx      # main editor page
│   │   ├── Templates.jsx
│   │   └── Profile.jsx
│   ├── components/
│   │   ├── ui/                     # Shadcn components
│   │   ├── editor/
│   │   │   ├── Editor.jsx          # Tiptap + Liveblocks
│   │   │   ├── Toolbar.jsx
│   │   │   ├── extensions/         # custom Tiptap extensions
│   │   │   ├── CommentThread.jsx
│   │   │   ├── MentionList.jsx
│   │   │   ├── ImageUpload.jsx
│   │   │   └── ExportMenu.jsx
│   │   ├── layout/ (Sidebar.jsx, Navbar.jsx, DocHeader.jsx)
│   │   ├── notifications/ (NotificationBell.jsx)
│   │   └── shared/ (EmptyState.jsx, Loader.jsx, ConfirmDialog.jsx)
│   ├── lib/
│   │   ├── api.js                  # axios instance + Clerk token interceptor
│   │   ├── collaboration.js        # ← Liveblocks provider isolated HERE (swap seam)
│   │   ├── tiptap.js               # editor config / extensions
│   │   ├── export.js               # client-side export helpers
│   │   └── utils.js                # cn() etc.
│   ├── hooks/
│   │   ├── useDocument.js
│   │   ├── useDocuments.js
│   │   ├── useComments.js
│   │   └── useNotifications.js
│   ├── store/ (uiStore.js)         # Zustand
│   └── styles/ (globals.css)
├── .env / .env.example
├── tailwind.config.js
├── components.json                 # shadcn config
└── vite.config.js
```

---

## 8. Reusable Components / Utilities (build once, reuse everywhere)

**Client — shared UI:**
- `ui/*` — all Shadcn primitives (Button, Dialog, Input, DropdownMenu, Tooltip, Avatar, Tabs…)
- `shared/EmptyState` — reused on dashboard, templates, notifications
- `shared/Loader` / skeletons — every async view
- `shared/ConfirmDialog` — delete doc, remove collaborator, etc.
- `shared/UserAvatar` — comments, presence, member lists
- `layout/Sidebar`, `layout/Navbar` — every authenticated page
- `editor/Toolbar` button primitives (`ToolbarButton`, `ToolbarDropdown`) — reused per format action

**Client — shared logic:**
- `lib/api.js` — one Axios instance with Clerk-token interceptor (every request uses it)
- `hooks/useDocuments`, `useDocument`, `useComments`, `useNotifications` — TanStack Query wrappers reused across pages
- `lib/collaboration.js` — single Liveblocks integration point (swap seam)

**Server — shared:**
- `middleware/requireAuth` — every protected route
- `middleware/requireDocAccess` — every doc/comment route
- `middleware/errorHandler` + `utils/asyncHandler` — wrap every controller
- `middleware/validate` (zod) — every write endpoint
- `modules/*/service.js` pattern — controllers stay thin, logic reusable

---

## 9. Phase-by-Phase Build Plan

> Each phase = backend endpoints first, then frontend wired to them. Each phase ends demoable.

### Phase 0 — Foundations
- **Server:** Express app, `config/db.js`, `config/env.js`, error handler, `requireAuth` (Clerk), health route.
- **Client:** Vite + Tailwind + Shadcn init, ClerkProvider, QueryClient, Router, protected-route wrapper, `lib/api.js`.
- **Deliverable:** log in with Clerk (Google + email), hit a protected `/api/me` route.

### Phase 1 — Documents CRUD
- **Server:** `Document` model, `User` model, Clerk user-sync webhook, documents module (create/list/get/rename/delete).
- **Client:** Dashboard listing personal + org docs, create/rename/delete, open a doc.
- **Deliverable:** create and manage documents (no editor content yet).

### Phase 2 — Rich Text Editor + Formatting (single-user)
- **Client:** Tiptap editor, Toolbar (bold/italic/underline, headings, color, align), lists & checklists, links, undo/redo, tables, margin controls.
- **Server + Cloudinary:** signed image upload endpoint; image insertion in editor.
- **Save:** debounce `contentJSON` to `Document`.
- **Deliverable:** full-featured single-user editor.

### Phase 3 — Real-time Collaboration (Liveblocks)
- **Server:** `POST /api/liveblocks-auth` minting room tokens from Clerk identity.
- **Client:** wire `lib/collaboration.js` + `@liveblocks/react-tiptap`; live cursors + presence (🎯 cursor tracking).
- **Deliverable:** two browsers editing the same doc live with cursors.

### Phase 4 — Comments & Mentions
- **Server:** `Comment` model + CRUD, resolve/reply.
- **Client:** highlight-to-comment (Tiptap mark), comment sidebar/threads, `@mention` autocomplete from org members.
- **Deliverable:** threaded comments with mentions.

### Phase 5 — Notifications
- **Server:** `Notification` model; create on mention/comment/share.
- **Client:** `NotificationBell` dropdown, unread badge, mark-as-read.
- **Deliverable:** in-app notifications.

### Phase 6 — Organizations (Clerk)
- **Client:** `<OrganizationSwitcher/>`, org-scoped dashboard, invite members via Clerk UI, roles.
- **Server:** scope documents by `orgId`; permission checks.
- **Deliverable:** org workspaces + invites working (mostly Clerk-driven).

### Phase 7 — Templates + Export
- **Server:** `Template` model, seed templates, export endpoints (PDF via Puppeteer; HTML/TXT/JSON transforms).
- **Client:** template gallery, "new from template", export menu.
- **Deliverable:** create-from-template + download in 4 formats.

### Phase 8 — Polish + Deploy
- Responsive pass, empty/loading/error states, profile page.
- Deploy client → Vercel, server → Vercel/Render. Configure Clerk/Liveblocks/Cloudinary production keys + webhook URLs.
- **Deliverable:** live public URL.

---

## 10. Environment Variables

**gdocs-server/.env**
```
PORT=5000
MONGO_URI=<mongodb atlas connection string>
CLERK_SECRET_KEY=<clerk secret key>
CLERK_WEBHOOK_SECRET=<clerk webhook signing secret>
LIVEBLOCKS_SECRET_KEY=<liveblocks sk_ key>
CLOUDINARY_CLOUD_NAME=<...>
CLOUDINARY_API_KEY=<...>
CLOUDINARY_API_SECRET=<...>
CLIENT_URL=http://localhost:5173
```

**gdocs-client/.env**
```
VITE_API_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=<clerk pk_ key>
VITE_LIVEBLOCKS_PUBLIC_KEY=<liveblocks pk_ key>
```

---

## 11. Accounts Needed (all free tier)

| Service | Get | Where |
|---|---|---|
| MongoDB Atlas | connection string | cloud.mongodb.com |
| Clerk | pk + sk keys; enable Google + Organizations | dashboard.clerk.com |
| Liveblocks | pk + sk keys | liveblocks.io/dashboard |
| Cloudinary | cloud name + key + secret | cloudinary.com |

---

## 12. Instructions for the AI in a new session

1. Read this whole spec. Confirm the phase to build.
2. Build **backend first, then frontend** within each phase.
3. Use **JavaScript + ES Modules**, match the file structures in §6–7.
4. Keep controllers thin (logic in `service.js`), wrap async in `asyncHandler`, validate writes with zod.
5. Isolate Liveblocks in `lib/collaboration.js`.
6. Use placeholder env values; never hardcode secrets.
7. Prefer the reusable components in §8 — do not duplicate UI or fetch logic.
8. Follow §3.5: connect frontend to the real backend endpoint **within the same phase** — never build against mock/fake data and "connect later."
9. End each phase with a short "how to run / test this" note.
