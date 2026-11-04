# BOPIS eligibility: product requirements (v0.3)

*Written in sprint 1 by Dana Whitfield, product owner for online fulfilment. The retailer, its stores and every number here are made up.*

**BOPIS** means "buy online, pick up in store". When a customer adds an item to the basket, the site asks the eligibility service
whether that item can be offered for pickup at the store they chose. This document says what "eligible" means.

## 1. Store stock

An item is eligible only if the chosen store has at least the quantity the customer wants **plus a buffer of 3 units**, so that
the shelf is never left empty by an online order.

## 2. Quantity

A customer can order **at most 6 units of one item** for a single pickup.

## 3. Perishable items

**Perishable items (anything that spoils quickly) are not eligible** for pickup. They cannot wait in the back room.

## 4. Hazardous items

Items flagged as hazardous materials (hazmat) are not eligible. They have to be handed over by trained staff.

## 5. Age-restricted items

Age-restricted items (alcohol, tobacco) are eligible only when the customer's age has been verified at checkout.

## 6. Gift cards

Gift cards are delivered digitally and are never eligible for pickup.

## 7. Store must be open

Pickup is offered only while the chosen store is open for pickup.

## 8. Heavy items

Items **heavier than 20 kg** are not eligible. They are too heavy for curbside loading.

## 9. General

- Eligibility checks should be fast.
- Most large items should be excluded.
- Customers should have a good experience when an item is not eligible.
- Items that are risky to hand over should be handled carefully.

## 10. Out of scope for this release

Substitutions, home delivery, pricing and discounts, and payment.
