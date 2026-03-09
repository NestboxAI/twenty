import { Injectable, Logger } from '@nestjs/common';

import * as fs from 'fs';
import * as path from 'path';

import { ASSET_PATH } from 'src/constants/assets-path';

@Injectable()
export class BoilerplateService {
  private readonly logger = new Logger(BoilerplateService.name);

  // Assets are copied to dist/assets/ by nest-cli.json compilerOptions.assets
  private readonly templateDir = path.join(
    ASSET_PATH,
    'engine',
    'core-modules',
    'operating-model',
    'boilerplate',
  );

  async scaffold(
    workspaceId: string,
    repoPath: string,
    workspaceName: string,
  ): Promise<void> {
    const workspaceSlug = this.slugify(workspaceName);
    const shortId = workspaceId.split('-')[0];
    const pluginName = `${workspaceSlug}-${shortId}`;
    const targetDir = path.join(repoPath, workspaceId);

    if (fs.existsSync(targetDir)) {
      this.logger.log(
        `Workspace directory already exists: ${targetDir}`,
      );

      return;
    }

    this.logger.log(
      `Scaffolding workspace ${workspaceId} from template at ${this.templateDir}`,
    );

    this.copyDir(this.templateDir, targetDir, {
      '{{WORKSPACE_SLUG}}': workspaceSlug,
      '{{PLUGIN_NAME}}': pluginName,
    });

    this.logger.log(
      `Scaffolded workspace ${workspaceId} at ${targetDir}`,
    );
  }

  private copyDir(
    src: string,
    dest: string,
    vars: Record<string, string>,
  ): void {
    fs.mkdirSync(dest, { recursive: true });

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        this.copyDir(srcPath, destPath, vars);
      } else {
        let content = fs.readFileSync(srcPath, 'utf-8');

        for (const [key, value] of Object.entries(vars)) {
          content = content.replace(new RegExp(this.escapeRegex(key), 'g'), value);
        }

        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.writeFileSync(destPath, content);
      }
    }
  }

  private slugify(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
