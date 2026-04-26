# Submissions Dashboard

A full-stack submissions management dashboard built with **Django (DRF)** and **Next.js (App Router)**.

This project focuses on modeling a **realistic operations workflow** rather than a feature-heavy demo. The goal is to enable users to efficiently review, filter, and inspect broker-submitted opportunities with a clear and consistent experience.

---

## Live Demo

* **Frontend:** https://limit-challenge-three.vercel.app/submissions
* **API:** https://limit-challenge-backend-1ts4.onrender.com/api/submissions/

---

## Demo (Walkthrough)

👉 https://www.loom.com/share/9b881aba289f4688b5d93b871ab3c153

---

## Core Workflow

```id="workflow"
submissions list → filtering → pagination → detail → back with preserved context
```

The application is designed around this loop, with particular attention to **state persistence and navigational consistency**.

---

## Key Features

### Filtering

* Filter by **status**, **broker**, and **company**
* Case-insensitive company search
* Advanced filters:

  * Date range (`createdFrom`, `createdTo`)
  * Has documents / has notes
* Filters are fully **URL-driven**, enabling:

  * refresh-safe state
  * shareable links
  * reproducible views

---

### Sorting

* Column-level sorting controls directly in the table UI
* Supports sorting by:

  * Created / updated date
  * Broker / company name
  * Status
  * Document & note counts
* Custom **business ordering** for priority (High → Medium → Low)

---

### Submission Detail

* Structured detail view including:

  * Summary
  * Documents
  * Notes
  * Company, broker, owner, and contacts
* Dedicated loading and error states
* Navigation preserves filter and pagination context

---

### UX Considerations

* Debounced search input to reduce unnecessary requests
* Collapsible advanced filters to keep the primary UI focused
* Clickable table rows with modifier key support (cmd/ctrl click)
* Deterministic colored avatars for visual consistency
* Clickable emails and phone numbers (`mailto:` / `tel:`)
* Consistent layout and spacing using MUI theming

---

## Approach

The implementation prioritizes **clarity, scalability, and real-world usability** over adding unnecessary complexity.

### URL as Source of Truth

Filters and pagination are stored in the URL to ensure:

* persistence across refreshes
* shareable and reproducible views
* compatibility with browser navigation (back/forward)

---

### Separation of Concerns

* **URL state** → filters & pagination
* **React Query** → server data fetching & caching
* **Local state** → UI interactions (debounce, toggles)

This separation keeps each concern predictable and easier to evolve.

---

### Backend Efficiency

* `select_related` for key relationships
* `annotate` for computed fields (document and note counts)
* Optimized queryset strategies for list vs detail endpoints

---

### Progressive UI Complexity

* Primary filters are always visible
* Advanced filters are opt-in and collapsed by default

This avoids overwhelming the user while still supporting complex queries.

---

## Deployment

The application is deployed using a split architecture:

* **Frontend:** Deployed on Vercel (optimized for Next.js App Router and edge delivery)
* **Backend:** Deployed on Render (simple setup for Django services)

Key considerations:

* Environment-based configuration (`NEXT_PUBLIC_API_BASE_URL`)
* Server-side filtering and sorting to keep the frontend lightweight
* Pre-deploy migrations and seeding for demo readiness

This setup prioritizes **fast iteration, simplicity, and reliable demo availability**.

---

## Testing

### Frontend

* **Vitest + Testing Library**
* Covers:

  * Table states (loading, empty, error)
  * Custom hooks (`useDebounce`, `useSearchState`)
  * Utility functions

Run:

```bash
npm run test:run
```

---

### Backend

* Django test suite covering:

  * Filtering logic (status, broker, search)
  * Date range filters
  * Boolean filters (`hasDocuments`, `hasNotes`)
  * Ordering (including annotated fields and custom logic)

Run:

```bash
python manage.py test
```

---

## API

Main endpoint:

```
GET /submissions/
```

Supports:

### Filters

* `status`
* `brokerId`
* `companySearch`
* `createdFrom`, `createdTo`
* `hasDocuments`, `hasNotes`

### Ordering

* `created_at`, `updated_at`
* `broker__name`, `company__legal_name`
* `document_count`, `note_count`
* `priority_order`
* Prefix with `-` for descending

---

## Getting Started

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Tech Stack

**Frontend**

* Next.js (App Router)
* React
* MUI
* React Query

**Backend**

* Django
* Django REST Framework
* django-filter

---

## Design Principles

* Keep the interface **scanable and predictable**
* Favor **functional clarity over visual complexity**
* Build for **real-world usage patterns**, not just demo completeness
* Avoid premature abstractions

---

## Future Improvements

- Extended search across more fields (e.g. notes, broker, owner)
- Role-based access control and authentication flow
- Production-grade authentication strategy
- Accessibility audit and keyboard navigation improvements
- Mobile-specific card-based layout for improved small-screen usability
- End-to-end testing with Playwright to cover full user flows
- Saved filter views and user-specific preferences
- Export functionality (CSV / Excel) for filtered datasets

---

## Author

Built as part of a technical challenge with a focus on **practical product thinking and maintainable architecture**.
