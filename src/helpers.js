require("dotenv").config();

const axios = require("axios");

module.exports = {
    reformatContact(department, num, contact) {
        const newContact = {};

        newContact["Full Name"] = contact[`${department}_Name_${num}`] || "";
        newContact["First Name"] = contact[`${department}_Name_${num}`].split(" ")[0] || "";
        newContact["Last Name"] =
            contact[`${department}_Name_${num}`].split(" ").slice(1).join(" ") || "";
        newContact["Phone Number"] = contact[`${department}_Phone_${num}`] || "";
        newContact["Square Feet"] = contact.sf || "";
        newContact["Address"] = contact.address || "";
        newContact["Street"] = contact.street || "";
        newContact["City"] = contact.city || "";
        newContact["State"] = contact.state || "";
        newContact["Zip"] = contact.zip || "";
        newContact["Email"] = contact[`${department}_Email_${num}`] || "";
        newContact["Company Name"] = contact[`${department}_Company`] || "";
        // newContact.Priority = 1;

        return newContact;
    },
    // reformatContact(department, num, contact) {
    //     const newContact = {};

    //     // if ("image" in contact) {
    //     //     newContact["Image"] = contact.image;
    //     // } else {
    //     //     newContact["Image"] = "";
    //     // }

    //     // newContact["Type"] = department;

    //     if (`${department}_Name_${num}` in contact) {
    //         newContact["Full Name"] = contact[`${department}_Name_${num}`];
    //     } else {
    //         newContact["Full Name"] = "";
    //     }

    //     if (`${department}_Name_${num}` in contact) {
    //         newContact["First Name"] = contact[`${department}_Name_${num}`].split(" ")[0];
    //         newContact["Last Name"] = contact[`${department}_Name_${num}`]
    //             .split(" ")
    //             .slice(1)
    //             .join(" ");
    //     } else {
    //         newContact["First Name"] = "";
    //         newContact["Last Name"] = "";
    //     }

    //     if (`${department}_Phone_${num}` in contact) {
    //         newContact["Phone Number"] = contact[`${department}_Phone_${num}`];
    //     } else {
    //         newContact["Phone Number"] = "";
    //     }

    //     if ("sf" in contact) {
    //         newContact["Square Feet"] = contact.sf;
    //     } else {
    //         newContact["Square Feet"] = "";
    //     }

    //     if ("address" in contact) {
    //         newContact["Address"] = contact.address;
    //     } else {
    //         newContact["Address"] = "";
    //     }

    //     if ("street" in contact) {
    //         newContact["Street"] = contact.street;
    //     } else {
    //         newContact["Street"] = "";
    //     }

    //     if ("city" in contact) {
    //         newContact["City"] = contact.city;
    //     } else {
    //         newContact["City"] = "";
    //     }

    //     if ("state" in contact) {
    //         newContact["State"] = contact.state;
    //     } else {
    //         newContact["State"] = "";
    //     }

    //     if ("zip" in contact) {
    //         newContact["Zip"] = contact.zip;
    //     } else {
    //         newContact["Zip"] = "";
    //     }

    //     if (`${department}_Email_${num}` in contact) {
    //         newContact["Email"] = contact[`${department}_Email_${num}`];
    //     } else {
    //         newContact["Email"] = "";
    //     }

    //     if (`${department}_Company` in contact) {
    //         newContact["Company Name"] = contact[`${department}_Company`];
    //     } else {
    //         newContact["Company Name"] = "";
    //     }

    //     newContact.Priority = 1;

    //     // newContact["Outreach"] = "Email";

    //     return newContact;
    // },

    removeMNumbers(mNumbers, pNumbers) {
        // remove mNumbers from pNumbers
        let pNumbersString = pNumbers.map((e) => JSON.stringify(e));
        let mNumbersString = mNumbers.map((e) => JSON.stringify(e));
        pNumbersString = pNumbersString.filter((contact) => !mNumbersString.includes(contact));
        return Array.from(pNumbersString).map((e) => JSON.parse(e));
    },

    async checkDNC(phoneNumber) {
        phoneNumber = phoneNumber.replace(/\D+/g, "");

        try {
            const res = await axios.get(
                `https://api.apeiron.io/v2/numbers/do_not_call/${phoneNumber}`,
                {
                    auth: {
                        username: "ryan@summamedia.co",
                        password: process.env.APEIRON_KEY,
                    },
                }
            );
            return res.data;
        } catch (error) {
            console.log(error);
            return false;
        }
    },

    // async checkDNC(phoneNumber) {
    //     try {
    //         const res = await axios({
    //             method: "post",
    //             url: "https://app.realvalidito.com/tcpaValidationLookup",
    //             data: {
    //                 uid: process.env.REALVALIDITO_UID,
    //                 auth_key: process.env.REALVALIDITO_AUTH_KEY,
    //                 phones: [phoneNumber],
    //             },
    //         });

    //         console.log(res.data.Response);
    //         return res.data.Response.Blacklisted.length > 0 ? true : false;
    //     } catch (error) {
    //         console.log(error);
    //     }
    // },
};
