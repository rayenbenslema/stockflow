# Tunisian Facturation Compliance

This document expands the compliance rules defined in `../../CONSTITUTION.md`.

## Status

Draft. Accountant and TTN validation required before public launch.

## Mandatory Architecture

The platform must be TTN / El Fatoora ready through a compliance adapter.

Flow:

```txt
Invoice Engine
→ Compliance Adapter
→ TEIF/XML-ready payload
→ Signature-ready layer
→ TTN / Ministry connector later
→ Store official reference
→ Archive immutably