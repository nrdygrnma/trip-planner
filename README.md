# Trip Planner App

A modern Vue 3 + Nuxt 4 application to plan trips efficiently, including flights, accommodations, car rentals, and
stops. Built with **Pinia**, **TailwindCSS**, and **Nuxt UI** components for a clean, responsive UI.

---

## Features

- Manage multiple trips with separate itineraries
- Add, edit, and delete **flights**, **car rentals**, **accommodations**, and **trip stops**
- Real-time trip cost calculation with multi-currency support
- Persistent data storage using `localStorage`
- Intuitive and interactive forms with **VeeValidate** + **Zod** schemas
- Modular, reusable components for scalability
- Drag-and-drop support for assigning team members (if applicable)

---

## Tech Stack

- [Nuxt 4](https://nuxt.com/) – Framework for Vue 3 with SSR support
- [Vue 3](https://vuejs.org/) – Reactive frontend framework
- [Pinia](https://pinia.vuejs.org/) – State management
- [TailwindCSS](https://tailwindcss.com/) – Utility-first CSS framework
- [Nuxt UI](https://ui.nuxt.com/) – UI components
- [uuid](https://www.npmjs.com/package/uuid) – Unique identifiers for flights, trips, and stops
- [Zod](https://zod.dev/) – Schema validation for forms
- [vue-sonner](https://github.com/philippsp/sonner) – Toast notifications

---

## Installation

Clone the repository:

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

Install dependencies:

```bash
npm install
# or
yarn install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Visit http://localhost:3000 in your browser.