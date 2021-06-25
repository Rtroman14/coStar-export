let property = {
    address: "123 Winters Dr, Colorado Springs, CO 80907",
    street: "123 Winters Dr",
    city: "Colorado Springs",
    state: "CO",
    zip: "80907",
    yearBuild: "2018",
    yearRenovated: "2018",
    buildingArea: "12,000",
    type: "Industrial | Warehouse",
    companyName: "J K Properties Llc",
    companyAddress: "123 Winters Dr, Colorado Springs, CO 80907",
    "person-0_name": "Josiah Baker",
    "person-0_email": "siah@excite.com",
    "person-0_mobile-0": "719-216-9026",
    "person-0_mobile-1": "719-216-9026",
    "person-0_mobile-2": "719-216-9026",
    "person-1_name": "Brandy Lancaster",
    "person-1_email": "",
    "person-2_name": "Keith Kantor",
    "person-2_email": "",
    "person-2_mobile-0": "719-216-9026",
    "person-2_mobile-1": "719-216-9026",
    "person-3_name": "Riki Baker",
    "person-3_email": "",
};

let num = 0;

let mobileKeys = [];
for (let key in property) {
    key.includes(`person-${num}_mobile`) && mobileKeys.push(key);
}

console.log(mobileKeys);

if (mobileKeys.length) {
    console.log("TRUEEE");
    // loop keys and push
    for (let [index, numMobile] of mobileKeys.entries()) {
        console.log({ index });
        console.log({ numMobile });
    }
} else {
    console.log("FALSEEE");
    // push
}
