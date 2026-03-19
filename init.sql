CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(100) NOT NULL UNIQUE,
  password   VARCHAR(100) NOT NULL,
  is_active  BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS posts (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID NOT NULL,
  title      VARCHAR(200) NOT NULL,
  content    TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_post_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

INSERT INTO users (name, email, password) VALUES
  ('Alice', 'alice@email.com', 'hashed_password_1'),
  ('Bob',   'bob@email.com',   'hashed_password_2');

INSERT INTO posts (user_id, title, content) VALUES
  ((SELECT id FROM users WHERE email = 'alice@email.com'), 'First Post', 'Hello from Alice!'),
  ((SELECT id FROM users WHERE email = 'bob@email.com'),   'Second Post', 'Hello from Bob!');