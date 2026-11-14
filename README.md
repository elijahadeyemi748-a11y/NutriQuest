# NutriQuest 2.1

A mobile-first progressive web app with local food journal, USDA food search, Open Food Facts barcode lookup, manual food entry, macro/micronutrient exploration, companion levels, daily gentle quests, JSON backup/restore, optional Supabase cloud sync, and a server-side AI meal-photo estimate endpoint.

## Important status and setup

The app itself runs locally after hosting the folder on HTTPS (GitHub Pages is suitable). Cloud sync and photo AI are real integrations but require your own Supabase project and provider credentials. They are not activated by merely uploading the files.

### 1. Publish the app
Upload the contents of this folder to the root of your GitHub Pages repository. Keep the `supabase/` folder and its subfolders. `index.html` must be at repository root. Before replacing an existing app, export a backup from Settings.

### 2. Supabase cloud sync
1. Create a Supabase project.
2. Open SQL Editor and run `supabase/setup.sql`.
3. In Project Settings → API, copy the Project URL and anon/public key (never use `service_role`).
4. In NutriQuest Settings, paste both and tap Save connection.
5. In Supabase Authentication URL configuration, add your GitHub Pages URL as a Site URL / allowed redirect URL.
6. Enter your email in NutriQuest and tap Email sign-in link. Open the link on the same device/browser, return to NutriQuest, then tap Sync now.

The sync writes one JSON journal row per signed-in user. Row-level security restricts access to the authenticated user's own row. Export a backup periodically.

### 3. AI photo recognition (Groq)
The Edge Function is implemented for Groq's vision-capable `qwen/qwen3.8-27b` model. Groq API usage may be billable and provider limits/prices can change. This is not a guaranteed free service.

Deploy the function from the project root using Supabase CLI:

```sh
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase secrets set GROQ_API_KEY=YOUR_GROQ_API_KEY
supabase functions deploy meal-recognition
```

Optional model override: `supabase secrets set GROQ_VISION_MODEL=qwen/qwen3.8-27b`.

Then set the AI function URL in NutriQuest Settings:
`https://YOUR_PROJECT_REF.supabase.co/functions/v1/meal-recognition`

The Supabase function deployment must require a valid JWT. The app sends the signed-in user's access token. Do not disable JWT verification for a public app. Keep provider secrets in Supabase Edge Function secrets only—never in `app.js`, GitHub, or the browser.

### Features and limitations
- USDA search currently uses `DEMO_KEY`, which is rate-limited. For more reliable use, obtain a USDA FoodData Central API key and change `DEMO_KEY` in `app.js`.
- Barcode search uses the public Open Food Facts API. A camera barcode scanner is not included in this release; barcode numbers can be entered manually.
- AI photo estimates are approximate and must be reviewed before logging. Images are sent to the configured server/provider only after the user taps Analyze.
- Cloud sync is manual (Sync now); no background sync is promised.
- This app deliberately has no face scan, body-based calorie calculator, weight-loss rate selector, or restrictive calorie goals. It is a food-learning companion, not medical advice.
