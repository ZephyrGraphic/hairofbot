/**
 * Logs command usage to console
 * @param {TelegrafContext} ctx - The Telegraf context
 */
function logCommand(ctx) {
  if (!ctx.message || !ctx.message.text) return

  const text = ctx.message.text
  if (!text.startsWith("/")) return

  const command = text.split(" ")[0]
  const args = text.substring(command.length).trim()

  const user = ctx.from
  const username = user.username ? `@${user.username}` : `${user.first_name} ${user.last_name || ""}`.trim()
  const userId = user.id

  const chatType = ctx.chat.type
  const chatId = ctx.chat.id
  const chatTitle = ctx.chat.title || "Private Chat"

  console.log(
    `[${new Date().toISOString()}] ${command} ${args ? `(${args})` : ""} - User: ${username} (${userId}) - Chat: ${chatTitle} (${chatId}) [${chatType}]`,
  )
}

module.exports = { logCommand }

