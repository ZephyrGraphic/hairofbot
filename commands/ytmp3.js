const ytdl = require("ytdl-core")
const fs = require("fs")
const path = require("path")
const config = require("../config")
const { getVideoInfo } = require("../utils/youtube")

module.exports = {
  name: "ytmp3",
  execute: async (ctx, bot) => {
    const url = ctx.message.text.substring(7).trim()

    if (!url) {
      return ctx.reply(`${config.emoji.music} Please provide a YouTube URL after /ytmp3 command.`)
    }

    // Validate YouTube URL
    if (!ytdl.validateURL(url)) {
      return ctx.reply(`${config.emoji.error} Invalid YouTube URL. Please provide a valid YouTube video link.`)
    }

    const loadingMessage = await ctx.reply(`${config.emoji.loading} Downloading audio from YouTube...`)

    try {
      // Get video info
      const videoInfo = await getVideoInfo(url)
      const title = videoInfo.videoDetails.title
      const sanitizedTitle = title.replace(/[^\w\s]/gi, "").substring(0, 32)

      // Create temp directory if it doesn't exist
      const tempDir = path.join(__dirname, "../temp")
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir)
      }

      // Set file paths
      const audioPath = path.join(tempDir, `${sanitizedTitle}.mp3`)

      // Download audio
      const audioStream = ytdl(url, {
        quality: "highestaudio",
        filter: "audioonly",
      })

      const writeStream = fs.createWriteStream(audioPath)

      audioStream.pipe(writeStream)

      writeStream.on("finish", async () => {
        // Delete loading message
        await ctx.deleteMessage(loadingMessage.message_id)

        // Send audio file
        await ctx.replyWithAudio(
          { source: audioPath },
          {
            caption: `${config.emoji.music} *${title}*\n\nDownloaded via ${config.botName}`,
            parse_mode: "Markdown",
          },
        )

        // Delete temp file
        fs.unlinkSync(audioPath)
      })

      writeStream.on("error", async (err) => {
        console.error("Error writing audio file:", err)

        // Delete loading message
        await ctx.deleteMessage(loadingMessage.message_id)

        // Send error message
        await ctx.reply(`${config.emoji.error} Failed to download audio. Please try again later.`)
      })
    } catch (error) {
      console.error("YouTube download error:", error)

      // Delete loading message
      await ctx.deleteMessage(loadingMessage.message_id)

      // Send error message
      await ctx.reply(`${config.emoji.error} Failed to download audio. Please try again later.`)
    }
  },
}

