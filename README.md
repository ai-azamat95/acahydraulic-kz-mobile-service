# ACA Hydraulic — Heavy Equipment Field Service Platform

[![Website](https://img.shields.io/badge/live-acahydraulic.kz-111827)](https://acahydraulic.kz)
[![Industrial AI Demo](https://img.shields.io/badge/HackAlem-Industrial_AI-FFC000)](https://acahydraulic.kz/industrial-ai/)

ACA Hydraulic is a real-world industrial service project focused on **on-site hydraulic diagnostics, heavy-equipment repair and spare-parts workflows in Kazakhstan**.

This repository contains the web platform behind `acahydraulic.kz`. The product is being developed around a practical operating problem: heavy-equipment service is often fragmented across phone calls, WhatsApp messages, photos of nameplates, manual diagnostics, parts searches and individual technician experience.

## HackAlem AI prototype

This repository includes **ACA Industrial AI**, a technician-facing prototype for multi-brand heavy-equipment service.

**Live reviewer demo:** https://acahydraulic.kz/industrial-ai/

The demo accepts machine data, symptoms, fault codes, measurements and previous interventions, then returns a structured technician-facing report with:

- known facts separated from missing information;
- ranked diagnostic hypotheses with confidence labels;
- a verification checklist instead of premature parts replacement;
- a parts-search brief;
- explicit safety gates and a final technician decision gate.

This is deliberately **human-in-the-loop decision support**, not an autonomous-repair claim. The LLM output contract is constrained by JSON Schema, validated at runtime with Zod and exposed through a typed tRPC endpoint. The server endpoint is rate-limited.

For the public GitHub Pages build, the bundled SANY SY365H case is presented as a deterministic reviewer replay so the complete UX can be inspected without exposing an API key in the browser. The live LLM backend implementation remains in the repository and is used in a server deployment.

Review the implementation:

- [`client/src/pages/IndustrialAI.tsx`](client/src/pages/IndustrialAI.tsx) — interactive prototype UI and safe public reviewer replay;
- [`server/industrialAI.ts`](server/industrialAI.ts) — domain prompt, structured JSON schema and validation;
- [`server/routers.ts`](server/routers.ts) — typed API endpoint and rate limiting;
- [`docs/hackalem-application.md`](docs/hackalem-application.md) — 60-second reviewer brief;
- [`docs/hackathon-concept.md`](docs/hackathon-concept.md) — product thesis and roadmap.

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

The current codebase powers the ACA Hydraulic web presence and service/catalog workflows. It includes a modern frontend, server-side application code, database tooling, catalog synchronization utilities and the Industrial AI prototype.

### Stack

- React 19
- TypeScript
- Vite
- Express
- tRPC
- Zod
- Drizzle ORM
- MySQL
- React Query
- i18next
- AWS S3 tooling
- Vitest

## Why this matters

Heavy-equipment owners frequently operate mixed fleets: Caterpillar, SANY, XCMG, Hitachi, Shantui, Komatsu and other brands. Independent service teams therefore need a workflow that is not tied to one manufacturer's ecosystem.

ACA Hydraulic is being built from real field-service operations, so the product direction starts with actual service cases, customer requests, diagnostics and parts workflows rather than a purely theoretical demo.

## AI workflow

The current prototype demonstrates the first layer of an **AI-assisted service agent** for heavy equipment:

1. Customer or technician enters machine model, symptoms and available measurements.
2. The system structures the case and identifies missing information.
3. The AI separates known facts from uncertain hypotheses.
4. It produces ranked probable causes and recommended verification checks.
5. It prepares a parts-search brief while keeping a qualified technician responsible for the final diagnosis and repair decision.
6. Future iterations can add nameplate/computer-vision intake and resolved-case knowledge retrieval.

The objective is **decision support and workflow automation**, not replacing qualified mechanics.

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
