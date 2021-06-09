const { checkDNC } = require("./src/helpers");

(async () => {
    try {
        const isDNC = await checkDNC("3032635034");

        console.log(isDNC);
    } catch (error) {
        console.log(error);
    }
})();
