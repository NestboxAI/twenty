import { registerEnumType } from '@nestjs/graphql';

export enum ModelTab {
  COMMANDS = 'commands',
  SKILLS = 'skills',
  AGENTS = 'agents',
  HOOKS = 'hooks',
}

registerEnumType(ModelTab, { name: 'ModelTab' });
