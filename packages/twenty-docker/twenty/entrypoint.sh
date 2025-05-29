#!/bin/sh
set -e

# Flag file to track if initial setup has been completed
SETUP_FLAG_FILE="/app/.initial-setup-completed"

setup_and_migrate_db() {
    if [ "${DISABLE_DB_MIGRATIONS}" = "true" ]; then
        echo "Database setup and migrations are disabled, skipping..."
        return
    fi

    echo "Running database setup and migrations..."
    PGUSER=$(echo $PG_DATABASE_URL | awk -F '//' '{print $2}' | awk -F ':' '{print $1}')
    PGPASS=$(echo $PG_DATABASE_URL | awk -F ':' '{print $3}' | awk -F '@' '{print $1}')
    PGHOST=$(echo $PG_DATABASE_URL | awk -F '@' '{print $2}' | awk -F ':' '{print $1}')
    PGPORT=$(echo $PG_DATABASE_URL | awk -F ':' '{print $4}' | awk -F '/' '{print $1}')
    PGDATABASE=$(echo $PG_DATABASE_URL | awk -F ':' '{print $4}' | awk -F '/' '{print $2}')

    # Creating the database if it doesn't exist
    db_count=$(PGPASSWORD=${PGPASS} psql -h ${PGHOST} -p ${PGPORT} -U ${PGUSER} -d postgres -tAc "SELECT COUNT(*) FROM pg_database WHERE datname = '${PGDATABASE}'")
    if [ "$db_count" = "0" ]; then
        echo "Database ${PGDATABASE} does not exist, creating..."
        PGPASSWORD=${PGPASS} psql -h ${PGHOST} -p ${PGPORT} -U ${PGUSER} -d postgres -c "CREATE DATABASE \"${PGDATABASE}\""

        # Run setup and migration scripts
        NODE_OPTIONS="--max-old-space-size=1500" tsx ./scripts/setup-db.ts
        yarn database:migrate:prod
    fi
    
    yarn command:prod upgrade
    echo "Successfully migrated DB!"
}

automated_workspace_setup() {
    # Check if automated setup is enabled and not already completed
    if [ "${AUTO_SETUP_ENABLED}" != "true" ]; then
        echo "Automated workspace setup is disabled (AUTO_SETUP_ENABLED=${AUTO_SETUP_ENABLED})"
        return
    fi

    if [ -f "${SETUP_FLAG_FILE}" ]; then
        echo "Initial setup already completed, skipping automated workspace creation..."
        return
    fi

    echo "============================================================"
    echo "STARTING AUTOMATED WORKSPACE SETUP"
    echo "============================================================"

    # Validate required environment variables
    if [ -z "${ADMIN_USER_EMAIL}" ] || [ -z "${ADMIN_USER_PASSWORD}" ] || [ -z "${WORKSPACE_NAME}" ]; then
        echo "ERROR: Missing required environment variables for automated setup:"
        echo "  ADMIN_USER_EMAIL: ${ADMIN_USER_EMAIL:-'NOT SET'}"
        echo "  ADMIN_USER_PASSWORD: ${ADMIN_USER_PASSWORD:+'SET'}"
        echo "  WORKSPACE_NAME: ${WORKSPACE_NAME:-'NOT SET'}"
        echo "Skipping automated setup..."
        return 1
    fi

    # Step 1: Create workspace and admin user
    echo "Creating workspace: ${WORKSPACE_NAME}"
    echo "Admin user: ${ADMIN_USER_EMAIL}"
    
    if yarn command:prod workspace:signup \
        --username="${ADMIN_USER_EMAIL}" \
        --password="${ADMIN_USER_PASSWORD}" \
        --workspace-name="${WORKSPACE_NAME}" \
        --timezone="${WORKSPACE_TIMEZONE:-America/New_York}" \
        --admin-first-name="${ADMIN_USER_FIRST_NAME:-Admin}" \
        --admin-last-name="${ADMIN_USER_LAST_NAME:-User}"; then
        
        echo "✅ Workspace created successfully!"
        
        # Step 2: Generate API key
        echo "Generating API key: ${API_KEY_NAME:-Initial API Key}"
        
        if yarn command:prod apikeys:create-token \
            --workspace="${WORKSPACE_NAME}" \
            --name="${API_KEY_NAME:-Initial API Key}"; then
            
            echo "✅ API key generated successfully!"
            
            # Mark setup as completed
            touch "${SETUP_FLAG_FILE}"
            echo "✅ Initial setup completed and marked as done"
            
            echo "============================================================"
            echo "AUTOMATED SETUP COMPLETED SUCCESSFULLY"
            echo "============================================================"
            echo "Your Twenty instance is ready to use!"
            echo "Access it at: ${SERVER_URL:-http://localhost:3000}"
            echo "Login with: ${ADMIN_USER_EMAIL}"
            echo "============================================================"
            
        else
            echo "❌ Failed to generate API key"
            return 1
        fi
        
    else
        echo "❌ Failed to create workspace"
        return 1
    fi
}

# Run database setup and migrations
setup_and_migrate_db

# Run automated workspace setup (only on first time)
automated_workspace_setup

# Continue with the original Docker command
exec "$@"
