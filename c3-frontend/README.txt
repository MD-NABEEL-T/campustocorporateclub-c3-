PERFORMANCE / BUNDLE-SIZE FIX FILES (c3-frontend/src/...)
=============================================================
App/App.jsx                              -> src/App.jsx  (REPLACE)
DomainsSection/DomainsSection.jsx        -> src/components/sections/DomainsSection.jsx  (REPLACE)
JoinUsSection/JoinUsSection.jsx          -> src/components/sections/JoinUsSection.jsx  (REPLACE)
Carousel/Carousel.jsx                    -> src/components/reactbits/Carousel.jsx  (REPLACE)
Modal/Modal.jsx                          -> src/components/ui/Modal.jsx  (REPLACE)
ApplicationForm/ApplicationForm.jsx      -> src/components/public/ApplicationForm.jsx  (REPLACE)
FAQAccordion/FAQAccordion.jsx            -> src/components/public/FAQAccordion.jsx  (REPLACE)
Apply/Apply.jsx                          -> src/pages/public/Apply.jsx  (REPLACE)
ToastContext/ToastContext.jsx            -> src/context/ToastContext.jsx  (REPLACE)
package/package.json                     -> c3-frontend/package.json  (REPLACE - framer-motion removed)

ALSO DELETE THESE TWO FILES (dead code, not used anywhere):
- src/components/reactbits/FloatingLines.jsx
- src/components/reactbits/FloatingLines.css

AFTER COPYING:
1. Delete the two FloatingLines files above.
2. Run: npm install   (package.json changed - framer-motion removed)
3. Run: npm run build
   Should complete clean, and you should see separate small chunks like
   Dashboard-*.js, AllAttendance-*.js, Galaxy-*.js, MagicRings-*.js etc.
   instead of one giant bundle.

WHAT EACH FILE CHANGE DOES:
- App.jsx: pages are now lazy-loaded (React.lazy + Suspense) so public/
  member/admin code splits into separate downloads instead of one bundle.
- DomainsSection.jsx: Galaxy/Strands/MagicRings (three.js/ogl - heavy)
  are now lazy-loaded, only fetched when that section scrolls into view.
- JoinUsSection.jsx: same treatment for Particles (ogl).
- Carousel.jsx: swapped 5 generic icons from react-icons to lucide-react
  (no visual/behavior change, just removes overlap with your existing
  lucide-react usage).
- Modal.jsx, ApplicationForm.jsx, FAQAccordion.jsx, Apply.jsx,
  ToastContext.jsx: import 'motion' instead of 'framer-motion' (same
  API, just consolidates to the one package used everywhere else).
- package.json: framer-motion dependency removed.
