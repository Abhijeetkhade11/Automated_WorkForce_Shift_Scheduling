# Week 1: Problem Definition, Scope, and MVP Freezing

## 1. Problem Statement
In many round-the-clock industries (e.g., healthcare, retail, logistics, hospitality), scheduling employee shifts is a complex, error-prone, and time-consuming manual process. 
- **Inefficiency:** Managers spend several hours every week manually aligning shift slots with employee availability, preferences, and qualifications.
- **Errors and Conflicts:** Manual scheduling frequently results in double-booking, under-staffing, over-staffing, or assigning shifts that violate labor laws or employee preferences.
- **Communication Gaps:** Employees lack a central real-time view of available slots, active assignments, or changes, leading to missed shifts and low employee satisfaction.
- **Lack of Tracking:** Tracking booking status, shift cancellations, and swap requests manually makes reporting and auditing extremely difficult.

The **Automated Workforce Shift Scheduling System** addresses these issues by providing a digital portal where administrators/managers can create shift schedules and employees can view, request, cancel, and track their shift assignments in real time.

---

## 2. Stakeholders & Target Users
- **Employees (Shift Workers):** Need to view available slots, submit booking requests for preferred shifts, request cancellations, and monitor shift approval status.
- **Managers / Administrators:** Need to define shift requirements, review and approve/reject booking requests, track resource coverage, and manage overall scheduling configuration.
- **System Administrators (DevOps / IT Ops):** Need to ensure the system is highly available, deploy updates reliably, monitor logs, and provision the server infrastructure.

---

## 3. Existing Pain Points
1. **Time-consuming manual creation** of Excel sheets or physical rosters.
2. **High conflict rate** (employees assigned to shifts during vacation/unavailable hours).
3. **No real-time status updates**; notification of changes is typically done via SMS/calls.
4. **Poor audit trails** when disputes arise regarding who booked or cancelled a particular shift.

---

## 4. Project Objectives
- **Automate Availability Matching:** Enable employees to view open slots and claim them instantly based on predefined slots.
- **Self-Service Requests:** Allow booking, cancellation, and status tracking without direct managerial intervention.
- **Centralized Database:** A single source of truth for all shift schedules, reducing conflict rates.
- **DevOps Integration:** Demonstrate an end-to-end automated deployment pipeline from repository code commit to automated server configuration and deployment.

---

## 5. System Constraints
- **Technical Constraints:** The system must run on standard server hardware, deployable via Docker containers, and provisioned using Ansible/Puppet.
- **Operational Constraints:** Schedule approvals must update instantly so that no two employees book the same slot concurrently (concurrency lock).
- **Timeline Constraints:** Complete delivery of the working MVP and DevOps lifecycle in 15 weeks.

---

## 6. Measurable Success Criteria
- **Reduction in Conflict Rates:** 0% double-bookings for the same shift slot.
- **Time Saving:** Reducing scheduling creation and management time by at least 80% (from hours to minutes).
- **Adoption Rate:** 100% of employees and managers utilizing the tool for schedule tracking.
- **Deployment Efficiency:** Under 5 minutes from source code commit to verified production deployment via Jenkins CI/CD.

---

## 7. Frozen MVP Scope (15-Week Plan)
The MVP will focus on a subset of features to ensure robustness:
1. **User Registration & Roles:** Employee and Manager/Admin logins.
2. **Availability/Slot View:** Visual display of active schedules and open shift slots.
3. **Booking Request:** Employees can request to claim an open slot.
4. **Confirmation:** Managers can approve or auto-confirm slot bookings.
5. **Cancellation:** Employees can request a shift cancellation within policy.
6. **Status Tracking:** A dashboard showing the status of requests (Pending, Confirmed, Cancelled).

---

## 📅 Roadmap of MVP Core Features
- **Week 1-2:** Problem Definition, Agile Backlog & DevOps Plan.
- **Week 3-4:** Architecture, Technology Setup, Repo Setup & Skeleton.
- **Week 5-6:** Feature Development (Registration, Booking, Status Tracking, Conflict Resolution).
- **Week 7-10:** CI Setup (Jenkins), Pipeline as Code, Local/Jenkins Selenium Tests.
- **Week 11-12:** Containerization (Docker) & Jenkins CD.
- **Week 13-14:** Configuration Management (Ansible/Puppet) & Reliability Validation.
- **Week 15:** Final Release & Viva.
