import { Injectable, Logger } from '@nestjs/common';

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SshKeyService {
  private readonly logger = new Logger(SshKeyService.name);

  async ensureKeypair(repoPath: string): Promise<string> {
    const sshDir = path.join(repoPath, '.ssh');
    const privateKeyPath = path.join(sshDir, 'id_ed25519');
    const publicKeyPath = path.join(sshDir, 'id_ed25519.pub');

    if (fs.existsSync(publicKeyPath)) {
      return fs.readFileSync(publicKeyPath, 'utf-8').trim();
    }

    fs.mkdirSync(sshDir, { recursive: true });

    execSync(
      `ssh-keygen -t ed25519 -f "${privateKeyPath}" -N "" -C "operating-model-deploy-key"`,
      { stdio: 'pipe' },
    );

    // Ensure correct permissions
    fs.chmodSync(privateKeyPath, 0o600);
    fs.chmodSync(publicKeyPath, 0o644);

    const publicKey = fs.readFileSync(publicKeyPath, 'utf-8').trim();

    this.logger.log(`Generated SSH keypair at ${sshDir}`);

    return publicKey;
  }

  getPublicKey(repoPath: string): string | null {
    const publicKeyPath = path.join(repoPath, '.ssh', 'id_ed25519.pub');

    if (!fs.existsSync(publicKeyPath)) {
      return null;
    }

    return fs.readFileSync(publicKeyPath, 'utf-8').trim();
  }

  getSshCommand(repoPath: string): string {
    const privateKeyPath = path.join(repoPath, '.ssh', 'id_ed25519');

    return `ssh -i "${privateKeyPath}" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null`;
  }
}
