# HackAlem AI — Reviewer Brief

## Applicant positioning

**Founder & IT enthusiast building an AI copilot for multi-brand heavy-equipment diagnostics and field-service automation.**

ACA Hydraulic is an operating heavy-equipment field-service business. The technical project in this repository converts real service workflows — intake, symptoms, measurements, diagnostic checks, parts search and quotation preparation — into a structured software platform.

## What to review in 60 seconds

1. Open the prototype route: `/industrial-ai`.
2. Click **Load demo** to use the SANY SY365H service case.
3. Run **Analyze with Industrial AI**.
4. Review the structured output:
   - known facts;
   - missing information;
   - ranked hypotheses with confidence labels;
   - verification checklist;
   - parts-search brief;
   - safety gates;
   - technician decision gate.
5. Inspect the implementation:
   - `client/src/pages/IndustrialAI.tsx` — interactive prototype UI;
   - `server/industrialAI.ts` — LLM prompt, structured JSON schema and runtime validation;
   - `server/routers.ts` — typed tRPC endpoint and demo rate limit;
   - `docs/hackathon-concept.md` — product thesis and roadmap.

## Why this is not a generic chatbot

The prototype returns a domain-specific schema rather than free-form chat. It is designed to move a field-service case through an operational sequence:

`machine → symptoms → evidence → missing data → ranked hypotheses → verification checks → parts-search brief → technician decision`

The output is validated with Zod before it reaches the frontend. The public demo endpoint is deliberately rate-limited.

## Safety / human-in-the-loop model

The system is decision support. It does not claim autonomous diagnosis or autonomous repair. The model is instructed to:

- separate facts from uncertain hypotheses;
- request missing measurements when evidence is insufficient;
- prefer verification over premature parts replacement;
- avoid instructions that bypass guards, interlocks, lockout/tagout or pressure-release procedures;
- leave final diagnosis, safety decisions and repair authorization to a qualified technician.

## Why this project can scale

Independent service companies and fleet owners often work across Caterpillar, SANY, XCMG, Hitachi, Komatsu, Shantui and other OEMs. The opportunity is a neutral service layer that can accumulate structured outcomes across mixed fleets.

The long-term data loop is:

`machine → symptom → measurement → failed component → repair → part → outcome`

That dataset can later support troubleshooting, parts forecasting, technician training, maintenance planning and engineering feedback.

## Current stack

- React 19 + TypeScript
- Vite
- Express
- tRPC
- Zod structured validation
- Drizzle ORM + MySQL
- LLM integration with JSON-schema structured output
- Vitest / GitHub Actions build checks

## Applicant statement

I am approaching the hackathon as an **IT enthusiast / founder building a real industrial AI product**, not as a participant presenting only a business idea. The software is grounded in an operating service business and real heavy-equipment cases, and the hackathon objective is to turn that domain knowledge into a reusable AI-assisted workflow.
