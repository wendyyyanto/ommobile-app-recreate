# OM Mobile: animation opportunities

Review of branch `enhancement/ui-ux-enhancement-01` on 2026-11-04. Every screen and shared component was read, and each interaction was run through the Expo animation gate: frequency, purpose, speed, function.

No code was changed and the app was not run. Findings come from the code, so feel still has to be judged on a release build on the slowest device you support.

The animation skill caps a whole-app report at 5 to 7 suggestions. You asked for each interaction, so the full list is here, and the 7 worth doing first are separated out.

No new dependency is needed for anything below except the optional Lottie asset.

## Where the app stands

| Area | Today | Assessment |
|---|---|---|
| Screen transitions | Native stack defaults, no `animation` set | Right for pushes. Auth to app needs one change. |
| Tabs | No transition | Right. Leave it. |
| Audio/Video pill | Moti spring, 250ms | Good, needs tuning |
| Filter sheets | `@gorhom/bottom-sheet` | Good motion, missing backdrop and footer entrance |
| Accordions | Core `LayoutAnimation` plus Reanimated chevron | Works, wrong tool |
| iOS switch | Moti timing, 200ms | Good |
| Skeletons | Moti shimmer | Good, but cut hard to content |
| Spinner | Lottie | Fine |
| Carousel | Parallax with autoplay | Good, ignores reduced motion |
| Press feedback | `active:opacity-70` on some controls, nothing on the rest | Biggest gap |
| Haptics | Audio transport buttons only | Underused at commit moments |
| Reduced motion | No `useReducedMotion` or `ReduceMotion` anywhere | Must ship with this work |

## Do these first

Ordered by leverage.

| # | What | Where | Purpose | Frequency | Size |
|---|---|---|---|---|---|
| 1 | Shared `PressableScale` for every button and card | All pressables listed below | Feedback | Tens/day | Medium |
| 2 | Fade content in when a skeleton or spinner ends | Home, Teachings, Section, Notifications, E-Books, Classes, Teaching detail | Preventing a jarring change | Tens/day | Small |
| 3 | Fade the Audio/Video content on swap, with a selection haptic | `app/teachings/[teachingId].tsx:120` | Preventing a jarring change | Occasional | Small |
| 4 | Filter sheet footer entrance, backdrop, grabber | `SectionBookFilterDropdown.tsx`, `SectionOtherFilterDropdown.tsx` | Spatial consistency | Occasional | Medium |
| 5 | Accordions on Reanimated, chapter and checkbox selection transitions | `SectionBookOptionsAccordion.tsx`, `SectionOtherOptionsAccordion.tsx` | State indication | Occasional | Medium |
| 6 | Download dropdown entrance, downloading state, result haptics | `app/teachings/[teachingId].tsx:170`, `ebooks/[ebookId].tsx:165`, `utils/fileHelper.ts:75` | Feedback | Occasional | Small |
| 7 | Fade between auth and app, entrances on success screens | `app/_layout.tsx:90`, `register-success.tsx`, `check-email.tsx` | Delight (rare tier) | Rare | Small |

## Shared values

Use these everywhere so the app has one motion vocabulary.

| Name | Value | Use |
|---|---|---|
| `CSS_EASE_OUT` | `cubicBezier(0.23, 1, 0.32, 1)` | CSS transitions, entering and exiting |
| `EASE_OUT` | `Easing.bezier(0.23, 1, 0.32, 1)` | `withTiming`, layout animation builders |
| `EASE_IN_OUT` | `Easing.bezier(0.77, 0, 0.175, 1)` | Movement on screen, such as the pill |
| Press | scale `0.97`, 120ms | Buttons, cards |
| Icon press | scale `0.95`, 120ms | Small transport icons |
| Toggle or chip | 150ms to 200ms | Selection and state changes |
| Content fade | `FadeIn.duration(200)` | Skeleton to content |
| Finger release | spring `{ duration: 400, dampingRatio: 0.8, velocity }` | Only if a drag is ever added |

Build layout animation builders at module scope, not inline in JSX.

## Interaction by interaction

Tier: **A** do first, **B** worth doing, **C** optional polish, **No** leave as is.

### App shell and navigation

| Location | Interaction | Today | Motion | Frequency | Purpose | Tier |
|---|---|---|---|---|---|---|
| `app/_layout.tsx:43` | Splash to first screen | Hard hide. Splash is `#171F2A`, app is black. | `SplashScreen.setOptions({ duration: 400, fade: true })`. `fade` is iOS only. | Rare | Preventing a jarring change | B |
| `app/_layout.tsx:96-107` | Login completes, logout, account deleted | Guard swap with the default animation | `animation: "fade"` on `(tabs)` and `(auth)` | Rare | Preventing a jarring change | A |
| `app/(auth)/_layout.tsx:5` | `router.replace("/login")` from register, success, check email | Plays as a forward push | `animationTypeForReplace: "pop"` on the `login` screen only | Rare | Spatial consistency | B |
| `app/(tabs)/_layout.tsx` | Tab switch, icon and label swap | Instant | None | 100+/day | None | No |
| `app/(tabs)/_layout.tsx:40` | Tab bar hides on Section and Search | `display: none` snaps during the push | See rejected list | Tens/day | None | No |
| All stacks | Push and back | Platform default | None | Tens/day | None | No |
| `components/ui/BackButton.tsx:11` | Back | Opacity on press | Keep. Pushed screens already move. | Tens/day | Feedback | No |

### Auth

| Location | Interaction | Today | Motion | Frequency | Purpose | Tier |
|---|---|---|---|---|---|---|
| `login.tsx:132`, `register.tsx:165` | Primary CTA press | No press state | `PressableScale` | Rare | Feedback | A |
| `login.tsx:138`, `register.tsx:172` | CTA enters loading | Opacity jumps to 0.5, label swaps | CSS transition on opacity, 150ms | Rare | State indication | B |
| `login.tsx:17-24`, `register.tsx:26` | Invalid input | Toast only | Underline to red in 150ms, error haptic, `translateX` keyframes 0, -6, 6, -4, 4, 0 over 300ms | Rare | Feedback | C |
| `login.tsx:155`, `register.tsx:204` | Text links | No press state | Opacity 0.7 on press | Rare | Feedback | B |
| `register-success.tsx:34` | Account created | Static text | Heading, body, CTA use `FadeInDown` 300ms, 60ms stagger, with `Haptics.notificationAsync(Success)` fired from `register` `onSuccess` | Rare | Delight | A |
| `register-success.tsx` | Success mark | None | Optional Lottie checkmark. Needs an asset from you. | Rare | Delight | C |
| `check-email.tsx:53` | Link sent | Glow image and text appear at once | Glow fades in over 400ms from scale 0.97, text follows at 300ms | Rare | Delight | A |
| `check-email.tsx:95-117` | Resend unlocks | Grey snaps to white at 0 | Color transition on `Animated.Text`, 200ms | Rare | State indication | B |
| `check-email.tsx:38` | Resend succeeds | Toast | Add success haptic | Rare | Feedback | B |
| `expired-link.tsx:41`, `account-not-found.tsx:17` | Error destinations | Static | Glow fade 300ms. No stagger, this is not a happy moment. | Rare | Preventing a jarring change | C |
| `expired-link.tsx:84`, `account-not-found.tsx:70,77`, `check-email.tsx:95,118` | Text actions | No press state | Opacity 0.7 on press | Rare | Feedback | B |
| `auth.tsx:55` | Signing in | Lottie | Keep. The root fade covers the exit. | Rare | None | No |

### Home

| Location | Interaction | Today | Motion | Frequency | Purpose | Tier |
|---|---|---|---|---|---|---|
| `(tabs)/index.tsx:293-303` | Skeleton to teachings | Hard cut | Wrap the list in `Animated.View entering={FadeIn.duration(200)}`. Container only. | Tens/day | Preventing a jarring change | A |
| `(tabs)/index.tsx:175` | Skeleton to name | Hard cut | Same fade on the `Text` | Tens/day | Preventing a jarring change | C |
| `(tabs)/index.tsx:210,236` | Resource cards | Instant opacity | `PressableScale` | Occasional | Feedback | A |
| `(tabs)/index.tsx:275` | Browse All | Instant opacity | `PressableScale` | Occasional | Feedback | A |
| `components/ui/TeachingCard.tsx:19` | Teaching card | Instant opacity | `PressableScale` | Tens/day | Feedback | A |
| `(tabs)/index.tsx:190` | Settings gear | Instant opacity | Keep | Occasional | None | No |
| `AnnouncementCarousel.tsx:54` | Banner image loads | Pops in | `transition={200}` on `expo-image` | Tens/day | Preventing a jarring change | B |
| `AnnouncementCarousel.tsx:35` | Autoplay | Runs under reduced motion | `autoPlay={!isLoading && !reduced}` | Tens/day | Accessibility | A |
| `AnnouncementCarousel.tsx:81-99` | Dot style | `translateY` interpolates 0 to 0, does nothing | Delete it | n/a | Cleanup | B |
| `(tabs)/index.tsx:158` | Pull to refresh | `RefreshControl` | Keep the control. See the tint note under Other findings. | Occasional | None | No |

### Teachings, Section, Search

| Location | Interaction | Today | Motion | Frequency | Purpose | Tier |
|---|---|---|---|---|---|---|
| `(tabs)/teachings/index.tsx:175` | Category cards | Instant opacity | `PressableScale` | Occasional | Feedback | A |
| `(tabs)/teachings/index.tsx:161`, `section/[sectionId].tsx:86` | Search button | Instant opacity | `PressableScale` | Occasional | Feedback | A |
| `(tabs)/teachings/index.tsx:225-235` | Skeleton to list | Hard cut | Container fade | Tens/day | Preventing a jarring change | A |
| `(tabs)/teachings/index.tsx:228` | Refresh loads a new random set | List swaps instantly | Remount the list container with a `key` so the fade replays. Teachings tab only. | Occasional | Preventing a jarring change | B |
| `(tabs)/teachings/index.tsx:153` | Wrapper | `MotiView` with no `from` or `animate` does nothing | Replace with `View` | n/a | Cleanup | B |
| `section/[sectionId].tsx:102,118` | Filter pills | No press state | `PressableScale` | Occasional | Feedback | A |
| `section/[sectionId].tsx:112,134` | Filter chevrons | Static while the sheet is open | Rotate to 180deg, CSS transition 200ms, matching the download chevron | Occasional | State indication | B |
| `section/[sectionId].tsx:143-189` | Skeleton to list | Hard cut | Fade the view around the `FlatList`. Never on rows. | Tens/day | Preventing a jarring change | A |
| `section/[sectionId].tsx:149,168` | Filter applied | List empties, then spinner in the empty slot while `RefreshControl` is also active | Use `TeachingListSkeleton`, then the same fade | Occasional | Preventing a jarring change | B |
| `search.tsx:51-56` | Illustration changes between initial and no result | Hard swap on `ImageBackground` | Absolute `expo-image` with `transition={200}` | Occasional | Preventing a jarring change | B |
| `search.tsx:100` | Each query | List clears to a large spinner | Results fade in. Longer term, keep old results dimmed, since the hook clears them at `useSearchTeachings.ts:51`. | Occasional | Preventing a jarring change | B |
| `search.tsx:128` | Prompt and no-result text | Swaps instantly | `FadeIn.duration(200)` | Occasional | Preventing a jarring change | C |

### Filter sheets

| Location | Interaction | Today | Motion | Frequency | Purpose | Tier |
|---|---|---|---|---|---|---|
| `SectionBookFilterDropdown.tsx:133`, `SectionOtherFilterDropdown.tsx:82` | Footer appears on first selection | Teleports and shrinks the list | Use the library's `footerComponent` with `BottomSheetFooter`, and `FadeInDown` 200ms, `FadeOutDown` 150ms | Occasional | Preventing a jarring change | A |
| Both, `:90` and `:43` | Sheet opens | No backdrop, the list behind stays live | `BottomSheetBackdrop` with `appearsOnIndex={0}`, `disappearsOnIndex={-1}`. Read the placement note under Other findings. | Occasional | Spatial consistency | A |
| Both, `:96` and `:49` | Drag affordance | Handle hidden, pan to close still on | Show the handle | Occasional | Explanation | A |
| Both, `:83` and `:36` | Open height | `expand()` always goes to the last snap point | Use `snapToIndex(0)` if opening at 50% was intended | Occasional | Spatial consistency | B |
| Both, snap | Detent catches | None | `Haptics.impactAsync(Light)` from `onChange`, not on the initial open | Occasional | Feedback | C |
| `SectionBookOptionsAccordion.tsx:45,72` | Book expands | `LayoutAnimation` | `layout={LinearTransition.duration(200)}` on the row, `FadeIn.duration(150)` on the chapters | Occasional | State indication | A |
| `SectionOtherOptionsAccordion.tsx:41,91` | Filter group expands | `LayoutAnimation` | Same | Occasional | State indication | A |
| `SectionBookOptionsAccordion.tsx:40-48`, `SectionOtherOptionsAccordion.tsx:36-44` | Chevron | 300ms shared value using `.value` | CSS transition on rotate, 200ms. Removes the shared value. | Occasional | State indication | A |
| `SectionBookOptionsAccordion.tsx:94` | Chapter chip selected | Color snaps | Background transition 150ms on `Animated.View`, `Haptics.selectionAsync()` | Tens per session | State indication | A |
| `SectionOtherOptionsAccordion.tsx:108-129` | Checkbox | Color and check snap | Background 150ms, check `FadeIn` from scale 0.9, selection haptic | Tens per session | State indication | A |
| `SectionBookFilterDropdown.tsx:135` | Select All Chapters | All chips snap | The chip transition covers it. Impact Light once. | Occasional | Feedback | B |
| `SectionOtherFilterDropdown.tsx:84` | Reset Filters | Checks snap | The checkbox transition covers it | Occasional | Feedback | B |
| Both CTAs and close icons | Show, Apply, close | No press state | `PressableScale`, with `hitSlop` where needed | Occasional | Feedback | A |

### Teaching detail and player

| Location | Interaction | Today | Motion | Frequency | Purpose | Tier |
|---|---|---|---|---|---|---|
| `app/teachings/[teachingId].tsx:120-121` | Audio/Video content swap | Instant after tap or swipe | `entering={FadeIn.duration(150)}` on each tab. No `exiting`: it would keep the old player mounted, and audio could overlap. | Occasional | Preventing a jarring change | A |
| `TeachingTab.tsx:25` | Pill | Spring with duration only | `withTiming` or CSS transition, 200ms, `EASE_IN_OUT`, with no overshoot | Occasional | Spatial consistency | B |
| `TeachingTab.tsx:37,54` | Tab labels | Color snaps while the pill moves | Color transition 150ms on `Animated.Text` | Occasional | State indication | B |
| `TeachingTab.tsx:35,52`, `[teachingId].tsx:58`, `TeachingAudioTab.tsx:31` | Tab change | No haptic | `Haptics.selectionAsync()` on press and at swipe commit | Occasional | Feedback | A |
| `[teachingId].tsx:170` | Download dropdown | Teleports while its chevron animates | `FadeInDown.duration(150)` with a 6px start, `FadeOut.duration(120)`, scale from 0.97 | Occasional | Spatial consistency | A |
| `[teachingId].tsx:132,203` | Download buttons | No press state | `PressableScale` | Occasional | Feedback | A |
| `[teachingId].tsx:172,185` | Dropdown options | No press state | Background highlight on press | Occasional | Feedback | B |
| `[teachingId].tsx:75,216` | Download running | Toast for 6s, the button stays tappable | Disable and dim to 0.6, CSS opacity 150ms, until the promise settles | Occasional | State indication | A |
| `utils/fileHelper.ts:75,111` | Download result | Toast | Success or error haptic, once | Occasional | Feedback | A |
| `TeachingAudioPlayer.tsx:73` | Play/pause | Icon swaps | Scale 0.95, plus layered icons crossfading over 120ms | Tens/day | State indication | B |
| `TeachingAudioPlayer.tsx:63,90` | Seek back and forward | Haptic only | Scale 0.95 | Tens/day | Feedback | B |
| `TeachingAudioPlayer.tsx:102` | Speed chip | Haptic only | Scale 0.97. The value should not animate. | Occasional | Feedback | B |
| `TeachingAudioPlayer.tsx:30` | Player skeleton to controls | Hard cut | `FadeIn.duration(200)` | Occasional | Preventing a jarring change | B |
| `TeachingAudioTab.tsx:42` | Artwork loads | Pops in | `transition={200}` | Occasional | Preventing a jarring change | B |
| `TeachingAudioTab.tsx:42` | Playing vs paused | Artwork is static | Scale 0.94 when paused, 1 when playing, CSS transition 300ms ease-out | Tens/day | State indication | C |
| `TeachingAudioPlayer.tsx:35` | Slider, time labels | Native | None | Tens/day | None | No |
| `TeachingVideoTab.tsx:31` | YouTube player | WebView | None beyond the parent fade | Occasional | None | No |

### Notifications and settings

| Location | Interaction | Today | Motion | Frequency | Purpose | Tier |
|---|---|---|---|---|---|---|
| `(tabs)/notifications/index.tsx:107` | Row press | No state | Opacity or background highlight, not scale. Rows are full width with no card. | Occasional | Feedback | A |
| `(tabs)/notifications/index.tsx:60` | Skeleton to list | Hard cut | Fade the wrapping view | Occasional | Preventing a jarring change | A |
| `(tabs)/notifications/index.tsx:84` | Empty state | Static | Fade 300ms from scale 0.97, once | Rare | Delight | B |
| `notifications/[notificationId].tsx:25` | Detail load | Spinner on a blank view, then the background pops in | Keep the background during loading, fade the content | Occasional | Preventing a jarring change | B |
| `notifications/[notificationId].tsx:43` | Hero image | Pops in | `transition={200}` | Occasional | Preventing a jarring change | B |
| `NotificationSwitch.tsx:47` | iOS toggle | Thumb and track animate | Keep the motion. Add `selectionAsync()`. | Rare | Feedback | B |
| `NotificationSwitch.tsx:26` | Android toggle | Native | None | Rare | None | No |
| `settings.tsx:109` | Spinner to list | Hard cut | `FadeIn.duration(200)` | Rare | Preventing a jarring change | C |
| `settings.tsx:121`, `ErrorState.tsx:20`, `+not-found.tsx:31` | Try again, Go to Home | No press state | `PressableScale` | Rare | Feedback | A |
| `settings.tsx:160,169` | Logout, Delete | No press state | Opacity on press. Full-width rows should not scale. | Rare | Feedback | B |
| `settings.tsx:29` | Delete confirmed | None | `impactAsync(Medium)` when confirmed, then a success or error notification haptic on the result. Keep the native alert. | Rare | Feedback | B |

### E-Books and Class Materials

| Location | Interaction | Today | Motion | Frequency | Purpose | Tier |
|---|---|---|---|---|---|---|
| `components/ui/EbookCard.tsx:13` | Card | Instant opacity | `PressableScale` | Occasional | Feedback | A |
| `components/ui/EbookCard.tsx:29` | Cover loads | 1000ms fade, longer than any UI budget | `transition={200}` | Occasional | Preventing a jarring change | A |
| `ebooks/index.tsx:82`, `class-materials/index.tsx:96` | Search query | Whole list becomes a skeleton after each debounce | First load only. On re-query keep the list, dim to 0.5 over 150ms, fade new results in. | Occasional | Preventing a jarring change | A |
| `ebooks/index.tsx:48`, class screens | Inline back buttons | No press state | Replace with `BackButton`, which already has one | Occasional | Feedback | B |
| `ebooks/[ebookId].tsx:110` | Skeleton to detail | Hard cut | `FadeIn.duration(200)` | Occasional | Preventing a jarring change | A |
| `ebooks/[ebookId].tsx:165` | Download | No immediate feedback at all | `PressableScale`, the Teaching detail downloading state, and result haptics | Occasional | Feedback | A |
| `ebooks/[ebookId].tsx:174` | Read Book | No press state | `PressableScale` | Occasional | Feedback | A |
| `ebooks/[ebookId].tsx:184`, `[week].tsx:103` | Reader modal | `animationType="slide"` | Keep | Occasional | None | No |
| `PdfViewer.tsx:118,131` | Spinner to PDF | Hard cut | `FadeIn.duration(200)` around `Pdf` | Occasional | Preventing a jarring change | B |
| `class-materials/index.tsx:118`, `[id]/index.tsx:77`, `[week].tsx:77` | Class, week, material rows | No press state | `PressableScale`. These are inset cards. | Occasional | Feedback | A |
| `[id]/index.tsx:63`, `[week].tsx:63` | Skeleton to list | Hard cut | `FadeIn.duration(200)` | Occasional | Preventing a jarring change | B |

## Rejected

| Candidate | Why not |
|---|---|
| Tab transitions, icon or label animation | 100+/day, and tabs are peers |
| Staggered entrance on Home and Teachings lists | Seen too often, delay gets in the way |
| `entering` on `FlatList` rows | Rows re-fire on recycling and flicker |
| Finger-tracked pager between Audio and Video | YouTube WebView under a transform is risky on Android, and the current swipe already commits with velocity |
| Animated tab bar hide | Needs a height animation, which is a layout pass per frame. Moving Section and Search out of the tabs would solve it structurally. |
| Custom screen transitions | Platform transitions keep the back gesture |
| Shared-element card to detail | Unverified: I don't believe this is stable on New Architecture in Reanimated 4.1. Not worth the risk here. |
| Parallax or collapsing header on detail screens | Reading screens, motion hinders |
| Hold-to-confirm for Delete Account | Native alert already prevents slips |
| Custom pull to refresh | `RefreshControl` is correct |
| `react-native-keyboard-controller` | Forms sit high on screen, a new native dependency isn't justified |
| Floating or pulsing loops on glows and empty-state art | Decoration with no purpose |
| Determinate download progress | `File.downloadFileAsync` is called with no progress callback. Unverified whether the API supports one. |
| Animated slider or time labels | Data being read |
| Android ripple | Custom-designed app, same scale on both platforms is more coherent |

## Reduced motion

Ship this with the work, not after.

| Item | Under reduced motion |
|---|---|
| `PressableScale` | Opacity 0.7 instead of scale, read from `useReducedMotion()` |
| Layout animations (`FadeIn`, `FadeInDown`, `LinearTransition`) | Use fade only, drop translation |
| Root stack | `animation: reduced ? "fade" : "default"` |
| Carousel | `autoPlay` off |
| Filter sheets | Library supports `overrideReduceMotion`. Test the default first. |
| Moti shimmer | Unverified whether it respects the setting. Test with the system setting on. |
| Lottie spinner | Keep. It communicates loading. |
| Color and opacity transitions | Keep. They explain state. |

## Implementation notes

| Topic | Note | Confidence |
|---|---|---|
| Tooling | Reanimated 4.1.7 is installed, `cubicBezier` is exported, `scheduleOnRN` exists in worklets, New Architecture is on | Checked in `node_modules` and `app.json` |
| Moti | New work should use Reanimated. Moti stays for skeletons. Don't rewrite working Moti code just for this. | Judgment |
| Compiler | React Compiler is on (`app.json:106`), so use `.get()` and `.set()`, not `.value` | Checked |
| NativeWind | Keep `transition*` in `StyleSheet`. Test `className` on `Animated.View` before building `PressableScale`, since cards use it for layout. | Unverified |
| `PressableScale` | Must pass layout through. Home resource cards rely on `flex-1`. Add `pressRetentionOffset`. | From code |
| 120fps | `CADisableMinimumFrameDurationOnPhone` is not in `app.json`, and no `ios/` folder was present to check. Confirm after prebuild. | Unverified |
| Haptics | One per action, same frame as the visual, never the only feedback. Silent on many Android devices. | Skill rule |

## Other findings

Found along the way. Not animation work, but they affect how it will feel.

| Location | Finding | Confidence |
|---|---|---|
| `section/[sectionId].tsx:191-192` | Sheets render inside the list container. Their height and any backdrop are limited to that area, so a backdrop won't dim the header. Moving them to screen level makes `100%` mean the whole screen, which then needs `topInset`. | High from code, confirm on device |
| `(tabs)/index.tsx:161`, Teachings, Notifications, Teaching detail | Refresh `tintColor` is black over a dark screen, so the iOS spinner may be invisible. Section uses the default. | Medium, check on device |
| `app/teachings/[teachingId].tsx:120` | Switching to Video unmounts the audio player, which likely stops playback and loses position | Medium, test it |
| `TeachingTab.tsx:55` | Video label lacks `fonts.body1White`, so it differs from Audio | High |
| `[teachingId].tsx:57` plus iOS | Right swipe on the Video tab may compete with the iOS back gesture | Unverified |
| `notifications/[notificationId].tsx:25` | No back button during loading | High |
| `expo-improvements.md` #20, #23 | Now stale: `TeachingCard` is 200ms and `expo-haptics` is in use. `EbookCard` still has the 1000ms fade. | High |

## Feel-check on device

| Try | Looking for |
|---|---|
| Press and drag off a card | Press doesn't cancel from slight drift, and releases cleanly |
| Tap a card while scrolling | Scale doesn't fire during a scroll |
| Swipe Audio to Video repeatedly | No flash from the WebView on Android, no audio overlap |
| Open a sheet, tap a chapter, drag the sheet | Footer entrance doesn't jump the list |
| Open Psalms in the book filter | 150 chips with transitions still open smoothly on a slow Android |
| Toggle reduced motion in system settings | Carousel stops, scale becomes opacity |
| Run with haptics off | Every moment still reads visually |

## Verdict

The app needs modest motion, and most of it is feedback. The heavy parts (navigation, tabs, sheets, player) are already right or close to it. What's missing is the small layer: controls that don't answer a press, and content that appears with a hard cut. `PressableScale` is the single highest-leverage item, because it fixes the most controls at once. Next would be the content fade, which is a few lines per screen. After the 7 items above, tier B and C are optional and should be judged on a device first.
