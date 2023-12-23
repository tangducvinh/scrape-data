const puppeteer = require('puppeteer')

const startBrowser = async() => {
    let browser
    try {
        browser = await puppeteer.launch({
            args: ["--disable-setuid-sanbox"],
            'ignorHTTPSErrors': true
        })

    } catch(error) {
        console.log("No create browser: " + error)
    }

    return browser
}

module.exports = startBrowser