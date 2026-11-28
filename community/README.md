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


## Public-room presence and moderation update

For a new database, apply the current schema.sql. If the earlier outdoor-only presence table was already created, disable ENABLE_PRESENCE first, run DELETE FROM presence, then ALTER TABLE presence ADD COLUMN room TEXT NOT NULL DEFAULT '' CHECK(room IN ('','tea','park','kitchen','arcade')); apply the current schema afterward. Do not run the ALTER a second time. This table contains temporary positions only; do not delete the messages table. Deploy the new Worker and require health.sharedRooms and health.presenceModeration to both be true.

Shared visitors can now appear together in the Tea Room, Daydream Park, Grandma's Kitchen and Arcade during normal exploration. Private activity views stop publishing presence. Only presets are shared; there is no synchronized cooking/arcade score or free-text live chat yet. Blocking is reciprocal for a session and persists in the database; reporting records a reason against the traveller code. The moderator can list reports at GET /moderation/presence and temporarily restrict a code using POST /moderation/presence with {id,hours} (0 removes restriction, maximum 720 hours). These controls do not establish verified identity and a new anonymous session could evade a restriction. Keep this in private staging until stronger abuse controls and an actual moderation process are reviewed.

Automated integration: from repository root, use Node 22 and run node --experimental-sqlite scripts/community-test.mjs. The GitHub Actions Community backend checks workflow runs this on relevant commits. This tests actual Worker routes against a SQLite D1 adapter, not Cloudflare's deployed runtime. Also test five real browser contexts and visual positioning in both languages before activation. No credentials or provisioned D1 database are included.

### Presence retention when disabled

Scheduled cleanup deletes all stored position snapshots when ENABLE_PRESENCE is not true, rather than leaving stale positions behind. While enabled, snapshots expire after 18 seconds as before. Expired reports and restrictions are cleaned independently of the setting, while active restrictions and session blocks are retained. Older text-only databases without presence tables continue their regular cleanup. Keep the scheduled trigger configured; switching off the flag immediately prevents new presence writes, and existing rows are removed at the next successful cleanup.


## One-time Cloudflare staging activation via GitHub Actions

The workflow **Deploy Pawradise community staging** is manually triggered only. It leaves the game's public endpoint unchanged and does not open public participation.

1. In Cloudflare, create a fresh D1 database for Pawradise staging and record its name and UUID. Use a new database rather than silently migrating an existing production database.
2. In GitHub repository Settings > Secrets and variables > Actions, create repository secrets CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN, PAW_COMMUNITY_RATE_SECRET and PAW_COMMUNITY_MODERATOR_TOKEN. Use an account-scoped API token with Workers Scripts and D1 write permissions, and two independent randomly generated secrets of at least 32 characters. Never paste the token or secrets into a chat, issue or source file.
3. In the Variables tab, set PAW_COMMUNITY_D1_ID and PAW_COMMUNITY_D1_NAME to the new database's UUID and name.
4. Open Actions > Deploy Pawradise community staging > Run workflow, select main, enter STAGING, and keep presence off for initial moderation/health checks. The workflow runs the real SQLite regression, applies schema.sql, deploys a Worker called pawradise-community-staging, configures scheduled cleanup, and stores server secrets in Cloudflare. Use the Worker URL shown by Wrangler in the run log.
5. Verify /health returns the expected service/version/moderated/replies/places capabilities, complete moderated post/reply/report/delete tests using separate sessions, then explicitly enable presence in a staging rerun for the five-client acceptance tests. Public activation is separate: assign a moderator, complete acceptance, then set only the public HTTPS endpoint in src/shell.html. Do not expose either server secret in the browser.

A successful workflow is not sufficient evidence of visual or multi-client acceptance. If Cloudflare permissions, D1 configuration, or moderation staffing are absent, leave the public meta content blank. The staging workflow is unexecuted until the account owner supplies the configuration.
