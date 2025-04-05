const { Configuration, OpenAIApi } = require("openai")
const config = require("../config")

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

module.exports = {
  name: "ai",
  execute: async (ctx, bot) => {
    const prompt = ctx.message.text.substring(4).trim()

    if (!prompt) {
      return ctx.reply(`${config.emoji.ai} Please provide a prompt after /ai command.`)
    }

    const loadingMessage = await ctx.reply(`${config.emoji.loading} Thinking...`)

    try {
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful, friendly assistant. Keep responses concise and engaging." },
          { role: "user", content: prompt },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      })

      const answer = response.data.choices[0].message.content.trim()

      // Delete the loading message
      await ctx.deleteMessage(loadingMessage.message_id)

      // Send the AI response
      await ctx.replyWithMarkdown(`${config.emoji.ai} *AI Response:*\n\n${answer}`)
    } catch (error) {
      console.error("OpenAI API Error:", error)

      // Delete the loading message
      await ctx.deleteMessage(loadingMessage.message_id)

      // Send error message
      await ctx.reply(`${config.emoji.error} Sorry, I couldn't process your request. Please try again later.`)
    }
  },
}

