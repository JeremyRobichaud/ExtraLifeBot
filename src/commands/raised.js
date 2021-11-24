const { getRegisteredUserData } = require('../helpers.js');
const { Constants } = require('discord.js');
const request  = require('request');

const { 
    EXTRA_LIFE_TEAM_URL,
    USD_TO_CAD_RATE
}  = require('../../settings.js');

/**
 * 
 * This command print the targetted users amount raised.
 * The target can either be the author of the post, or key specific
 * 
 * This key can either be the participantID found in the user's extralife profile url
 * ex: https://www.extra-life.org/index.cfm?fuseaction=donorDrive.participant&participantID=461230 <-- would be 461230
 * Or this key can be the display name (special characters are required)
 * ex: https://www.extra-life.org/index.cfm?fuseaction=donorDrive.participant&participantID=461230  would be Jérémy Robichaud
 * 
 * So a full example would be:
 *      - !raised
 *      - !raised 461230
 *      - !raised Jérémy Robichaud
 * 
 * @param {Discord.Client} bot The Discord Bot.
 * @param {string} messageInfo A dict containing all the message info.
 */

module.exports = {
    name: 'raised',
    description: 'Returns the amount raised.',
    category: 'ExtraLife',
    slash: 'both',
    testOnly: false,
    options: [{
        name: 'target',
        description: 'The participantID or Display Name of a ExtraLife user.',
        required: false,
        type: Constants.ApplicationCommandOptionTypes.STRING,
    }],
    callback: async ({ user, args }) => {
        const author = user
        const registeredUserData = await getRegisteredUserData();

        // Check 1 - If the author is not registered //
        var check = registeredUserData.filter(u => u.discordId === author.id)
        if (check.length === 0) {
            return "[ACCESS DENIED] You need to be a registered ExtraLife participant to use this function."
        }

        // Target:   !raised <This Part>
        var target = args.join(" ");

        // If no target, use the EL info from the author //
        if (target == '') {
            target = check[0].elName
        }

        let retval = ''

        // GET Extra Life Team JSON //
        request(EXTRA_LIFE_TEAM_URL, async function (error, _, body) {

            if (error != null) {
                console.error(error)
                retval = "-Error- Please contact a local CSA Exec as an error just occured."
            }
            const data = JSON.parse(body);

            // Check 2 - If the target is not in the team, or if somewho multiple users show up //
            users = data.filter(obj => obj.displayName === target || obj.participantID == target);
            if (users.length > 1){
                retval =  "Multiple users found with '" + target + "', please review the info and change it."
                return
            }
            else if (users.length == 0) {
                retval =  "No users were found with '" + target + "', please make sure you are in the Computer Science Association Team and try again. \n Here's the link if you need it: https://www.extra-life.org/index.cfm?fuseaction=donorDrive.team&teamID=57965"
                return
            }

            const userData = users[0];

            const donationUSD = userData['sumDonations']

            // This will convert it to CAD and round to the nearest cent // 
            const donationCAN = (Math.round(donationUSD * USD_TO_CAD_RATE * 100) / 100).toFixed(2);

            retval =  target + " has raised **$" + donationCAN + "** ($" + donationUSD + " USD)!"
        
        })

        await new Promise(resolve => setTimeout(resolve, 1000))

        return retval
    }
}