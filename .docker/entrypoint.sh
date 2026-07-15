#!/bin/sh
set -e

# Jika APP_KEY belum di-set, generate
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "base64:" ] || [ "$APP_KEY" = " " ]; then
    echo ">>> Generating APP_KEY..."
    php artisan key:generate --force
fi

# Jika environment file belum ada
if [ ! -f .env ]; then
    cp .env.example .env
    php artisan key:generate --force
fi

# Link storage
php artisan storage:link --force 2>/dev/null || true

# Cache config (production only)
if [ "$APP_ENV" = "production" ]; then
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
fi

# Run migrations (safe — only runs pending ones)
php artisan migrate --force

echo ">>> Entrypoint done. Starting supervisord..."
exec "$@"
