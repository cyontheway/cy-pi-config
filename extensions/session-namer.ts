/**
 * Session Namer — 自动命名 session
 * 格式：YYMMDD <名字>（日期从 session 第一行提取）
 *
 * 命名语义：session 名 = 整段 session 的定名（这一段时间做的固定事项），
 * 不是当前话题名。一个 session 只在未命名时起一次名，此后冻结。
 *
 * 稳定性规则：
 *   - 已有名称时 name_session 直接跳过（硬拦截），不覆盖
 *   - 只有用户本轮消息明确要求改名，AI 才可传 force: true
 *   - 用户手动 /name 或 --name 设的名字同样视为已有名，不被自动覆盖
 */
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { readFileSync } from "node:fs";

// ── 日期提取 ────────────────────────────────────────────

/** 从 session 文件第一行（session header）提取开始日期，格式 YYMMDD */
function sessionStartYYMMDD(sessionFile: string | undefined): string {
  const fallback = (): string => {
    const d = new Date();
    const yy = String(d.getFullYear()).slice(2);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yy}${mm}${dd}`;
  };

  if (!sessionFile) return fallback();
  try {
    const firstLine = readFileSync(sessionFile, "utf-8").split("\n")[0];
    if (firstLine) {
      const header = JSON.parse(firstLine);
      if (header.timestamp) {
        const d = new Date(header.timestamp);
        const yy = String(d.getFullYear()).slice(2);
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yy}${mm}${dd}`;
      }
    }
  } catch {
    // 解析失败，fallback 到当天
  }
  return fallback();
}

// ── 构造名字 ────────────────────────────────────────────

function buildName(datePrefix: string, topic?: string): string {
  if (topic && topic.trim()) {
    return `${datePrefix} ${topic.trim()}`;
  }
  return datePrefix;
}

// ── Extension 入口 ─────────────────────────────────────

export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "name_session",
    label: "命名 Session",
    description:
      `给当前 session 起名（格式 YYMMDD <名字>，日期前缀自动添加）。` +
      `session 名 = 整段 session 的定名（如"合同审查""标签标准化"）。` +
      `已有名称时本工具直接跳过，不覆盖；仅当用户明确要求改名时才传 force: true。`,
    promptSnippet:
      "给未命名的 session 起一个整段定名（仅限未命名时，用户不参与）；已有名字时不要调用。",
    promptGuidelines: [
      "session 名 = 整段 session 的定名（这一段时间在做的那件事），不是当前话题名。话题漂移不改名。",
      "只在当前 session 未命名时调用 name_session，一生只起一次；上下文没显示名字也不代表可以重命名，不确定就不动。",
      "起名时传一个简短有意义的描述（2-8字中文，如「合同审查」「标签标准化」），一眼看懂是什么，不要用文件名/skill名/产品名。",
      "force: true 仅当用户在本轮消息里明确说出「改 session 名字」「重命名」时才可传；自己觉得该改 ≠ 用户要改。",
    ],
    parameters: Type.Object({
      name: Type.Optional(
        Type.String({
          description:
            "简短有意义的中文描述，2-8 字。例如：合同审查、标签标准化。不要文件名/skill名/产品名。不传则只显示日期。",
        }),
      ),
      force: Type.Optional(
        Type.Boolean({
          description:
            "仅在用户明确要求修改 session 名称时传 true。默认 false：已有名称时不覆盖。",
        }),
      ),
    }),

    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      // 硬拦截：已有名称时，除非用户明确要求（force），否则不覆盖
      const existing = ctx.sessionManager?.getSessionName?.();
      if (existing && !params.force) {
        return {
          content: [
            {
              type: "text",
              text: `Session 已有名称「${existing}」，按规则不覆盖。如确需改名，请在用户明确要求后传 force: true。`,
            },
          ],
          details: { skipped: true, name: existing },
        };
      }

      const sessionFile = ctx.sessionManager?.getSessionFile();
      const datePrefix = sessionStartYYMMDD(sessionFile);
      const fullName = buildName(datePrefix, params.name);

      pi.setSessionName(fullName);
      return {
        content: [{ type: "text", text: `Session 已命名为：${fullName}` }],
        details: { name: fullName },
      };
    },
  });
}
