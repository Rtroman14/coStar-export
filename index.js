const { combinedFiles, removeFiles } = require("./src/files");
const { reformatContact, removeMNumbers } = require("./src/helpers");
const writeCsvFile = require("./src/writeCsv");
const lookup = require("./src/validateNumber");
// const neverBounce = require("./src/neverBounce");

let firstLiners = [];
let allData = [];

const FILENAME = "";

(async () => {
    try {
        const coStarData = await combinedFiles("inputJSON");

        // filter coStar data
        coStarData.forEach((contact) => {
            for (let i = 1; i < 4; i++) {
                if (`trueOwner_Email_${i}` in contact) {
                    firstLiners.push(reformatContact("trueOwner", i, contact));
                }
                if (`propertyManagement_Email_${i}` in contact) {
                    firstLiners.push(reformatContact("propertyManagement", i, contact));
                }
                if (`previousTrueOwner_Email_${i}` in contact) {
                    firstLiners.push(reformatContact("previousTrueOwner", i, contact));
                }
                if (`trueOwner_Name_${i}` in contact) {
                    firstLiners.push(reformatContact("trueOwner", i, contact));
                }
                if (`propertyManagement_Name_${i}` in contact) {
                    firstLiners.push(reformatContact("propertyManagement", i, contact));
                }
                if (`previousTrueOwner_Name_${i}` in contact) {
                    firstLiners.push(reformatContact("previousTrueOwner", i, contact));
                }
            }

            allData.push(contact);
        });

        let checkDupicates = [];

        // remove duplicates
        const firstLinersString = new Set(firstLiners.map((e) => JSON.stringify(e)));
        const firstLinersUnique = Array.from(firstLinersString).map((e) => JSON.parse(e));

        const firstLinersWithEmails = firstLinersUnique.filter((contact) => {
            if (contact.Email !== "" && !checkDupicates.includes(contact.Email)) {
                checkDupicates.push(contact.Email);
                return contact;
            }
        });

        writeCsvFile(firstLinersWithEmails, "coStar_Emails");

        let pNumbers = [];
        let mNumbers = [];
        let newMNumbers = [];

        checkDupicates = [];

        firstLinersUnique.forEach((contact) => {
            if (!checkDupicates.includes(contact["Phone Number"])) {
                delete contact["First Line"];
                // delete contact.Outreach;

                if (contact["Phone Number"].includes("X")) {
                    let phoneNumber = contact["Phone Number"].slice(
                        0,
                        contact["Phone Number"].indexOf(" X")
                    );

                    pNumbers.push({
                        ...contact,
                        "Phone Number": phoneNumber,
                    });
                } else if (contact["Phone Number"].includes("(p)")) {
                    let phoneNumber = contact["Phone Number"].replace(" (p)", "");

                    pNumbers.push({
                        ...contact,
                        "Phone Number": phoneNumber,
                    });
                } else if (contact["Phone Number"].includes("(m)")) {
                    let phoneNumber = contact["Phone Number"].replace(" (m)", "");

                    mNumbers.push({
                        ...contact,
                        "Phone Number": phoneNumber,
                    });
                }
            }

            checkDupicates.push(contact["Phone Number"]);
        });

        const pNumbersLength = pNumbers.length;

        console.log("\n------- BEFORE -------");
        console.log("mNumbers total =", mNumbers.length);
        console.log("pNumbers total =", pNumbers.length);
        console.log("------- BEFORE -------\n");

        total = 0;

        for (let contact of pNumbers) {
            total++;

            try {
                const carrierType = await lookup(contact["Phone Number"]);
                carrierType.carrier.type === "mobile" &&
                    mNumbers.push(contact) &&
                    newMNumbers.push(contact);
            } catch (error) {
                console.log("\n ---------- ERROR START ----------\n");
                console.log(error);

                console.log(contact);
                console.log("\n ---------- ERROR END ----------\n");
            }

            total % 50 === 0 &&
                console.log(`Contacts left to validate: ${pNumbers.length - total}`);
        }

        pNumbers = removeMNumbers(mNumbers, pNumbers);

        writeCsvFile(pNumbers, "coStar_pNumbers");
        writeCsvFile(mNumbers, "coStar_mNumbers");
        // writeCsvFile(newMNumbers, "coStar_newMNumbers");

        console.log("------- AFTER -------");
        console.log("mNumbers total =", mNumbers.length);
        console.log("pNumbers total =", pNumbers.length);
        // console.log("newMNumbers total =", newMNumbers.length);
        console.log(
            "Percent of mobile numbers in pNumbers =",
            (newMNumbers.length / pNumbersLength).toFixed(2)
        );
        console.log("------- AFTER -------\n");

        setTimeout(() => {
            removeFiles("inputJSON");
        }, 750);
    } catch (error) {
        console.log("ERROR ---", error);
    }
})();
