const { combinedFiles, removeFiles } = require("./src/files");
const { reformatContact, removeMNumbers, checkDNC } = require("./src/helpers");
const writeCsvFile = require("./src/writeCsv");
const lookup = require("./src/validateNumber");

let contacts = [];

const FILENAME = "";

(async () => {
    try {
        const reonomyData = await combinedFiles("inputJSON");

        for (let property of reonomyData) {
            const lastPersonKey = Object.keys(property)[Object.keys(property).length - 1]; // person-2_name

            const numPeople = lastPersonKey.slice(
                lastPersonKey.indexOf("-") + 1,
                lastPersonKey.indexOf("_")
            ); // 2

            for (let num = 0; num <= numPeople; num++) {
                let person = {};

                let mobileKeys = [];
                for (let key in property) {
                    key.includes(`person-${num}_mobile`) && mobileKeys.push(key);
                }

                if (mobileKeys.length) {
                    for (let [numMobile, key] of mobileKeys.entries()) {
                        person["Full Name"] = property[`person-${num}_name`] || "";
                        person["First Name"] = property[`person-${num}_name`].split(" ")[0] || "";
                        person["Last Name"] =
                            property[`person-${num}_name`].split(" ").slice(1).join(" ") || "";
                        person["Phone Number"] =
                            property[`person-${num}_mobile-${numMobile}`] || "";
                        person["Square Feet"] = property.buildingArea || "";
                        person.Address = property.address || "";
                        person.Street = property.street || "";
                        person.City = property.city || "";
                        person.State = property.state || "";
                        person.Zip = property.zip || "";
                        person.Email = property[`person-${num}_email`] || "";
                        person["Company Name"] = property.companyName || "";
                        person["Company Address"] = property.companyAddress || "";
                        person["Year Built"] = property.yearBuild || "";
                        person["Year Renovated"] = property.yearRenovated || "";
                        person["Building Type"] = property.type || "";
                        person.Priority = 1;
                    }
                } else {
                    person["Full Name"] = property[`person-${num}_name`] || "";
                    person["First Name"] = property[`person-${num}_name`].split(" ")[0] || "";
                    person["Last Name"] =
                        property[`person-${num}_name`].split(" ").slice(1).join(" ") || "";
                    person["Phone Number"] = "";
                    person["Square Feet"] = property.buildingArea || "";
                    person.Address = property.address || "";
                    person.Street = property.street || "";
                    person.City = property.city || "";
                    person.State = property.state || "";
                    person.Zip = property.zip || "";
                    person.Email = property[`person-${num}_email`] || "";
                    person["Company Name"] = property.companyName || "";
                    person["Company Address"] = property.companyAddress || "";
                    person["Year Built"] = property.yearBuild || "";
                    person["Year Renovated"] = property.yearRenovated || "";
                    person["Building Type"] = property.type || "";
                    person.Priority = 1;
                }

                contacts.push(person);
            }
        }

        // remove duplicates
        const contactsJson = new Set(contacts.map((e) => JSON.stringify(e)));
        contacts = Array.from(contactsJson).map((e) => JSON.parse(e));

        let mobileList = [];
        let nameList = [];

        const mobileContacts = contacts.filter((contact) => {
            if (contact["Phone Number"] !== "" && !mobileList.includes(contact["Phone Number"])) {
                mobileList.push(contact["Phone Number"]);
                nameList.push(contact["Full Name"]);
                return contact;
            }
        });

        let emailList = [];

        const emailContacts = contacts.filter((contact) => {
            if (
                contact.Email !== "" &&
                !emailList.includes(contact.Email) &&
                !nameList.includes(contact["Full Name"])
            ) {
                emailList.push(contact.Email);
                return contact;
            }
        });

        console.log("emails total =", emailContacts.length);
        console.log("mobile total =", mobileContacts.length);

        writeCsvFile(emailContacts, "reonomy_emails");
        writeCsvFile(mobileContacts, "reonomy_mobile");

        // setTimeout(() => {
        //     removeFiles("inputJSON");
        // }, 750);
    } catch (error) {
        console.log("ERROR ---", error);
    }
})();
