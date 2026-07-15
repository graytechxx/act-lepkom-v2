# ============================================================
# Stage 1: Build frontend assets (Node)
# ============================================================
FROM node:22-alpine AS frontend-build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build

# ============================================================
# Stage 2: PHP + Composer dependencies
# ============================================================
FROM composer:2.8 AS vendor-build

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --no-scripts \
    --no-autoloader \
    --prefer-dist

COPY . .
RUN composer install --no-dev --no-interaction --no-progress --prefer-dist

# ============================================================
# Stage 3: Production image
# ============================================================
FROM php:8.3-fpm-alpine AS app

ENV PHP_OPCACHE_ENABLE=1
ENV PHP_OPCACHE_VALIDATE_TIMESTAMPS=0
ENV PHP_OPCACHE_MAX_ACCELERATED_FILES=20000
ENV PHP_OPCACHE_MEMORY_CONSUMPTION=256

# Install system deps
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    unzip \
    git \
    sqlite \
    sqlite-libs \
    libzip-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    oniguruma-dev \
    linux-headers \
    $([ -f /usr/include/linux/input.h ] || echo "")

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    pdo \
    pdo_mysql \
    pdo_sqlite \
    mbstring \
    bcmath \
    gd \
    zip \
    pcntl

# Install Redis extension from PECL
RUN pecl install redis && docker-php-ext-enable redis

# Install OPcache
RUN docker-php-ext-install opcache

# Copy PHP config
COPY .docker/php/php.ini $PHP_INI_DIR/conf.d/99-custom.ini
COPY .docker/php/opcache.ini $PHP_INI_DIR/conf.d/opcache.ini
COPY .docker/php/www.conf /usr/local/etc/php-fpm.d/www.conf

# Copy Nginx config
COPY .docker/nginx/default.conf /etc/nginx/http.d/default.conf

# Copy Supervisor config
COPY .docker/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy entrypoint
COPY .docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Copy application files from vendor-build stage
COPY --from=vendor-build /app /var/www/html
COPY --from=frontend-build /app/public/build /var/www/html/public/build

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache

WORKDIR /var/www/html

EXPOSE 80 443

ENTRYPOINT ["entrypoint.sh"]
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
