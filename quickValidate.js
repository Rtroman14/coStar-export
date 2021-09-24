const allData = require("./inputJSON/data.json");
const lookup = require("./src/validateNumber");
const writeCsvFile = require("./src/writeCsv");

let mNumbers = [];
let pNumbers = [];

let total = 0;

(async () => {
    try {
        console.log("Total numbers =", allData.length);

        for (let data of allData) {
            total++;

            try {
                const carrierType = await lookup(data["Phone Number"]);
                carrierType.carrier.type === "mobile" ? mNumbers.push(data) : pNumbers.push(data);
            } catch (error) {
                console.log(error.message);
            }

            total % 100 === 0 &&
                console.log(`Contacts left to validate: ${allData.length - total}`);
        }

        console.log("mNumbers total =", mNumbers.length);
        console.log("pNumbers total =", pNumbers.length);

        writeCsvFile(mNumbers, "mNumbers");
    } catch (error) {
        console.log(error);
    }
})();
