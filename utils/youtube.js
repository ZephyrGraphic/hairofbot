const ytdl = require("ytdl-core")

/**
 * Get video information from YouTube URL
 * @param {string} url - YouTube video URL
 * @returns {Promise<Object>} - Video information
 */
async function getVideoInfo(url) {
  try {
    const info = await ytdl.getInfo(url)
    return info
  } catch (error) {
    console.error("Error getting video info:", error)
    throw error
  }
}

module.exports = { getVideoInfo }

