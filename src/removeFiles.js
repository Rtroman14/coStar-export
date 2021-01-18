const fs = require("fs");
const path = require("path");

module.exports = (directory) => {
    fs.readdir(directory, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(directory, file), (err) => {
                if (err) throw err;
            });
            console.log("Removed", file);
        }
    });
};
