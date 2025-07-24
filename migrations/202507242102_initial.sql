CREATE TABLE guild_settings (
  id BIGINT PRIMARY KEY,
  target_channel_id BIGINT,
  target_role_id BIGINT,
  admin_role_id BIGINT
);

CREATE TABLE run_record (
  id SERIAL PRIMARY KEY,
  guild_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);
