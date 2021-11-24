// The ID of the discord role you want to assign members who are registered //
const SERVER_ID = 'XXXXXXXX'

// The ID of the discord role you want to assign members who are registered //
const EXTRE_LIFE_REGISTER_ROLE = 'XXXXXXXXXX'

// The API URL of your extralife team //
const EXTRA_LIFE_TEAM_URL = 'https://www.extra-life.org/api/1.3/teams/XXXXX/participants'

// The minimum amount raised to be a participant IN CAD (Lowest: 0.0) //
const EXTRA_LIFE_MINIMUM_RAISED = 10

// The discord name of admins //
const USD_TO_CAD_RATE = 1.26

// The amount of minutes before an event to send the reminder, set to -1 if you dont want //
const EVENT_REMINDER = 10

//The discord token
const TOKEN = "XXXXXXXXXXXXXXXXXXXXXXX"

module.exports = {
    SERVER_ID: SERVER_ID,
    EXTRE_LIFE_REGISTER_ROLE: EXTRE_LIFE_REGISTER_ROLE,
    EXTRA_LIFE_TEAM_URL: EXTRA_LIFE_TEAM_URL,
    EXTRA_LIFE_MINIMUM_RAISED: EXTRA_LIFE_MINIMUM_RAISED,
    USD_TO_CAD_RATE: USD_TO_CAD_RATE,
    EVENT_REMINDER:EVENT_REMINDER,
    TOKEN: TOKEN
}
