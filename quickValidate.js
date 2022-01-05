let allData = require("./inputJSON/data.json");
const writeCsvFile = require("./src/writeCsv");
const { validateProspect } = require("./src/helpers");

let numProspects = 100;
let iterations = Math.ceil(allData.length / numProspects);

(async () => {
    try {
        console.log("Total numbers =", allData.length);

        let mobileNumbers = [];

        for (let i = 1; i <= iterations; i++) {
            let prospects = allData.splice(0, numProspects);

            const validateNumbers = prospects.map((prospect) => validateProspect(prospect));
            const validatedNumbers = await Promise.all(validateNumbers);

            mobileNumbers = [...mobileNumbers, ...validatedNumbers];

            console.log(`Validated: ${validatedNumbers.length} numbers`);
        }

        let mobileProspects = [];
        let emailProspect = [];

        mobileNumbers.forEach((prospect) => {
            if (prospect.phoneType === "mobile") {
                mobileProspects.push({ ...prospect, Outreach: "Text" });
            }

            if (prospect.phoneType !== "mobile") {
                emailProspect.push({ ...prospect, Outreach: "Email" });
            }
        });

        console.log("mobileProspects total =", mobileProspects.length);
        console.log("emailProspect total =", emailProspect.length);

        writeCsvFile(mobileProspects, "mobileProspects");
        writeCsvFile(emailProspect, "emailProspect");
    } catch (error) {
        console.log(error);
    }
})();
