const scrapers = require('./scraper')
const fs = require('fs')

const scrapeController = async(browserInstance) => {
    const url = "https://cellphones.com.vn/"
    try {
        let browser = await browserInstance
        let categorys = await scrapers.scrapeCategory(browser, url)

        const resultPage = await scrapers.scrape(browser, categorys[0].link)

        const resultDetail = await scrapers.scrapeDetail(browser, resultPage[0])

        console.log(resultDetail)
        
        // const data = []

        // for (let i = 0; i < categorys.length; i++) {
        //     const resultPages = await scrapers.scrape(browser, categorys[i].link)

        //     for (let resultPage of resultPages) {
        //         if (resultPage == 'https://cellphones.com.vn/samsung-galaxy-a15.html' 
        //             || resultPage == 'https://cellphones.com.vn/samsung-galaxy-s22-ultra-12gb-256gb.html'
        //             || resultPage == 'https://cellphones.com.vn/samsung-galaxy-z-fold-5-256gb.html'
        //             || resultPage == 'https://cellphones.com.vn/xiaomi-mi-pad-5-256gb.html'
        //             || resultPage == 'https://cellphones.com.vn/ipad-10-2-inch-2021.html'
        //             || resultPage == 'https://cellphones.com.vn/samsung-galaxy-tab-a9.html'
        //             || resultPage == 'https://cellphones.com.vn/xiaomi-redmi-pad-se.html'
        //             || resultPage == 'https://cellphones.com.vn/apple-airpods-2.html'
        //             || resultPage == 'https://cellphones.com.vn/apple-airpods-pro-2-usb-c.html'
        //             || resultPage == 'https://cellphones.com.vn/vong-deo-tay-thong-minh-xiaomi-mi-band-8.html'
        //             || resultPage == 'https://cellphones.com.vn/vong-deo-tay-thong-minh-xiaomi-mi-band-8-active.html'
        //             || resultPage == 'https://cellphones.com.vn/rog-ally-z1.html'
        //             || resultPage == 'https://cellphones.com.vn/asus-rog-ally.html'
        //             || resultPage == 'https://cellphones.com.vn/gia-treo-man-hinh-may-tinh-north-bayou-nb-f80.html'
        //             || resultPage == 'https://cellphones.com.vn/gia-treo-man-hinh-may-tinh-north-bayou-nb-f160.html') continue;
        //         else {
        //             const resultDetail = await scrapers.scrapeDetail(browser, resultPage, i)
        //             if (resultDetail === false) continue
        //             else data.push(resultDetail)
        //         }
        //     }
        // }

        // fs.writeFile('products.json', JSON.stringify(data), (err) => {
        //     if (err) console.log("Ghi data vo file json error: " + err)
        //     console.log('Add data success')
        // })
    } catch(e) {
        console.log("Error in scrape controller: "+ e)
    }
}

module.exports = scrapeController