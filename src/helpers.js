require("dotenv").config();

const axios = require("axios");

const lookup = require("./validateNumber");

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

    removeDuplicateByKey(objectArray, key) {
        return objectArray.filter(
            (value, index, array) => array.findIndex((t) => t[key] === value[key]) === index
        );
    },

    arrayDifference(newArray, array, key) {
        return newArray.filter(
            ({ [key]: value1 }) => !array.some(({ [key]: value2 }) => value2 === value1)
        );
    },

    numDigits(phoneNumber) {
        return phoneNumber.replace(/[^0-9]/g, "").length;
    },

    async validateProspect(prospect) {
        try {
            const carrierType = await lookup(prospect["Phone Number"]);

            if (carrierType?.carrier.type) {
                return { ...prospect, phoneType: carrierType.carrier.type };
            }

            return { ...prospect, phoneType: "" };
        } catch (error) {
            console.log(error.message);

            return { ...prospect, phoneType: "" };
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
