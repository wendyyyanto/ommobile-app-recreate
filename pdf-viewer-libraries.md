# PDF viewer libraries with rich controls

Researched 2026-11-04 for this app: Expo SDK 54, React Native 0.81.5, New Architecture on, dev client builds. Nothing was installed or run, so every library claim below comes from docs or package metadata.

"Rich controls" is assumed to mean a viewer toolbar with page navigation, zoom, search, and thumbnails.

## Answer

Yes, but free native libraries do not include a control UI. The ready-made native toolbars come from paid SDKs. The one free ready-made UI is PDF.js in a WebView.

## Current state

| Item | Finding |
|---|---|
| Library in use | `react-native-pdf` 7.0.4 in `package.json`; changelog top entry is 7.0.5 |
| Screen | `features/teaching/PdfViewer.tsx` |
| Controls on screen now | Back button only, with `enablePaging` on |
| File handling | Downloaded to cache, deleted when the viewer closes |

## Options

| Library | Ready-made controls | Search | Thumbnails | Fit with this app | Cost |
|---|---|---|---|---|---|
| `react-native-pdf` (installed) | None | No | First page only, through `singlePage` | Works today | Free, MIT per listing |
| PDF.js viewer in `react-native-webview` | Yes, prebuilt web viewer | Yes (from my knowledge, not on the page read) | Yes (from my knowledge, not on the page read) | WebView already installed; hosting needed | Free |
| `react-native-pdf-jsi` 6.1.1 | No toolbar; has `goToPage`, `zoomTo`, `onPageChange` on a ref | Yes, `document.searchText(query, first, last)` returns rects for highlights (README) | Yes, `PdfPage` component | RN 0.76+, Expo 52+, config plugin; adds `react-native-nitro-modules`; zero-based pages; Android first build downloads about 23 MB PDFium | Free, MIT |
| `react-native-better-pdf` | None mentioned | Yes; Android 15+, or 12 to 14 with SDK extension 13 | Not mentioned | Blocked: current README needs RN 0.83+ and Expo SDK 55+ | Free, MIT |
| Nutrient (`@nutrient-sdk/react-native`) | Yes, default viewer UI | Not confirmed on pages read; expected (unverified) | Yes, thumbnail bar | Has Expo guide and config plugin; example uses iOS 17 and Android min SDK 24 | Paid, quote only |
| Apryse (`react-native-pdftron`) | Yes, configurable toolbars | Not confirmed in RN docs read | Not confirmed in RN docs read | Expo support not confirmed | Paid, quote only |

## What each path costs

| Path | Gain | Cost |
|---|---|---|
| Control bar on `react-native-pdf` | Page count, previous, next, jump to page, zoom | Small UI work, no new dependency, no native rebuild; live `scale` changes need a device test |
| PDF.js in WebView | Full viewer, free | Worker is off for `file://`, so the viewer must be served; PDF.js asks embedders to re-skin the viewer; phone fit and large file speed untested |
| `react-native-pdf-jsi` | Possible native search | New native dependencies, native rebuild, search needs proof on device; UI still yours to build |
| Nutrient or Apryse | Most complete native UI | License fee, larger native dependency, sales contact |

## Recommendation

| If you need | Use | Why |
|---|---|---|
| Page and zoom controls | Control bar on `react-native-pdf` | Smallest change; library already ships `setPage`, `onPageChanged`, `scale` |
| Search as well, no budget | Trial PDF.js first, then `react-native-pdf-jsi` | PDF.js needs no native change; jsi search is unconfirmed |
| Annotation, or full polish, with budget | Nutrient | Confirmed Expo guide and config plugin; get a quote first |

## Open checks

| Check | Why it matters |
|---|---|
| Is search required? | It decides whether `react-native-pdf` can stay |
| Live `scale` prop on both platforms | Docs read do not confirm programmatic zoom updates |
| Nutrient quote and iOS 17 floor | The example target may drop older devices; the guide says to match your release |
| Search in `react-native-pdf-jsi` | Listing claims it; the npm manifest does not mention it |

## Sources

| Source | Used for |
|---|---|
| [react-native-pdf](https://github.com/wonday/react-native-pdf) | Props, methods, Expo notes |
| [react-native-pdf-jsi manifest](https://registry.npmjs.org/react-native-pdf-jsi/latest) | Version, peers, plugin |
| [react-native-pdf-jsi listing](https://www.pkgstats.com/pkg:react-native-pdf-jsi) | Search and bookmark claims |
| [react-native-better-pdf](https://github.com/gmi-software/react-native-better-pdf) | Requirements, search limits |
| [Nutrient Expo guide](https://www.nutrient.io/blog/how-to-use-nutrient-react-native-sdk-with-expo) | Expo setup, version floors |
| [Nutrient getting started](https://www.nutrient.io/guides/react-native/getting-started/) | Default UI, thumbnail bar |
| [Apryse React Native API](https://docs.apryse.com/ios/get-started/react-native/api/) | Toolbars, license key |
| [G2 Apryse vs Nutrient](https://www.g2.com/compare/apryse-pdf-sdk-vs-nutrient-sdk) | Apryse quote-only pricing |
| [CloudPDF on Nutrient](https://cloudpdf.io/blog/pspdfkit-alternatives) | Nutrient contact-for-pricing; competitor source |
| [PDF.js getting started](https://mozilla.github.io/pdf.js/getting_started/) | Viewer, `file://` limit, re-skin request |
