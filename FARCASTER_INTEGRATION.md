# Farcaster Integration Documentation

## Overview

This document describes the complete Farcaster integration implemented for Such.lol, including the Farcaster Mini App SDK and Neynar integration.

---

## Packages Installed

### Core Dependencies
- **@farcaster/miniapp-sdk** - Official Farcaster Mini App SDK for client-side integration
- **@neynar/react** - Neynar's React SDK for Farcaster components
- **@neynar/nodejs-sdk** - Neynar's Node.js SDK for server-side Farcaster API access

### Installation Command
```bash
npm install @farcaster/miniapp-sdk @neynar/react @neynar/nodejs-sdk --legacy-peer-deps
```

---

## Implementation Details

### 1. FarcasterProvider Component

**Location:** `/packages/react-app-revamp/components/FarcasterProvider/index.tsx`

**Purpose:** Provides Farcaster context throughout the application

**Features:**
- Initializes the Farcaster Mini App SDK on mount
- Detects if the app is running in a Farcaster Mini App context
- Provides user context (FID, username, displayName, pfpUrl)
- Calls `sdk.actions.ready()` when the app is fully loaded

**Usage:**
```tsx
import { useFarcaster } from "@components/FarcasterProvider";

const { user, isReady, isMiniApp } = useFarcaster();
// user.fid, user.username, user.displayName, user.pfpUrl
```

**Detection Logic:**
- Checks for `?miniApp=true` query parameter
- Checks if pathname includes `/mini`

### 2. Provider Chain Integration

**Location:** `/packages/react-app-revamp/app/providers.tsx`

**Changes:**
- Added `FarcasterProvider` to the provider chain
- Imported Neynar CSS: `@neynar/react/dist/style.css`
- Provider hierarchy: WagmiProvider → QueryClientProvider → RainbowKitProvider → **FarcasterProvider**

### 3. User Profile Integration

**New Hook:** `/packages/react-app-revamp/hooks/useFarcasterProfile/index.ts`

**Purpose:** Access Farcaster profile data from the Mini App SDK context

**Updated Hook:** `/packages/react-app-revamp/hooks/useProfileData/index.ts`

**Priority Order:**
1. **Farcaster** (if in Mini App context) ✨ NEW
2. Lens Protocol
3. ENS
4. Fallback to shortened address

**New Profile Data Field:**
- Added `isFarcaster: boolean` flag to ProfileData interface

### 4. Sharing Functionality

**Updated File:** `/packages/react-app-revamp/helpers/share.ts`

**New Functions:**
```typescript
// Share contests on Farcaster/Warpcast
generateFarcasterShareUrlForContest(
  contestName: string,
  contestAddress: string,
  chain: string,
  rewards?: Reward | null
): string

// Share submissions on Farcaster/Warpcast
generateFarcasterShareUrlForSubmission(
  contestAddress: string,
  chain: string,
  submissionId: string
): string
```

**Base URL:** `https://warpcast.com/~/compose?`

**Parameters:**
- `text` - Share text with contest name and rewards
- `embeds[]` - Array of embedded URLs

### 5. Share Component Updates

#### Contest Share Dropdown

**Location:** `/packages/react-app-revamp/components/Share/index.tsx`

**Changes:**
- Added Farcaster as the FIRST sharing option (prioritized)
- Order: Farcaster → Lens → Twitter → Copy Link
- Uses `/socials/farcaster.svg` icon

#### Submission Success Share

**Location:** `/packages/react-app-revamp/components/_pages/DialogModalSendProposal/components/SuccessLayout/index.tsx`

**Changes:**
- Added Farcaster share button as the FIRST option
- Order: Farcaster → Lens → Twitter → LinkedIn → Facebook
- Uses `/socials/share-submission/farcaster.svg` icon

### 6. Farcaster Icons

**Created Files:**
- `/packages/react-app-revamp/public/socials/farcaster.svg`
- `/packages/react-app-revamp/public/socials/share-submission/farcaster.svg`

**Design:** Purple Farcaster logo (brand color: #8A63D2)

### 7. Farcaster Frame Metadata

Frames allow Farcaster casts to be interactive, with buttons and actions.

#### Contest Page Frames

**Location:** `/packages/react-app-revamp/app/contest/[chain]/[address]/page.tsx`

**Metadata Added:**
```typescript
other: {
  "fc:frame": "vNext",
  "fc:frame:image": frameImage,
  "fc:frame:image:aspect_ratio": "1.91:1",
  "fc:frame:button:1": "View Contest",
  "fc:frame:button:1:action": "link",
  "fc:frame:button:1:target": contestUrl,
  "fc:frame:button:2": "Submit Entry",
  "fc:frame:button:2:action": "link",
  "fc:frame:button:2:target": contestUrl,
  "fc:frame:button:3": "Vote",
  "fc:frame:button:3:action": "link",
  "fc:frame:button:3:target": contestUrl,
}
```

**Frame Buttons:**
1. "View Contest" - Opens contest page
2. "Submit Entry" - Opens contest page (user can submit)
3. "Vote" - Opens contest page (user can vote)

**OG Image:** `https://jokerace.io/api/og/contest/${chain}/${address}`

#### Submission Page Frames

**Location:** `/packages/react-app-revamp/app/contest/[chain]/[address]/submission/[submission]/page.tsx`

**Metadata Added:**
```typescript
other: {
  "fc:frame": "vNext",
  "fc:frame:image": frameImage,
  "fc:frame:image:aspect_ratio": "1.91:1",
  "fc:frame:button:1": "Vote For",
  "fc:frame:button:1:action": "link",
  "fc:frame:button:1:target": submissionUrl,
  "fc:frame:button:2": "View Contest",
  "fc:frame:button:2:action": "link",
  "fc:frame:button:2:target": contestUrl,
  "fc:frame:button:3": "Visit Submission",
  "fc:frame:button:3:action": "link",
  "fc:frame:button:3:target": submissionUrl,
}
```

**Frame Buttons:**
1. "Vote For" - Opens submission page to vote
2. "View Contest" - Opens parent contest
3. "Visit Submission" - Opens submission detail page

**OG Image:** `https://jokerace.io/api/og/submission/${chain}/${address}/${submission}`

---

## Environment Variables

**Optional (for advanced features):**
```env
# Neynar API key (if using Neynar managed signers or server-side features)
NEYNAR_API_KEY=your_api_key_here

# For production deployment
NEXT_PUBLIC_FARCASTER_APP_NAME=Such.lol
```

---

## Testing the Integration

### Test as a Mini App

1. Add `?miniApp=true` to any URL
2. Check browser console for Farcaster SDK initialization
3. Verify `useFarcaster()` hook returns `isMiniApp: true`

### Test Sharing

1. Navigate to any contest page
2. Click "Share" button
3. Verify Farcaster is the first option
4. Click "share on Farcaster"
5. Should open Warpcast composer with pre-filled text

### Test Frames

1. Share a contest or submission link on Farcaster
2. The cast should display as an interactive Frame
3. Frame should show contest image and interactive buttons
4. Buttons should link to the appropriate pages

### Test User Profiles

1. Access the app with `?miniApp=true`
2. Mock or provide Farcaster user context
3. Profile data should prioritize Farcaster username/avatar

---

## Farcaster Frame Specification

Frames use OpenGraph meta tags with `fc:frame` prefix.

**Required Tags:**
- `fc:frame` - Must be "vNext"
- `fc:frame:image` - Image URL (supports any valid image URL)

**Optional Tags:**
- `fc:frame:image:aspect_ratio` - "1.91:1" or "1:1"
- `fc:frame:button:{idx}` - Button label (max 4 buttons)
- `fc:frame:button:{idx}:action` - "post", "post_redirect", "link", "mint"
- `fc:frame:button:{idx}:target` - URL for the action
- `fc:frame:post_url` - Where to POST when button is clicked

**Documentation:**
- Farcaster Frames Spec: https://docs.farcaster.xyz/reference/frames/spec
- Mini Apps Docs: https://miniapps.farcaster.xyz/

---

## Integration Benefits for Such.lol

### User Experience
- ✅ Native Farcaster sharing from all contest and submission pages
- ✅ Interactive Frames in Farcaster casts
- ✅ Farcaster user authentication in Mini App context
- ✅ Profile resolution prioritizes Farcaster identities

### Community Growth
- ✅ Frictionless sharing to Farcaster communities
- ✅ Increased discoverability through Frames
- ✅ Native Degen L3 + Farcaster ecosystem integration

### Developer Experience
- ✅ Modern SDK with TypeScript support
- ✅ React hooks for easy integration
- ✅ Neynar infrastructure for reliable API access

---

## Next Steps & Future Enhancements

### Recommended Enhancements

1. **Frame Actions with POST endpoints**
   - Create API routes to handle Frame button POST requests
   - Allow voting directly from Frame (without leaving Farcaster)
   - Submit entries via Frame interactions

2. **Neynar Managed Signers**
   - Implement server-side signing for Frame actions
   - Allow users to interact without connecting wallets initially

3. **Cast Notifications**
   - Send notifications when contests start/end
   - Notify users when they receive votes
   - Alert winners when rewards are distributed

4. **Farcaster Authentication**
   - Add "Sign in with Farcaster" button
   - Use Neynar Auth for seamless onboarding
   - Link FID to Ethereum addresses

5. **Channel Integration**
   - Create a Such.lol Farcaster channel
   - Auto-post new contests to the channel
   - Curate top submissions

6. **Advanced Frames**
   - Multi-page Frames with state
   - Dynamic Frame images based on user
   - Voting leaderboards in Frames

### API Routes to Implement

```
/api/frame/contest/[chain]/[address]
  - POST handler for Frame button clicks
  - Return next Frame state

/api/frame/submission/[chain]/[address]/[id]/vote
  - POST handler for voting via Frame
  - Validate Farcaster signature

/api/og/contest/[chain]/[address]
  - Generate dynamic OG image for contest

/api/og/submission/[chain]/[address]/[id]
  - Generate dynamic OG image for submission
```

---

## Troubleshooting

### SDK Not Initializing

**Problem:** `sdk.actions.ready()` not being called
**Solution:** Check that FarcasterProvider is in the provider chain

### User Context Not Available

**Problem:** `useFarcaster().user` is null
**Solution:** Ensure `?miniApp=true` query param or `/mini` path

### Frames Not Displaying

**Problem:** Cast shows link instead of Frame
**Solution:** Verify all required Frame meta tags are present

### Build Errors

**Problem:** Peer dependency conflicts
**Solution:** Use `--legacy-peer-deps` flag during installation

---

## References

- [Farcaster Mini Apps Docs](https://miniapps.farcaster.xyz/)
- [Neynar API Docs](https://docs.neynar.com/)
- [Farcaster Frames Spec](https://docs.farcaster.xyz/reference/frames/spec)
- [@farcaster/miniapp-sdk NPM](https://www.npmjs.com/package/@farcaster/miniapp-sdk)
- [@neynar/react NPM](https://www.npmjs.com/package/@neynar/react)

---

*Last Updated: 2025-11-22*
*Integration Status: ✅ Complete*
