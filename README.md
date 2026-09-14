# ACA Hydraulic — Heavy Equipment Field Service Platform

[![Website](https://img.shields.io/badge/live-acahydraulic.kz-111827)](https://acahydraulic.kz)

ACA Hydraulic is a real-world industrial service project focused on **on-site hydraulic diagnostics, heavy-equipment repair and spare-parts workflows in Kazakhstan**.

This repository contains the web platform behind `acahydraulic.kz`. The product is being developed around a practical operating problem: heavy-equipment service is often fragmented across phone calls, WhatsApp messages, photos of nameplates, manual diagnostics, parts searches and individual technician experience.

## Product goal

Build a digital operating layer for independent heavy-equipment service that can eventually connect:

- customer intake and service requests;
- machine, model and component identification;
- diagnostic history and field measurements;
- spare-parts search and OEM / cross-reference workflows;
- quotations and service-job preparation;
- service history and reusable technical knowledge.

The long-term direction is a **multi-brand industrial service platform** rather than a tool for a single OEM.

## Current project

The current codebase powers the ACA Hydraulic web presence and service/catalog workflows. It includes a modern frontend, server-side application code, database tooling and catalog synchronization utilities.

### Stack

- React 19
- TypeScript
- Vite
- Express
- tRPC
- Drizzle ORM
- MySQL
- React Query
- i18next
- AWS S3 tooling
- Vitest

## Why this matters

Heavy-equipment owners frequently operate mixed fleets: Caterpillar, SANY, XCMG, Hitachi, Shantui, Komatsu and other brands. Independent service teams therefore need a workflow that is not tied to one manufacturer's ecosystem.

ACA Hydraulic is being built from real field-service operations, so the product direction starts with actual service cases, customer requests, diagnostics and parts workflows rather than a purely theoretical demo.

## AI / hackathon direction

The next product layer is an **AI-assisted service agent** for heavy equipment. This is a roadmap / prototype direction, not a claim that the production system already performs autonomous diagnosis.

The proposed workflow:

1. Customer or technician enters machine model, symptoms and available measurements.
2. The system structures the case and requests missing information.
3. Photos of nameplates / component markings can be used to identify parts or narrow the search.
4. The assistant produces a ranked set of likely causes and recommended checks.
5. A technician remains responsible for the final diagnosis and repair decision.
6. The system can then prepare a service request, parts shortlist and quotation workflow.

The objective is **decision support and workflow automation**, not replacing qualified mechanics.

See: [`docs/hackathon-concept.md`](docs/hackathon-concept.md)

## Local development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

## Type check / tests

```bash
pnpm check
pnpm test
```

## Repository context

- `acahydraulic.kz` — field service and heavy-equipment repair
- `acahydraulic.com` — separate ACA project / catalog direction
- `acahdd.kz` — horizontal directional drilling direction

## Product ownership

Product direction and real-world service use cases are led by **[@ai-azamat95](https://github.com/ai-azamat95)**.

---

**Industrial service → structured data → AI-assisted diagnostics → parts automation → scalable multi-brand platform.**