# SYD Ledger Solutions

A complete five-page static website in HTML5, CSS3, Bootstrap 5.3.3 and vanilla JavaScript. No installation, build command, framework or server is required.

## Run or upload

Open `index.html` directly in a browser. For shared hosting, upload the five HTML files and the `assets` folder together to the public web directory. All page links are relative. An internet connection loads the CDN styles, fonts and animation libraries. Body content is already present in HTML and remains readable if JavaScript or animation CDNs are unavailable. A local web server is optional.

```
index.html
about.html
insights.html
contact.html
pricing.html
contact-handler.php          # optional cPanel PHP mail handler
assets/
  css/style.css
  js/main.js
  images/
README.md
```

The wordmark uses the supplied SYD Ledger logo. Decorative glass geometry, finance motifs and motion effects are CSS and inline SVG. Reduced-motion users receive a still presentation.

## Contact integration — required before accepting enquiries

The form validates locally and opens the visitor’s email app addressed to `Sydledgersolutions@gmail.com` when the endpoint is blank. The visitor must complete the final send action in their own email app. No personal details are stored by the website. The submit button remains disabled when JavaScript is unavailable.

### cPanel direct delivery

For direct delivery from cPanel, upload `contact-handler.php` beside the HTML files, then change `CONTACT_ENDPOINT` near the top of `assets/js/main.js` to `contact-handler.php`. The PHP handler validates the fields and sends enquiries to `Sydledgersolutions@gmail.com` through the hosting account’s configured mail service. Create the matching mailbox or forwarding address in cPanel first, and test on the live HTTPS domain. GitHub Pages and local `file://` previews keep the email-app fallback because they cannot execute PHP.

The **single configuration point** is `CONTACT_ENDPOINT` near the top of `assets/js/main.js`. Replace its empty string with `contact-handler.php` on cPanel, or with your confirmed HTTPS endpoint. No HTML `action` change is needed. The form automatically updates its availability note when an endpoint is configured.

The form sends a JSON `POST` with `fullName`, `email`, `company`, `country`, `transactionsPerMonth` and `message`. The endpoint must return an HTTP 2xx response with JSON `{ "success": true }` only after the request has actually been accepted. Other responses and 15-second timeouts retain the entered details and show a failure message. It must accept CORS requests from the deployed site origin if it is on another origin. Testing submission from `file://` may be rejected by normal CORS rules; use an HTTP preview or hosting for integration testing.

Implement rate limits, appropriate CSRF/origin protection, spam prevention, secure delivery and business-appropriate data handling at the real endpoint. Never put API keys or other secrets in this static JavaScript. Configure any required privacy information with the business before collecting submissions.

## CDN/library list

- Bootstrap 5.3.3 CSS and bundle JS — `cdn.jsdelivr.net/npm/bootstrap@5.3.3/` (with subresource integrity).
- GSAP 3.12.5 and ScrollTrigger 3.12.5 — `cdn.jsdelivr.net/npm/gsap@3.12.5/dist/`.
- DM Sans and Manrope — Google Fonts (`fonts.googleapis.com` and `fonts.gstatic.com`), with Arial/sans-serif fallbacks and font-display swap.
- No jQuery, npm tooling, bundler, framework, icon font, analytics, cookie banner or tracking script.

## Design and maintenance

`assets/css/style.css` contains the shared palette, spacing, radius, glass, typography and motion tokens. The primary colors are `#0a66c2` and `#ffffff`. All five pages have complete semantic content, unique titles/descriptions and Open Graph basics. Canonical URLs and `og:url` are intentionally omitted until a confirmed production domain is configured. The tiny blank data favicon prevents requests for an invented logo.

Navigation and footers are static HTML repeated intentionally for direct-file compatibility. Update them consistently across all five pages. Exactly five public HTML pages are included.

`assets/js/main.js` coordinates GSAP, ScrollTrigger, keyboard-aware navigation, optional desktop pointer effects, and validation. Native scrolling is retained. Reduced-motion preferences disable large motion; the footer also offers Pause motion. Touch devices do not use tilt or magnetic effects. Navigation has a Bootstrap-independent JavaScript fallback and a no-JavaScript expanded-menu fallback. Form validation uses azure styling rather than Bootstrap's default red/green colors.

The abstract hero chart is decorative, hidden from assistive technology, and contains no financial measurements or performance data. Country labels indicate service areas, not office locations.

