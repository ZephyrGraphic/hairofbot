const schedule = require("node-schedule")
const config = require("../config")
const { parseTime } = require("../utils/timeParser")

// Store active reminders
const activeReminders = new Map()

module.exports = {
  name: "reminder",
  execute: async (ctx, bot) => {
    // Start reminder dialog
    ctx.session.reminderState = "awaiting_text"

    await ctx.reply(`${config.emoji.reminder} What should I remind you about?`)

    // Set up one-time listener for the reminder text
    bot.use(async (ctx, next) => {
      if (ctx.message && ctx.message.text && ctx.session.reminderState === "awaiting_text") {
        const reminderText = ctx.message.text

        // Save reminder text
        ctx.session.reminderText = reminderText
        ctx.session.reminderState = "awaiting_time"

        await ctx.reply(
          `${config.emoji.reminder} When should I remind you? (e.g., "in 10 minutes", "at 9 PM", "tomorrow at 3 PM")`,
        )

        return
      }

      if (ctx.message && ctx.message.text && ctx.session.reminderState === "awaiting_time") {
        const timeText = ctx.message.text
        const reminderText = ctx.session.reminderText

        // Parse time
        try {
          const reminderDate = parseTime(timeText)

          if (!reminderDate) {
            await ctx.reply(
              `${config.emoji.error} I couldn't understand that time format. Please try again with a format like "in 10 minutes", "at 9 PM", or "tomorrow at 3 PM".`,
            )
            return
          }

          const now = new Date()

          // Check if time is in the past
          if (reminderDate <= now) {
            await ctx.reply(`${config.emoji.error} The reminder time must be in the future. Please try again.`)
            return
          }

          // Calculate time difference for display
          const diffMs = reminderDate.getTime() - now.getTime()
          const diffMins = Math.round(diffMs / 60000)
          let timeDisplay

          if (diffMins < 60) {
            timeDisplay = `${diffMins} minute${diffMins !== 1 ? "s" : ""}`
          } else {
            const hours = Math.floor(diffMins / 60)
            const mins = diffMins % 60
            timeDisplay = `${hours} hour${hours !== 1 ? "s" : ""}${mins > 0 ? ` and ${mins} minute${mins !== 1 ? "s" : ""}` : ""}`
          }

          // Schedule reminder
          const job = schedule.scheduleJob(reminderDate, async () => {
            await ctx.telegram.sendMessage(
              ctx.chat.id,
              `${config.emoji.reminder} *Reminder for ${ctx.from.first_name}*\n\n${reminderText}`,
              { parse_mode: "Markdown" },
            )

            // Remove from active reminders
            activeReminders.delete(`${ctx.from.id}_${job.name}`)
          })

          // Store in active reminders
          const reminderId = `${ctx.from.id}_${job.name}`
          activeReminders.set(reminderId, {
            job,
            userId: ctx.from.id,
            chatId: ctx.chat.id,
            text: reminderText,
            time: reminderDate,
          })

          // Confirmation message
          await ctx.reply(
            `${config.emoji.success} Reminder set! I'll remind you about "${reminderText}" in ${timeDisplay}.`,
            {
              reply_markup: {
                inline_keyboard: [[{ text: "❌ Cancel Reminder", callback_data: `cancel_reminder_${reminderId}` }]],
              },
            },
          )

          // Reset reminder state
          delete ctx.session.reminderState
          delete ctx.session.reminderText
        } catch (error) {
          console.error("Reminder time parsing error:", error)
          await ctx.reply(
            `${config.emoji.error} I couldn't understand that time format. Please try again with a format like "in 10 minutes", "at 9 PM", or "tomorrow at 3 PM".`,
          )
        }

        return
      }

      return next()
    })
  },
  actions: {
    // Dynamic action handler for canceling reminders
    cancel_reminder: async (ctx) => {
      const reminderId = ctx.callbackQuery.data.replace("cancel_reminder_", "")

      if (activeReminders.has(reminderId)) {
        const reminder = activeReminders.get(reminderId)

        // Cancel the job
        reminder.job.cancel()

        // Remove from active reminders
        activeReminders.delete(reminderId)

        await ctx.editMessageText(`${config.emoji.success} Reminder canceled.`)
      } else {
        await ctx.answerCbQuery("This reminder no longer exists or has already been triggered.")
      }
    },
  },
  pattern: /^\/remind(?:er)?(?:\s+(.+))?$/i,
}

