# Stockroom — inventory management demo

A small, responsive inventory dashboard for trying out common stockroom tasks. It runs in your browser and does not need a database, account, or build tools.

## Run the app

1. Open the repository on GitHub and download it (click **Code → Download ZIP**), or clone it if you already use Git.
2. Unzip the folder, then open `index.html` in a recent browser such as Chrome, Edge, Firefox, or Safari.
3. Search the sample products, filter by category, try the assistant, or add a product. Your edits are saved in that browser using local storage.

For webcam barcode scanning, camera access is typically available when the site uses HTTPS or when you run it on `localhost`. Open the app through a local development server (for example, in VS Code install the **Live Server** extension, right-click `index.html`, then choose **Open with Live Server**). If camera scanning is unavailable, you can still enter a barcode or SKU manually. Browser support for automatic barcode detection varies.

## What the demo includes

- Dashboard totals for products, units, stock value, and items needing attention.
- Product search by name, SKU, barcode, or category, plus a category filter.
- Sample products and low-stock list.
- Add products and adjust stock quantities; changes stay in local storage on the current browser/device.
- Barcode lookup by camera where supported, with manual lookup as a fallback.
- A **demo** stock assistant that answers a few common questions from the local inventory. It uses simple in-browser rules and is not connected to an AI model or a live business database.
- Responsive layout for phones and computers.

## Beginner guide to these files

- `index.html` contains the page structure and labels.
- `styles.css` controls colors, layout, and phone-sized styling.
- `app.js` contains the sample products and the interactions, including search, stock updates, barcode lookup, and assistant responses.

To start fresh, use **Reset sample data** at the bottom of the inventory table. This resets only the data stored in the browser you are currently using.

## Important before using for a real business

This is a front-end starter, not a production inventory system. Data is stored only in one browser, so it is not shared across staff or devices and should not be considered a backup. The assistant is rule-based, not a real generative AI service. A production version needs secure sign-in, a shared database, server-side validation, backups, audit logs, and a securely configured AI provider if you want AI-generated answers. Never put API keys in browser code.
