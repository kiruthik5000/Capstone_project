# Tailwind CSS Installation & Verification Steps

## 1. Check if Tailwind CSS is already in `package.json`

**Result:** Found `tailwindcss@^4.2.1` and `@tailwindcss/vite@^4.2.1` listed in `package.json` dependencies.

## 2. Check if packages are installed in `node_modules`

```powershell
dir node_modules\tailwindcss /B
```

**Result:** Package was NOT found in `node_modules` — needed `npm install`.

## 3. Install dependencies

```powershell
npm install
```

**Result:** All packages installed successfully. Verified with:

```powershell
node -e "console.log(require('tailwindcss/package.json').version)"
# Output: 4.2.1
```

## 4. Configure `@tailwindcss/vite` plugin in `vite.config.js`

Added the Tailwind CSS Vite plugin:

```diff
 import { defineConfig } from 'vite'
 import react from '@vitejs/plugin-react'
+import tailwindcss from '@tailwindcss/vite'

 export default defineConfig({
-  plugins: [react()],
+  plugins: [react(), tailwindcss()],
 })
```

## 5. Add `@import "tailwindcss"` to `src/index.css`

Added at the top of `src/index.css`:

```diff
+@import "tailwindcss";
+
 :root {
   font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
```

## 6. Add a test element in `App.jsx` to verify

Added a paragraph with Tailwind utility classes:

```jsx
<p className="text-green-500 font-bold text-2xl mt-4 p-4 bg-gray-800 rounded-lg">
  ✅ Tailwind CSS is working!
</p>
```

## 7. Start dev server and verify in browser

```powershell
npm run dev
# Server started at http://localhost:5173/
```

**Result:** ✅ Tailwind CSS is working — green bold text with dark background and rounded corners rendered correctly in the browser.
