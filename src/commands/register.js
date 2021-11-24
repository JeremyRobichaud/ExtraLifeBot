const { getRegisteredUserData, registerUser } = require('../helpers.js');
const { Constants } = require('discord.js');
const request = require('request');

const {
    EXTRA_LIFE_TEAM_URL,
    EXTRE_LIFE_REGISTER_ROLE,
    EXTRA_LIFE_MINIMUM_RAISED,
    USD_TO_CAD_RATE
} = require('../../settings.js');

/**
 * 
 * This command registers the discord author based on a given ExtraLife related key.
 * 
 * This key can either be the participantID found in the user's extralife profile url
 * ex: https://www.extra-life.org/index.cfm?fuseaction=donorDrive.participant&participantID=461230 <-- would be 461230
 * 
 * Or this key can be the display name (special characters are required)
 * ex: https://www.extra-life.org/index.cfm?fuseaction=donorDrive.participant&participantID=461230  would be Jérémy Robichaud
 * 
 * So a full example would be: 
 *      - !register 461230
 *      - !register Jérémy Robichaud
 * 
 * @param {Discord.Client} bot The Discord Bot.
 * @param {string} messageInfo A dict containing all the message info.
 */

module.exports = {
    name: 'register',
    description: 'Registers the users Extra Life account.',
    category: 'ExtraLife',
    slash: 'both',
    testOnly: false,
    guildOnly: true,
    options: [{
        name: 'target',
        description: 'The participantID or Display Name of your ExtraLife account.',
        required: true,
        type: Constants.ApplicationCommandOptionTypes.STRING,
    }],
    callback: async ({ user, guild, args }) => {
        const author = user
        let registeredUserData = await getRegisteredUserData();

        // Target:   !register <This Part>
        const target = args.join(" ");

        // Check 1 - If the author is already registered //
        var check = registeredUserData.filter(u => u.elName === target || u.discordId === author.id || u.elId === target)
        if (check.length > 0) {
            return "User " + check[0].discordName + " is already registered to the account of '" + check[0].elName + "'."
        }
        let retval = ''
        // GET Extra Life Team JSON //
        request(EXTRA_LIFE_TEAM_URL, async function (error, _, body) {
            if (error != null) {
                console.error(error)
                retval = "-Error- Please contact a local CSA Exec as an error just occured."
                return
            }
            const data = JSON.parse(body);

            // Check 2 - If the target is not in the team, or if somewho multiple users show up //
            const users = data.filter(obj => obj.displayName === target || obj.participantID == target);
            if (users.length > 1) {
                retval = "Multiple users found with '" + target + "', please review the info and change it."
                return
            }
            if (users.length == 0) {
                retval = "No users were found with '" + target + "', please make sure you are in the Computer Science Association Team and try again. \n Here's the link if you need it: https://www.extra-life.org/index.cfm?fuseaction=donorDrive.team&teamID=57965"
                return
            }


            const userData = users[0];

            // Check 3 - Check if the target raised the minimum //
            if (userData['sumDonations'] < (EXTRA_LIFE_MINIMUM_RAISED/USD_TO_CAD_RATE)) {
                retval = "Your total donation does not meeting the 10$ criteria."
                return
            }

            const member = guild.members.cache.get(author.id)
            const role = guild.roles.cache.get(EXTRE_LIFE_REGISTER_ROLE)

            member.roles.add(role)

            retval = "Thank you for joining us " + userData['displayName'] + "!"

            await registerUser(userData, author)
        })

        await new Promise(resolve => setTimeout(resolve, 1000))

        return retval
    }
}