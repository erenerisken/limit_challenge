# Submissions Dashboard

A full-stack submissions management dashboard built with **Django (DRF)** and **Next.js (App Router)**.

This project focuses on building a **realistic operational workflow** rather than a feature-heavy demo. The core experience centers around reviewing, filtering, and inspecting broker-submitted opportunities efficiently.

---

## Demo

*Loom video coming soon*

---

## Core Workflow

```
submissions list → filtering → pagination → detail → back with preserved context
```

The application is designed to support this flow with minimal friction and strong state consistency.

---

## Key Features

### Filtering

* Filter by **status**, **broker**, and **company**
* Case-insensitive company search
* Advanced filters:

  * Date range (`createdFrom`, `createdTo`)
  * Has documents / has notes
* Filters are fully **URL-synced** for shareable and reproducible views

---

### Sorting

* Column-level sorting controls in the table UI
* Sort by:

  * Created / updated date
  * Broker / company name
  * Status
  * Document & note counts
* Custom **business ordering** for priority (High → Medium → Low)

---

### Submission Detail

* Structured view with:

  * Summary
  * Documents
  * Notes
  * Related metadata
* Dedicated loading and error states
* Navigation preserves filter context

---

### UX Considerations

* Debounced search input
* Collapsible advanced filters to keep primary UI clean
* Clickable table rows with modifier key support (cmd/ctrl click)
* Deterministic colored avatars for better visual scanning
* Consistent spacing and hierarchy using MUI theming

---

## Approach

The implementation prioritizes **clarity, performance, and scalability** over adding unnecessary complexity.

Key decisions:

* **URL as source of truth**
  Filters and pagination are stored in the URL to ensure:

  * refresh persistence
  * shareable links
  * native browser navigation support

* **Separation of concerns**

  * URL state → filters & pagination
  * React Query → server data & caching
  * local state → UI interactions (debounce, toggles)

* **Backend-driven efficiency**

  * `select_related` for core relations
  * `annotate` for document/note counts
  * optimized list vs detail query strategies

* **Progressive complexity in UI**

  * primary filters always visible
  * advanced filters collapsed by default

---

## Testing

### Frontend

* **Vitest + Testing Library**
* Coverage includes:

  * Table rendering (loading, empty, error states)
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
* Avoid unnecessary abstractions unless a pattern clearly emerges

---

## Future Improvements

* Extended search across more fields
* Role-based access control
* Production-grade authentication strategy
* Improved accessibility audit

---

## Author

Built as part of a technical challenge with a focus on **real-world product thinking and maintainable architecture**.
