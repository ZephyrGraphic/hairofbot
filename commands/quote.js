const axios = require("axios")
const { Markup } = require("telegraf")
const config = require("../config")

module.exports = {
  name: "quote",
  execute: async (ctx, bot) => {
    // Check if a category was specified
    const args = ctx.message.text.split(" ")
    const category = args.length > 1 ? args[1].toLowerCase() : null

    // Validate category if provided
    if (category && !config.quoteCategories.includes(category)) {
      const categoryList = config.quoteCategories.join(", ")
      return ctx.reply(`${config.emoji.warning} Invalid category. Available categories: ${categoryList}`)
    }

    // If no category specified, show category selection
    if (!category) {
      const buttons = config.quoteCategories.map((cat) =>
        Markup.button.callback(cat.charAt(0).toUpperCase() + cat.slice(1), `quote_${cat}`),
      )

      // Split buttons into rows of 2
      const keyboard = []
      for (let i = 0; i < buttons.length; i += 2) {
        keyboard.push(buttons.slice(i, i + 2))
      }

      return ctx.reply(`${config.emoji.quote} Please select a quote category:`, Markup.inlineKeyboard(keyboard))
    }

    await sendQuote(ctx, category)
  },
  actions: {
    // Dynamic action handlers for quote categories
    ...config.quoteCategories.reduce((actions, category) => {
      actions[`quote_${category}`] = async (ctx) => {
        await ctx.answerCbQuery()
        await sendQuote(ctx, category)
      }
      return actions
    }, {}),
  },
}

/**
 * Fetch and send a quote
 * @param {TelegrafContext} ctx - Telegraf context
 * @param {string} category - Quote category
 */
async function sendQuote(ctx, category) {
  const loadingMessage = await ctx.reply(`${config.emoji.loading} Fetching a ${category} quote...`)

  try {
    let quote

    if (category === "anime") {
      // Fetch anime quote
      const response = await axios.get("https://animechan.vercel.app/api/random")
      quote = {
        text: response.data.quote,
        author: response.data.character,
        source: response.data.anime,
      }
    } else {
      // Fetch general quote
      const response = await axios.get(`https://api.quotable.io/random?tags=${category}`)
      quote = {
        text: response.data.content,
        author: response.data.author,
        source: null,
      }
    }

    // Delete loading message
    await ctx.deleteMessage(loadingMessage.message_id)

    // Format quote message
    let quoteMessage = `
${config.emoji.quote} *Quote (${category})*

"${quote.text}"

— *${quote.author}*`

    if (quote.source) {
      quoteMessage += `\n*Source:* ${quote.source}`
    }

    // Send quote
    await ctx.replyWithMarkdown(quoteMessage, {
      reply_markup: {
        inline_keyboard: [[{ text: "🔄 Get Another Quote", callback_data: `quote_${category}` }]],
      },
    })
  } catch (error) {
    console.error("Quote API error:", error)

    // Delete loading message
    await ctx.deleteMessage(loadingMessage.message_id)

    // Send error message
    await ctx.reply(`${config.emoji.error} Failed to fetch a quote. Please try again later.`)
  }
}

