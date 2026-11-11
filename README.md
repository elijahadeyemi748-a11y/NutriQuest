# NutriQuest

An installable iPhone-friendly Progressive Web App starter for food journaling and nutrition exploration.

## Included
- Mobile-first app interface and Home Screen manifest
- Local food journal saved in browser storage
- Character selection, naming, XP and levels
- USDA FoodData Central food search (uses the public `DEMO_KEY`, which has strict rate limits)
- Barcode lookup via Open Food Facts
- Camera barcode scanner (requires HTTPS and camera permission)
- Macro and micronutrient dashboard for nutrients returned by food records
- Meal photo selection and preview

## Important limitations
- **AI photo recognition is not connected.** This build deliberately does not pretend that a photo was analyzed. A real vision model and a secure server endpoint are required to identify foods and estimate portions. Do not put a private AI API key in browser JavaScript.
- USDA's `DEMO_KEY` is rate-limited. For regular use, obtain a FoodData Central API key and put it behind a small server proxy rather than exposing it in a public app.
- Barcode data availability varies by product and country. Open Food Facts values are often per 100 g and may be incomplete.
- Nutrient totals are only as complete as the underlying food records. Missing data is not the same as zero nutrient content.
- This app intentionally does not set calorie, weight-loss, or restriction targets.

## Run locally
Open `index.html` in a modern browser for basic features. For camera scanning and service-worker support, serve over HTTPS or localhost.

## Install on iPhone
1. Publish this folder to an HTTPS host (for example, a static hosting service).
2. Open the published URL in Safari on iPhone.
3. Tap Share → Add to Home Screen.
4. Launch NutriQuest from the new Home Screen icon.

## Next development steps
1. Add a secure backend proxy for USDA FoodData Central.
2. Add a vision endpoint that accepts an image, returns candidate foods and portion estimates, and requires user confirmation before logging.
3. Add robust serving-size conversion and nutrient ID mapping for all FoodData Central data types.
4. Add export, backup, and accessibility testing.
