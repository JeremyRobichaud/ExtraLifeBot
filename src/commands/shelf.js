const { getBoardgameData } = require('../helpers.js');
const { Constants } = require('discord.js');


/**
 * This command simulates a shelf of boardgames. 
 * It simulates boardgames by sharing online links to free replacements to popular boardgames
 * 
 * It has two modes:
 *      !shelf - This returns the list of available replacements
 *      !shelf <Name of a Boardgame> - Returns the link of that boardgame
 *  
 */

module.exports = {
    name: 'shelf',
    description: 'Returns information about the online shelf of boardgames.',
    category: 'ExtraLife',
    slash: 'both',
    testOnly: false,
    options: [{
        name: 'boardgame_name',
        description: 'The name of the boardgame to return the URL',
        required: false,
        type: Constants.ApplicationCommandOptionTypes.STRING,
    }],
    callback: async ({ args }) => {
        const targetEvent = args.join(" ")
        const boardgameData = await getBoardgameData();
        // !shelf //
        if (targetEvent === '') {
            const msg = boardgameData.map(bg => {
                return bg.title
            })
            return "Here are all the board games on my shelf:\n" + msg.join(" ● ")
        }
        // !shelf <Name>
        var results = boardgameData.filter(obj => {
            return obj.title === targetEvent
        })
        if (results.length == 0) {
            return "No games by the name of '" + targetEvent + "' was found.\nCheck /shelf for a list of available games."
        }
        return "Here's a URL to a free online version of " + targetEvent + ":\n" + results[0].url
    }
}