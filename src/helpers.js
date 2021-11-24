
const {createObjectCsvWriter} = require('csv-writer');
const {SERVER_ID} = require('../settings');
const {csv} = require('csvtojson');
var Mutex = require('async-mutex').Mutex;

const bgWriter = createObjectCsvWriter({
    path: './data/BoardGames.csv',
    header: [
    {id: 'title', title: 'title'},
    {id: 'url', title: 'url'},
    ]
});

const ruWriter = createObjectCsvWriter({
    path: './data/RegisteredUsers.csv',
    header: [
    {id: 'discordName', title: 'discordName'},
    {id: 'discordId', title: 'discordId'},
    {id: 'elName', title: 'elName'},
    {id: 'elId', title: 'elId'},
    ]
});

const eWriter = createObjectCsvWriter({
    path: './data/Events.csv',
    header: [
    {id: 'name', title: 'name'},
    {id: 'channelId', title: 'channelId'},
    {id: 'roleId', title: 'roleId'},
    {id: 'time', title: 'time'},
    {id: 'users', title: 'users'},
    ],
    fieldDelimiter: ';'
});

async function _load(path, delimiter=',') {
    return new Promise((resolve) => {
        setTimeout(async () => {
            resolve(csv({delimiter: delimiter}).fromFile(path))
        }, 1500)
    })
}

const bgMutex = new Mutex();
var boardgameData = []

const ruMutex = new Mutex();
var registeredUserData = []

const eMutex = new Mutex();
var eventData = []

async function loadData(){
    const eRelease = await eMutex.acquire();
    const ruRelease = await ruMutex.acquire();
    const bgRelease = await bgMutex.acquire();
    try{
        boardgameData = await _load('./data/BoardGames.csv')
        registeredUserData = await _load('./data/RegisteredUsers.csv')
        eventData = await _load('./data/Events.csv', ';')
        eventData = await eventData.map(e => {
            e.time = new Date(e.time)
            if (e.users != '') {
                e.users = e.users.split(",")
            } else {
                e.users = []
            }
            return e
        });
    } finally {
        await bgRelease();
        await ruRelease();
        await eRelease();
    }
}

async function getBoardgameData(){
    await bgMutex.waitForUnlock();
    return boardgameData
}
async function getRegisteredUserData(){
    await ruMutex.waitForUnlock();
    return registeredUserData
}
async function getEventData(){
    await eMutex.waitForUnlock();
    return eventData
}

async function registerEvent(targetEvent, author){
    const release = await eMutex.acquire();
    try{
        // Check 2 - The target is a valid event //
        if (!eventData.some(e => e.name === targetEvent)) {
            return "No event was found with the name '" + targetEvent + "', please use '!schedule' to see a full list of events and try again."
        }
        var i = await eventData.findIndex(e => e.name === targetEvent);

        // Check 3 - The author is already signed up //
        if (await eventData[i].users.includes(author.username)) {
            return "Successfully signed up user '" + author.username + "' to the " + targetEvent + " event."
        }
        await eventData[i].users.push(author.username)
        var newData = await eventData.map(e => {
            e.time = e.time.toUTCString()
            e.users = e.users.join(",")
            return e
        })
        eventData = newData
        await eWriter.writeRecords(newData)

    } catch (err) {
        console.error(err)

    } finally {
        release();
    }
    
}
async function registerUser(userData, user){
    const release = await ruMutex.acquire();
    try{
        // Update the data file //
        await registeredUserData.push({
            discordName: user.username,
            discordId: user.id,
            elName: userData['displayName'],
            elId: userData['participantID']
        });
        await ruWriter.writeRecords(registeredUserData)
    } finally {
        release();
    }

}

async function registerBoardGame(title, url){
    const release = await bgMutex.acquire();
    try{
        // Update the data file //
        await boardgameData.push({
            title: title,
            url: url
        });
        await bgWriter.writeRecords(boardgameData)
    } finally {
        release();
    }

}

module.exports = {
    loadData: loadData,
    registerUser: registerUser,
    registerEvent: registerEvent,
    registerBoardGame: registerBoardGame,
    getBoardgameData: getBoardgameData,
    getRegisteredUserData: getRegisteredUserData,
    getEventData: getEventData,
}