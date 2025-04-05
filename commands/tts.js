const googleTTS = require("google-tts-api")
const fs = require("fs")
const path = require("path")
const axios = require("axios")
const config = require("../config")

module.exports = {
  name: "tts",
  execute: async (ctx, bot) => {
    const text = ctx.message.text.substring(5).trim()

    if (!text) {
      return ctx.reply(`${config.emoji.voice} Please provide text after /tts command.`)
    }

    if (text.length > 200) {
      return ctx.reply(`${config.emoji.warning} Text is too long. Please limit to 200 characters.`)
    }

    const loadingMessage = await ctx.reply(`${config.emoji.loading} Converting text to speech...`)

    try {
      // Get TTS URL
      const url = googleTTS.getAudioUrl(text, {
        lang: "en",
        slow: false,
        host: "https://translate.google.com",
      })

      // Create temp directory if it doesn't exist
      const tempDir = path.join(__dirname, "../temp")
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir)
      }

      // Download audio
      const response = await axios({
        method: "GET",
        url: url,
        responseType: "arraybuffer",
      })

      const audioPath = path.join(tempDir, `tts_${Date.now()}.mp3`)
      fs.writeFileSync(audioPath, response.data)

      // Delete loading message
      await ctx.deleteMessage(loadingMessage.message_id)

      // Send audio
      await ctx.replyWithVoice({ source: audioPath }, { caption: `${config.emoji.voice} Text to Speech` })

      // Delete temp file
      fs.unlinkSync(audioPath)
    } catch (error) {
      console.error("TTS error:", error)

      // Delete loading message
      await ctx.deleteMessage(loadingMessage.message_id)

      // Send error message
      await ctx.reply(`${config.emoji.error} Failed to convert text to speech. Please try again later.`)
    }
  },
}

