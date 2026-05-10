# StockFlow Flows

This document expands the UML and lifecycle rules defined in `../../CONSTITUTION.md`.

## Product Sale Flow

```txt
POS
→ Search Product
→ Add Quantity
→ Select Client
→ Choose Payment
→ Generate Invoice
→ Update Inventory
→ Create Audit Logs
→ Generate PDF
→ Queue Compliance

## Compliance Flow
Draft Invoice
→ Validation
→ Lock Number
→ Generate XML/TEIF-ready payload
→ Generate Signature
→ Queue Submission
→ Submit to TTN later
→ Receive Reference
→ Archive Permanently