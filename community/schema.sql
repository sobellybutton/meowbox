-- MeowBox moderated community: public messages are never auto-published.
CREATE TABLE IF NOT EXISTS messages (
 id TEXT PRIMARY KEY, owner TEXT NOT NULL, rate_key TEXT NOT NULL,
 name TEXT NOT NULL, text TEXT NOT NULL, created INTEGER NOT NULL,
 status TEXT NOT NULL CHECK(status IN ('pending','approved','rejected')),
 moderated INTEGER
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
