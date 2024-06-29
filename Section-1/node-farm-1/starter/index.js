const fs = require("fs");

//////////////////////////////////////////////////
// FILES

/** Blocking, synchronious way */
// Read file content - run by node index.js
const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
console.log(textIn);

const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on: ${new Date().toLocaleString()}`

// Write file in the file stystem
fs.writeFileSync("./txt/output.txt", textOut)
console.log("File written.")

/** Non-blocking, asynchronious way, using callback functions */
fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
    if (err) {
        return console.log("ERROR ❌")
    }
  fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
    console.log(data2);
    fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
      console.log(data3);

      fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
        console.log("Your file has been written ✅");
      });
    });
  });
});

console.log("Start reading file...");