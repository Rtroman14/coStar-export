const allData = require("./inputJSON/data.json");
const lookup = require("./src/validateNumber");
const writeCsvFile = require("./src/writeCsv");

let mNumbers = [];
let pNumbers = [];

let total = 0;

(async () => {
    try {
        for (let data of allData) {
            total++;

            try {
                const carrierType = await lookup(data["Phone Number"]);
                carrierType.carrier.type === "mobile" ? mNumbers.push(data) : pNumbers.push(data);
            } catch (error) {
                console.log("\n ---------- ERROR START ----------\n");
                console.log(error);

                console.log(data);
                console.log("\n ---------- ERROR END ----------\n");
            }

            // data["Phone Number"].includes("407") ? mNumbers.push(data) : pNumbers.push(data);

            total % 50 === 0 && console.log(`Contacts left to validate: ${allData.length - total}`);
        }

        console.log("mNumbers total =", mNumbers.length);
        console.log("pNumbers total =", pNumbers.length);

        writeCsvFile(mNumbers, "mNumbers");
        writeCsvFile(pNumbers, "pNumbers");
    } catch (error) {
        console.log(error);
    }
})();
