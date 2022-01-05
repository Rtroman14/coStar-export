let allData = require("./inputJSON/data.json");
const writeCsvFile = require("./src/writeCsv");
const { validateProspect } = require("./src/helpers");

// TODO: only validate in batches of 100.

(async () => {
    try {
        console.log("Total numbers =", allData.length);

        const validateNumbers = allData.map((prospect) => validateProspect(prospect));

        const validatedNumbers = await Promise.all(validateNumbers);

        let mobileProspects = [];
        let emailProspect = [];

        validatedNumbers.forEach((prospect) => {
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
