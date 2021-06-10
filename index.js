const { combinedFiles, removeFiles } = require("./src/files");
const { reformatContact, removeMNumbers, checkDNC } = require("./src/helpers");
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
        let validatedNumbers = [];
        let dncList = [];

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

        console.log("\n------- BEFORE -------");
        console.log("mNumbers total =", mNumbers.length);
        console.log("pNumbers total =", pNumbers.length);
        console.log("------- BEFORE -------\n");

        let numbers = {
            mobile: mNumbers.length,
            dnc: 0,
            valid: 0,
        };

        total = 0;

        // validate pNumbers
        for (let contact of pNumbers) {
            total++;

            try {
                const carrierType = await lookup(contact["Phone Number"]);

                if (carrierType.carrier.type === "mobile") {
                    numbers.mobile++;

                    const isDNC = await checkDNC(contact["Phone Number"]);

                    if (isDNC) {
                        dncList.push(contact);
                    } else {
                        validatedNumbers.push(contact);
                    }

                    // mNumbers.push(contact);
                }
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

        // validate mNumbers
        for (let contact of mNumbers) {
            try {
                const isDNC = await checkDNC(contact["Phone Number"]);

                if (isDNC) {
                    dncList.push(contact);
                } else {
                    validatedNumbers.push(contact);
                }
            } catch (error) {
                console.log(error);
            }
        }

        writeCsvFile(validatedNumbers, "coStar_validatedNumbers");
        writeCsvFile(dncList, "coStar_dncList");
        // writeCsvFile(mNumbers, "coStar_mNumbers");

        console.log("------- AFTER -------");
        numbers.dnc = dncList.length;
        numbers.valid = validatedNumbers.length;
        console.log(numbers);
        console.log("validatedNumbers total =", validatedNumbers);
        console.log("------- AFTER -------\n");

        setTimeout(() => {
            removeFiles("inputJSON");
        }, 750);
    } catch (error) {
        console.log("ERROR ---", error);
    }
})();
