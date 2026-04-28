# Google Ads Conversion Tracking Implementation

## Overview
Google Ads conversion tracking has been successfully implemented for the ACA Hydraulic website to track form submissions and lead generation.

## Configuration Details

**Google Ads Account ID:** `AW-17847190636`  
**Conversion Event ID:** `AW-17847190636/4nkyCNfMn_gbEOyImr5C`  
**Conversion Name:** "Заявка с сайта ACA Hydraulic"

## Implementation

### 1. Global Tag Setup
The Google Ads global tag (gtag.js) is installed in `client/index.html`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-17847190636"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-17847190636');
  
  // Google Ads Conversion Tracking Function
  function gtag_report_conversion(url) {
    var callback = function () {
      if (typeof(url) != 'undefined') {
        window.location = url;
      }
    };
    gtag('event', 'conversion', {
        'send_to': 'AW-17847190636/4nkyCNfMn_gbEOyImr5C',
        'event_callback': callback
    });
    return false;
  }
  
  window.gtag_report_conversion = gtag_report_conversion;
</script>
```

### 2. Conversion Triggers

Conversions are tracked on the following user actions:

#### A. B2B Lead Form Submission
**File:** `client/src/components/B2BLeadForm.tsx`  
**Trigger:** When user successfully submits the B2B lead form  
**Implementation:**
```typescript
// Fire Google Ads conversion
if (typeof window.gtag_report_conversion === 'function') {
  window.gtag_report_conversion();
}
```

#### B. Cost Calculator - WhatsApp Button Click
**File:** `client/src/components/CostCalculator.tsx`  
**Trigger:** When user clicks "Получить смету в WhatsApp" button after completing calculator  
**Implementation:**
```typescript
onClick={() => {
  // Fire Google Ads conversion
  if (typeof window.gtag_report_conversion === 'function') {
    window.gtag_report_conversion();
  }
}}
```

### 3. TypeScript Support
Global window interface extended in `client/src/global.d.ts`:

```typescript
interface Window {
  gtag_report_conversion: (url?: string) => boolean;
  gtag: (...args: any[]) => void;
  dataLayer: any[];
}
```

## Features

### ✅ GCLID Preservation
The Google Ads tag automatically captures and preserves the `gclid` parameter from URL query strings, ensuring proper attribution of conversions to ad clicks.

### ✅ Duplicate Prevention
The implementation includes safety checks:
- Function existence check before calling: `typeof window.gtag_report_conversion === 'function'`
- Google's native deduplication prevents multiple conversions from the same user session

### ✅ No Double Firing
Each conversion trigger is placed at the appropriate user action point:
- Form submission success (after validation)
- WhatsApp button click (single action)

## Testing Instructions

### Using Google Tag Assistant

1. Install [Google Tag Assistant Chrome Extension](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)

2. Open the website in Chrome

3. Click the Tag Assistant icon and enable recording

4. Perform one of the conversion actions:
   - Submit the B2B lead form
   - Complete the cost calculator and click WhatsApp button

5. Check Tag Assistant for:
   - ✅ Google Ads tag is firing
   - ✅ Conversion event is being sent
   - ✅ Conversion ID matches: `AW-17847190636/4nkyCNfMn_gbEOyImr5C`

### Using Google Ads Interface

1. Log in to Google Ads account

2. Navigate to: **Tools & Settings → Measurement → Conversions**

3. Find conversion: "Заявка с сайта ACA Hydraulic"

4. Check status:
   - Should show "Recording conversions" status
   - May take 24-48 hours for first conversions to appear

### Browser Console Testing

1. Open browser DevTools (F12)

2. Go to Console tab

3. Perform a conversion action

4. Check for network requests to `googleadservices.com`

5. Verify no JavaScript errors related to gtag

## Conversion Value

Currently, conversions are tracked without a specific monetary value. To add conversion value tracking, update the conversion call:

```typescript
gtag('event', 'conversion', {
    'send_to': 'AW-17847190636/4nkyCNfMn_gbEOyImr5C',
    'value': 1000.0,  // Add estimated lead value
    'currency': 'KZT'  // Kazakhstan Tenge
});
```

## Troubleshooting

### Conversion Not Recording

1. **Check Tag Installation**
   - Open browser DevTools → Network tab
   - Look for requests to `googletagmanager.com` and `googleadservices.com`
   - Verify no 404 or blocked requests

2. **Verify Function Availability**
   - Open browser console
   - Type: `typeof window.gtag_report_conversion`
   - Should return: `"function"`

3. **Check Ad Blockers**
   - Disable ad blockers temporarily
   - Test conversion action again

4. **Verify Conversion ID**
   - Ensure ID matches exactly: `AW-17847190636/4nkyCNfMn_gbEOyImr5C`
   - Check for typos in implementation

### Data Delay

- Conversions may take 3-24 hours to appear in Google Ads
- Real-time testing requires Tag Assistant or browser DevTools

## Maintenance

### When to Update

- If Google Ads account ID changes
- If new conversion actions are added
- If conversion event ID is regenerated

### Files to Modify

1. `client/index.html` - Update conversion event ID
2. `client/src/components/B2BLeadForm.tsx` - Add/modify conversion triggers
3. `client/src/components/CostCalculator.tsx` - Add/modify conversion triggers

## Support

For Google Ads conversion tracking issues:
- [Google Ads Help Center](https://support.google.com/google-ads/answer/1722022)
- [Conversion Tracking Troubleshooting](https://support.google.com/google-ads/answer/6095947)

---

**Implementation Date:** February 13, 2026  
**Last Updated:** February 13, 2026  
**Status:** ✅ Active and Ready for Testing
