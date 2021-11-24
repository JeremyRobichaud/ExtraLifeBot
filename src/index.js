// Import Commands
const {loadData, getEventData} = require('./helpers.js');
const {Client, Intents} = require('discord.js');
const {EVENT_REMINDER, TOKEN} = require('../settings');
WOKCommands = require('wokcommands');
path = require('path');
var CronJob = require('cron').CronJob;
let jobs = []

async function main() {
    await loadData();
    

    // Initialize Discord Bot
    const bot = new Client({
        intents:[
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES
        ],
    });


    // Set Event reminders //
    if (EVENT_REMINDER > -1) {
        const eventData = await getEventData();
        eventData.forEach(e => {
            var tempTime = new Date(e.time)
            tempTime.setMinutes(e.time.getMinutes() - EVENT_REMINDER)
            jobs.push(
                new CronJob(tempTime, function() {
                    const channel = bot.channels.cache.get(e.channelId);
                    channel.send({
                        content: '<@&' + e.roleId + '> your event will start in ' + EVENT_REMINDER.toString() + 'mins!',
                        allowedMentions: { roles: [e.roleId] },
                    });
                }, null, true, 'America/Moncton')
            );
            jobs[jobs.length-1].start();
        });
    }
    

    bot.on('ready', () => {
        //console.log(bot)
        console.log('Connected');
        console.log('Logged in as: ' + bot.user.username + ' - (' + bot.user.id + ')');

        new WOKCommands(bot, {
            commandsDir: path.join(path.resolve(), 'src', 'commands'),
            testServers: ['571837481964535809']
        })
    });

    bot.login(TOKEN)
}


main()