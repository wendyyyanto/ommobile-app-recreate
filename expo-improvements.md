# OM Mobile: what can be improved

Audit of branch `adjustment/register-and-contents` on 2026-11-04. Stack: Expo SDK 54, Expo Router 6, React Native 0.81.5, Continuous Native Generation (`android/` and `ios/` are gitignored).

No code was changed. The app was not run on a device, so runtime behaviour below is inferred from the code. Each finding says how sure I am.

## Check results

| Check | Result |
|---|---|
| `tsc --noEmit` | Passes |
| `expo lint` | 0 errors, 1 warning: unused `setIsLoadMoreLatestTeachings` at `app/(tabs)/index.tsx:41` |
| `expo-doctor` | Fails: 9 packages behind on patch versions, including `expo`, `expo-router` and `expo-updates` |
| Tests and CI | No test files, no `.github` or `.eas` workflows |

## Priority 1: security

| # | Problem | Evidence | Fix | Confidence |
|---|---|---|---|---|
| 1 | OneSignal REST API key ships inside the app. Anyone who extracts it can likely call the OneSignal API as you, including sending push to all users, depending on the key's scope. | `services/oneSignalServices.ts:5`, called from `hooks/useNotificationSettings.ts:15` and `:48`. `EXPO_PUBLIC_*` values are inlined in the bundle. | Move the segments call behind your API, then rotate the key. | High on exposure. Key scope not checked. |
| 2 | The login token is readable in the iOS Files app. It sits in the Documents folder, and the app exposes that folder on purpose for downloads. | `stores/authStore.ts:5`, `app.json:19-20` | Store it in `expo-secure-store`. Migrate the old file on first launch and delete it. | High from code. Confirm on a device. |
| 3 | Detail routes are probably not behind the login guard. `notifications`, `teaching` and `teachings` have no `_layout`, so their real route names are `teachings/[teachingId]` and so on, and the `Stack.Screen` names match nothing. A logged-out user could open them from a deep link or push tap. | `app/_layout.tsx:95-97` | Add a `_layout.tsx` to each folder, or use the full route names. | Medium. Test a deep link while logged out. |
| 4 | A static API token ships in the bundle and is the fallback whenever nobody is signed in. | `constants/axios.ts:9`, `:17` | Check what it grants on the backend. Treat it as public, and limit it to public read routes. | High on exposure. Backend scope not checked. |
| 5 | The magic-link token is accepted without validation, so a bad link signs the user in until `/profile` returns 401. `/expired-link` exists but this path never reaches it. | `app/(auth)/auth.tsx:15-17` | Validate with `/profile` before calling `login`. Route failures to `/expired-link`. | High |

## Priority 2: user-facing bugs

| # | Problem | Evidence | Fix | Confidence |
|---|---|---|---|---|
| 6 | Playback speed lags one step. The label shows 1.25x while audio plays at 1x. | `hooks/useTeachingAudioPlayer.ts:85-86` passes the old value to the player | Compute the next rate once and use it for both calls. | High |
| 7 | A session expiring is only caught on the home screen. Elsewhere, requests fail silently. | `app/(tabs)/index.tsx:74` is the only 401 check | Add one response interceptor in `constants/axios.ts` that calls `logout()`, and remove the home check. | High |
| 8 | Failed requests mostly log to the console, so users see an empty screen or "No teachings found" when offline. | 12 `onError` handlers only log. 3 files use `showErrorToast`. | Add an error state with a retry button on list screens. | High |
| 9 | The PDF viewer may not rotate on iOS. `unlockAsync` is limited by the portrait-only `Info.plist` setting. | `app.json:7`, `features/teaching/PdfViewer.tsx:74` | Set `orientation` to `default`. The root layout already locks portrait at runtime. | Medium. Test on a device. |
| 10 | The section screen crashes if opened without a `name` param, for example from a deep link. | `app/(tabs)/teachings/section/[sectionId].tsx:64` calls `.split` on an unchecked value | Fall back to a default title, or derive it from `sectionId`. | High from code |
| 11 | Users who denied notifications may be sent to Settings on every launch. The prompt also fires before login, with no context. | `app/_layout.tsx:31` uses `requestPermission(true)` at module load | Ask after login, from a clear moment, with `false`. | Medium. Test on a device. |

## Priority 3: store review and release

| # | Problem | Evidence | Fix | Confidence |
|---|---|---|---|---|
| 12 | The app declares microphone access but never records. This invites review questions and looks bad on the listing. | `app.json:61`, `:88`. No recording API in the code. | Set `microphonePermission: false`, and remove `RECORD_AUDIO` and `MODIFY_AUDIO_SETTINGS` after checking audio playback still works. | High |
| 13 | OneSignal logs at Verbose in production builds. | `app/_layout.tsx:29` | Use `__DEV__ ? LogLevel.Verbose : LogLevel.None`. | High |
| 14 | Android `versionCode` is set by hand while iOS auto-increments, which makes a rejected duplicate upload easy. | `eas.json:4`, `app.json:31` | Use `appVersionSource: "remote"` with `autoIncrement` on both. | High |
| 15 | The bundle ID is `com.anonymous.ommobileapp`. | `app.json:14`, `:35` | Leave it if already published, since changing it creates a new store listing. | High. Worth knowing only. |
| 16 | The `preview` profile uses store distribution, so testers can't sideload the iOS build. | `eas.json:11-22` | Use `internal` if preview is meant for testers. | Medium. Depends on intent. |

## Priority 4: performance

| # | Problem | Evidence | Fix | Confidence |
|---|---|---|---|---|
| 17 | No list is virtualized. Infinite-scroll screens keep every card mounted and get slower as users load more pages. | 0 uses of `FlatList`. `.map` inside `ScrollView` at `app/(tabs)/teachings/section/[sectionId].tsx:146`, and also in search and notifications. | Use `FlatList` with `onEndReached`. It is built in and removes the `isNearScrollEnd` handler. | High on cause. Slowdown not measured. |
| 18 | Whole-store subscriptions re-render screens on any store change. Home re-renders when an unrelated teaching field changes, and the React Compiler can't prevent that. | 32 `useXStore()` calls without a selector across 25 files | Use selectors, or `useShallow` for several fields. Start with `app/(tabs)/index.tsx:33-43`. | High on cause. Impact not measured. |
| 19 | 38.7 MB of images are tracked in git. Illustrations are 2.2 MB each at @3x and `background@3x.png` is 3.1 MB. | `assets/images` | Convert to WebP and drop placeholder variants that aren't needed. Likely the cheapest download-size win. | High on size. Savings not measured. |
| 20 | Each `TeachingCard` image fades in for a full second. | `components/ui/TeachingCard.tsx:24` | Use about 200 ms. | High |

## Priority 5: cleanup

| # | Problem | Evidence | Fix | Confidence |
|---|---|---|---|---|
| 21 | Likely dead 332-line route. Nothing links to `/teaching/...`, and it differs from the live `/teachings/...` route by 160 lines, including a `PdfViewer` the live route lacks. | `app/teaching/[teachingId].tsx` | Check whether that PDF feature should be on the live route, then delete the old one. | High that it is unlinked. Backend push payloads not checked. |
| 22 | `tamagui` has zero imports. | `package.json:68` | Remove it. | High |
| 23 | `expo-sharing`, `expo-symbols`, `expo-web-browser` and `expo-haptics` have zero imports. | `package.json` | Remove them. Keep `expo-haptics` if you act on the motion suggestion in #26. | High |
| 24 | `prettier-plugin-tailwindcss` and `babel-preset-expo` sit in `dependencies`. | `package.json:23`, `:49` | Move to `devDependencies`. | High |
| 25 | Stale files and versions: `package.json` says 1.0.0 while `app.json` says 1.3.4, and `reset-project` points at a missing script. | `package.json:4`, `:8` | Align the version and delete the script entry. | High |

Keep `react-native-blob-util`, even with zero imports. It is a peer dependency of `react-native-pdf`.

## Priority 6: longer-term

| # | Idea | Why | Cost |
|---|---|---|---|
| 26 | Press feedback and accessibility labels | Only 1 of the 30 files using `Pressable` has accessibility props, so screen-reader users get unlabelled icon buttons. Pressables also have no visible press state. | Medium |
| 27 | Add `tsc`, `lint` and `expo-doctor` to CI | Nothing checks a PR before merge, and there is no `typecheck` script. | Low |
| 28 | A few focused tests | `paginationHelper`, `chapterSelector` and the 401 flow are the highest-value targets. | Low |
| 29 | Upgrade the Expo SDK | SDK 54 is several releases behind: the Expo skills already reference SDK 58. Do this as its own branch, after the fixes above. | High |
| 30 | React Query for server state | It would replace most hand-written loading, stale-request and pagination code such as `hooks/useTeachingSection.ts`, and solve #8. Only worth it if you plan more data screens. | High |

## Suggested order

| Step | Items | Why now |
|---|---|---|
| 1 | #6, #13, #20, #10 | Small, safe fixes that can ship over the air |
| 2 | #1, #2, #3, #5, #7 | Security and session fixes. #1 also needs a backend change and key rotation. |
| 3 | #12, #14, #9, #11, #22-25 | Config changes for the next store build |
| 4 | #17, #18, #19, #8 | Performance and offline behaviour |
| 5 | #26-30 | Larger investments |

## Not checked

| Area | Reason |
|---|---|
| Runtime behaviour | No device or simulator run |
| `.env` values | Not read. Only key names from `.env.example` and the `expo lint` output. |
| Backend token and key scopes | Outside this repository |
| Actual download size | No release build was made |
| Screen-by-screen visual design | Out of scope for this pass. `expo-design-system` can audit it. |
