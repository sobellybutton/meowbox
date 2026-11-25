-- MeowBox moderated community: public messages are never auto-published.
CREATE TABLE IF NOT EXISTS messages (
 id TEXT PRIMARY KEY, owner TEXT NOT NULL, rate_key TEXT NOT NULL,
 name TEXT NOT NULL, text TEXT NOT NULL, created INTEGER NOT NULL,
 status TEXT NOT NULL CHECK(status IN ('pending','approved','rejected')),
 moderated INTEGER,
 reply_to TEXT REFERENCES messages(id) ON DELETE SET NULL,
 place TEXT NOT NULL DEFAULT 'square' CHECK(place IN ('square','fortune','home','island','wonder'))
);
CREATE INDEX IF NOT EXISTS messages_status_created ON messages(status,created);
CREATE INDEX IF NOT EXISTS messages_owner_created ON messages(owner,created);
CREATE INDEX IF NOT EXISTS messages_rate_created ON messages(rate_key,created);
CREATE TABLE IF NOT EXISTS reports (
 message_id TEXT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
 reporter TEXT NOT NULL, created INTEGER NOT NULL,
 PRIMARY KEY(message_id,reporter)
);
CREATE INDEX IF NOT EXISTS reports_reporter_created ON reports(reporter,created);
-- Separate submission events retain rate limits after a visitor deletes a post.
CREATE TABLE IF NOT EXISTS submission_events (
 id TEXT PRIMARY KEY, owner TEXT NOT NULL, rate_key TEXT NOT NULL, created INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS events_owner_created ON submission_events(owner,created);
CREATE INDEX IF NOT EXISTS events_rate_created ON submission_events(rate_key,created);
CREATE INDEX IF NOT EXISTS messages_place_status_created ON messages(place,status,created);
CREATE INDEX IF NOT EXISTS messages_reply ON messages(reply_to);

-- Opt-in outdoor presence only. No user-entered names, messages or save data.
CREATE TABLE IF NOT EXISTS presence (
 owner TEXT PRIMARY KEY, public_id TEXT NOT NULL UNIQUE, rate_key TEXT NOT NULL,
 place TEXT NOT NULL CHECK(place IN ('fortune','home','island','wonder')),
 x INTEGER NOT NULL CHECK(x BETWEEN 0 AND 1000),
 y INTEGER NOT NULL CHECK(y BETWEEN 0 AND 1777),
 avatar INTEGER NOT NULL CHECK(avatar BETWEEN 0 AND 3),
 facing TEXT NOT NULL CHECK(facing IN ('up','down','left','right')),
 walking INTEGER NOT NULL CHECK(walking IN (0,1)),
 gesture TEXT NOT NULL CHECK(gesture IN ('none','wave','cheer','tea')),
 updated INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS presence_place_updated ON presence(place,updated);
CREATE INDEX IF NOT EXISTS presence_rate_updated ON presence(rate_key,updated);

-- One preset reaction per visitor per approved message; removed with its message.
CREATE TABLE IF NOT EXISTS reactions (
 message_id TEXT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
 owner TEXT NOT NULL, kind TEXT NOT NULL CHECK(kind IN ('laugh','heart','same')),
 created INTEGER NOT NULL, PRIMARY KEY(message_id,owner)
);
CREATE INDEX IF NOT EXISTS reactions_owner_created ON reactions(owner,created);
