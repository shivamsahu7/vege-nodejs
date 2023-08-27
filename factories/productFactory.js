const { faker } = require('@faker-js/faker');
const { Product } = require('../models')

async function generateUser() {
    const  producData =await Product.create({
        name:faker.commerce.product(),
        subCategoryId:1
    })
    return producData
    // return {
    //     name: faker.commerce.product(),
    //     // email: faker.internet.email(),
    //     // Add more fields as needed
    // };
}

const args = process.argv.slice(2); // Get command line arguments
console.log(process.argv)
if (args[0] === 'user') {
     async function userfunc(){
        const user = await generateUser()
        // console.log(user);
     }
     userfunc()
} else {
    console.log('Usage: node factory.js <entity>');
    console.log('Supported entities: user');
}

// if (args[0] === 'user') {
//      generateUser().then((user)=>{
//         console.log(user);
//     });
// } else {
//     console.log('Usage: node factory.js <entity>');
//     console.log('Supported entities: user');
// }
