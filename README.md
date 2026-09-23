# Plexis Media

A lightweight, responsive creative agency website with original collage artwork, subtle motion, and dedicated About, Services, and Contact pages.

## Preview locally

Run from the project directory:

```sh
python3 -m http.server 4173 --directory dist
```

Open http://localhost:4173. No build step or package installation is required.

## Structure

- `dist/`: complete static website
- `dist/assets/`: local artwork and fonts
- `dist/contact-config.json`: enquiry email destination

## Contact setup

The form sends enquiries through FormSubmit to the `email` in `dist/contact-config.json`. The recipient must confirm the activation email from FormSubmit after the first test submission before enquiries will reach the inbox. Check the spam folder if the activation email does not appear. FormSubmit processes and temporarily stores the submitted form data.

Motion respects the visitor's reduced-motion preference. Vercel serves `dist` using `vercel.json`. The GitHub repository is connected for automatic deployments.

The homepage butterfly reuses one compressed transparent WebP for its layered wing motion. It flutters when clicked or tapped; on phones it otherwise stays still. Reduced-motion settings and browsers without the needed features show the still image. The `www.plexis.media` to `plexis.media` redirect is configured on the Vercel project domain.
