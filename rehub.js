const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();

  var count = 1;
  var datas = []
  while(1){

    await page.goto(`https://www.rehab-bd.org/index.php?page=members&page2=${count}&action=Add&NumRec=&asearch=`  , {waitUntil: 'domcontentloaded', timeout: 0});


    await page.waitForSelector('.nav2')
  
      var temp = await page.evaluate( () => 
      Array.from(document.querySelectorAll('.nav2') , a => a.innerText ))
  
       datas =  [...datas , ...temp]
      
      if(count == 5){
          break
      }

      count++
  }

  




//


// let scrapData = async (link) => {
//     await page.goto(`${link}` , {waitUntil: 'domcontentloaded', timeout: 0}) 
// await page.waitForSelector('.nav2')

// // hasNext = [...document.querySelectorAll('a')].filter( ab => ab.innerHTML == '[Next]')[0]
// hasNext = await page.evaluate(
//     () => Array.from(document.querySelectorAll('a') , a => a)) 

// hasNext = hasNext.filter( ab => ab.innerHTML == '[Next]')[0]


// let tempData = await page.evaluate(
//     () => Array.from(document.querySelectorAll('.nav2') , a => a.innerText)) 
//     return tempData
// }


// // let nextBtn = null;
// // let hasNext = [...document.querySelectorAll('a')].filter( ab => ab.innerHTML == '[Next]')[0]

// hasNext = await page.evaluate(
//     () => {
//         let arr = Array.from(document.querySelectorAll('a') )
//         arr.filter(eachData => eachData.innerHTML = '[next]')
//     })
    

// hasNext = hasNext.filter( ab => ab == '[Next]')

// console.log('as' , hasNext[0]);


// while( hasNext[0] ){

// console.log(hasNext[0]);

// let temp = await scrapData(hasNext) 
//     datas.push(...temp)

// }

//

        const webLink = []
        const memberNumber = []
        const companyName = []

        datas.map( data => {
            
        if(data.match("^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$")){
            webLink.push(data)
        }
        else if(data.includes('/')){
            memberNumber.push(data)
        }
        else{
            companyName.push(data)
        }
        })

     
        console.log('Company_Name' , companyName);
        console.log('Web_Links' ,  webLink);
        console.log('Member_Number' ,  memberNumber);
        



//   await browser.close();
})();
