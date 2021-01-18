const fs = require("fs");
const { reformatContact } = require("./src/helpers");
const directoryFiles = fs.readdirSync("./inputJSON");
const writeCsvFile = require("./src/writeCsv");
const removeFile = require("./src/removeFiles");

const coStarFile = directoryFiles.find((file) => file.includes("coStar"));

const coStarData = require(`./inputJSON/${coStarFile}`);

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

writeCsvFile(firstLinersUnique, "coStar_Emails");
writeCsvFile(allData, "coStar_allData");

setTimeout(() => {
    removeFile("inputJSON");
}, 750);
