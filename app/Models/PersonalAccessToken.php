<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;

/**
 * A Sanctum access token keyed by a UUID.
 *
 * Sanctum embeds this model's key in the plain-text token handed to clients
 * ("{id}|{token}"), so an auto-incrementing key would publish how many tokens
 * the application has ever issued.
 */
class PersonalAccessToken extends SanctumPersonalAccessToken
{
    use HasUuids;
}
