const lookup = require("./src/validateNumber");

let phoneNumber = "(715) 252-5716";

(async () => {
    try {
        const res = await lookup(phoneNumber);

        console.log(res);
    } catch (error) {
        console.log(error);
    }
})();
