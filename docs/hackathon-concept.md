# Hackathon Concept — ACA Industrial AI

## One-line pitch

**An AI copilot for multi-brand heavy-equipment service that turns symptoms, photos, measurements and service history into a structured diagnostic workflow, parts shortlist and service request.**

## Problem

Heavy-equipment service is often fragmented. A customer sends a model name, a voice message and several photos. A technician then has to reconstruct the case manually, ask for missing measurements, identify a component, search for parts and prepare a quotation.

The problem becomes harder when a fleet contains different OEMs and machines of different ages. Knowledge is distributed across manuals, service history, technician experience and supplier communication.

## Target users

- independent heavy-equipment service companies;
- field technicians and hydraulic specialists;
- fleet owners with mixed-brand equipment;
- parts and service coordinators.

## Proposed MVP

A technician or customer creates a case with:

- machine brand / model;
- component or subsystem;
- symptoms;
- fault codes if available;
- pressure / temperature / other measurements;
- nameplate and component photos;
- previous repairs or parts replacements.

The AI layer then:

1. normalizes the information into a structured service case;
2. detects missing information and asks targeted follow-up questions;
3. suggests a ranked diagnostic checklist;
4. helps identify the component / likely part family from available markings;
5. prepares a parts-search brief and service request;
6. stores the resolved case as reusable technical knowledge.

## Safety model

The product is a **decision-support system**. It should not present uncertain output as a confirmed diagnosis.

Every recommendation should distinguish between:

- known facts from the case;
- assumptions;
- probable causes;
- required measurements / inspections;
- technician-confirmed conclusions.

Final diagnosis, repair authorization and safety-critical decisions remain with a qualified specialist.

## Why multi-brand

OEM tools are strong inside their own ecosystems. Independent service companies work across mixed fleets and need a neutral workflow that can organize service knowledge across multiple brands and machine generations.

## Data advantage

The defensible asset is not only the model interface. Over time, the system can accumulate structured service cases linking:

`machine → symptoms → measurements → failed component → repair → part → outcome`

That dataset can improve troubleshooting, parts demand planning, training and eventually component engineering.

## Business model hypotheses

Potential commercial models after validation:

- SaaS subscription for independent service companies;
- per-seat technician plans;
- enterprise fleet subscription;
- paid parts sourcing / transaction margin;
- API / white-label workflows for dealers and service networks.

## Hackathon demo

A strong demo should use one realistic case from intake to result:

1. Enter a machine and symptoms.
2. Add a nameplate photo and two or three measurements.
3. Show the AI asking only relevant missing questions.
4. Generate a structured diagnostic plan.
5. Generate a parts-search brief / OEM-number request.
6. Produce a customer-facing service request or quotation draft.
7. Show how the resolved case becomes searchable knowledge for the next technician.

## Product roadmap

**Stage 1 — Internal ACA workflow**  
Automate ACA Hydraulic's own intake, diagnostics documentation and parts workflows.

**Stage 2 — Multi-tenant service platform**  
Offer the system to other independent service companies and fleet operators.

**Stage 3 — Predictive service intelligence**  
Use accumulated structured cases to improve troubleshooting, maintenance planning and parts forecasting.

**Stage 4 — Components and engineering feedback loop**  
Use field failure data to guide better replacement components, retrofit kits and eventually proprietary industrial products.

## Success criteria for the MVP

The prototype should prove that it can reduce manual work in at least three areas:

- structuring an incoming service case;
- producing a useful diagnostic checklist;
- preparing the parts / quotation workflow.

The goal of the hackathon is not to claim autonomous repair. The goal is to prove a practical AI workflow that can be deployed into a real operating business after the event.
