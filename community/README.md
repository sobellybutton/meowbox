# MeowBox community: activation and safety

The GitHub Pages game is static. It cannot host a shared chat database itself. The optional Worker in this folder implements real visitor posts, selected village conversation spots, replies, reporting, owner deletion, and a mandatory review queue. Fictional NPC tea-room conversations and private noticeboard notes remain separate. This is asynchronous moderated posting, not real-time multiplayer or direct messages.

## Set up the service

1. Create a Cloudflare Worker and a D1 database. Apply community/schema.sql to a new database. This schema assumes the community has not launched; if upgrading a database created from the earlier schema, migrate the messages table by adding reply_to and place before applying the new indexes.
2. Deploy community/worker.mjs as a module Worker. Bind the database as DB. Set independent, randomly generated secrets RATE_SECRET and MODERATOR_TOKEN (each at least 32 characters). Configure ALLOWED_ORIGIN as the exact production origin, normally https://sobellybutton.github.io. Configure a daily scheduled trigger for retention cleanup. Never put the secrets into GitHub, the public shell, or browser local storage.
3. Visit the deployed Worker URL followed by /health. Require HTTP 200 and JSON with service "meowbox-community", version 1, moderated true, replies true, places true. A health result confirms the database schema and configuration, not actual message delivery or the existence of a moderator.
4. Assign a real moderator and a process for checking /moderation/queue with the moderator token, approving or rejecting through POST /moderation/decide with id and status. Review reports and remove inappropriate material promptly. Until moderation is staffed, keep the public feature disabled.
5. Set the empty meow-community-api meta content in src/shell.html to the actual HTTPS Worker URL (only the public endpoint; never a secret). Commit the change. The game will check /health and the message feed before showing Connected or enabling Send. No mock online-player counts or fictional real-visitor posts.
6. Verify the published game on separate browsers or isolated private profiles using the acceptance procedure below. The free tier has limits; monitor consumption before expanding access.

## Acceptance procedure

- With no endpoint configured, the public square explains that it is not open; the private fictional lounge remains usable.
- With endpoint configured but unavailable, the public square displays unavailable and disables posting. A successful health check plus feed request enables posting for a chosen nickname.
- Visitor A submits a harmless test message in Town Square. A sees pending status under My submitted messages. Visitor B does not see the pending post.
- Moderator approves A's post. B refreshes or waits for polling and sees the actual approved post. B replies to A. After approval, A sees B's reply and attribution.
- Switch village conversation spot. No message from the other spot should appear. Replies across different spots are rejected by the server.
- Report from B; verify the moderation queue includes the report. Reject the reported post and verify it disappears for both visitors. A can delete their own posts but cannot delete B's.
- Verify invalid content, bad reply IDs, invalid places, throttling, and unauthorized moderation requests fail. Check that clearing a local browser session means its ownership token cannot be recovered. Do not promise permanent accounts or cross-device ownership.
- Test mobile and desktop, English and Chinese, including the offline state. Verify no birth chart data, game saves, private notes or NPC transcripts are transmitted.

## Future flow

Start with Town Square as a shared conversation space so early visitors are not scattered. Village topics can be chosen explicitly; they do not disclose the player's position. Later, add opt-in presence with a short expiry, preset waves, public reply notifications and cooperative activities, only after the moderated text feature works. No private messaging or player tracking at launch. All presence and online counts must come from actual active sessions.


## Owner-approved mixed community direction (25 November 2026)

The target is an opt-in shared town with real visitors and clearly identifiable fictional residents. Real visitors in the same instance should see each other's walking, sitting, gestures and eligible shared activities. Five real visitors should normally share one small town rather than be split into five solo instances. Never fabricate human presence or activity; a resident can start a conversation, invite a group activity and respond with authored bilingual banter, then participate less as actual people engage. NPCs must not masquerade as humans. Quiet visitors can observe, react, wave, or opt out without introductions, friend requests or pressure to reply. No private messages at initial rollout.

Implementation order: (1) deploy and verify existing moderated asynchronous feed with staffed moderation; (2) opt-in ephemeral presence, real session counts, nickname/avatar, voluntary waves and presence expiry; (3) room/instance-scoped movement snapshots with interpolation, bounds and rate validation, reconnect, departure, visibility and block controls; (4) resident-led group prompts and opt-in short cooperative activities, with predefined safe NPC reactions before considering any paid AI service; (5) real multi-client testing and moderation review before enabling publicly. Prefer free-tier infrastructure within measured limits; never expose credentials or private game data. Presence is optional and must not disclose birth details, private notes, precise location, or full save state. No raw free-text live chat without an effective moderation and abuse-handling plan. Include a quiet solo mode and preserve existing local progress. Test zero, one and five actual concurrent visitors, leave/reconnect/idle expiry, blocking, mobile/desktop, EN/ZH, and verify no synthetic users are counted as real.

This is a new product requirement, not evidence that multiplayer has been implemented or deployed. The current moderated feed remains separate from fictional NPC conversations until the shared service passes acceptance.

## Outdoor presence preview (implemented in source; deployment still gated)

After the existing moderated feed is operational, apply the updated schema to D1 and deploy worker.mjs. Set ENABLE_PRESENCE to the string true only after moderator and usage-limit review. /health must advertise presence:true. Leave the public endpoint blank until these checks are complete.

The Shared stroll tab in Town Square offers per-visit opt-in and solo mode. It sends only map ID, game coordinates, selected avatar, direction, walking and an allowlisted gesture. The Worker returns other active sessions on that map, with a server-derived traveller code (no user-entered names). Five-second polling and 900ms interpolation are a low-frequency prototype, not full live movement or a WebSocket service. Outdoor peers appear in the existing foot-depth sorted drawing order. The current version does not share rooms, conversations, accounts, friendships or activity state. Hide controls are local to the visit. It shows resident prompts and a shared tea gesture response, not a generative AI chat or synchronized minigame. The service returns at most 30 other sessions, limits to eight active sessions per network and 100 total, throttles writes, and excludes sessions older than 18 seconds; expired database rows are removed by the scheduled cleanup. Counts represent connected sessions, not proof of unique human identity.

Acceptance: enable in a staging Worker first, use five isolated browser profiles on the same map, confirm four other sessions per visitor and correct avatars/position, wave/tea gestures, no NPC count, map switching, off-map disappearance, hiding, opt-out, reconnect and expiry. Check small/tall mobile, tablet, desktop, language switching and offline/timeout. Inspect depth order, sprite placement and labels. Verify the network payload contains no nickname, local save, private notes or birth data. Keep disabled until actual five-client and moderation review pass. Before public rollout add abuse controls, server-side blocking/reporting for presence, quota monitoring and a fuller realtime transport if required.
