const sharp = require("sharp")
const axios = require("axios")
const fs = require("fs")
const path = require("path")
const config = require("../config")

module.exports = {
  name: "sticker",
  execute: async (ctx, bot) => {
    // Check if command was sent with a photo
    if (!ctx.message.photo && !ctx.message.reply_to_message?.photo) {
      return ctx.reply(
        `${config.emoji.sticker} Please send a photo with the caption /sticker or reply to a photo with /sticker.`,
      )
    }

    const loadingMessage = await ctx.reply(`${config.emoji.loading} Creating sticker...`)

    try {
      // Get photo (either from the message or the replied message)
      const photo = ctx.message.photo || ctx.message.reply_to_message.photo
      const fileId = photo[photo.length - 1].file_id // Get the highest quality photo

      // Get file path
      const file = await ctx.telegram.getFile(fileId)
      const fileUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`

      // Create temp directory if it doesn't exist
      const tempDir = path.join(__dirname, "../temp")
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir)
      }

      // Download image
      const response = await axios({
        method: "GET",
        url: fileUrl,
        responseType: "arraybuffer",
      })

      const imagePath = path.join(tempDir, `sticker_${Date.now()}.png`)

      // Process image with sharp
      await sharp(response.data)
        .resize(512, 512, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .toFile(imagePath)

      // Delete loading message
      await ctx.deleteMessage(loadingMessage.message_id)

      // Send as sticker
      await ctx.replyWithSticker({ source: imagePath })

      // Delete temp file
      fs.unlinkSync(imagePath)
    } catch (error) {
      console.error("Sticker creation error:", error)

      // Delete loading message
      await ctx.deleteMessage(loadingMessage.message_id)

      // Send error message
      await ctx.reply(`${config.emoji.error} Failed to create sticker. Please try again later.`)
    }
  },
}

