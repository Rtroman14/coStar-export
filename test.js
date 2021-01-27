const { combinedFiles } = require("./src/files");

(async () => {
    let data = await combinedFiles("inputJSON");

    console.log(data.length);
})();
