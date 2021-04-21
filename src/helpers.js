module.exports = {
    reformatContact(department, num, contact) {
        const newContact = {};

        // if ("image" in contact) {
        //     newContact["Image"] = contact.image;
        // } else {
        //     newContact["Image"] = "";
        // }

        // newContact["Type"] = department;

        if (`${department}_Name_${num}` in contact) {
            newContact["Full Name"] = contact[`${department}_Name_${num}`];
        } else {
            newContact["Full Name"] = "";
        }

        if (`${department}_Name_${num}` in contact) {
            newContact["First Name"] = contact[`${department}_Name_${num}`].split(" ")[0];
            newContact["Last Name"] = contact[`${department}_Name_${num}`]
                .split(" ")
                .slice(1)
                .join(" ");
        } else {
            newContact["First Name"] = "";
            newContact["Last Name"] = "";
        }

        if (`${department}_Phone_${num}` in contact) {
            newContact["Phone Number"] = contact[`${department}_Phone_${num}`];
        } else {
            newContact["Phone Number"] = "";
        }

        if ("sf" in contact) {
            newContact["Square Feet"] = contact.sf;
        } else {
            newContact["Square Feet"] = "";
        }

        if (`${department}_Email_${num}` in contact) {
            newContact["Email"] = contact[`${department}_Email_${num}`];
        } else {
            newContact["Email"] = "";
        }

        if ("address" in contact) {
            newContact["Address"] = contact.address;
        } else {
            newContact["Address"] = "";
        }

        if (`${department}_Company` in contact) {
            newContact["Company Name"] = contact[`${department}_Company`];
        } else {
            newContact["Company Name"] = "";
        }

        newContact["First Line"] = "";

        // newContact["Outreach"] = "Email";

        return newContact;
    },

    removeMNumbers(mNumbers, pNumbers) {
        // remove mNumbers from pNumbers
        let pNumbersString = pNumbers.map((e) => JSON.stringify(e));
        let mNumbersString = mNumbers.map((e) => JSON.stringify(e));
        pNumbersString = pNumbersString.filter((contact) => !mNumbersString.includes(contact));
        return Array.from(pNumbersString).map((e) => JSON.parse(e));
    },
};
