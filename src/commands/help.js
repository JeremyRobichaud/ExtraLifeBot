module.exports = {
    name: 'help',
    description: 'Brings up the help menu for ELi',
    category: 'ExtraLife',
    slash: 'both',
    aliases: ['h'],
    testOnly: false,
    callback: async ({}) => {
        const msg = [
            "Hi I'm ExtraLife bot, ELi for short :)",
            "Here's how I can help you:",
            "",
            "\t/register <target>:",
            "\t\t Use this command to register your ExtraLife account to your discord account.",
            "\t\t NOTE: You must be in the 'UNB Computer Science Association' team and raised 10$ CAD in order.",
            "\t\t to register, here's a link to the team: <https://www.extra-life.org/index.cfm?fuseaction=donorDrive.team&teamID=57965>",
            "\t\t <Target> can be your EL **participationID** from your profile's URL, or your **displayed name**.",
            "\t\t EX: For this profile <https://www.extra-life.org/index.cfm?fuseaction=donorDrive.participant&participantID=461230>",
            "\t\t the participation ID would be '461230' and the display name would be 'Jérémy Robichaud' so...",
            "\t\t '/register 461230' or  '/register Jérémy Robichaud' would work.",
            "",
            "\t/raised <Optional:target>:",
            "\t\t Use this command to show the amount raised of either the author or the target.",
            "\t\t NOTE: You must be a registered Extralife participant to use this command.",
            "\t\t <Optional:Target> can be your EL **participationID** from your profile's URL, or your **displayed name**.",
            "\t\t EX: For this profile <https://www.extra-life.org/index.cfm?fuseaction=donorDrive.participant&participantID=461230>",
            "\t\t the participation ID would be '461230' and the display name would be 'Jérémy Robichaud' so...",
            "\t\t '/raised',  '/raised 461230',  or  '/raised Jérémy Robichaud' would work.",
            "",
            "\t/schedule:",
            "\t\t Use this command to display the extralife schedule!",
            "",
            "\t/signup <EventName>:",
            "\t\t Use this command alongside */schedule* to signup for events!",
            "\t\t NOTE: You must be a registered Extralife participant to use this command.",
            "",
            "\t/shelf <Optional:BoardGameName>:",
            "\t\t Use this command to display what is on my boardgame shelf!",
            "\t\t Since I'm a bot, I don't have an actual shelf,",
            "\t\t but I have a lot of **links for free online replacements for popular boardgames!**",
            "\t\t <Optional:BoardGameName> will display the URL of the specific boardgame.",
        ]
        return msg.join('\n')
    }
}