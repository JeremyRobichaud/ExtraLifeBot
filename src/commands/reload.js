const {loadData} = require('../helpers.js');
module.exports = {
    name: 'reload',
    description: '[ADMIN ONLY] Reloads the databases',
    category: 'ExtraLife',
    slash: 'both',
    testOnly: false,
    hidden: true,
    guildOnly:true,
    callback: async ({interaction}) => {
        if (interaction) {
            await interaction.deferReply();
            await loadData();
            await interaction.editReply('Success');
            return 
        }
        await loadData()
        return 'Success'
    }
}