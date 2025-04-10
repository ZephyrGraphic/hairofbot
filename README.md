# Premium Telegram Bot

A feature-rich, modular, and scalable Telegram bot built with Node.js and the Telegraf library. This bot provides a premium-style experience while being completely free to use and hostable on platforms like Replit or Render.

## 🌟 Features

- 🤖 **Premium-level command experience** with rich formatting and interactive elements
- 📦 **Modular structure** for easy maintenance and extensibility
- 🔄 **Works entirely using polling** (no webhooks required)
- 🔰 **Beginner-friendly yet production-ready**
- 🔒 **Built-in security features** like cooldown system to prevent abuse
- 📱 **Works in both private chats and groups**

## 📋 Available Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `/start` | Start the bot and get a welcome message | `/start` |
| `/menu` | Show the main menu with all available commands | `/menu` |
| `/ai [prompt]` | Chat with AI assistant (GPT) | `/ai What is the capital of France?` |
| `/ytmp3 [URL]` | Convert YouTube video to MP3 | `/ytmp3 https://www.youtube.com/watch?v=dQw4w9WgXcQ` |
| `/sticker` | Convert image to Telegram sticker | Send photo with caption `/sticker` |
| `/tts [text]` | Convert text to speech | `/tts Hello world` |
| `/groupinfo` | Get information about the current group | `/groupinfo` |
| `/reminder` | Set a reminder | `/reminder` (follows interactive dialog) |
| `/quote` | Get a random inspirational quote | `/quote` or `/quote motivational` |
| `/translate [lang] [text]` | Translate text to another language | `/translate es Hello, how are you?` |

## 🚀 Quick Start Guide

### Prerequisites

- Node.js 16.x or higher
- A Telegram Bot Token (get from [@BotFather](https://t.me/BotFather))
- OpenAI API Key (for AI command)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/premium-telegram-bot.git
   cd premium-telegram-bot
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   \`\`\`
   BOT_TOKEN=your_telegram_bot_token
   OPENAI_API_KEY=your_openai_api_key
   \`\`\`

4. **Start the bot**
   \`\`\`bash
   npm start
   \`\`\`

## 🛠️ Deployment Options

### Replit

1. Create a new Replit project
2. Import this repository
3. Add environment variables in the Secrets tab:
   - `BOT_TOKEN`
   - `OPENAI_API_KEY`
4. Run the bot with `npm start`
5. Set up a monitoring service like [UptimeRobot](https://uptimerobot.com/) to ping your Replit URL every 5 minutes to keep it running

### Render

1. Create a new Web Service on Render
2. Connect your repository
3. Add environment variables:
   - `BOT_TOKEN`
   - `OPENAI_API_KEY`
4. Set the build command: `npm install`
5. Set the start command: `npm start`
6. Deploy the service

## 📂 Project Structure

\`\`\`
premium-telegram-bot/
├── commands/           # Command handlers
│   ├── ai.js           # AI chat command
│   ├── groupinfo.js    # Group info command
│   ├── menu.js         # Menu command
│   ├── quote.js        # Quote command
│   ├── reminder.js     # Reminder command
│   ├── start.js        # Start command
│   ├── sticker.js      # Sticker command
│   ├── translate.js    # Translation command
│   ├── tts.js          # Text-to-speech command
│   └── ytmp3.js        # YouTube to MP3 command
├── utils/              # Utility functions
│   ├── logger.js       # Logging utility
│   ├── middleware.js   # Bot middleware
│   ├── timeParser.js   # Time parsing for reminders
│   └── youtube.js      # YouTube utilities
├── temp/               # Temporary files (created at runtime)
├── .env                # Environment variables
├── .env.example        # Example environment variables
├── .gitignore          # Git ignore file
├── config.js           # Bot configuration
├── index.js            # Main entry point
├── package.json        # Project dependencies
└── README.md           # Project documentation
\`\`\`

## 🔧 Customization

### Modifying Bot Configuration

You can customize various aspects of the bot by editing the `config.js` file:

- **Bot Name**: Change the `botName` property
- **Emojis**: Modify the `emoji` object to change the emojis used in messages
- **Cooldowns**: Adjust the `cooldowns` object to change command cooldown times
- **Command Descriptions**: Update the `commandDescriptions` object for menu display
- **Categories**: Modify the `categories` object to reorganize commands

### Adding New Commands

1. Create a new file in the `commands` folder (e.g., `weather.js`)
2. Use the following template:

\`\`\`js
const config = require('../config');

module.exports = {
  name: 'weather', // Command name without the slash
  execute: async (ctx, bot) => {
    // Your command logic here
    const args = ctx.message.text.split(' ').slice(1).join(' ');
    
    if (!args) {
      return ctx.reply(`${config.emoji.warning} Please provide a location.`);
    }
    
    // Process the command...
    await ctx.reply(`${config.emoji.success} Weather for ${args}: Sunny, 25°C`);
  },
  actions: {
    // Optional: Action handlers for inline buttons
    'weather_refresh': async (ctx) => {
      await ctx.answerCbQuery('Refreshing weather...');
      // Refresh logic here
    }
  }
};
\`\`\`

3. The command will be automatically registered by the bot on the next startup

### Adding Command to Menu

To add your new command to the menu, update the `categories` object in `config.js`:

\`\`\`js
categories: {
  utility: {
    name: "Utility",
    emoji: "🛠️",
    commands: ["translate", "reminder", "tts", "weather"] // Add your command here
  },
  // Other categories...
}
\`\`\`

Also add a description in the `commandDescriptions` object:

\`\`\`js
commandDescriptions: {
  // Existing commands...
  weather: "Get weather information for a location"
}
\`\`\`

## 🔍 Troubleshooting

### Bot Not Responding

1. Check if your bot token is correct
2. Ensure the bot is running (`npm start`)
3. Try restarting the bot
4. Check the console for any error messages

### Command Not Working

1. Check if the command file is properly structured
2. Ensure any required API keys are set in the `.env` file
3. Check the console for error messages related to the command

### Deployment Issues

#### Replit

1. Make sure all environment variables are set in the Secrets tab
2. Check if the bot is actually running in the Replit console
3. Set up UptimeRobot to ping your Replit URL to keep it running

#### Render

1. Verify that all environment variables are set correctly
2. Check the build and deployment logs for any errors
3. Ensure the service is actually running

## 📚 Advanced Usage

### Custom Middleware

You can add custom middleware by editing the `utils/middleware.js` file. For example, to add a middleware that logs all messages:

\`\`\`js
function setupMiddleware(bot) {
  // Existing middleware...
  
  // Add new middleware
  bot.use((ctx, next) => {
    if (ctx.message && ctx.message.text) {
      console.log(`Message from ${ctx.from.username || ctx.from.first_name}: ${ctx.message.text}`);
    }
    return next();
  });
}
\`\`\`

### Database Integration

For persistent storage, you can integrate a database like MongoDB:

1. Install the required package: `npm install mongoose`
2. Create a database connection in a new file `utils/database.js`
3. Create models for your data
4. Use the models in your commands

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

If you have any questions or suggestions, please open an issue or contact [your contact information].

#   h a i r o f b o t  
 