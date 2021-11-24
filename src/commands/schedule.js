const { MessageActionRow, MessageButton } = require('discord.js');
const { getEventData } = require('../helpers.js');

/**
 * This command formats the events in the data file and prints it in a user-friendly way.
 * 
 * Output:
 *  TestingEvent1  -  12:00 AM Nov. 21
 *  TestingEvent2  -  1:00 PM Nov. 21
 *  TestingEvent3  -  2:00 PM Nov. 21
 *  
 */

module.exports = {
    name: 'schedule',
    description: 'Shows the ExtraLife schedule',
    category: 'ExtraLife',
    slash: 'both',
    testOnly: false,
    callback: async ({msgInt}) => {
        const temp = await getEventData()
        var rows = temp.map(e => {
            const test = new MessageActionRow().addComponents(
                new MessageButton().setCustomId('submit').setLabel('Sign up!').setStyle('SUCCESS')
            )
            var temp = e.time.toTimeString(); // 13:00:00 GMT-0400 (Atlantic Standard Time)
            temp = temp.split(":"); // ['13', '00', '00 GMT-0400 (Atlantic Standard Time)']
            temp[2] = 'AM'; // ['13', '00', 'AM']
            if (parseInt(temp[0]) > 12) {
                temp[0] = parseInt(temp[0]) - 12 ;
                temp[0] = temp[0].toString();
                temp[2] = 'PM'
            }
            var time = temp[0] + ":" + temp[1] + " " + temp[2]; // 12:00 AM
            return e.name + "  -  " + time + " Nov. " + e.time.getDate() // TestingEvent1  -  12:00 AM Nov. 21
        })
        return rows.join('\n')
    }
}