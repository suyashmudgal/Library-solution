# Google Apps Script Setup Guide for "LIBRARY'S DATA"

This application directly connects to your Google Sheet with **zero additional database services**.

---

## 1. Google Sheet Column Layout (Sheet1)

Confirm your Google Sheet titled **`LIBRARY'S DATA`** has the following exact 15 headers in row 1:

| Col | Header Name | Description |
|---|---|---|
| **A** | `Member ID` | Generated automatically (`SR-2026-XXXXX`) |
| **B** | `Name` | Student full name |
| **C** | `Father's Name` | Father's name |
| **D** | `Mobile Number` | 10-digit Indian mobile number |
| **E** | `Seat Number` | Assigned study seat number |
| **F** | `Membership Plan` | `1 Month`, `3 Months`, `6 Months`, or `12 Months` |
| **G** | `Fee Paid` | Numeric fee amount in ₹ |
| **H** | `Payment Date` | Payment date (`YYYY-MM-DD`) |
| **I** | `Joining Date` | Joining date (`YYYY-MM-DD`) |
| **J** | `Valid Till` | Calculated automatically (`Joining Date + Plan`) |
| **K** | `Status` | `PENDING`, `APPROVED`, or `REJECTED` |
| **L** | `Card Status` | `PENDING`, `ACTIVE`, `EXPIRED`, or `REJECTED` |
| **M** | `Card File URL` | Digital card URL (`/card/SR-2026-XXXXX`) |
| **N** | `Created At` | ISO timestamp of submission |
| **O** | `Approved At` | ISO timestamp of admin approval |

> [!IMPORTANT]
> - Do not add any Photo column.
> - Do not alter the column order A:O.

---

## 2. Deploying Google Apps Script

1. Open your Google Sheet **`LIBRARY'S DATA`**.
2. Click **Extensions** > **Apps Script** in the top menu.
3. Delete any default code in the editor, and paste the entire contents of [`google-apps-script/Code.gs`](file:///c:/Users/suyas/Library'solution/google-apps-script/Code.gs).
4. Click the **Save** icon (diskette).
5. In the top right, click **Deploy** > **New deployment**.
6. Click the gear icon (Select type) > **Web app**.
7. Configure deployment settings:
   - **Description**: `Study Room Digital Card Backend`
   - **Execute as**: `Me (your Google email)`
   - **Who has access**: `Anyone` *(Crucial: allows the student registration page and admin portal to communicate with the sheet without Google login barriers)*.
8. Click **Deploy**.
9. If prompted, click **Authorize access**, select your Google account, click **Advanced** > **Go to (unsafe)**, and **Allow**.
10. Copy the generated **Web App URL** (starts with `https://script.google.com/macros/s/.../exec`).

---

## 3. Connecting to the Web Application

You can connect your deployed Web App URL in either of two ways:

### Option A: Admin Portal (Instant One-Click)
1. Open the Study Room web application at `/admin`.
2. Click the **Connect Google Sheet** button in the header.
3. Paste your Web App URL and click **Save & Connect**.
4. The system immediately tests the connection, fetches your live Google Sheet data, and switches live!

### Option B: Environment Variable (.env)
Create a `.env` file in the project root:
```env
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```
