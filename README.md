# Token Price Explorer

A single-page web application built with **React** that allows users to explore token swap prices between different EVM-compatible chains. Users can select two tokens and view their price relationship based on a USD amount.

---

## 🚀 Live Demo

[🔗 Deployed on Vercel](https:)

---

## 📦 Tech Stack

- **React** (Next.js App Router)
- **TypeScript**
- **TailwindCSS** (UI styling)
- **Lucide React** (icons)
- **@funkit/api-base** (for fetching ERC20 token and price info)
- **Next Image** (optimized image handling)
- **ESLint + Prettier** (code quality)

---

## 🧩 Features

- ✅ Select source and destination chains
- ✅ Choose supported tokens from each chain
- ✅ Real-time token price fetching
- ✅ Two-way conversion calculation
- ✅ Searchable + collapsible token selector modal
- ✅ Error handling + loading indicators
- ✅ Responsive and accessible UI

---

## 🛠️ Setup Instructions

```bash
# Clone the repository
git clone https://github.com/your-username/token-price-explorer.git
cd token-price-explorer

# Install dependencies
npm install

# Run the development server
npm run dev
```


## 📁 Folder Structure
src/
  components/        # UI components
  data/              # Static token/chain list (evm_chains.json)
  types/             # TypeScript types
  pages/             # Next.js pages (main UI lives in app/page.tsx)

## Assumptions Made

- We manually maintain a small list of chains and their supported tokens in evm_chains.json.
- Token image URLs are based on symbol (via crypticon CDN), not contract address.
- API response errors are parsed and shown to the user with a timeout.
- The app is read-only, not performing real swaps — pricing is for reference only.


## 📚 Libraries Used & Why

| Library            | Reason                                    |
| ------------------ | ----------------------------------------- |
| `@funkit/api-base` | Provided API to fetch token info & prices |
| `Tailwind CSS`     | Rapid UI styling                          |
| `Lucide React`     | Clean, consistent icon set                |
| `Next.js`          | Optimized for React, great DX             |
| `TypeScript`       | Type safety and better editor tooling     |


## 📝 Submission Checklist

- Uses React + fetches from API
- Token swap price calculator
- Clean UI with loading and error states
- Public source code repository
- Vercel deployment