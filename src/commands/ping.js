module.exports = {
    name: 'ping',
    description: 'Replies with pong',
    category: 'ExtraLife',
    slash: 'both',
    testOnly: true,
    callback: async ({message, interaction}) => {
        return 'Pong!'
    }
}