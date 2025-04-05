const config = require("../config")

module.exports = {
  name: "groupinfo",
  execute: async (ctx, bot) => {
    // Check if command is used in a group
    if (ctx.chat.type !== "group" && ctx.chat.type !== "supergroup") {
      return ctx.reply(`${config.emoji.error} This command can only be used in groups.`)
    }

    try {
      // Get group info
      const chatId = ctx.chat.id
      const chatTitle = ctx.chat.title
      const chatType = ctx.chat.type

      // Get member count
      const memberCount = await ctx.getChatMembersCount()

      // Get chat admins
      const admins = await ctx.getChatAdministrators()
      const adminList = admins
        .map((admin) => {
          const user = admin.user
          const name = user.username ? `@${user.username}` : `${user.first_name} ${user.last_name || ""}`.trim()
          const status = admin.status === "creator" ? "👑 Creator" : "👮 Admin"
          return `• ${status}: ${name}`
        })
        .join("\n")

      // Check bot permissions
      const botMember = await ctx.getChatMember(ctx.botInfo.id)
      const canDeleteMessages = botMember.can_delete_messages ? "✅" : "❌"
      const canRestrictMembers = botMember.can_restrict_members ? "✅" : "❌"
      const canPinMessages = botMember.can_pin_messages ? "✅" : "❌"

      // Create info message
      const infoMessage = `
${config.emoji.group} *Group Information*

*Name:* ${chatTitle}
*ID:* \`${chatId}\`
*Type:* ${chatType === "supergroup" ? "Supergroup" : "Group"}
*Members:* ${memberCount}

*Administrators:*
${adminList}

*Bot Permissions:*
• Delete Messages: ${canDeleteMessages}
• Restrict Members: ${canRestrictMembers}
• Pin Messages: ${canPinMessages}
`

      await ctx.replyWithMarkdown(infoMessage)
    } catch (error) {
      console.error("Group info error:", error)
      await ctx.reply(`${config.emoji.error} Failed to get group information. Please try again later.`)
    }
  },
}

