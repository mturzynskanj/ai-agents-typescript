// export const get_current_datetime(date_format"%Y-%m-%d %H:%M:%S")

import { ToolDefinition } from "../types.js"
import { format } from "date-fns"

export const getCurrentDateTimeTool: ToolDefinition = {
  name: "current_date_time",
  description: "Retrieve current date and time in current time zone",
  input_schema: {
    type: "object",
    properties: {
      format_string: {
        type: "string",
        description: "The format string for the date and time",
        default: "yyyy-MM-dd HH:mm:ss",
      },
    },
  },
  func: async (input: { format_string?: string } = {}) => {
    return format(new Date(), input.format_string ?? "yyyy-MM-dd HH:mm:ss")
  },
}
