import { Anthropic } from "@anthropic-ai/sdk"

export type ToolDefinition = {
  name: string
  description: string
  input_schema: Anthropic.Tool.InputSchema
  func: (args: any) => Promise<string> | string
}

export type ServerTool = Anthropic.WebSearchTool20260318
export type AnyTool = ServerTool | ToolDefinition

export const isServerTool = (tool: AnyTool): tool is ServerTool =>
  "type" in tool
