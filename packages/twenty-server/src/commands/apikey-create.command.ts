import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Command, CommandRunner, Option } from 'nest-commander';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { ApiKeyService } from 'src/engine/core-modules/auth/services/api-key.service';
import { Workspace } from 'src/engine/core-modules/workspace/workspace.entity';
import { TwentyORMGlobalManager } from 'src/engine/twenty-orm/twenty-orm-global.manager';
import { ApiKeyWorkspaceEntity } from 'src/modules/api-key/standard-objects/api-key.workspace-entity';

interface ApiKeyCreateOptions {
    workspace: string;
    name: string;
}

@Command({
    name: 'apikeys:create-token',
    description: 'Create a new API key for a workspace',
})
@Injectable()
export class ApiKeyCreateCommand extends CommandRunner {
    private readonly logger = new Logger(ApiKeyCreateCommand.name);

    constructor(
        private readonly apiKeyService: ApiKeyService,
        private readonly twentyORMGlobalManager: TwentyORMGlobalManager,
        @InjectRepository(Workspace, 'core')
        private readonly workspaceRepository: Repository<Workspace>,
    ) {
        super();
    }

    @Option({
        flags: '--workspace <workspace>',
        description: 'Workspace subdomain or ID',
        required: true,
    })
    parseWorkspace(value: string): string {
        return value;
    }

    @Option({
        flags: '--name <name>',
        description: 'API key name',
        required: true,
    })
    parseName(value: string): string {
        return value;
    }

    async run(
        passedParams: string[],
        options: ApiKeyCreateOptions,
    ): Promise<void> {
        try {
            this.logger.log('Starting API key creation process...');

            // Find workspace by name
            let workspace: Workspace | null = null;

            // Find by name
            workspace = await this.workspaceRepository.findOne({
                where: { displayName: options.workspace },
            });

            if (!workspace) {
                throw new Error(`Workspace not found: ${options.workspace}`);
            }

            this.logger.log(`Found workspace: ${workspace.displayName} (${workspace.id})`);

            // Check if API key with the same name already exists
            const apiKeyRepository = await this.twentyORMGlobalManager.getRepositoryForWorkspace<ApiKeyWorkspaceEntity>(
                workspace.id,
                'apiKey',
                {
                    shouldBypassPermissionChecks: true,
                },
            );

            const existingApiKey = await apiKeyRepository.findOne({
                where: { name: options.name },
            });

            if (existingApiKey) {
                this.logger.log('='.repeat(60));
                this.logger.log('API KEY ALREADY EXISTS');
                this.logger.log('='.repeat(60));
                this.logger.log('');
                this.logger.log(`An API key with the name "${options.name}" already exists in workspace "${workspace.displayName}"`);
                this.logger.log(`Existing API Key ID: ${existingApiKey.id}`);
                this.logger.log(`Created At: ${existingApiKey.createdAt}`);
                this.logger.log(`Expires At: ${existingApiKey.expiresAt?.toISOString()}`);
                this.logger.log('');
                this.logger.log('Skipping API key creation. Use a different name or delete the existing key first.');
                this.logger.log('='.repeat(60));
                return;
            }

            // Set expiration to 100 years from now
            const expiresAt = new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000);

            this.logger.log(`Creating API key: ${options.name}`);
            this.logger.log(`Expiration date: ${expiresAt.toISOString()}`);

            // Step 1: Create API key record in workspace schema
            const apiKeyId = uuidv4();
            await apiKeyRepository.insert({
                id: apiKeyId,
                name: options.name,
                expiresAt: expiresAt,
            });

            this.logger.log(`API key record created with ID: ${apiKeyId}`);

            // Step 2: Generate JWT token
            const apiKeyToken = await this.apiKeyService.generateApiKeyToken(
                workspace.id,
                apiKeyId,
                expiresAt,
            );

            if (!apiKeyToken) {
                throw new Error('Failed to generate API key token');
            }

            this.logger.log('='.repeat(60));
            this.logger.log('API KEY CREATION SUCCESSFUL');
            this.logger.log('='.repeat(60));
            this.logger.log('');
            this.logger.log('API KEY DETAILS');
            this.logger.log('='.repeat(60));
            this.logger.log(`Name: ${options.name}`);
            this.logger.log(`API Key ID: ${apiKeyId}`);
            this.logger.log(`API Key Token: ${apiKeyToken.token}`);
            this.logger.log(`Workspace ID: ${workspace.id}`);
            this.logger.log(`Workspace Name: ${workspace.displayName}`);
            this.logger.log(`Expires At: ${expiresAt.toISOString()}`);
            this.logger.log('');
            this.logger.log('='.repeat(60));
        } catch (error) {
            this.logger.error('Failed to create API key:', error.message);
            throw error;
        }
    }
}
