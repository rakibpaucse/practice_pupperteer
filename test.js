const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({headless: false , ignoreHTTPSErrors: true});
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('https://www.psychologytoday.com/us/therapists?search=Alaska' , {waitUntil: 'load', timeout: 0});
    await page.waitFor(1000)


    await page.waitForSelector('.hidden-xs-down');
    let pageList = await page.evaluate(
        () => Array.from(document.querySelectorAll('.hidden-xs-down > .hidden-xs-down'),a => a.href)) 
   

    let scrapData = async (link) => {
        await page.goto(`${link}` , {waitUntil: 'load', timeout: 0}) 
    await page.waitForSelector('.hidden-xs-down');
    let NewpageList = await page.evaluate(
        () => Array.from(document.querySelectorAll('.hidden-xs-down > .hidden-xs-down'),a => a.href)) 
        return NewpageList
    }


    let nextBtn = null;

    while( nextBtn != pageList[pageList.length - 1] ){
    nextBtn = pageList[pageList.length - 1]
    let temp = await scrapData(pageList[pageList.length - 1])
        pageList.push(...temp)
    }


    //doctors

    let getDoctorList = async (link) => {

    await page.goto(`${link}` , {waitUntil: 'load', timeout: 0}) 
    await page.waitForSelector('.result-name');
    let doctorsList = await page.evaluate(
      () => Array.from(document.querySelectorAll('.result-name'), a => a.href) ) 

    // doctorsList.forEach((doc , index) => console.log(index , doc))
        return doctorsList
    }

    let fullDoctorList = []
     pageList = pageList.filter((v, i, a) => a.indexOf(v) === i);
     for(let page of pageList){
            let docTemp = await getDoctorList(page)
            fullDoctorList.push(...docTemp)
        };

        let mainOutput = [] 

        for(let eachDoc of fullDoctorList){

            await page.goto(`${eachDoc}` , {waitUntil: 'load', timeout: 0}) 
            await page.screenshot({path: 'screenshot.png'});
            await page.waitForSelector('.profile-name-phone');

          let name = await page.evaluate(
           () => document.querySelector('[itemprop="name"]').innerHTML)  

          let phoneNumber = await page.evaluate(
           () => document.querySelector('[itemprop="telephone"] a').innerHTML)
             
          let details = await page.evaluate(
                () =>    Array.from(document.querySelectorAll('.profile-name-phone .nowrap')).map(a => a.innerText ).join('')
                ) 
                 
            let eachDoctorDetails = {}

            eachDoctorDetails.name = name ;
            eachDoctorDetails.phoneNumber = phoneNumber ;
            eachDoctorDetails.details = details ;

            const hasWebsite = await page.evaluate(
              ()=>  document.querySelector('[data-event-label="website"]'))

            if(hasWebsite){
                let webLink = await page.evaluate(
                () => document.querySelector('[data-event-label="website"]').href)
                await page.goto(`${webLink}` , {waitUntil: 'load', timeout: 0}).catch(e => void 0) 

                await page.waitFor(1000)
                 let Url =  await page.evaluate(
                      () => document.URL
                  )
                  eachDoctorDetails.Url = Url ;

                const fullPageContent = await page.evaluate(() => document.querySelector('*').outerHTML);

                var email  = fullPageContent.match(/[\w\.-]+@[\w\.-]+\.\w{2,4}/)

                email ? eachDoctorDetails.email = email[0] : null
            }

            mainOutput.push(eachDoctorDetails) 
            
        }

        mainOutput.forEach((doc , index) => console.log(index , doc))


    // await browser.close();
    // await page.screenshot({path: 'screenshot.png'});
  })();









// const puppeteer = require('puppeteer');
// (async () => {
//     const browser = await puppeteer.launch({headless: false , ignoreHTTPSErrors: true});
//     const page = await browser.newPage();
//     await page.setViewport({ width: 1280, height: 800 });
//     await page.goto('https://www.recoverywaterscounseling.com/' , {waitUntil: 'load', timeout: 0});
//     await page.waitFor(1000)

//         // const content = await page.evaluate(
//         //       ()=>  document.querySelector('[data-event-label="website"]'))

//         const fullPageContent = await page.evaluate(() => document.querySelector('*').outerText);

//         var email  = fullPageContent.match(/[\w\.-]+@[\w\.-]+\.\w{2,4}/)[0]

//           console.log(email);
          
              

//     await page.screenshot({path: 'screenshot.png'});
//     // await browser.close();
//   })();
