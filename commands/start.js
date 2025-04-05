const { Markup } = require("telegraf")
const config = require("../config")

module.exports = {
  name: "start",
  execute: async (ctx, bot) => {
    const user = ctx.from
    const firstName = user.first_name

    const welcomeMessage = `
${config.emoji.welcome} *Welcome to ${config.botName}*, ${firstName}!

I'm a feature-rich Telegram bot that can help you with various tasks.

${config.emoji.info} *Version:* ${config.version}
${config.emoji.bot} *Created by:* Your Name

Use /menu to see all available commands and features.
`

    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback("📋 Show Menu", "show_menu")],
      [Markup.button.url("👨‍💻 Developer", "https://t.me/yourusername")],
    ])

    await ctx.replyWithMarkdown(welcomeMessage, keyboard)
  },
  actions: {
    show_menu: async (ctx, bot) => {
      const menuCommand = require("./menu")
      await menuCommand.execute(ctx, bot)
    },
  },
}

