require("dotenv").config();

const NeverBounce = require("neverbounce");

// Initialize NeverBounce client
const client = new NeverBounce({ apiKey: process.env.NEVERBOUNCE_API });

module.exports = (firstLiners, fileName) => {
    // Verify a list of emails
    client.jobs
        .create(
            firstLiners,
            NeverBounce.job.inputType.supplied,
            fileName // Friendly name that can be used to identify job
        )
        .then(
            (resp) =>
                console.log(`Uploaded ${fileName} to NeverBounce with Job ID = ${resp.job_id}`),
            (err) => console.log("ERROR: " + err.message)
        );
};
