const scrapers = require('./scraper')
const fs = require('fs')

const scrapeController = async(browserInstance) => {
    const url = "https://cellphones.com.vn/"
    try {
        let browser = await browserInstance
        let categorys = await scrapers.scrapeCategory(browser, url)

        const data = []

        for (let i = 0; i < 8; i++) {
            const itemLinks = await scrapers.scrape(browser, categorys[i].link)

            for (let itemLink of itemLinks) {
                if (itemLink == 'https://cellphones.com.vn/samsung-galaxy-a15.html') continue;
                else {
                    const response = await scrapers.scrapeDetail(browser, itemLink)

                    data.push(response)
                }
            }
        }

        fs.writeFile('ecommerce.json', JSON.stringify(data), (err) => {
            if (err) console.log("Ghi data vo file json error: " + err)
            console.log('Add data success')
        })

    } catch(e) {
        console.log("Error in scrape controller: "+ e)
    }
}

module.exports = scrapeController