# Wedding Invitation — How to Customize

## Repository structure

```text
weddinginvite01/
├── index.html              # Page layout and data-key placeholders
├── styles.css              # Colors, typography, layout, and animations
├── script.js               # Loads JSON and updates the page
├── invite-config.json      # Names, dates, schedule, text, colors, and media
├── assets/
│   ├── images/
│   │   ├── hero-couple.png
│   │   ├── couple-portrait.png
│   │   ├── whatsapp-preview.png
│   │   ├── gallery-proposal.png
│   │   ├── gallery-engagement.png
│   │   └── gallery-family.png
│   └── audio/
│       └── wedding-theme.mp3
├── scripts/
│   └── generate-share-metadata.js
├── .github/
│   └── workflows/
│       └── deploy-pages.yml
└── README.md
```

## 1. Add your images

### Option A — Store images in the repository

1. Copy JPG, PNG, or WebP files into `assets/images/`.
2. Open `invite-config.json`.
3. Update the matching `local_path` field with a path such as:

```json
"local_path": "assets/images/your-hero-photo.png"
```

Recommended names used by the invitation are:

- `assets/images/hero-couple.png` — main banner
- `assets/images/couple-portrait.png` — couple portrait
- `assets/images/gallery-proposal.png` — gallery image
- `assets/images/gallery-engagement.png` — gallery image
- `assets/images/gallery-family.png` — gallery image

### Option B — Use an internet image URL

Replace the matching `public_url` with a direct image link:

```json
"public_url": "https://your-site.com/photos/hero.jpg"
```

The public URL is preferred when both `public_url` and `local_path` are present. For `assets/images/`, keep the website running from the repository root so relative paths resolve correctly.

## 2. Update your invitation text

Open `invite-config.json` and edit values that have these two parts:

```json
{
  "en": "English text",
  "sec": "Secondary-language text"
}
```

Important examples:

- Couple names: `couple.bride.name` and `couple.groom.name`
- Main wedding message: `celebration.message`
- Story: `story.timeline`
- Event names, dates, venues, and schedules: `event_schedule`
- Hotel and airport details: `travel`

Keep the `en` and `sec` keys. The language toggle reads these keys automatically.

## 3. Update the colors

In `invite-config.json`, edit hexadecimal colors under `theme_colors`:

```json
"theme_colors": {
  "primary": "#7A1F2B",
  "secondary": "#C9A96E",
  "background": "#FFF9F3",
  "surface": "#FFFFFF",
  "text": "#2D2420"
}
```

## 4. Update schedule details

- Add or edit events inside the `event_schedule` array.
- Keep a unique `id` for each event.
- Update event dates with bilingual `date` objects.
- Put the venue in `location.venue_name` and `location.address`.
- Use a complete map link in `location.map_url`.

## 5. Check your JSON

After editing:

1. Save the file with UTF-8 encoding.
2. Do not remove commas incorrectly or leave an opening bracket unmatched.
3. Use a JSON validator or VS Code's Problems panel if a value turns red.
4. Serve the site through a local web server rather than opening it only with a `file://` URL. Relative JSON and image paths need HTTP paths.

## How the files work together

- `index.html` displays fixed page regions and uses `data-key` placeholders.
- `styles.css` controls the appearance.
- `script.js` fetches `invite-config.json`, reads `currentLanguage`, maps `data-key` paths to JSON values, and assigns the image URLs.
- Every language change reruns the rendering process, so it does not require separate English and Telugu HTML pages.

## Publish with GitHub Pages

1. Create a GitHub repository and push this project to its default branch.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **GitHub Actions**.
4. Ensure `main` is the repository's default branch, then push the project to `main`.
5. Open the **Actions** tab and wait for **Deploy wedding invitation to GitHub Pages** to finish.
6. Open the provided `https://<username>.github.io/<repository>/` URL.

Keep the files at the repository root and keep names and folder paths matching `invite-config.json`. Do not use `/assets/...` absolute paths in the JSON; repository-relative paths such as `assets/images/hero-couple.png` work on project Pages URLs. `.nojekyll` prevents GitHub Pages processing from interfering with assets and folders.

## Customize the WhatsApp preview

All WhatsApp, social, browser, and search preview information comes from `invite-config.json`.

Update these values before sharing the website:

```json
"metadata": {
  "title": {
    "en": "The Wedding of Vijay & Gayathri",
    "sec": "విజయ్ & గాయత్రి వివాహం"
  },
  "site_url": "https://manaahvanam.github.io/weddinginvite01/",
  "description": {
    "en": "A celebration of love, family, laughter, and a beautiful new beginning.",
    "sec": "ప్రేమ, కుటుంబ బంధం, సంతోషపు నవ్వులు—విజయ్ & గాయత్రి కొత్త ప్రయాణం మొదలయ్యే పండుగకు మాతో కలిసి రండి."
  }
}
```

Set the preview image under `media_assets.share_preview`:

```json
"share_preview": {
  "local_path": "assets/images/whatsapp-preview.png",
  "public_url": "",
  "alt_text": {
    "en": "Vijay and Gayathri wedding invitation preview",
    "sec": "విజయ్ మరియు గాయత్రి వివాహ ఆహ్వాన ప్రివ్యూ"
  },
  "width": 2848,
  "height": 1504
}
```

- Put a replacement image at `assets/images/whatsapp-preview.png`, or use an HTTPS direct image URL in `public_url`.
- `public_url` takes priority. A `local_path` is converted to an absolute URL using `metadata.site_url` when the GitHub Pages deployment is generated.
- Use a horizontal image such as `1200 × 630` or the existing `2848 × 1504` image ratio.
- Keep names and important text away from the outer edge.
- Replace `metadata.site_url` with the exact public HTTPS invitation URL when moving to another repository or custom domain.

Do not paste names, descriptions, URLs, or preview dimensions directly into `index.html`. Update `invite-config.json`, then publish again.

## How WhatsApp preview metadata is generated

The browser script reads `invite-config.json` and updates page metadata when the invitation opens. For messaging apps, crawlers usually read static HTML without executing JavaScript, so the repository includes a build-time generator.

`.github/workflows/deploy-pages.yml` runs `scripts/generate-share-metadata.js` before uploading the GitHub Pages artifact. The generator:

1. Reads `invite-config.json`.
2. Creates Open Graph, Twitter, canonical, and search metadata.
3. Resolves the preview image to an absolute HTTPS URL.
4. Generates the static HTML used by WhatsApp and Facebook crawlers.

After a JSON update:

1. Commit and push the change to the `main` branch.
2. Wait for the **Deploy wedding invitation to GitHub Pages** workflow to complete.
3. Open the live URL and confirm the preview image URL works.
4. Send the URL to WhatsApp.
5. If WhatsApp keeps displaying an older card, add a new cache-busting query such as `?v=2` to the first shared URL. Keep the same `metadata.site_url` canonical URL in the JSON.

WhatsApp may cache previews for days. WhatsApp cache testing normally requires a new URL or the first successful crawl of an otherwise unique link.
