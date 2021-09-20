const lookup = require("./src/validateNumber");
const writeCsvFile = require("./src/writeCsv");
const allData = require("./inputJSON/data.json");
const { removeDuplicateByKey } = require("./src/helpers");

console.log("allData =", allData.length);

const uniqueData = removeDuplicateByKey(allData, "Phone Number");

console.log("uniqueData =", uniqueData.length);

let mNumbers = [];
let pNumbers = [];

let total = 0;

(async () => {
    try {
        let name;

        for (let data of uniqueData.slice(0, 800)) {
            total++;

            if (data["Full Name"] !== name) {
                try {
                    const carrierType = await lookup(data["Phone Number"]);

                    if (carrierType.carrier.type === "mobile") {
                        mNumbers.push(data);
                        name = data["Full Name"];
                    } else {
                        pNumbers.push(data);
                    }
                } catch (error) {
                    console.log(error.message);
                }
            }

            total % 50 === 0 &&
                console.log(`Contacts left to validate: ${uniqueData.length - total}`);
        }

        console.log("mNumbers total =", mNumbers.length);
        console.log("pNumbers total =", pNumbers.length);

        writeCsvFile(mNumbers, "mNumbers");
        writeCsvFile(pNumbers, "pNumbers");
    } catch (error) {
        console.log(error);
    }
})();
