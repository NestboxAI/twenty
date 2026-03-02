import { TextInput } from '@/ui/input/components/TextInput';
import styled from '@emotion/styled';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
  IconSearch,
  IconX,
} from 'twenty-ui/display';
import { type AnalyxCommand } from '../AnalyxTypes';

const SKILL_CARD_COLORS = [
  // Warm
  { bg: '#FFF5F0', border: '#FFD6C0', accent: '#FF8C5A' },
  { bg: '#FFF8F0', border: '#FFE4BA', accent: '#F5A623' },
  { bg: '#FFF0F6', border: '#FFCCE0', accent: '#E8578A' },
  { bg: '#FFFFF0', border: '#F0E8B0', accent: '#C9A832' },
  // Cool
  { bg: '#F0F7FF', border: '#C4DFFF', accent: '#5B9BF5' },
  { bg: '#F5F0FF', border: '#D8C8FF', accent: '#8B6CE0' },
  { bg: '#F0FFF5', border: '#B8F0CD', accent: '#4CAF7D' },
  { bg: '#F0FDFF', border: '#B8EBF4', accent: '#3DB5CC' },
  // Extended
  { bg: '#FFF4F4', border: '#FFCACA', accent: '#E06060' },
  { bg: '#FFF9F0', border: '#FFE0B2', accent: '#E8964B' },
  { bg: '#F0F0FF', border: '#C8C8FF', accent: '#6B6BE0' },
  { bg: '#F8F0FF', border: '#E4C8FF', accent: '#A06BE0' },
  { bg: '#F0FFF0', border: '#B8F0B8', accent: '#4CAF4C' },
  { bg: '#FFF0FF', border: '#F0C0F0', accent: '#C060C0' },
  { bg: '#F0FFFA', border: '#B0F0D8', accent: '#3CB893' },
  { bg: '#FFFDF0', border: '#F5E8A0', accent: '#B8A030' },
];

const StyledContainer = styled.div`
  align-self: center;
  display: flex;
  gap: 10px;
  max-width: 1100px;
  width: 100%;
`;

const StyledActionButtons = styled.div`
  align-items: center;
  align-self: center;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 8px;
`;

const StyledActionButton = styled.button`
  align-items: center;
  background: ${({ theme }) => theme.background.transparent.lighter};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: 50%;
  color: ${({ theme }) => theme.font.color.secondary};
  cursor: pointer;
  display: flex;
  height: 30px;
  justify-content: center;
  width: 30px;

  &:hover {
    background: ${({ theme }) => theme.background.transparent.light};
    color: ${({ theme }) => theme.font.color.primary};
  }
`;

const StyledScrollArea = styled.div`
  flex: 1;
  min-width: 0;
  position: relative;
`;

const StyledSearchOverlay = styled.div`
  align-items: center;
  background: ${({ theme }) => theme.background.primary};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.boxShadow.light};
  display: flex;
  left: 0;
  padding: 4px;
  position: absolute;
  top: -36px;
  z-index: 3;
`;

const StyledScrollContainer = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 2px 0;
  scroll-behavior: smooth;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const StyledScrollArrow = styled.button<{ position: 'left' | 'right' }>`
  align-items: center;
  backdrop-filter: blur(8px);
  background: ${({ theme }) => theme.background.primary};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: 50%;
  box-shadow: ${({ theme }) => theme.boxShadow.light};
  color: ${({ theme }) => theme.font.color.secondary};
  cursor: pointer;
  display: flex;
  height: 30px;
  justify-content: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  z-index: 2;
  ${({ position }) => (position === 'left' ? 'left: -15px;' : 'right: -15px;')}

  &:hover {
    background: ${({ theme }) => theme.background.secondary};
    color: ${({ theme }) => theme.font.color.primary};
  }
`;

const StyledSkillCard = styled.div<{
  $bgColor: string;
  $borderColor: string;
  $accentColor: string;
}>`
  background: ${({ $bgColor }) => $bgColor};
  border: 1px solid ${({ $borderColor }) => $borderColor};
  border-left: 3px solid ${({ $accentColor }) => $accentColor};
  border-radius: 8px;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 6px;
  height: 76px;
  justify-content: center;
  padding: 12px 14px;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
  width: 180px;

  &:hover {
    box-shadow: 0 2px 8px ${({ $borderColor }) => $borderColor};
    transform: translateY(-1px);
  }
`;

const StyledSkillName = styled.div`
  color: ${({ theme }) => theme.font.color.primary};
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledSkillDescription = styled.div`
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: ${({ theme }) => theme.font.color.tertiary};
  display: -webkit-box;
  font-size: 11px;
  line-height: 1.4;
  overflow: hidden;
`;

type AnalyxCommandsBarProps = {
  skills: AnalyxCommand[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSkillClick: (skill: AnalyxCommand) => void;
  onAddSkillClick: () => void;
};

export const AnalyxCommandsBar = ({
  skills,
  searchQuery,
  onSearchChange,
  onSkillClick,
  onAddSkillClick,
}: AnalyxCommandsBarProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSearchOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchOverlayRef.current &&
        !searchOverlayRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen, onSearchChange]);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    updateScrollState();
  }, [skills, updateScrollState]);

  const handleScroll = () => {
    updateScrollState();
  };

  const scrollBy = (direction: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: direction === 'left' ? -300 : 300,
      behavior: 'smooth',
    });
  };

  const handleSearchToggle = () => {
    if (isSearchOpen) {
      setIsSearchOpen(false);
      onSearchChange('');
    } else {
      setIsSearchOpen(true);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  };

  return (
    <StyledContainer>
      <StyledActionButtons>
        <StyledActionButton onClick={handleSearchToggle}>
          <IconSearch size={15} />
        </StyledActionButton>
        <StyledActionButton onClick={onAddSkillClick}>
          <IconPlus size={15} />
        </StyledActionButton>
      </StyledActionButtons>

      <StyledScrollArea>
        {isSearchOpen && (
          <StyledSearchOverlay ref={searchOverlayRef}>
            <TextInput
              ref={searchInputRef}
              value={searchQuery}
              onChange={onSearchChange}
              placeholder="Filter commands..."
              LeftIcon={IconSearch}
              RightIcon={(props) => (
                <IconX
                  {...props}
                  color={searchQuery ? 'currentColor' : 'transparent'}
                />
              )}
              onRightIconClick={() => onSearchChange('')}
              sizeVariant="sm"
            />
          </StyledSearchOverlay>
        )}

        {canScrollLeft && (
          <StyledScrollArrow position="left" onClick={() => scrollBy('left')}>
            <IconChevronLeft size={16} />
          </StyledScrollArrow>
        )}

        <StyledScrollContainer ref={scrollRef} onScroll={handleScroll}>
          {skills.map((skill, index) => {
            const colors = SKILL_CARD_COLORS[index % SKILL_CARD_COLORS.length];
            const snippet = skill.description
              .replace(/<[^>]*>/g, ' ')
              .replace(/###?\s?/g, '')
              .replace(/\*\*/g, '')
              .replace(/^- /gm, '')
              .replace(/^\d+\.\s/gm, '')
              .replace(/\s+/g, ' ')
              .trim()
              .slice(0, 120);
            return (
              <StyledSkillCard
                key={skill.id}
                $bgColor={colors.bg}
                $borderColor={colors.border}
                $accentColor={colors.accent}
                onClick={() => onSkillClick(skill)}
              >
                <StyledSkillName>{skill.name}</StyledSkillName>
                <StyledSkillDescription>{snippet}</StyledSkillDescription>
              </StyledSkillCard>
            );
          })}
        </StyledScrollContainer>

        {canScrollRight && (
          <StyledScrollArrow position="right" onClick={() => scrollBy('right')}>
            <IconChevronRight size={16} />
          </StyledScrollArrow>
        )}
      </StyledScrollArea>
    </StyledContainer>
  );
};
