import { type FileNode } from '../OperatingModelTypes';

const HOOKS_JSON_CONTENT = `{
  "description": "PE/VC financial research quality hooks",
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "prompt",
            "prompt": "You are a PE/VC financial report quality checker. Review the content about to be written or edited. Check for:\\n\\n1. Financial figures without an as-of date\\n2. Monetary values without currency labels\\n3. Return figures without gross/net designation\\n4. Performance metrics without confidence level\\n5. Percentage values that seem unreasonable\\n\\nRespond with a brief warning if issues found, or approve if clean."
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "prompt",
            "prompt": "You are a PE/VC data provenance checker. Review the content that was just written or edited. Verify:\\n\\n1. Any stated facts or figures have source attribution\\n2. Data from external sources has provenance tags\\n3. No data appears to be fabricated\\n\\nRespond with a brief note about provenance coverage."
          }
        ]
      },
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "prompt",
            "prompt": "You are a PE/VC computation sanity checker. If the bash command was a financial calculation, review:\\n\\n1. TVPI should approximately equal DPI + RVPI\\n2. IRR should be in a reasonable range (-50% to +100%)\\n3. DPI and RVPI should be non-negative\\n\\nRespond with a brief sanity check result."
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "You are a PE/VC research completeness checker. Before the session ends, verify:\\n\\n1. All ACSR phases present\\n2. Critical data gaps acknowledged\\n3. A final output file exists\\n4. The repeat-decision scorecard shows adequate completeness\\n\\nRespond with a brief research completeness summary."
          }
        ]
      }
    ]
  }
}`;

export const HOOK_STUBS: FileNode[] = [
  {
    id: 'hooks-json',
    name: 'hooks.json',
    path: 'hooks/hooks.json',
    type: 'file',
    format: 'json',
    validationStatus: 'ok',
    lastEdited: '2025-12-06T12:00:00Z',
    content: HOOKS_JSON_CONTENT,
  },
];
