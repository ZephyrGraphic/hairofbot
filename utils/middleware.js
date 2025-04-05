const config = require("../config")
const { logCommand } = require("./logger")

/**
 * Sets up all middleware for the bot
 * @param {Telegraf} bot - The Telegraf bot instance
 */
function setupMiddleware(bot) {
  // Logging middleware
  bot.use((ctx, next) => {
    logCommand(ctx)
    return next()
  })

  // Cooldown middleware
  bot.use((ctx, next) => {
    if (!ctx.message || !ctx.message.text || !ctx.message.text.startsWith("/")) {
      return next()
    }

    const command = ctx.message.text.split(" ")[0].substring(1).split("@")[0]
    const userId = ctx.from.id

    // Skip cooldown check for /start command
    if (command === "start") {
      return next()
    }

    // Get cooldown time for this command
    const cooldownTime = config.cooldowns[command] || config.cooldowns.default

    // Check if user is on cooldown
    if (!ctx.session.cooldowns) {
      ctx.session.cooldowns = {}
    }

    const now = Date.now()
    const userCooldowns = ctx.session.cooldowns

    if (userCooldowns[command] && userCooldowns[command] > now) {
      const timeLeft = Math.ceil((userCooldowns[command] - now) / 1000)
      ctx
        .reply(`${config.emoji.warning} Please wait ${timeLeft} seconds before using this command again.`)
        .then((message) => {
          // Delete the cooldown message after the cooldown period
          setTimeout(() => {
            ctx.deleteMessage(message.message_id).catch(() => {})
          }, timeLeft * 1000)
        })
      return
    }

    // Set cooldown
    userCooldowns[command] = now + cooldownTime * 1000

    return next()
  })
}

module.exports = { setupMiddleware }

