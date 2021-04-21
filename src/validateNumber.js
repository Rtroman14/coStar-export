require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

module.exports = async (phoneNumber) => {
    try {
        return await client.lookups.v1
            .phoneNumbers(phoneNumber)
            .fetch({ countryCode: "US", type: ["carrier"] });
    } catch (error) {
        console.log("VALIDATENUMBER ERROR ---", error);
    }
};
