export type AgentStreamingEvent = {
  type: 'text-delta' | 'tool-call' | 'tool-result' | 'step-start' | 'step-finish' | 'finish' | 'error';
  message: string;
};

export type AgentStreamingParserCallbacks = {
  onTextDelta?: (message: string) => void;
  onToolCall?: (message: string) => void;
  onToolResult?: (message: string) => void;
  onStepStart?: (message: string) => void;
  onStepFinish?: (message: string) => void;
  onFinish?: (message: string) => void;
  onError?: (message: string) => void;
  onParseError?: (error: Error, rawLine: string) => void;
};

export const parseAgentStreamingChunk = (
  chunk: string,
  callbacks: AgentStreamingParserCallbacks,
): void => {
  const lines = chunk.split('\n');

  for (const line of lines) {
    if (line.trim() !== '') {
      try {
        const event = JSON.parse(line) as AgentStreamingEvent;

        switch (event.type) {
          case 'text-delta':
            callbacks.onTextDelta?.(event.message);
            break;
          case 'tool-call':
            callbacks.onToolCall?.(event.message);
            break;
          case 'tool-result':
            callbacks.onToolResult?.(event.message);
            break;
          case 'step-start':
            callbacks.onStepStart?.(event.message);
            break;
          case 'step-finish':
            callbacks.onStepFinish?.(event.message);
            break;
          case 'finish':
            callbacks.onFinish?.(event.message);
            break;
          case 'error':
            callbacks.onError?.(event.message);
            break;
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to parse stream event:', error);

        const errorMessage =
          error instanceof Error
            ? error
            : new Error(`Unknown parsing error: ${String(error)}`);
        callbacks.onParseError?.(errorMessage, line);
      }
    }
  }
};
