# Simbolo Admin Dashboard Workflow

This guide is written for a non-technical admin who needs to manage website content, services, packages, media, leads, and settings from the Simbolo CMS.

## Main Flowchart

```mermaid
flowchart TD
    A[Open Admin Dashboard] --> B{Browser asks for username and password?}
    B -->|Yes| C[Enter Basic Auth username and password]
    B -->|No| D[Admin dashboard opens]
    C --> D
    D --> E[Click Admin Sign In in the top-right navbar]
    E --> F[Enter admin email and password]
    F --> G{Login successful?}
    G -->|No| H[Check credentials or ask technical team for access]
    H --> F
    G -->|Yes| I[Choose task from left sidebar]

    I --> J[Website Management]
    I --> K[Content Management]
    I --> L[Media Library]
    I --> M[SEO Settings]
    I --> N[Users and Settings]
    I --> U[Users]

    J --> J1[Homepage]
    J --> J2[Services Overview]
    J --> J3[Individual Service Pages]
    J --> J4[Packages]
    J --> J5[Portfolio, FAQs, Technologies, Industries, Navigation]

    K --> K1[Leads]
    K --> K2[Blogs]
    K --> K3[Case Studies]
    K --> K4[Testimonials]
    K --> K5[About Us and Team Members]

    L --> L1[Upload, search, view, or delete media]
    M --> M1[Manage page SEO records]
    N --> N1[Manage users, theme, and system settings]
    U --> U1[Create client account and assign plan]

    J1 --> O[Edit content]
    J2 --> O
    J3 --> O
    J4 --> P[Create, edit, or delete package]
    J5 --> O
    K2 --> Q[Create or delete content]
    K3 --> Q
    K4 --> Q
    K5 --> O

    O --> R[Preview live page where available]
    P --> R
    Q --> R
    U1 --> S
    R --> S[Refresh admin list]
    S --> T[Confirm public website looks correct]
```

## Login Workflow

```mermaid
flowchart TD
    A[Go to admin URL] --> B{Basic Auth enabled?}
    B -->|Yes| C[Browser popup appears]
    C --> D[Enter ADMIN_USERNAME and ADMIN_PASSWORD]
    D --> E{Accepted?}
    E -->|No| C
    E -->|Yes| F[Admin dashboard loads]
    B -->|No| F
    F --> G[Click Admin Sign In in top-right]
    G --> H[Enter admin API email and password]
    H --> I{Signed in?}
    I -->|No| J[Use correct email/password or ask technical team]
    J --> H
    I -->|Yes| K[Protected create, update, upload, and delete actions work]
```

Important note: the app currently has two access layers.

1. Basic Auth protects the admin website itself when `ADMIN_USERNAME` and `ADMIN_PASSWORD` are configured.
2. The top-right `Admin Sign In` modal signs into the backend API and saves the admin token in the browser. This is required for protected backend changes such as uploads, package edits, leads, blogs, and other CMS data.

## Package Editing Workflow

```mermaid
flowchart TD
    A[Open Packages from sidebar] --> B[Review package list]
    B --> C{Need new package or edit existing?}
    C -->|New| D[Click New Package]
    C -->|Edit| E[Open row action menu and choose Edit]
    D --> F[Fill package name and description]
    E --> F
    F --> G{Linked service already exists?}
    G -->|Yes| H[Select Linked Service]
    G -->|No| I[Click Add Service]
    I --> J[Enter service name, short description, type, and starting price]
    J --> K[Click Create Service and Select]
    K --> H
    H --> L{Is this a base plan?}
    L -->|Yes| M[Select package illustration]
    L -->|No, add-on| N[Tick Is this a Service Add-on]
    M --> O[Enter base price in INR]
    N --> O
    O --> P[Choose tier: Starter, Professional, Enterprise, or Custom]
    P --> Q[Optionally mark as Popular]
    Q --> R[Click Create Package or Save Package]
    R --> S[Refresh list]
    S --> T[Preview related public service page]
```

### Package Rules For Non-Technical Admins

- Every package must be connected to a service.
- A base package must have an illustration.
- An add-on does not need an illustration.
- Use `Popular` for the plan that should be highlighted on the website.
- Use the delete icon only when the package should be removed permanently. The app asks for confirmation before deleting.
- If saving fails with an authorization message, sign in again using the top-right `Admin Sign In` button.

## New User Creation And Plan Assignment Workflow

Use this workflow when a new client should be created manually by the admin team instead of signing up from the public website.

```mermaid
flowchart TD
    A[Open Users from sidebar] --> B[Confirm packages are loaded]
    B --> C{Is the required package available?}
    C -->|No| D[Open Packages]
    D --> E[Create or update the package first]
    E --> A
    C -->|Yes| F[Fill Manual Client Creation form]
    F --> G[Enter first name and last name]
    G --> H[Enter email address]
    H --> I[Enter phone number if available]
    I --> J[Set temporary password]
    J --> K[Confirm timezone]
    K --> L{Assign a plan now?}
    L -->|No| M[Leave Assign Package as No plan yet]
    L -->|Yes| N[Select package from Assign Package dropdown]
    N --> O[Choose interval: Monthly, Quarterly, or Yearly]
    O --> P[Confirm price and currency]
    P --> Q[Add GST number, billing address, and internal notes if needed]
    M --> R[Click Create Client]
    Q --> R
    R --> S{Created successfully?}
    S -->|No| T[Read the error message and correct missing or invalid fields]
    T --> F
    S -->|Yes| U[Success message appears]
    U --> V[Recent Clients list refreshes]
    V --> W[Share login email and temporary password with the client through the approved channel]
```

### User And Plan Rules For Non-Technical Admins

- Use `Users` to create client accounts manually.
- The client must have first name, last name, email, and temporary password.
- Phone is optional, but if entered, keep the country code and 10-digit phone number correct.
- `Assign Package` can be left as `No plan yet` if the client should be created without a subscription.
- When assigning a package, confirm the billing interval and price before clicking `Create Client`.
- The price auto-fills from the selected package, but it can be reviewed before saving.
- GST number, billing address, and internal notes are optional business details.
- After creation, send the client their email and temporary password only through the approved private communication channel.
- If packages do not load, sign in again using the top-right `Admin Sign In` button or ask the technical team to check API access.

### Step-By-Step: Create A New Client Manually

Use these steps when the admin team needs to create a client account from the admin dashboard.

1. Open the admin dashboard.
2. If the browser asks for Basic Auth, enter the admin website username and password.
3. Click `Admin Sign In` in the top-right navbar.
4. Enter the admin API email and password.
5. Open `Users` from the left sidebar.
6. Wait for the `Available Packages` count to load.
7. In the `Manual Client Creation` form, enter the client's `First Name`.
8. Enter the client's `Last Name`.
9. Enter the client's `Email`.
10. Enter the client's phone number only if available.
11. If phone is entered, keep the country code separate, for example `+91`.
12. Enter exactly 10 digits in the phone number field.
13. Enter a temporary password in `Temporary Password`.
14. Keep `Timezone` as `Asia/Kolkata` unless the client is in another timezone.
15. If the client should not get a plan immediately, leave `Assign Package` as `No plan yet`.
16. If the client should get a plan immediately, follow the package assignment steps below.
17. Add `GST Number` only if the client has provided a valid GSTIN.
18. Add `Billing Address` if available.
19. Add `Internal Notes` only for admin team reference.
20. Click `Create Client`.
21. Wait for the success message.
22. Confirm the client appears in the `Recent Clients` list.
23. Share the login email and temporary password with the client through the approved private channel.

### Step-By-Step: Assign A Package While Creating A Client

Use these steps inside the same `Manual Client Creation` form on the `Users` page.

1. Click the `Assign Package` dropdown.
2. Select the package the client has purchased or should receive.
3. Confirm that the selected package name is correct.
4. Choose the billing `Interval`: `Monthly`, `Quarterly`, or `Yearly`.
5. Check the `Price` field.
6. If the price is empty, confirm the package setup in `Packages` first.
7. Keep `Currency` as `INR` unless the business team has approved another currency.
8. Fill the remaining client details.
9. Click `Create Client`.
10. Check the success message. It should say the client was created and assigned the selected plan.
11. If an error appears, correct the highlighted field and click `Create Client` again.

Important: package assignment happens at the time you click `Create Client`. If you leave `Assign Package` as `No plan yet`, the user is created without an active subscription.

### Common Mistakes During Client Creation

| Problem | What to do |
| --- | --- |
| Packages are not loading | Click `Refresh`; if still empty, sign in again with `Admin Sign In`. |
| Client phone is rejected | Enter only 10 digits in the phone field and keep country code separate. |
| Name is rejected | Remove numbers or symbols from first name and last name. |
| Email is rejected | Check spelling and make sure the email has a valid format like `name@company.com`. |
| Price is missing after selecting package | Open `Packages`, check the package base price, then return to `Users`. |
| Create Client fails with authorization error | Sign in again from the top-right `Admin Sign In` button. |

## Individual Service Page Workflow

The sidebar contains service pages for SEO, Google Ads, Meta Ads, Website Design, Video Editing, Graphic Design, and E-Commerce.

```mermaid
flowchart TD
    A[Open an Individual Service page] --> B[Edit Hero Benefits]
    B --> C[Edit Stats Bar]
    C --> D[Edit Service Items and Unit Pricing]
    D --> E[Edit Result Metrics]
    E --> F{Need packages or add-ons?}
    F -->|Yes| G[Click Manage Packages]
    G --> H[Create or update package]
    H --> I[Return to service page]
    F -->|No| I[Continue]
    I --> J{Need FAQs?}
    J -->|Yes| K[Click Manage FAQs]
    K --> L[Create or update FAQ]
    L --> M[Return to service page]
    J -->|No| M[Continue]
    M --> N[Click Save Configuration]
    N --> O[Click Preview Live]
    O --> P[Check public service page]
```

### Service Page Fields

- Hero Benefits: short bullet points shown near the top of the service page.
- Stats Bar: proof points such as project count, speed, savings, or growth metrics.
- Service Items and Unit Pricing: detailed offerings inside the service, such as logo design, ad setup, or SEO audit pricing.
- Result Metrics: measurable outcomes used for trust and case-study preview.
- Packages and Add-ons: managed centrally in `Packages`, not inside the service page.
- FAQs: managed centrally in `FAQs`, not inside the service page.

## Website Management Workflow

```mermaid
flowchart TD
    A[Website Management] --> B[Homepage]
    A --> C[Services Overview]
    A --> D[Individual Services]
    A --> E[Packages]
    A --> F[Portfolio]
    A --> G[FAQs]
    A --> H[Technologies]
    A --> I[Industries]
    A --> J[Navigation]

    B --> K[Hero, featured services, benefits, brands, SEO]
    C --> L[Hero, business goals, timeline, core services, SEO]
    D --> M[Service-specific benefits, stats, items, metrics]
    E --> N[Pricing plans and add-ons]
    F --> O[Public work examples]
    G --> P[Questions and answers]
    H --> Q[Technology stack list]
    I --> R[Industry list]
    J --> S[Navbar, sidebar menus, and footer links]
```

## Content Management Workflow

```mermaid
flowchart TD
    A[Content Management] --> B[Leads]
    A --> C[Blogs]
    A --> D[Case Studies]
    A --> E[Testimonials]
    A --> F[About Us]
    A --> G[Team Members]

    B --> B1[Review enquiries and update lead status]
    C --> C1[Add blog title, excerpt, content, author, category, status, tags]
    D --> D1[Add or edit case study details]
    E --> E1[Add or manage customer testimonials]
    F --> F1[Manage company story, stats, values, team, technologies, timeline]
    G --> G1[Manage website team profiles]
```

## Media Library Workflow

```mermaid
flowchart TD
    A[Open Media Library] --> B[Choose folder]
    B --> C{Need to upload?}
    C -->|Yes| D[Click Upload Asset]
    D --> E[Select image, video, or PDF]
    E --> F[File uploads into selected folder]
    C -->|No| G[Search or browse existing media]
    F --> G
    G --> H{Need to remove file?}
    H -->|Yes| I[Click delete and confirm]
    H -->|No| J[Use media in page editors or selectors]
```

Folders currently available in the media library are `general`, `blogs`, `services`, `homepage`, and `case-studies`.

## Common Admin Actions

| Action | Where to go | What to do |
| --- | --- | --- |
| Edit website homepage | `Homepage` | Open a section, edit text/media, preview live page. |
| Edit a service landing page | `Individual Services` | Choose service, edit benefits/stats/items/metrics, save configuration, preview live. |
| Add a new pricing plan | `Packages` | Click `New Package`, select or create linked service, enter price/tier, save. |
| Add a service add-on | `Packages` | Click `New Package`, tick add-on, select linked service, enter price, save. |
| Create a new client user | `Users` | Fill Manual Client Creation form, enter temporary password, optionally assign package, click `Create Client`. |
| Assign a plan to a new client | `Users` | Select a package in `Assign Package`, choose interval, confirm price/currency, then create client. |
| Add FAQ | `FAQs` | Click `Add FAQ`, enter question, answer, category, status, create. |
| Add blog | `Blogs` | Click `Add Blog`, enter article details, choose author/category/status, save. |
| Upload website image | `Media Library` | Pick folder, click `Upload Asset`, select file. |
| Check customer enquiries | `Leads` | Review lead list and update/delete as needed. |
| Change menu links | `Navigation` | Edit top navbar, sidebar menus, marketing services menu, or footer links. |
| Change SEO | Page editor or `SEO Settings` | Update meta title, description, keywords, canonical URL, and OpenGraph image. |

## Safe Operating Checklist

1. Sign in through the top-right `Admin Sign In` button before making changes.
2. For content edits, change one section at a time.
3. Use `Preview Live` after saving whenever the page has a preview button.
4. Refresh the admin list after create, update, or delete actions.
5. Do not delete packages, media, blogs, FAQs, or testimonials unless you are sure they are no longer needed.
6. Keep prices in INR where the package manager asks for base price.
7. Before creating a client, confirm the email address and assigned package are correct.
8. Share temporary client passwords only through an approved private channel.
9. Use `Draft` for content that is not ready for public display and `Published` only when it can go live.
10. If an action fails with `401` or authorization error, sign out and sign in again from the top-right admin account menu.

## Feature Map

| Sidebar area | Feature | Current purpose |
| --- | --- | --- |
| Dashboard | Dashboard | Main landing screen for the CMS. |
| Website Management | Homepage | Manage landing page sections and homepage SEO. |
| Website Management | Services Overview | Manage the main services index page. |
| Website Management | Individual Services | Manage each service landing page content and connect to packages/FAQs. |
| Website Management | Packages | Create, edit, delete, and highlight pricing packages and service add-ons. |
| Website Management | Portfolio | Manage public work examples. |
| Website Management | FAQs | Create and delete frequently asked questions. |
| Website Management | Technology Stack | Manage technology list used on the website. |
| Website Management | Industries | Manage industries served. |
| Website Management | Navigation | Manage top navbar, sidebar menus, marketing services menu, and footer links. |
| Content Management | Leads | Review and manage customer enquiries. |
| Content Management | Blogs | Create/delete blogs and control draft/published status. |
| Content Management | Case Studies | Manage case-study content and edit existing case studies. |
| Content Management | Testimonials | Manage customer testimonials. |
| Content Management | About Us | Manage company story, statistics, values, team, technologies, and timeline sections. |
| Content Management | Team Members | Manage website team member profiles. |
| Global | Media Library | Upload, search, view, and delete public media assets. |
| Global | SEO Settings | Manage SEO records. |
| Global | Users | Create client accounts manually, assign plans, and review recent clients. |
| Global | Settings | Manage theme and system settings. |

## When To Ask The Technical Team

- The browser Basic Auth username/password is not accepted.
- The top-right Admin Sign In account is not accepted.
- A save action fails repeatedly after signing in again.
- A required blog author, FAQ category, service, or package is missing and cannot be created from the screen.
- A public page does not update after saving and refreshing.
- A media upload fails or an uploaded image does not appear on the website.
