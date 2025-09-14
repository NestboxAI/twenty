export interface McpServerConfig {
  id: string;
  url: string;
  name: string;
  version: string;
  description: string;
}

export const MCP_SERVER_CONFIGS: Record<string, McpServerConfig> = {
  'demo-mcp-1': {
    id: 'demo-mcp-1',
    'url': "https://url-mcp-demo.sshh.io/sse?config=eyJzZXJ2ZXJJbmZvIjp7Im5hbWUiOiJEZW1vIE1DUCIsInZlcnNpb24iOiIxLjAuMCJ9LCJ0b29scyI6W3sibmFtZSI6IldlYXRoZXIgY2hlY2siLCJkZXNjcmlwdGlvbiI6IkNoZWNrIHdlYXRoZXIiLCJpbnB1dFNjaGVtYSI6eyJ0eXBlIjoib2JqZWN0IiwicHJvcGVydGllcyI6eyJsYXRpdHVkZSI6eyJ0eXBlIjoibnVtYmVyIiwiZGVzY3JpcHRpb24iOiJMYXRpdHVkZSBvZiB0aGUgbG9jYXRpb24ifSwibG9uZ2l0dWRlIjp7InR5cGUiOiJudW1iZXIiLCJkZXNjcmlwdGlvbiI6IkxvbmdpdHVkZSBvZiB0aGUgbG9jYXRpb24ifX0sInJlcXVpcmVkIjpbImxhdGl0dWRlIiwibG9uZ2l0dWRlIl19LCJyZXNwb25zZVR5cGUiOiJlbmRwb2ludCIsImVuZHBvaW50IjoiaHR0cHM6Ly9hcGkub3Blbi1tZXRlby5jb20vdjEvZm9yZWNhc3Q%2FbGF0aXR1ZGU9e3tsYXRpdHVkZX19JmxvbmdpdHVkZT17e2xvbmdpdHVkZX19JmN1cnJlbnRfd2VhdGhlcj10cnVlIn1dfQ%3D%3D",
    name: 'Weather MCP tool',
    version: '1.0.0',
    description: 'Weather MCP tool',
  },
  // Example: Add more MCP servers here
  'demo-mcp-2': {
    id: 'demo-mcp-2',
    url: 'https://url-mcp-demo.sshh.io/sse?config=eyJzZXJ2ZXJJbmZvIjp7Im5hbWUiOiJEZW1vIE1DUCIsInZlcnNpb24iOiIxLjAuMCJ9LCJ0b29scyI6W3sibmFtZSI6IkNvdW50cnkgaW5mb3JtYXRpb24iLCJkZXNjcmlwdGlvbiI6IkdldCBpbmZvIGFib3V0IGNvdW50cmllcyAocG9wdWxhdGlvbiwgY3VycmVuY3ksIGxhbmd1YWdlcywgZXRjLikiLCJpbnB1dFNjaGVtYSI6eyJ0eXBlIjoib2JqZWN0IiwicHJvcGVydGllcyI6eyJjb3VudHJ5Ijp7InR5cGUiOiJzdHJpbmcifX0sInJlcXVpcmVkIjpbImNvdW50cnkiXX0sInJlc3BvbnNlVHlwZSI6ImVuZHBvaW50IiwiZW5kcG9pbnQiOiJodHRwczovL3Jlc3Rjb3VudHJpZXMuY29tL3YzLjEvbmFtZS97e2NvdW50cnl9fSJ9XX0%3D',
    name: 'Country Info MCP tool',
    version: '1.0.0',
    description: 'Country Info MCP tool',
  },
} as const;

export type McpServerId = keyof typeof MCP_SERVER_CONFIGS;
