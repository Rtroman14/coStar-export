const fs = require("fs");
const path = require("path");

module.exports = {
    async combinedFiles(directory) {
        let combinedFiles = [];

        const files = await fs.promises.readdir(directory);
        for (const file of files) {
            const jsonFile = require(`../${directory}/${file}`);
            combinedFiles = [...combinedFiles, ...jsonFile];
        }

        return combinedFiles;
    },

    async removeFiles(directory) {
        await fs.promises.readdir(directory, (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.promises.unlink(path.join(directory, file), (err) => {
                    if (err) throw err;
                });
                console.log("Removed", file);
            }
        });
    },
};
