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

Set `email` in `dist/contact-config.json` to the agency's enquiry address. The form validates input and opens a prefilled email draft in the visitor's email app. It does not send mail through a server. Until configured, the form explicitly reports that enquiries are not connected.

Motion respects the visitor's reduced-motion preference. Vercel serves `dist` using `vercel.json`. The GitHub repository is connected for automatic deployments.
