import { Anthropic } from "@anthropic-ai/sdk"
import * as readline from "readline/promises"
import { Agent } from "./agent.js"
import tools from "./agent/tools/index.js"
import 'dotenv/config'

main()

async function main() {
  const client = new Anthropic({apiKey: process.env.ANTHROPIC_API_KEY})

  const agent = new Agent(
    client,
    getUserMessage,
    getToolConsent,
    showAgentMessage,
    tools,
  )

  try {
    await agent.run()
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.log("Exiting…")
    } else {
      throw error
    }
  }
}

async function getUserMessage(): Promise<string> {
  // Create readline interface for user input
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  // Prompt user for input
  const userMessage = await rl.question("\u001b[94mYou\u001b[0m: ")

  // Close the readline interface
  rl.close()

  return userMessage
}

async function getToolConsent(toolDescription: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const consent = await rl.question(
    `\n\u001b[92mTool request\u001b[0m: ${toolDescription}\n` +
      "\u001b[93mClaude\u001b[0m: Do you want to continue? [yes]: ",
  )

  rl.close()

  return consent === "" || consent.toLowerCase() === "yes"
}

function showAgentMessage(message: string): void {
  console.log(`\n\u001b[93mClaude to ME\u001b[0m: ${message}\n`)
}
