const { getRegisteredUserData, registerEvent, getEventData } = require('../helpers.js');
const { Constants } = require('discord.js');

module.exports = {
    name: 'signup',
    description: 'This commands signs you up for an event.',
    category: 'ExtraLife',
    slash: 'both',
    testOnly: false,
    options: [{
        name: 'event_name',
        description: 'The name of the boardgame to return the URL',
        required: true,
        type: Constants.ApplicationCommandOptionTypes.STRING,
    }],
    callback: async ({  guild, user, args }) => {
        const registeredUserData = await getRegisteredUserData();
        // targetEvent:   !signup <This Part>
        const targetEvent = args.join(" ")

        const author = user

        // Check 1 - The author is a registered ExtraLife member // 
        var check = registeredUserData.filter(u => u.discordId === author.id)
        if (check.length === 0) {
            return "User " + author.username + " is not registered, in order to sign-up for an event in advance, please register using '!register'."
        }

        const eventData = await getEventData();

        var i = await eventData.findIndex(e => e.name === targetEvent);

        if (i < 0) {
            return "No event exists with the title of '" + targetEvent + "'. \n Check /schedule for the list of events."
        }
        
        const member = guild.members.cache.get(author.id)
        const role = guild.roles.cache.get(eventData[i].roleId)

        member.roles.add(role);
        return "Successfully signed up user '" + author.username + "' to the " + targetEvent + " event.";
    }
}