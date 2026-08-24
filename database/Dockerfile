# =====================================================
# KPPSM Database - Custom MySQL 8.0 Image
# Pre-loaded with database-schema.sql
# =====================================================

FROM mysql:8.0

LABEL maintainer="KPPSM Tech Team"
LABEL description="Custom MySQL Database for KPPSM Website & API"

# Set default MySQL environment variables
ENV MYSQL_DATABASE=kppsm_website \
    MYSQL_ROOT_PASSWORD=rootpassword

# Copy SQL initialization script to auto-run on container first launch
COPY database/database-schema.sql /docker-entrypoint-initdb.d/01-database-schema.sql

# Expose default MySQL port
EXPOSE 3306

# Run MySQL with UTF-8 support
CMD ["mysqld", "--character-set-server=utf8mb4", "--collation-server=utf8mb4_unicode_ci", "--default-authentication-plugin=mysql_native_password"]
