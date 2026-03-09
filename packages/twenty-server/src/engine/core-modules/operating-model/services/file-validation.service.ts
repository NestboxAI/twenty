import { Injectable, Logger } from '@nestjs/common';

import * as path from 'path';

import matter from 'gray-matter';

export interface ValidationItem {
  path: string;
  message: string;
  severity: 'error' | 'warning';
}

const ALLOWED_EXTENSIONS = new Set([
  '.md',
  '.json',
  '.py',
  '.sh',
  '.ts',
  '.js',
  '.png',
  '.jpg',
  '.svg',
  '.yaml',
  '.yml',
]);

const MAX_FILE_SIZE = 1024 * 1024; // 1MB

@Injectable()
export class FileValidationService {
  private readonly logger = new Logger(FileValidationService.name);

  validateFiles(
    files: { path: string; content: string }[],
  ): ValidationItem[] {
    const errors: ValidationItem[] = [];

    for (const file of files) {
      errors.push(...this.validatePath(file.path));
      errors.push(...this.validateSize(file.content, file.path));

      if (file.path.endsWith('.md')) {
        errors.push(...this.validateFrontmatter(file.content, file.path));
      }

      if (file.path.endsWith('hooks.json')) {
        errors.push(...this.validateHooksJson(file.content, file.path));
      }
    }

    return errors;
  }

  validatePath(filePath: string): ValidationItem[] {
    const errors: ValidationItem[] = [];

    if (path.isAbsolute(filePath)) {
      errors.push({
        path: filePath,
        message: 'Absolute paths are not allowed',
        severity: 'error',
      });
    }

    if (filePath.includes('..')) {
      errors.push({
        path: filePath,
        message: 'Path traversal is not allowed',
        severity: 'error',
      });
    }

    const ext = path.extname(filePath).toLowerCase();

    if (ext && !ALLOWED_EXTENSIONS.has(ext)) {
      errors.push({
        path: filePath,
        message: `File extension "${ext}" is not allowed`,
        severity: 'error',
      });
    }

    return errors;
  }

  validateSize(content: string, filePath: string): ValidationItem[] {
    const size = Buffer.byteLength(content, 'utf-8');

    if (size > MAX_FILE_SIZE) {
      return [
        {
          path: filePath,
          message: `File exceeds maximum size of 1MB (${(size / 1024 / 1024).toFixed(2)}MB)`,
          severity: 'error',
        },
      ];
    }

    return [];
  }

  validateFrontmatter(content: string, filePath: string): ValidationItem[] {
    try {
      matter(content);

      return [];
    } catch (error) {
      return [
        {
          path: filePath,
          message: `Invalid YAML frontmatter: ${(error as Error).message}`,
          severity: 'error',
        },
      ];
    }
  }

  validateHooksJson(content: string, filePath: string): ValidationItem[] {
    try {
      const parsed = JSON.parse(content);

      if (parsed.hooks && !Array.isArray(parsed.hooks)) {
        return [
          {
            path: filePath,
            message: '"hooks" must be an array',
            severity: 'error',
          },
        ];
      }

      if (parsed.hooks) {
        for (const [i, hook] of parsed.hooks.entries()) {
          if (!hook.event) {
            return [
              {
                path: filePath,
                message: `Hook at index ${i} is missing required "event" field`,
                severity: 'error',
              },
            ];
          }
        }
      }

      return [];
    } catch (error) {
      return [
        {
          path: filePath,
          message: `Invalid JSON: ${(error as Error).message}`,
          severity: 'error',
        },
      ];
    }
  }
}
