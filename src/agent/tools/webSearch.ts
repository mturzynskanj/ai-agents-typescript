import Anthropic from "@anthropic-ai/sdk"
import { ServerTool } from "../types.js"

export const webSearchTool: ServerTool = {
  type: "web_search_20260318",
  name: "web_search",
  max_uses: 5,
}
