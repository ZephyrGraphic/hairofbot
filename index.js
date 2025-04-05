require("dotenv").config()
const { Telegraf, session } = require("telegraf")
const fs = require("fs")
const path = require("path")
const config = require("./config")
const { setupMiddleware } = require("./utils/middleware")

// Initialize bot with token from environment variables
const bot = new Telegraf(process.env.BOT_TOKEN)

// Set up session middleware for user data persistence
bot.use(session({ defaultSession: () => ({ cooldowns: {} }) }))

// Set up custom middleware (cooldown, logging, etc.)
setupMiddleware(bot)

// Dynamically load all command modules
const commandsPath = path.join(__dirname, "commands")
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"))

// Register all commands
for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file))

  if (command.name && command.execute) {
    console.log(`🔄 Loading command: ${command.name}`)

    // Register command handler
    if (command.pattern) {
      // For regex-based commands
      bot.hears(command.pattern, (ctx) => command.execute(ctx, bot))
    } else {
      // For standard commands
      bot.command(command.name, (ctx) => command.execute(ctx, bot))
    }

    // Register action handlers if any
    if (command.actions) {
      for (const [actionName, handler] of Object.entries(command.actions)) {
        bot.action(actionName, (ctx) => handler(ctx, bot))
      }
    }
  }
}

// Handle photos with caption for sticker command
bot.on("photo", (ctx) => {
  const caption = ctx.message.caption
  if (caption && caption.startsWith("/sticker")) {
    const stickerCommand = require("./commands/sticker")
    stickerCommand.execute(ctx, bot)
  }
})

// Handle unknown commands
bot.on("text", (ctx) => {
  const text = ctx.message.text
  if (text.startsWith("/")) {
    const command = text.split(" ")[0].substring(1).split("@")[0]
    const commandFile = commandFiles.find((file) => {
      const cmd = require(path.join(commandsPath, file))
      return cmd.name === command
    })

    if (!commandFile) {
      ctx.reply(`${config.emoji.error} Command not found. Try /menu to see available commands.`)
    }
  }
})

// Start the bot
bot
  .launch({ polling: true })
  .then(() => {
    console.log(`🚀 ${config.botName} is running!`)
  })
  .catch((err) => {
    console.error("❌ Error starting bot:", err)
  })

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))

