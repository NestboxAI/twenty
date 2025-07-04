#!/bin/sh

# Flag file to track if cron setup has been completed
CRON_SETUP_FLAG_FILE="/app/.cron-setup-completed"

automated_cron_setup() {    
    # Check if cron setup is enabled and not already completed
    if [ "${AUTO_CRON_SETUP_ENABLED}" != "true" ]; then
        echo "Automated cron setup is disabled (AUTO_CRON_SETUP_ENABLED=${AUTO_CRON_SETUP_ENABLED})"
        return
    fi

    if [ -f "${CRON_SETUP_FLAG_FILE}" ]; then
        echo "Cron setup already completed, skipping automated cron registration..."
        return
    fi

    echo "============================================================"
    echo "STARTING AUTOMATED CRON SETUP"
    echo "============================================================"

    # Register nestbox AI agent cron job
    echo "Registering nestbox AI agent cron job..."
    
    if yarn command:prod cron:nestbox-ai:agent; then
        echo "✅ Nestbox AI agent cron job registered successfully!"
        
        # Mark cron setup as completed
        touch "${CRON_SETUP_FLAG_FILE}"
        echo "✅ Cron setup completed and marked as done"

        echo "============================================================"
        echo "Nestbox AI agent cron job is now registered and will run when worker starts"
        echo "============================================================"
        
    else
        echo "❌ Failed to register nestbox AI agent cron job"
        return 1
    fi

    # Determine if messaging or calendar jobs need to be registered
    register_messaging=false
    register_calendar=false

    if [ "${MESSAGING_PROVIDER_GMAIL_ENABLED}" = "true" ] || [ "${MESSAGING_PROVIDER_MICROSOFT_ENABLED}" = "true" ]; then
        register_messaging=true
    fi

    if [ "${CALENDAR_PROVIDER_GOOGLE_ENABLED}" = "true" ] || [ "${CALENDAR_PROVIDER_MICROSOFT_ENABLED}" = "true" ]; then
        register_calendar=true
    fi

    if [ "$register_messaging" = "true" ] || [ "$register_calendar" = "true" ]; then
        echo "Registering messaging and/or calendar cron jobs..."

        # Messaging jobs (if any messaging integration is enabled)
        if [ "$register_messaging" = "true" ]; then
            if yarn command:prod cron:messaging:messages-import \
                && yarn command:prod cron:messaging:message-list-fetch \
                && yarn command:prod cron:messaging:ongoing-stale; then
                echo "✅ Messaging cron jobs registered successfully!"
            else
                echo "❌ Failed to register messaging cron jobs"
                return 1
            fi
        fi

        # Calendar jobs (if any calendar integration is enabled)
        if [ "$register_calendar" = "true" ]; then
            if yarn command:prod cron:calendar:calendar-event-list-fetch \
                && yarn command:prod cron:calendar:calendar-events-import \
                && yarn command:prod cron:calendar:ongoing-stale; then
                echo "✅ Calendar cron jobs registered successfully!"
            else
                echo "❌ Failed to register calendar cron jobs"
                return 1
            fi
        fi

        # Common workflow job (register if any integration is enabled)
        if yarn command:prod cron:workflow:automated-cron-trigger; then
            echo "✅ Workflow cron job registered successfully!"
        else
            echo "❌ Failed to register workflow cron job"
            return 1
        fi

        echo "============================================================"
        echo "Integration cron job(s) now registered and will run when worker starts"
        echo "============================================================"
    else
        echo "Messaging/Calendar integrations disabled, skipping related cron jobs"
    fi

    echo "============================================================"
    echo "AUTOMATED CRON SETUP COMPLETED SUCCESSFULLY"
    echo "============================================================"
} 