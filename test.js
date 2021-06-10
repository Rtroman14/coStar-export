const { checkDNC } = require("./src/helpers");

(async () => {
    try {
        const isDNC = await checkDNC("(970) 481-9905");
        // const isDNC = await checkDNC("(303) 263-5034");
        console.log(isDNC);

        // const num = phoneNumber.replace(/\D+/g, "");

        // console.log(num);
    } catch (error) {
        console.log(error);
    }
})();
