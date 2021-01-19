const fs = require("fs");
const { reformatContact } = require("./src/helpers");
const directoryFiles = fs.readdirSync("./inputJSON");
const writeCsvFile = require("./src/writeCsv");
const removeFile = require("./src/removeFiles");
const neverBounce = require("./src/neverBounce");

const coStarFile = directoryFiles.find((file) => file.includes("coStar"));
const coStarData = require(`./inputJSON/${coStarFile}`);

let firstLiners = [];
let allData = [];

const FILENAME = "";

// filter coStar data
coStarData.forEach((contact) => {
    for (let i = 1; i < 4; i++) {
        if (`trueOwner_Email_${i}` in contact) {
            firstLiners.push(reformatContact("trueOwner", i, contact));
        }
        if (`propertyManagement_Email_${i}` in contact) {
            firstLiners.push(reformatContact("propertyManagement", i, contact));
        }
        if (`trueOwner_Name_${i}` in contact) {
            firstLiners.push(reformatContact("trueOwner", i, contact));
        }
        if (`propertyManagement_Name_${i}` in contact) {
            firstLiners.push(reformatContact("propertyManagement", i, contact));
        }
    }

    allData.push(contact);
});

// remove duplicates
const firstLinersString = new Set(firstLiners.map((e) => JSON.stringify(e)));
const firstLinersUnique = Array.from(firstLinersString).map((e) => JSON.parse(e));

const firstLinersWithEmails = firstLinersUnique.filter((contact) => contact.Email !== "");
const firstLinersWithoutEmails = firstLinersUnique.filter((contact) => contact.Email === "");

writeCsvFile(firstLinersWithEmails, "coStar_Emails");
writeCsvFile(firstLinersWithoutEmails, "coStar_NoEmails");
writeCsvFile(allData, "coStar_allData");

setTimeout(() => {
    removeFile("inputJSON");
}, 750);

// send to NeverBounce to validate emails
neverBounce(firstLinersWithEmails, FILENAME);
