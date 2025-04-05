const axios = require("axios")
const config = require("../config")

// Language codes for common languages
const languages = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
  ar: "Arabic",
  hi: "Hindi",
}

module.exports = {
  name: "translate",
  execute: async (ctx, bot) => {
    const args = ctx.message.text.split(" ")

    // Remove command
    args.shift()

    // Check if enough arguments
    if (args.length < 2) {
      return ctx.reply(
        `${config.emoji.translate} *Usage:* /translate [language_code] [text]

*Example:* /translate es Hello, how are you?

*Available language codes:*
${Object.entries(languages)
  .map(([code, name]) => `• ${code} - ${name}`)
  .join("\n")}`,
        { parse_mode: "Markdown" },
      )
    }

    const targetLang = args[0].toLowerCase()
    const text = args.slice(1).join(" ")

    // Validate language code
    if (!languages[targetLang]) {
      return ctx.reply(
        `${config.emoji.error} Invalid language code. Available language codes:
${Object.entries(languages)
  .map(([code, name]) => `• ${code} - ${name}`)
  .join("\n")}`,
        { parse_mode: "Markdown" },
      )
    }

    const loadingMessage = await ctx.reply(`${config.emoji.loading} Translating to ${languages[targetLang]}...`)

    try {
      // Using LibreTranslate API (free and open source)
      const response = await axios.post("https://libretranslate.de/translate", {
        q: text,
        source: "auto",
        target: targetLang,
      })

      const translatedText = response.data.translatedText

      // Delete loading message
      await ctx.deleteMessage(loadingMessage.message_id)

      // Send translation
      await ctx.replyWithMarkdown(`
${config.emoji.translate} *Translation to ${languages[targetLang]}*

*Original:*
${text}

*Translated:*
${translatedText}
`)
    } catch (error) {
      console.error("Translation API error:", error)

      // Delete loading message
      await ctx.deleteMessage(loadingMessage.message_id)

      // Send error message
      await ctx.reply(`${config.emoji.error} Failed to translate text. Please try again later.`)
    }
  },
}

