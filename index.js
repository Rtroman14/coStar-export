const { combinedFiles, removeFiles } = require("./src/files");
const { reformatContact, removeMNumbers, checkDNC } = require("./src/helpers");
const writeCsvFile = require("./src/writeCsv");
const lookup = require("./src/validateNumber");

let contacts = [];

(async () => {
    try {
        const coStarData = await combinedFiles("inputJSON");

        // ORGANIZE COSTAR DATA
        coStarData.forEach((contact) => {
            for (let i = 1; i < 4; i++) {
                if (`trueOwner_Email_${i}` in contact) {
                    contacts.push(reformatContact("trueOwner", i, contact));
                }
                if (`propertyManagement_Email_${i}` in contact) {
                    contacts.push(reformatContact("propertyManagement", i, contact));
                }
                if (`previousTrueOwner_Email_${i}` in contact) {
                    contacts.push(reformatContact("previousTrueOwner", i, contact));
                }
                if (`trueOwner_Name_${i}` in contact) {
                    contacts.push(reformatContact("trueOwner", i, contact));
                }
                if (`propertyManagement_Name_${i}` in contact) {
                    contacts.push(reformatContact("propertyManagement", i, contact));
                }
                if (`previousTrueOwner_Name_${i}` in contact) {
                    contacts.push(reformatContact("previousTrueOwner", i, contact));
                }
            }
        });

        // REMOVE DUPLICATES
        const contactsJson = new Set(contacts.map((e) => JSON.stringify(e)));
        contacts = Array.from(contactsJson).map((e) => JSON.parse(e));

        console.log("contacts total =", contacts.length);

        let nameList = []; // every mobile number
        let pNumbers = [];
        let mNumbers = [];

        // SORT MOBILE AND LANDLINE NUMBERS
        contacts.forEach((contact) => {
            if (contact["Phone Number"] !== "" && !nameList.includes(contact["Full Name"])) {
                delete contact["First Line"];

                if (contact["Phone Number"].includes("X")) {
                    let phoneNumber = contact["Phone Number"].slice(
                        0,
                        contact["Phone Number"].indexOf(" X")
                    );

                    pNumbers.push({
                        ...contact,
                        "Phone Number": phoneNumber,
                    });
                }

                if (contact["Phone Number"].includes("(p)")) {
                    let phoneNumber = contact["Phone Number"].replace(" (p)", "");

                    pNumbers.push({
                        ...contact,
                        "Phone Number": phoneNumber,
                    });
                }

                if (contact["Phone Number"].includes("(m)")) {
                    let phoneNumber = contact["Phone Number"].replace(" (m)", "");

                    mNumbers.push({
                        ...contact,
                        "Phone Number": phoneNumber,
                        Outreach: "Text",
                    });
                    nameList.push(contact["Full Name"]);
                }
            }
        });

        total = 0;

        // CHECK IF pNUMBERS ARE MOBILE
        for (let contact of pNumbers) {
            total++;

            if (!nameList.includes(contact["Full Name"])) {
                try {
                    const carrierType = await lookup(contact["Phone Number"]);

                    if (carrierType.carrier.type === "mobile") {
                        mNumbers.push({
                            ...contact,
                            Outreach: "Text",
                        });
                        nameList.push(contact["Full Name"]);
                    }
                } catch (error) {
                    console.log(
                        `Error validating: ${contact["Phone Number"]} --- ${error.message}`
                    );
                }
            }

            total % 50 === 0 &&
                console.log(`Contacts left to validate: ${pNumbers.length - total}`);
        }

        let emailList = [];

        let emailContacts = contacts.filter((contact) => {
            if (
                contact.Email !== "" &&
                !emailList.includes(contact.Email) &&
                !nameList.includes(contact["Full Name"])
            ) {
                emailList.push(contact.Email);
                nameList.push(contact["Full Name"]);

                return contact;

                // CAN'T MUTATE WITH FILTER METHOD
                // return {
                //     ...contact,
                //     Outreach: "Email",
                // };
            }
        });

        emailContacts = emailContacts.map((contact) => ({ ...contact, Outreach: "Email" }));

        writeCsvFile(emailContacts, "coStar_emails");
        writeCsvFile(mNumbers, "coStar_mobile");

        console.log("mNumbers total =", mNumbers.length);
        console.log("emailContacts total =", emailContacts.length);

        setTimeout(() => {
            removeFiles("inputJSON");
        }, 750);
    } catch (error) {
        console.log("ERROR ---", error);
    }
})();
