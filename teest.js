require("dotenv").config();

const AirtableApi = require("./src/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API);

const lookup = require("./src/validateNumber");
const writeCsvFile = require("./src/writeCsv");
const allData = require("./inputJSON/data.json");
const { removeDuplicateByKey, arrayDifference, numDigits } = require("./src/helpers");

console.log("allData =", allData.length);

let uniqueData = removeDuplicateByKey(allData, "Phone Number");
uniqueData = uniqueData.slice(0, 2000);

console.log("uniqueData =", uniqueData.length);

const baseID = "appYePO2J6QAQITxc"; // McKinnis

let mNumbers = [];
let pNumbers = [];

let total = 0;

(async () => {
    let mobileContacts;

    // filter current reonomy contacts against contacts in view: "Texted"
    const airtableContacts = await Airtable.getFilteredRecords(baseID, {
        field: "Outreach",
        value: "Text",
    });

    if (airtableContacts) {
        mobileContacts = arrayDifference(uniqueData, airtableContacts, "Phone Number");

        console.log("airtableContacts length =", airtableContacts.length);
        console.log("mobileContacts length =", mobileContacts.length);
    } else {
        mobileContacts = uniqueData;
    }

    try {
        let name;

        for (let data of mobileContacts) {
            total++;

            // const isPhoneNumber = numDigits(data["Phone Number"] < 12);

            // if (data["Full Name"] !== name && isPhoneNumber) {
            if (data["Full Name"] !== name) {
                try {
                    const carrierType = await lookup(data["Phone Number"]);

                    if (carrierType.carrier.type === "mobile") {
                        mNumbers.push(data);
                        name = data["Full Name"];
                    } else {
                        pNumbers.push(data);
                    }
                } catch (error) {
                    console.log(error.message);
                }
            }

            total % 100 === 0 &&
                console.log(`Contacts left to validate: ${mobileContacts.length - total}`);
        }

        console.log("mNumbers total =", mNumbers.length);
        console.log("pNumbers total =", pNumbers.length);

        writeCsvFile(mNumbers, "mNumbers");
        writeCsvFile(pNumbers, "pNumbers");
    } catch (error) {
        console.log(error);
    }
})();
