import { Injectable, Logger } from '@nestjs/common';

import * as fs from 'fs';
import * as path from 'path';

import simpleGit, { type SimpleGit } from 'simple-git';

export interface GitLogEntry {
  sha: string;
  message: string;
  author: string;
  date: string;
}

export interface GitShowResult {
  files: {
    path: string;
    action: string;
    before: string | null;
    after: string | null;
  }[];
}

@Injectable()
export class GitService {
  private readonly logger = new Logger(GitService.name);
  private readonly initLocks = new Map<string, Promise<void>>();

  private git(repoPath: string, env?: Record<string, string>): SimpleGit {
    const instance = simpleGit({ baseDir: repoPath });

    if (env) {
      instance.env(env);
    }

    return instance;
  }

  private assertSafePath(repoPath: string, filePath: string): void {
    const resolved = path.resolve(repoPath, filePath);

    if (!resolved.startsWith(path.resolve(repoPath) + path.sep)) {
      throw new Error(`Path traversal detected: ${filePath}`);
    }
  }

  async ensureRepo(repoPath: string): Promise<void> {
    if (fs.existsSync(path.join(repoPath, '.git'))) {
      return;
    }

    // Prevent concurrent init for the same repo path
    const existing = this.initLocks.get(repoPath);

    if (existing) {
      return existing;
    }

    const initPromise = this.doInitRepo(repoPath);

    this.initLocks.set(repoPath, initPromise);

    try {
      await initPromise;
    } finally {
      this.initLocks.delete(repoPath);
    }
  }

  private async doInitRepo(repoPath: string): Promise<void> {
    // Double-check after acquiring the lock
    if (fs.existsSync(path.join(repoPath, '.git'))) {
      return;
    }

    fs.mkdirSync(repoPath, { recursive: true });

    const git = this.git(repoPath);

    await git.init(['--initial-branch=main']);
    await git.addConfig('user.email', 'system@operating-model');
    await git.addConfig('user.name', 'Operating Model');

    // Create .gitignore for .ssh directory
    const gitignorePath = path.join(repoPath, '.gitignore');

    fs.writeFileSync(gitignorePath, '.ssh/\n');

    await git.add('.gitignore');
    await git.commit('Initial repository setup');

    this.logger.log(`Initialized git repo at ${repoPath}`);
  }

  async listFiles(
    repoPath: string,
    subdir?: string,
  ): Promise<{ path: string; content: string }[]> {
    const targetDir = subdir
      ? path.join(repoPath, subdir)
      : repoPath;

    if (!fs.existsSync(targetDir)) {
      return [];
    }

    const results: { path: string; content: string }[] = [];

    this.readDirRecursive(targetDir, repoPath, results);

    return results;
  }

  private readDirRecursive(
    dir: string,
    baseDir: string,
    results: { path: string; content: string }[],
  ): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.name === '.git' || entry.name === '.ssh') {
        continue;
      }

      if (entry.isDirectory()) {
        this.readDirRecursive(fullPath, baseDir, results);
      } else {
        const relativePath = path.relative(baseDir, fullPath);

        try {
          const content = fs.readFileSync(fullPath, 'utf-8');

          results.push({ path: relativePath, content });
        } catch {
          // Skip binary files or unreadable files
        }
      }
    }
  }

  async readFile(repoPath: string, filePath: string): Promise<string | null> {
    this.assertSafePath(repoPath, filePath);

    const fullPath = path.join(repoPath, filePath);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    return fs.readFileSync(fullPath, 'utf-8');
  }

  async writeFiles(
    repoPath: string,
    files: { path: string; content: string }[],
  ): Promise<void> {
    for (const file of files) {
      this.assertSafePath(repoPath, file.path);

      const fullPath = path.join(repoPath, file.path);

      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(fullPath, file.content);
    }
  }

  async deleteFile(repoPath: string, filePath: string): Promise<void> {
    this.assertSafePath(repoPath, filePath);

    const fullPath = path.join(repoPath, filePath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }

  async commit(
    repoPath: string,
    message: string,
    author?: string,
  ): Promise<string> {
    const git = this.git(repoPath);

    await git.add('-A');

    const status = await git.status();

    if (
      status.staged.length === 0 &&
      status.created.length === 0 &&
      status.deleted.length === 0 &&
      status.modified.length === 0
    ) {
      // Nothing to commit — return current HEAD
      const log = await git.log({ maxCount: 1 });

      return log.latest?.hash ?? '';
    }

    const options: Record<string, string> = {};

    if (author) {
      options['--author'] = `${author} <${author}@operating-model>`;
    }

    const result = await git.commit(message, undefined, options);

    return result.commit;
  }

  async log(
    repoPath: string,
    pathFilter?: string,
    limit = 50,
  ): Promise<GitLogEntry[]> {
    const git = this.git(repoPath);

    try {
      const options: string[] = [`-n`, `${limit}`, '--follow'];

      if (pathFilter) {
        options.push('--', pathFilter);
      }

      const log = await git.log(options as any);

      return log.all.map((entry) => ({
        sha: entry.hash,
        message: entry.message,
        author: entry.author_name,
        date: entry.date,
      }));
    } catch {
      return [];
    }
  }

  async show(
    repoPath: string,
    commitSha: string,
    pathFilter?: string,
  ): Promise<GitShowResult> {
    const git = this.git(repoPath);
    const files: GitShowResult['files'] = [];

    try {
      // Get list of changed files with their status
      const diffArgs = ['diff-tree', '--no-commit-id', '-r', '--name-status', commitSha];

      if (pathFilter) {
        diffArgs.push('--', pathFilter);
      }

      const nameStatus = await git.raw(diffArgs);
      const lines = nameStatus.trim().split('\n').filter(Boolean);

      for (const line of lines) {
        const [status, filePath] = line.split('\t');

        if (!filePath) continue;

        let action = 'modified';

        if (status === 'A') action = 'added';
        else if (status === 'D') action = 'deleted';

        let before: string | null = null;
        let after: string | null = null;

        try {
          if (action !== 'added') {
            before = await git.raw(['show', `${commitSha}~1:${filePath}`]);
          }
        } catch {
          // File didn't exist in parent commit
        }

        try {
          if (action !== 'deleted') {
            after = await git.raw(['show', `${commitSha}:${filePath}`]);
          }
        } catch {
          // File doesn't exist in this commit
        }

        files.push({ path: filePath, action, before, after });
      }
    } catch (error) {
      this.logger.warn(`Failed to show commit ${commitSha}: ${error}`);
    }

    return { files };
  }

  async checkoutPathAtCommit(
    repoPath: string,
    commitSha: string,
    pathPrefix: string,
  ): Promise<void> {
    this.assertSafePath(repoPath, pathPrefix);

    const git = this.git(repoPath);

    await git.raw(['checkout', commitSha, '--', pathPrefix]);
  }

  async pushToRemote(
    repoPath: string,
    branch: string,
    sshCommand?: string,
    force = false,
  ): Promise<void> {
    const env: Record<string, string> = {};

    if (sshCommand) {
      env['GIT_SSH_COMMAND'] = sshCommand;
    }

    const git = this.git(repoPath, env);
    const args = ['push', 'origin', branch];

    if (force) {
      args.splice(1, 0, '--force');
    }

    await git.raw(args);
  }

  async pullFromRemote(
    repoPath: string,
    branch: string,
    sshCommand?: string,
    force = false,
  ): Promise<void> {
    const env: Record<string, string> = {};

    if (sshCommand) {
      env['GIT_SSH_COMMAND'] = sshCommand;
    }

    const git = this.git(repoPath, env);

    if (force) {
      await git.fetch('origin');
      await git.raw(['reset', '--hard', `origin/${branch}`]);
    } else {
      await git.pull('origin', branch, { '--strategy-option': 'theirs' });
    }
  }

  async tag(
    repoPath: string,
    tagName: string,
    commitSha: string,
  ): Promise<void> {
    const git = this.git(repoPath);

    await git.tag([tagName, commitSha]);
  }

  async addRemote(repoPath: string, url: string): Promise<void> {
    const git = this.git(repoPath);

    try {
      await git.remote(['set-url', 'origin', url]);
    } catch {
      await git.addRemote('origin', url);
    }
  }
}
