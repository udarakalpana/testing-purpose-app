---
paths:
  - 'app/Models/**'
---

# Models

## Models use HasUuids; Sanctum tokens are UUID-keyed too
Every model uses `Illuminate\Database\Eloquent\Concerns\HasUuids`. Do not set `$keyType` or `$incrementing` by hand — the trait's `HasUniqueStringIds` already overrides `getKeyType()` and `getIncrementing()`.

On Laravel 12 `HasUuids` generates UUID**v7** (time-ordered), so inserts keep clustered-index locality and `orderBy('id')` is chronological. Use `HasVersion4Uuids` only if random keys are genuinely required.

`App\Models\PersonalAccessToken` overrides Sanctum's model to add `HasUuids`, registered via `Sanctum::usePersonalAccessTokenModel()` in AppServiceProvider::boot(). Reason: Sanctum embeds the token's primary key in the plain-text token it returns to clients ("{id}|{token}"), so an auto-increment key would publish how many tokens the app has issued.

Bonus behaviour worth relying on: `resolveRouteBindingQuery()` validates UUID format before touching the database, so a malformed route key throws ModelNotFoundException (404) with no query — useful for the "404 not 403" tenancy rule.
