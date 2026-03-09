const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");
const { useAgent } = require("@nestbox-ai/functions");

const PLUGIN_NAME = "{{PLUGIN_NAME}}";
const PLUGIN_PATH = path.resolve(__dirname, "claude-plugin");
const SHARED_PLUGIN_PATH = `/shared/plugins/${PLUGIN_NAME}`;

function ensurePluginOnSharedVolume() {
  try {
    if (fs.existsSync(PLUGIN_PATH)) {
      fs.mkdirSync(path.dirname(SHARED_PLUGIN_PATH), { recursive: true });
      execSync(
        `rm -rf "${SHARED_PLUGIN_PATH}" && cp -r "${PLUGIN_PATH}" "${SHARED_PLUGIN_PATH}"`,
        { stdio: "ignore" }
      );
      return SHARED_PLUGIN_PATH;
    }
  } catch (_) { /* Shared volume not available — fall back to local */ }
  return PLUGIN_PATH;
}

const resolvedPluginPath = ensurePluginOnSharedVolume();

const VALID_OUTPUT_FORMATS = new Set(["docx", "pptx", "xlsx"]);

const workspaceAgent = useAgent(async (context, events) => {
  const {
    prompt, session_id, fork_session_id,
    model = "claude-opus-4-6", system_prompt,
    max_turns = 5, allowed_tools,
    permission_mode = "acceptEdits", mcp_config,
    claude_options, hooks, workspace_source_path,
    attachments, input_files, timeout_seconds,
    terminate_after = true, max_budget_usd, output_format,
  } = context.params;

  try {
    let dispatchedPrompt = session_id
      ? prompt
      : addGoCommandIfMissing(prompt);

    if (output_format && VALID_OUTPUT_FORMATS.has(output_format)) {
      dispatchedPrompt += `\n\n[OUTPUT_FORMAT: ${output_format}]`;
    }

    // Download input files to shared volume (bypass gRPC 4MB limit)
    const fileAttachments = [];
    if (input_files && input_files.length) {
      const stagingDir = `/shared/staging/input-files-${context.queryId}`;
      fs.mkdirSync(stagingDir, { recursive: true });
      for (const file of input_files) {
        try {
          const response = await fetch(file.url);
          if (!response.ok) continue;
          const buffer = Buffer.from(await response.arrayBuffer());
          const filePath = path.join(stagingDir, file.filename);
          fs.writeFileSync(filePath, buffer);
          fileAttachments.push({ filename: file.filename, filePath, mime_type: file.mime_type });
        } catch (_) { /* skip failed downloads */ }
      }
    }

    const base64Attachments = (attachments || []).map((a) => ({
      filename: a.filename, content: a.content, mimeType: a.mime_type,
    }));
    const pathAttachments = fileAttachments.map((a) => ({
      filename: a.filename, filePath: a.filePath, mimeType: a.mime_type,
    }));
    const allAttachments = [...base64Attachments, ...pathAttachments];

    const claudeParams = {
      prompt: dispatchedPrompt,
      model,
      maxTurns: Math.max(max_turns, 50),
      terminateSession: terminate_after && !session_id,
    };

    if (session_id) claudeParams.resumeSessionId = session_id;
    else if (fork_session_id) claudeParams.forkSessionId = fork_session_id;
    if (system_prompt) claudeParams.systemPrompt = system_prompt;
    if (allowed_tools && allowed_tools.length) claudeParams.allowedTools = allowed_tools;
    if (permission_mode) claudeParams.permissionMode = permission_mode;
    if (mcp_config) claudeParams.mcpConfig = mcp_config;

    const pluginEntry = { type: "local", path: resolvedPluginPath };
    claudeParams.claudeOptions = { ...(claude_options || {}), plugins: [pluginEntry] };

    const settingsJson = JSON.stringify({ plugins: [pluginEntry] });
    claudeParams.initialWorkspaceFiles = [{
      filename: ".claude/settings.json",
      content: Buffer.from(settingsJson).toString("base64"),
      mimeType: "application/json",
    }];
    if (hooks) claudeParams.hooks = {
      auditTools: hooks.audit_tools, blockDangerousBash: hooks.block_dangerous_bash,
    };
    if (workspace_source_path) claudeParams.workspaceSourcePath = workspace_source_path;
    if (allAttachments.length > 0) claudeParams.attachments = allAttachments;
    claudeParams.timeoutSeconds = Math.max(timeout_seconds || 900, 1200);
    claudeParams.maxBudgetUsd = max_budget_usd || 10;

    await context.claudeAgent.start(claudeParams, {
      agentCompleted: (result) => events.emitQueryCompleted({ data: result }),
      agentFailed: (error) => events.emitQueryFailed({ data: error }),
    });
  } catch (err) {
    await events.emitQueryFailed({ data: { error: err.message } });
  }
});

function addGoCommandIfMissing(prompt) {
  if (prompt.trim().startsWith("/")) {
    const firstSpaceIdx = prompt.trim().indexOf(" ");
    const firstWord = firstSpaceIdx === -1
      ? prompt.trim()
      : prompt.trim().substring(0, firstSpaceIdx);
    if (!firstWord.includes(":")) {
      const command = firstWord.substring(1);
      return prompt.replace(firstWord, `/${PLUGIN_NAME}:${command}`);
    }
  }
  return `/${PLUGIN_NAME}:go ${prompt}`;
}

module.exports = { workspaceAgent };
