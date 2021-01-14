const fs = require("fs");
const { reformatContact } = require("./src/helpers");
const directoryFiles = fs.readdirSync("./inputJSON");
// const writeJsonFile = require("./src/writeJson");
const writeCsvFile = require("./src/writeCsv");

const coStarFile = directoryFiles.find((file) => file.includes("coStar"));

const coStarData = require(`./inputJSON/${coStarFile}`);

// TRUE OWNER EMAIL || NAME
// OR
// PROPERTY MANAGER || NAME

let firstLiners = [];
let allData = [];

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

// writeJsonFile(JSON.stringify(firstLinersUnique), "coStar_Emails");
// writeJsonFile(JSON.stringify(allData), "coStar_allData");

writeCsvFile(firstLinersUnique, "coStar_Emails");
writeCsvFile(allData, "coStar_allData");
