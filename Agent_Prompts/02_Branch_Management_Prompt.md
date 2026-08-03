# Agent Prompt: Branch Management Module

You are a Senior Full-Stack Engineer building the **Branch Management Module** for a Pharmacy ERP SaaS platform.

## Goal
Implement a multi-outlet management module enabling pharmacy enterprises to provision retail outlets, hospital outlets, and warehouse stores with strict user branch scoping and inter-branch stock transfers.

## Requirements
1. **Multi-Branch Hierarchy**:
   - A single company can provision multiple physical branches.
   - Each branch has Branch Name, Manager, Phone, Email, Address, Warehouse Flag (`isWarehouse`), Assigned Cashiers, Pharmacists, Inventory Staff, Status (`active`, `suspended`, `closed`), and Opening Hours.
2. **Branch Dashboard**:
   - Live KPI widgets: Daily Sales, Stock Units, Today's Orders, Revenue, Employee Count, Customer Count, Low Stock Items, Expiry Medicines.
3. **Data Grid Features**:
   - Complete CRUD operations.
   - Server-side pagination, search by branch name/code, filter by status/warehouse, and column sorting.
   - Optimistic UI updates with loading states.
4. **RBAC Scoping Rules**:
   - `Company Owner`: Unrestricted access across all branches with dynamic branch switcher dropdown.
   - `Branch Manager`: Access restricted strictly to assigned branch.
   - `Cashier`: POS billing only.
   - `Pharmacist`: Prescription queue only.
   - `Inventory Staff`: Stock & FEFO batch control only.
   - `Customer`: Own profile & order history only.
5. **UI & Code Standards**:
   - Responsive UI, Dark Medical Theme, Reusable Components, Production-Ready Code, Unit Tests, and Audit Log creation on branch changes.
