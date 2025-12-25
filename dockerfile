# ================================
# Frontend build
# ================================
FROM node:22-alpine AS frontend-build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY resources/ resources/
COPY public/ public/
COPY vite.config.ts .
COPY tsconfig.json .
COPY eslint.config.js .
COPY components.json .

RUN npm run build


# ===============================
# PHP + Nginx stage
# ===============================
FROM php:8.4-fpm-alpine

# System dependencies
RUN apk add --no-cache \
    git curl nginx supervisor \
    libpng-dev oniguruma-dev libxml2-dev \
    zip unzip sqlite

RUN docker-php-ext-install \
    pdo_sqlite mbstring exif pcntl bcmath gd

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Install PHP dependencies
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader

# Copy app source
COPY . .
COPY --from=frontend-build /app/public/build ./public/build

# Permissions
RUN mkdir -p storage bootstrap/cache \
    && chown -R www-data:www-data /var/www \
    && chmod -R 775 storage bootstrap/cache

# Nginx & Supervisor
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/default.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# PHP-FPM env
RUN echo "clear_env = no" >> /usr/local/etc/php-fpm.d/www.conf

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
