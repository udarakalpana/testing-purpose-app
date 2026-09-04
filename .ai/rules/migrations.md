---
paths:
  - 'database/migrations/**'
---

# Migrations

## All domain tables use UUID primary keys
Domain tables use `$table->uuid('id')->primary();` and reference each other with `$table->foreignUuid('user_id')->constrained()->cascadeOnDelete();` — never `id()` or `foreignId()`.

Polymorphic relations MUST use `$table->uuidMorphs('...')`, not `morphs()`. `morphs()` hardcodes an unsignedBigInteger, and MySQL silently coerces a UUID string to 0 rather than erroring — the row is written and the relation resolves to nothing.

Framework infrastructure tables stay on auto-increment: `jobs` (its bigint id is load-bearing for Illuminate\Queue\DatabaseQueue's reservation logic) and `failed_jobs`. `cache`, `cache_locks`, `password_reset_tokens` and `job_batches` already have natural/string keys and need no change. `sessions.id` is the session identifier, not a model key — only its `user_id` column is a UUID.
