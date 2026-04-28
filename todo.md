# ACA Hydraulic - TODO

## Completed Tasks
- [x] Создание главной страницы (Home)
- [x] Создание страницы "Услуги" (Services)
- [x] Создание страницы "О компании" (About)
- [x] Создание страницы "Отзывы" (Reviews)
- [x] Создание страницы "Контакты" (Contacts)
- [x] Создание страницы "Кейсы" (Cases)
- [x] SEO-оптимизация (мета-теги для всех страниц)
- [x] Подключение аналитики (Google Analytics / Яндекс.Метрика)
- [x] Создание sitemap.xml и robots.txt
- [x] Оптимизация изображений (конвертация в WebP)
- [x] Мультиязычность (RU/KZ)
- [x] Создание раздела "Блог"
- [x] Обновление проекта до Full-Stack версии

## Pending Tasks
- [ ] Find "Оставить отзыв" button in the codebase
- [ ] Change its action to open WhatsApp with pre-filled message
- [ ] Telegram-интеграция для уведомлений о заявках (опционально)

## New Tasks
- [x] Change default language to Kazakh (KZ)
- [x] Update company address across all pages
- [x] Translate all remaining content to Kazakh language (Home page completed, translations prepared for other pages)

## SEO & B2B Optimization Project
- [x] Step 1: Conduct comprehensive website audit (Point A analysis)
- [x] Step 2: Create missing service page "Industrial Hydraulic Service"
- [x] Step 2: Create final site map document

## Phase 2: UI/UX Improvements
- [x] Fix header menu to single row layout (responsive)
- [x] Add brand logos section (CAT, Hitachi, Hyundai, Robex, Komatsu)
- [x] Optimize brand logos sizing and spacing for desktop

## Phase 3: Mobile & Language Issues
- [x] Fix equipment grid mobile responsiveness (1 column on mobile instead of 2)
- [x] Fix missing equipment icons on mobile (added 4 missing icons)
- [x] Set Kazakh (KZ) as default language instead of Russian

## Phase 4: Language Settings
- [x] Change default language from Kazakh to Russian

## Phase 5: Calculator Equipment Block Redesign
- [x] Create unified yellow outline SVG icons (48-56px, 2px stroke, #FFC107)
- [x] Update card styling (dark background #121212, 12-16px border-radius, 24px padding)
- [x] Add hover animations (yellow fill icon, dark-graphite background #1C1C1C)
- [x] Add selection state (yellow 2px border, glow effect)
- [x] Ensure high contrast white text (#FFFFFF) on dark background

## Phase 6: Equipment Icons Redesign (Accurate Representations)
- [x] Create 9 accurate equipment icons matching exact names (3px outline, #FFB800, side profile)
- [x] Excavator - tracked excavator with bucket and boom
- [x] Mining loader - low-profile underground LHD loader
- [x] Bulldozer - tracked with front blade
- [x] Milling machine - road milling machine with drum
- [x] HDD rig - horizontal directional drilling with guide frame
- [x] Piling rig - vertical drilling/piling machine
- [x] Grader - motor grader with long blade
- [x] Wheel loader - front-end wheel loader
- [x] Other equipment - tool icon (wrench or hammer)
- [x] Show preview to user for approval before applying
- [x] Update card sizing (desktop: 60px icons, 180px min height; mobile: 52px icons, 2 columns)

## Phase 7: Google Tag Installation
- [x] Add Google Tag (gtag.js AW-17847190636) code to index.html head section
- [x] Test Google Tag implementation and verify tracking

- [x] Redesign cost calculator with new dark theme (matching reference design)
  - Dark background (#1A1A1A or similar)
  - Yellow icons and borders (#FFB800)
  - Add step progress indicator "Шаг 1 из 4" in top right
  - Improve card hover effects and selection states
  - Ensure all 9 equipment types display correctly

## Phase 8: Complete SEO Optimization
- [x] Audit all existing pages for current SEO structure
- [x] Add unique Title tags for each page (50-60 characters)
- [x] Add unique Meta Description for each page (150-160 characters)
- [x] Ensure single H1 tag on each page
- [x] Add internal linking structure across all pages
- [x] Generate sitemap.xml file
- [x] Add LocalBusiness Schema Markup for Astana location
- [x] Test all SEO implementations

## Phase 9: Add robots.txt for Search Engine Crawlers
- [ ] Create /client/public/robots.txt file
- [ ] Add User-agent and Allow directives
- [ ] Add Sitemap URL reference

## Phase 10: Configure 301 Redirects for Old URLs
- [x] Map old URLs to new page structure
- [x] Implement 301 redirects in Express server
- [x] Test all redirect paths

## Phase 11: Update Brand Logos to Diagnostic Equipment Brands
- [x] Replace equipment brands with diagnostic tool brands
- [x] Update brand names: CAT ET, ToughBuilt, Milwaukee, Perkins
- [x] Find or create brand logo images
- [x] Update Home page brand section

## Phase 12: Fix Brand Logo Display Issues
- [x] Search and download high-quality brand logos (CAT ET, ToughBuilt, Milwaukee, Perkins)
- [x] Save logos to /client/public/brands/ directory
- [x] Update image references in Home.tsx to use local paths
- [x] Fix mobile header brand logos
- [x] Test all logo displays on both desktop and mobile

## Phase 13: Restore Original Equipment Brands in Mobile Hero Section
- [x] Change mobile header brands back to original equipment manufacturers (CAT, Hitachi, Hyundai, Komatsu)
- [x] Keep diagnostic equipment brands in "СОВРЕМЕННОЕ ОБОРУДОВАНИЕ" section
- [x] Test mobile view

## Phase 14: Fix Broken Brand Logos (Hitachi, Hyundai, Komatsu)
- [x] Find and download working logo images for Hitachi, Hyundai, Komatsu
- [x] Replace broken logo files in /brands/ directory
- [x] Test logo display in mobile hero section

## Phase 15: Redesign Mobile Brand Layout to Single Horizontal Row
- [x] Change mobile hero brand layout from 2 rows to 1 horizontal row
- [x] Display 4 brands: CATERPILLAR, HITACHI, HYUNDAI ROBEX, KOMATSU
- [x] Match reference design exactly (single row, centered, proper spacing)

## Phase 16: Fix Mobile Brand Logo Uniform Sizing
- [x] Set all 4 brand logos to same height (h-6 = 24px)
- [x] Ensure equal spacing between logos (gap-6)
- [x] Center align logos horizontally
- [x] Test visual consistency on mobile viewport

## Phase 17: Unified Monochrome Brand Logo Styling
- [x] Find or create white monochrome versions of all 4 brand logos
- [x] Ensure all logos have same style (white color, transparent background)
- [x] Set uniform size for all logos to fit perfectly in one row
- [x] Test visual consistency and single-row layout on mobile

## Phase 18: Remove Brand Logos from Mobile Hero Section
- [x] Remove the 4 manufacturer logos (CATERPILLAR, HITACHI, HYUNDAI ROBEX, KOMATSU) from mobile hero section
- [x] Keep the diagnostic equipment brands in "СОВРЕМЕННОЕ ОБОРУДОВАНИЕ" section unchanged
- [x] Test mobile view to ensure clean layout

## Phase 19: Restore White Monochrome Brand Logos in Mobile Hero
- [x] Restore the 4 white monochrome manufacturer logos (CATERPILLAR, HITACHI, HYUNDAI ROBEX, KOMATSU) in mobile hero section
- [x] Use the CDN URLs from Phase 17 (white monochrome versions)
- [x] Ensure uniform sizing and single-row layout

## Phase 20: Google Ads Conversion Tracking Setup
- [x] Verify existing Google Tag (gtag.js) installation
- [x] Add gtag_report_conversion function with event ID AW-17847190636/4nkyCNfMn_gbEOyImr5C
- [x] Implement conversion tracking on form submissions (calculator, contact forms)
- [x] Ensure gclid parameter preservation (automatic with gtag.js)
- [x] Prevent double conversion firing (function checks prevent duplicates)
- [ ] Test with Tag Assistant (requires user to test in production)

## Phase 21: Professional Lead Form Processing System
- [ ] Create database schema for leads (name, phone, whatsapp, equipment_type, comment, source_page, ip_address, created_at)
- [ ] Set up email service with SMTP for sending to azamat95@gmail.com
- [ ] Integrate Google reCAPTCHA v3 for spam protection
- [ ] Create tRPC procedure for form submission with validation
- [ ] Implement email template with all required fields
- [ ] Update B2B Lead Form with new submission logic
- [ ] Update "Вызвать специалиста" button/form with submission logic
- [ ] Update Cost Calculator WhatsApp flow with lead capture
- [ ] Add duplicate submission prevention (rate limiting)
- [ ] Trigger Google Ads conversion after successful submission
- [ ] Add success toast notification without page reload
- [ ] Test all forms and email delivery

## Phase 22: Desktop Layout Improvements
- [x] Arrange header elements in single horizontal row for desktop (already in single row)
- [x] Remove brand logos from hero section (below "Вызвать специалиста") on desktop only
- [x] Remove brand logos from "Современное оборудование" section on desktop only
- [x] Add physical address "Астана, Абая 24/1" to contacts section
- [x] Test desktop responsiveness and visual appearance

## Phase 23: Remove Remaining Desktop Brand Logos and Optimize Header
- [x] Find and remove all remaining brand logos from desktop hero section footer (SAVAGE, STRIM, ZOM, StroiMech, OCTANORM)
- [x] Optimize header navigation layout - removed separators, increased spacing, improved typography
- [x] Test desktop view to ensure clean appearance

## Phase 24: Remove Mobile Hero Brand Logos
- [x] Remove manufacturer brand logos (CATERPILLAR, HITACHI, HYUNDAI, KOMATSU) from mobile hero section
- [x] Keep equipment logos (CAT ET, ToughBuilt, Milwaukee, Perkins) in "Современное оборудование" section
- [x] Test mobile view

## Phase 26: Replace "ПОДРОБНЕЕ ОБ УСЛУГЕ" Button
- [x] Change button text from "ПОДРОБНЕЕ ОБ УСЛУГЕ" to "ОСТАВИТЬ ЗАЯВКУ ОНЛАЙН"
- [x] Keep all styles, size, spacing unchanged
- [x] Configure button to open modal form (same as other lead form triggers)
- [x] Test button click opens modal correctly

## Phase 27: Add Hero Informational Text and Sticky Mobile Bar
- [x] Add informational text block under hero buttons with 4 key points (response time, Kazakhstan coverage, contract with VAT, spare parts warehouse)
- [x] Style text with rgba(255,255,255,0.85) color, font-weight 500-600, 20-24px top margin
- [x] Ensure mobile responsiveness (2 rows on mobile if needed)
- [x] Create sticky bottom bar component for mobile only (below 768px)
- [x] Add two equal buttons: "Позвонить" (black bg, tel link) and "WhatsApp" (green #25D366, WhatsApp link)
- [x] Ensure bar is fixed at bottom, high z-index, doesn't cover content
- [x] Test mobile view and functionality

## Phase 28: Change Informational Text to Vertical List on Mobile
- [x] Modify informational text block to display as vertical list on mobile (flex-col)
- [x] Keep horizontal layout on desktop (flex-row with wrap)
- [x] Test mobile view for improved readability

## Phase 29: Gmail SMTP Integration and Complete Lead Processing System
- [x] Configure SMTP credentials (manus@acahydraulic.kz with app password)
- [x] Update database schema: add priority (1-5), status (new/urgent/in_progress/completed), ai_summary fields
- [x] Implement email service with SSL, 10s timeout, error handling, logging
- [x] Create notification email template (to info@acahydraulic.kz, CC stas@acahydraulic.kz)
- [x] Create auto-reply email template for clients
- [x] Implement AI analysis for priority detection (urgent keywords: авария, срочно, не работает, простой, утечка)
- [x] Add validation and sanitization for form inputs
- [x] Implement rate limiting and debounce protection
- [x] Create tRPC procedure for complete lead processing workflow
- [x] Update frontend forms (B2BLeadForm) to use new procedure
- [x] Test complete workflow: form submission → DB save → email notifications → auto-reply
- [x] Send test email and verify delivery

## Phase 30: Add Email Address to Website
- [x] Audit current website structure (footer, contacts page, header)
- [x] Add info@acahydraulic.kz to footer component
- [x] Add info@acahydraulic.kz to Contacts page
- [x] Test all pages to ensure no layout breaks
- [x] Save checkpoint

## Phase 31: Fix Non-Clickable Call Button
- [x] Identify which call button is not clickable (header, footer, CTA sections)
- [x] Fix button click issue (check z-index, pointer-events, overlays)
- [x] Test on all pages (Home, Services, About, Reviews, Contacts)
- [x] Save checkpoint

## Phase 32: Fix Non-Working Call Buttons on Mobile
- [x] Check "ВЫЗВАТЬ СПЕЦИАЛИСТА" button code in Home.tsx
- [x] Check "ПОЗВОНИТЬ" button in StickyMobileBar component
- [x] Fix button click handlers and ensure tel: links work
- [x] Test all buttons on mobile viewport
- [x] Save checkpoint

## Этап 1: Critical Fixes (TASK 1-2)

### TASK 1 - Fix Bottom Section on /services
- [x] Add visible clickable phone number: +7 771 417 79 25 (tel:+77714177925)
- [x] Add WhatsApp link next to phone: https://wa.me/77714177925
- [x] Increase font-weight to 600
- [x] Ensure mobile responsiveness
- [x] Do not alter global footer styling

### TASK 2 - Replace Weak CTA Block
- [x] Remove or redesign "Нужна консультация" block
- [x] Create high-conversion CTA section with headline "Срочный выезд инженера в течение 2 часов"
- [x] Add subtext "Работаем по договору с НДС. Собственный склад запчастей."
- [x] Add yellow button "ВЫЗВАТЬ СПЕЦИАЛИСТА" (tel link)
- [x] Add black button "ОСТАВИТЬ ЗАЯВКУ" (opens modal form)
- [x] Match existing design system
- [x] Test on mobile and desktop
- [x] Save checkpoint after Этап 1 completion

## Этап 2: Individual Service Pages (TASK 3)
- [ ] Create /remont-gidronasosov page
- [ ] Create /remont-raspredeliteley page
- [ ] Create /remont-gnb page
- [ ] Create /remont-ekskavatorov page
- [ ] Create /diagnostika-gidrosistem page
- [ ] Make service cards on /services clickable
- [ ] Write unique expert content for each page (problem, stages, timeline, guarantee, FAQ)
- [ ] Save checkpoint after Этап 2 completion

## Этап 3: SEO Technical Structure (TASK 4)
- [ ] Add proper H1/H2 hierarchy to all service pages
- [ ] Add meta title + description for each page
- [ ] Add schema markup (LocalBusiness + Service)
- [ ] Add internal linking between services
- [ ] Generate clean URL slugs
- [ ] Ensure canonical tags
- [ ] Save checkpoint after Этап 3 completion

## Этап 4: Conversion Optimization + AI Qualifier (TASK 5)
- [ ] Add trust block to each service page
- [ ] Add urgency trigger "Срочный выезд 24/7"
- [ ] Add bottom sticky mobile CTA bar (Phone | WhatsApp)
- [ ] Create interactive AI lead qualifier (4 steps: техника → проблема → срочность → город)
- [ ] Integrate qualifier with form submission and priority detection
- [ ] Test qualifier flow on mobile and desktop
- [ ] Save checkpoint after Этап 4 completion

## Final Testing
- [ ] Run mobile responsiveness test
- [ ] Validate no console errors
- [ ] Validate routing
- [ ] Validate form still works
- [ ] Provide summary of changes
- [ ] Mark as production-ready

## Phase 33: Google Ads Conversion Tracking for Phone Clicks
- [x] Audit all pages (Home, Services, About, Reviews, Contacts) for tel: links
- [x] Add onClick handler with gtag('event','conversion',{'send_to':'AW-17847190636/gJzYCKDa2vgbEOyImr5C'}) to all tel: links
- [x] Ensure gtag is not duplicated (already installed)
- [x] Test conversion event firing in browser console
- [x] Save checkpoint

## Phase 34: WhatsApp Conversion Tracking Setup
- [x] Verify existing Google tag (AW-17847190636) is installed
- [x] Add gtag_report_conversion function to <head> in client/index.html
- [x] Find all WhatsApp buttons/links across the website
- [x] Add onclick="return gtag_report_conversion('https://wa.me/77714177925');" to all WhatsApp buttons
- [x] Test button click functionality (WhatsApp should open)
- [x] Verify no console errors after implementation
- [x] Save checkpoint and provide implementation report

## Phase 35: Remove Гидроцилиндры Service Direction

### Step 1: Audit
- [x] Search all files for "гидроцилиндр", "гидроцилиндры", "цилиндр"
- [x] Check if /remont-gidrocilindrov page exists (found /services/hydraulic-cylinders)
- [x] List all files containing гидроцилиндры mentions (8 files, 27 mentions)

### Step 2: Remove Texts
- [ ] Remove from service cards/lists
- [ ] Remove from main page descriptions
- [ ] Remove from benefits blocks
- [ ] Remove from footer
- [ ] Remove from meta title/description
- [ ] Remove from image alt tags

### Step 3: Remove Navigation
- [ ] Remove from main menu
- [ ] Remove from mobile menu
- [ ] Remove from footer links
- [ ] Remove from internal links
- [ ] Delete /remont-gidrocilindrov page if exists

### Step 4: SEO Cleanup
- [ ] Remove schema markup for гидроцилиндры
- [ ] Remove canonical tags if any
- [ ] Remove structured data for this service

### Step 5: Testing
- [ ] Run build to check for errors
- [ ] Check browser console for errors
- [ ] Verify no broken links
- [ ] Verify no 404 pages
- [ ] Test all remaining services still work

### Step 6: Report
- [ ] List all modified files
- [ ] List all deleted pages
- [ ] Confirm website works correctly
- [ ] Save checkpoint

## Phase 34: Fix Google Search Console 404 Error
- [x] Add 301 redirect from /services/hydraulic-cylinders to /services
- [x] Test redirect functionality
- [x] Save checkpoint

## Phase 36: Fix SSL "Not Secure" Warning
- [ ] Audit all files for HTTP:// links
- [ ] Replace HTTP links with HTTPS or relative paths
- [ ] Check external resources (images, scripts, fonts)
- [ ] Test SSL certificate on acahydraulic.kz
- [ ] Save checkpoint

## Phase 37: Transform to Industrial B2B Website (Top 0.1%)

### Service Pages Creation
- [x] Create /services/gnb-repair page (GNB drilling rigs repair)
- [x] Create /services/bulldozer-repair page (Bulldozer repair)
- [x] Create /services/wirtgen-repair page (Wirtgen road milling machines)

### New Sections
- [x] Create /projects page with 3 template cases
- [x] Create /about page with engineering style

### Design Requirements
- [ ] Dark background + yellow accents (#FFC000)
- [ ] Large typography, minimalism
- [ ] Industrial icons
- [ ] No prices, no "cheap/best/100% guarantee"
- [ ] Professional B2B tone

### SEO & Navigation
- [x] Add H1, H2-H3 structure for each page
- [x] Add meta title + description
- [ ] Add ALT tags for images
- [x] Update navigation menu
- [x] Add new services to /services page
- [ ] Test mobile responsiveness

### Final Testing
- [x] Check all buttons work
- [x] Check mobile layout
- [x] Verify no broken links
- [ ] Save checkpoint

## Phase 38: Restructure Services Page
- [x] Create 11 new service pages (loaders, manipulators, railway, presses, drilling, graders, pile drivers, mine loaders, dump trucks)
- [x] Update Services page with 17 services in correct order
- [x] Remove "Выездной ремонт" from navigation menu
- [x] Add Google Search Console verification file
- [x] Test all service pages
- [x] Save checkpoint

## Phase 39: Redesign Services Page with 5 Main Categories
- [x] Backup current Services.tsx
- [x] Redesign Services page with 5 main service categories:
  - [x] 1. Выездной инженерный сервис 24/7
  - [x] 2. Ремонт спецтехники (6 subcategories)
  - [x] 3. Ремонт буровых установок (3 subcategories)
  - [x] 4. Ремонт гидравлических систем (5 subcategories)
  - [x] 5. Промышленная гидравлика (2 subcategories)
- [x] Add industrial icons for each main category
- [x] Add trust block at the bottom (юр. лица, договор, НДС, выезд, диагностика)
- [x] Test mobile responsiveness
- [x] Save checkpoint

## Phase 40: Create Professional Industrial Icons for Services Section
- [x] Generate 11 minimalist linear SVG icons in unified B2B style:
  - [x] 1. Mobile service 24/7 (service van + wrench)
  - [x] 2. Heavy equipment repair (excavator silhouette)
  - [x] 3. Drilling equipment (drilling rig)
  - [x] 4. GNB repair (horizontal drilling)
  - [x] 5. Hydraulic pumps (pump + hydraulic line)
  - [x] 6. Hydraulic motors (motor with rotation)
  - [x] 7. Distributors (hydraulic block with flows)
  - [x] 8. Industrial hydraulics (gears + hydraulic line)
  - [x] 9. Excavator repair (excavator boom)
  - [x] 10. Bulldozer repair (bulldozer front view)
  - [x] 11. Wirtgen repair (milling drum)
- [x] Integrate icons into Services.tsx without breaking layout
- [x] Add subtle hover effects (5% scale or color shift)
- [x] Test desktop (48-64px) and mobile (32-40px) responsiveness
- [x] Verify all existing functionality preserved
- [x] Save checkpoint

## Phase 41: Create Professional Favicon from ACA Hydraulic Logo
- [x] Generate 512x512px favicon (geometric symbol only, dark background)
- [x] Generate 180x180px Apple touch icon
- [x] Generate 32x32px favicon
- [x] Generate 16x16px favicon
- [x] Convert to favicon.ico format
- [x] Integrate favicon into project (client/public/)
- [x] Update index.html with favicon links
- [x] Test favicon display in browser tab
- [x] Test Apple touch icon on mobile
- [x] Save checkpoint

## Phase 42: Add Google Search Console Verification Files
- [x] Copy all 13 GSC verification HTML files to client/public/
- [x] Verify files are accessible via browser
- [x] Save checkpoint

## Phase 43: Create Sitemap.xml and Robots.txt for SEO
- [x] Collect all page URLs from App.tsx routes
- [x] Create sitemap.xml with proper structure and priorities
- [x] Create robots.txt with sitemap reference
- [x] Place files in client/public/
- [x] Verify files are accessible via browser
- [x] Save checkpoint

## Phase 44: Add Professional Background Images to Service Pages
- [x] Generate premium background images for priority service pages:
  - [x] GNB repair (horizontal directional drilling rig in action)
  - [x] Mobile repair service (service truck with equipment)
  - [x] Excavator repair (excavator on construction site)
  - [x] Hydraulic pumps (hydraulic pump close-up)
  - [x] Drilling equipment (vertical drilling rig)
- [x] Upload generated images to S3 and get CDN URLs
- [x] Integrate backgrounds into service page CSS
- [x] Add gradient overlays for text readability
- [x] Test visual quality on all pages
- [x] Save checkpoint

## Phase 45: Add Backgrounds to Remaining Service Pages and Improve Typography
- [x] Generate professional industrial background images for 12 remaining service pages:
  - [x] Bulldozer repair (Caterpillar/Komatsu bulldozer on construction site)
  - [x] Loader repair (front-end loader in operation)
  - [x] Grader repair (motor grader on road project)
  - [x] Wirtgen repair (road milling machine in action)
  - [x] Hydraulic motors (hydraulic motor close-up)
  - [x] Distributors (hydraulic valve block)
  - [x] Hydraulic cylinders (hydraulic cylinder cutaway)
  - [x] Industrial hydraulics (industrial press)
  - [x] Mining equipment (mining excavator in quarry)
  - [x] Manipulators (crane manipulator)
  - [x] Vertical drilling (vertical drilling rig)
  - [x] Piledriver (pile driving equipment on site)
- [x] Upload all generated images to S3 and get CDN URLs
- [x] Integrate backgrounds into remaining service page CSS
- [x] Improve typography across website:
  - [x] Set body text font-weight to 300-400 for lighter appearance
  - [x] Increase heading font-weight to 700-900 for better contrast
  - [x] Improve text color for better readability
- [x] Test visual quality on all updated pages
- [x] Save checkpoint

## Phase 46: Lighten Website Background to Dark Grey
- [x] Update background color from black (oklch 0.15) to dark grey (oklch 0.22-0.25)
- [x] Update card backgrounds to match new scheme
- [x] Update secondary/accent backgrounds
- [x] Verify text contrast remains readable
- [x] Test visual quality across pages
- [x] Save checkpoint

## Phase 47: Fix Icons, Add Background Image, and Change Services Page Color Scheme
- [x] Investigate why service category icons are not loading (showing yellow placeholders)
- [x] Fix icon paths or upload icons to S3 if needed
- [x] Generate beautiful industrial background image for Services page hero section
- [x] Change Services page color scheme:
  - [x] Background: white (#FFFFFF)
  - [x] Headings: dark grey/black (#1A1A1A)
  - [x] Body text: grey (#4A4A4A)
  - [x] Accents: yellow (#FFC000)
  - [x] Cards: light grey background (#F5F5F5)
- [x] Test visual quality on mobile and desktop
- [x] Save checkpoint

## Phase 48: Revert Services Page Color Scheme to Dark Theme
- [x] Change Services page background back to dark grey (oklch 0.22)
- [x] Change text back to white
- [x] Change service cards back to dark grey backgrounds
- [x] Keep yellow accents (#FFC000)
- [x] Keep industrial background image in hero section
- [x] Test visual quality
- [x] Save checkpoint

## Phase 49: Add 2GIS Link to Contacts Page
- [x] Review Contacts page structure
- [x] Add 2GIS link (https://2gis.kz/astana/geo/70000001111695391) to map section
- [x] Style link as button or clickable element
- [x] Test link opens correctly
- [x] Save checkpoint

## Phase 50: SEO Audit and Improvements
- [ ] Audit all page meta titles and descriptions
- [ ] Research target keywords for hydraulic repair in Kazakhstan
- [ ] Improve meta tags across all pages (Home, Services, About, Contacts, Reviews)
- [ ] Add JSON-LD LocalBusiness schema markup
- [ ] Add sitemap.xml
- [ ] Improve robots.txt
- [ ] Fix heading structure (H1/H2/H3 hierarchy)
- [ ] Add alt text to images
- [ ] Add canonical URLs
- [ ] Save checkpoint

## Phase 51: Add YouTube Video Section
- [ ] Add YouTube Shorts video (spniTTX9ECI) embed to Home page
- [ ] Style video section in dark theme with yellow accents
- [ ] Add YouTube channel link button
- [ ] Test responsiveness
- [ ] Save checkpoint

## SEO Optimization Sprint (Phase 36)
- [ ] Fix VITE_APP_TITLE to correct SEO title
- [ ] Remove duplicate canonical from index.html
- [ ] Merge two gtag.js scripts into one
- [ ] Create og-image.jpg (1200x630)
- [ ] Rebuild unified SEO component with full schema support
- [ ] Fix ServicePageTemplate: add canonical, og tags, breadcrumb schema
- [ ] Fix RegionalPageTemplate: add canonical, og tags
- [ ] Add SEO to all service pages missing it
- [ ] Add SEO to Corporate page
- [ ] Create 4 blog articles with SEO content
- [ ] Optimize Google Fonts (reduce to 2 families)
- [ ] Add lazy loading to images
- [ ] Improve internal linking between service and region pages

## SEO Critical Fixes (Phase 52)
- [ ] Pre-rendering: install vite-plugin-prerender and configure all 39 routes
- [ ] Code splitting: React.lazy() for blog, regional, and service pages
- [ ] Brand pages: /brands/cat, /brands/komatsu, /brands/hitachi, /brands/hyundai
- [ ] Add brand pages to sitemap.xml
- [ ] Add brand pages to App.tsx routes
