import { type KeyboardEvent, useEffect, useMemo, useState } from 'react';

import { type AnalyxSkill, type SlashCommand } from '../AnalyxTypes';
import { slugifySkillName } from '../AnalyxUtils';

const MAX_VISIBLE_COMMANDS = 3;
const SLASH_PREFIX_REGEX = /^\/([a-z-]*)$/;

type UseSlashCommandAutocompleteParams = {
  skills: AnalyxSkill[];
  prompt: string;
  onPromptChange: (value: string) => void;
};

export const useSlashCommandAutocomplete = ({
  skills,
  prompt,
  onPromptChange,
}: UseSlashCommandAutocompleteParams) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const allCommands = useMemo<SlashCommand[]>(
    () =>
      skills
        .map((skill) => ({
          command: slugifySkillName(skill.name),
          skillName: skill.name,
          skillId: skill.id,
          placeholder: skill.placeholder,
        }))
        .filter((cmd) => cmd.command.length > 0),
    [skills],
  );

  const slashPrefix = useMemo<string | null>(() => {
    const match = prompt.match(SLASH_PREFIX_REGEX);
    return match ? match[1] : null;
  }, [prompt]);

  const isOpen = slashPrefix !== null;

  const filteredCommands = useMemo<SlashCommand[]>(() => {
    if (slashPrefix === null) return [];
    if (slashPrefix === '') return allCommands.slice(0, MAX_VISIBLE_COMMANDS);
    return allCommands
      .filter((cmd) => cmd.command.startsWith(slashPrefix))
      .slice(0, MAX_VISIBLE_COMMANDS);
  }, [slashPrefix, allCommands]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredCommands]);

  const activeCommandData = useMemo<SlashCommand | null>(() => {
    const match = prompt.match(/^\/([a-z-]+)\s/);
    if (!match) return null;
    return allCommands.find((cmd) => cmd.command === match[1]) ?? null;
  }, [prompt, allCommands]);

  const activeCommand = activeCommandData ? `/${activeCommandData.command}` : null;
  const activePlaceholder = activeCommandData?.placeholder ?? null;

  const selectCommand = (cmd: SlashCommand) => {
    onPromptChange(`/${cmd.command} `);
    setSelectedIndex(0);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isOpen || filteredCommands.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(
          (prev) =>
            (prev - 1 + filteredCommands.length) % filteredCommands.length,
        );
        break;
      case 'Tab':
      case 'Enter':
        event.preventDefault();
        selectCommand(filteredCommands[selectedIndex]);
        break;
      case 'Escape':
        event.preventDefault();
        onPromptChange('');
        break;
    }
  };

  return {
    isOpen,
    filteredCommands,
    selectedIndex,
    handleKeyDown,
    selectCommand,
    activeCommand,
    activePlaceholder,
  };
};
