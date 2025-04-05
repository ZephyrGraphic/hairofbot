const { Markup } = require("telegraf")
const config = require("../config")

module.exports = {
  name: "menu",
  execute: async (ctx, bot) => {
    const menuMessage = `
${config.emoji.menu} *${config.botName} Menu*

Here are all the available commands:
`

    const buttons = []

    // Create buttons for each category
    for (const [categoryKey, category] of Object.entries(config.categories)) {
      const categoryButtons = []

      // Add header for this category
      buttons.push([Markup.button.callback(`${category.emoji} ${category.name}`, `category_${categoryKey}`)])

      // Add command buttons for this category
      for (const commandName of category.commands) {
        const emoji = config.emoji[commandName] || "🔹"
        const description = config.commandDescriptions[commandName] || ""
        categoryButtons.push(Markup.button.callback(`${emoji} /${commandName}`, `cmd_info_${commandName}`))
      }

      // Add all command buttons for this category
      buttons.push(categoryButtons)
    }

    const keyboard = Markup.inlineKeyboard(buttons)

    await ctx.replyWithMarkdown(menuMessage, keyboard)
  },
  actions: {
    // Dynamic action handlers for command info
    ...Object.keys(config.commandDescriptions).reduce((actions, cmd) => {
      actions[`cmd_info_${cmd}`] = async (ctx) => {
        const emoji = config.emoji[cmd] || "🔹"
        const description = config.commandDescriptions[cmd]

        await ctx.answerCbQuery(`${emoji} /${cmd}: ${description}`)
      }
      return actions
    }, {}),
  },
}

