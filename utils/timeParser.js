/**
 * Parse natural language time expressions
 * @param {string} timeText - Natural language time expression
 * @returns {Date|null} - Date object or null if parsing failed
 */
function parseTime(timeText) {
  const now = new Date()
  const text = timeText.toLowerCase().trim()

  // Pattern for "in X minutes/hours/days"
  const inPattern = /^in\s+(\d+)\s+(minute|minutes|min|mins|hour|hours|hr|hrs|day|days)$/i
  const inMatch = text.match(inPattern)

  if (inMatch) {
    const amount = Number.parseInt(inMatch[1])
    const unit = inMatch[2].toLowerCase()

    if (unit.startsWith("minute") || unit.startsWith("min")) {
      return new Date(now.getTime() + amount * 60000)
    } else if (unit.startsWith("hour") || unit.startsWith("hr")) {
      return new Date(now.getTime() + amount * 3600000)
    } else if (unit.startsWith("day")) {
      return new Date(now.getTime() + amount * 86400000)
    }
  }

  // Pattern for "at X:YY AM/PM"
  const atPattern = /^at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i
  const atMatch = text.match(atPattern)

  if (atMatch) {
    let hours = Number.parseInt(atMatch[1])
    const minutes = atMatch[2] ? Number.parseInt(atMatch[2]) : 0
    const meridiem = atMatch[3] ? atMatch[3].toLowerCase() : null

    // Adjust hours for AM/PM
    if (meridiem === "pm" && hours < 12) {
      hours += 12
    } else if (meridiem === "am" && hours === 12) {
      hours = 0
    }

    const result = new Date(now)
    result.setHours(hours, minutes, 0, 0)

    // If the time is already past for today, set it for tomorrow
    if (result <= now) {
      result.setDate(result.getDate() + 1)
    }

    return result
  }

  // Pattern for "tomorrow at X:YY AM/PM"
  const tomorrowPattern = /^tomorrow(?:\s+at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?)?$/i
  const tomorrowMatch = text.match(tomorrowPattern)

  if (tomorrowMatch) {
    const result = new Date(now)
    result.setDate(result.getDate() + 1)

    if (tomorrowMatch[1]) {
      let hours = Number.parseInt(tomorrowMatch[1])
      const minutes = tomorrowMatch[2] ? Number.parseInt(tomorrowMatch[2]) : 0
      const meridiem = tomorrowMatch[3] ? tomorrowMatch[3].toLowerCase() : null

      // Adjust hours for AM/PM
      if (meridiem === "pm" && hours < 12) {
        hours += 12
      } else if (meridiem === "am" && hours === 12) {
        hours = 0
      }

      result.setHours(hours, minutes, 0, 0)
    } else {
      // Default to 9 AM if no time specified
      result.setHours(9, 0, 0, 0)
    }

    return result
  }

  return null
}

module.exports = { parseTime }

