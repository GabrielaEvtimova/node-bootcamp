const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

//////////////////////////////////////////////////
// FILES

/** Blocking, synchronious way */
// Read file content - run by node index.js
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on: ${new Date().toLocaleString()}`;

// // Write file in the file stystem
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written.');

// /** Non-blocking, asynchronious way, using callback functions */
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   if (err) {
//     return console.log('ERROR ❌');
//   }
//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
//       console.log(data3);

//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
//         console.log('Your file has been written ✅');
//       });
//     });
//   });
// });

// console.log('Start reading file...');

//////////////////////////////////////////////////
// SERVER

// Read the data only once before executing the server

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const notFound = fs.readFileSync(`${__dirname}/templates/not-found.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data);

const slugs = dataObject.map((el) => slugify(el.productName, { lower: true }));
// console.log(slugs)

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });

    const cardsHtml = dataObject.map((el) => replaceTemplate(tempCard, el)).join('');

    const output = tempOverview.replace('{%PRODUCT_CARD%}', cardsHtml);
    res.end(output);

    // Product page
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    // If IDs were not the same as the position of the array, we will use filter
    // const product = dataObject.filter((el) => {
    //   if (el.id === +query.id) {
    //     return replaceTemplate(tempProduct, el);
    //   }
    // });
    // const output = replaceTemplate(tempProduct, product[0]);

    const product = dataObject[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);

    // 404 - Not Found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end(notFound);
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.info('Listening at http://127.0.0.1:8000');
});
