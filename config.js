module.exports = {
  botName: "PremiumBot",
  version: "1.0.0",

  // Command cooldowns in seconds
  cooldowns: {
    default: 3,
    ai: 5,
    ytmp3: 10,
    sticker: 5,
    tts: 5,
    reminder: 3,
    translate: 5,
  },

  // Emojis for visual hierarchy
  emoji: {
    bot: "🤖",
    welcome: "👋",
    menu: "📋",
    ai: "🧠",
    music: "🎵",
    sticker: "🖼️",
    voice: "🔊",
    group: "👥",
    reminder: "⏰",
    quote: "💭",
    translate: "🌐",
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
    loading: "⏳",
    settings: "⚙️",
  },

  // Categories for menu
  categories: {
    fun: {
      name: "Fun & Entertainment",
      emoji: "🎮",
      commands: ["ai", "quote"],
    },
    utility: {
      name: "Utility",
      emoji: "🛠️",
      commands: ["translate", "reminder", "tts"],
    },
    media: {
      name: "Media",
      emoji: "�media",
      commands: ["ytmp3", "sticker"],
    },
    info: {
      name: "Information",
      emoji: "📊",
      commands: ["groupinfo"],
    },
  },

  // Command descriptions for help menu
  commandDescriptions: {
    start: "Start the bot and get a welcome message",
    menu: "Show the main menu with all available commands",
    ai: "Chat with AI assistant (GPT)",
    ytmp3: "Convert YouTube video to MP3",
    sticker: "Convert image to Telegram sticker",
    tts: "Convert text to speech",
    groupinfo: "Get information about the current group",
    reminder: "Set a reminder",
    quote: "Get a random inspirational quote",
    translate: "Translate text to another language",
  },

  // Quote categories
  quoteCategories: ["inspirational", "anime", "motivational", "life", "success"],

  // Default language for translation
  defaultTargetLanguage: "en",
}

