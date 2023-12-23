const scrapeCategory = (browser, url) => new Promise(async(resolve, reject) => {
    try {
        // new page
        let page = await browser.newPage()
        console.log('New page')
        // access url
        await page.goto(url)
        console.log('Access: '+ url)
        // load website
        await page.waitForSelector('#menu-main')

        const dataCategory = await page.$$eval('#menu-main > div.menu-wrapper > div.menu-tree > div.label-menu-tree', els => {
            dataCategory = els.map(el => {
                return {
                    category: el.querySelector('a').innerText,
                    link: el.querySelector('a').href,
                }
            })

            return dataCategory
        })

        // console.log(dataCategory)

        await page.close()
        resolve(dataCategory)
    } catch(e) {
        console.log("Error in scrape category: "+ e)
        reject()
    }
})

const scrape = (browser, url) => new Promise(async(resolve, reject) => {
    try {
        // new page
        let page = await browser.newPage()
        console.log('New page')
        // access url
        await page.goto(url)
        console.log('Access: '+ url)
        // load website
        await page.waitForSelector('#__nuxt')

        let dataItem = await page.$$eval('#layout-desktop > div.cps-container > div > div.cps-category > div.block-filter-sort > div.filter-sort__list-product > div.block-product-list-filter > div.product-list-filter > div.product-info-container', els => {
            dataItem = els.map(el => {
                return el.querySelector('a').href
            })

            return dataItem
        })

        if (dataItem.length === 0) {
            dataItem = await page.$$eval('div.block-customized-product-list__product-list > div.product-list-swiper > div.swiper-container > div.swiper-wrapper > div.swiper-slide', async(els) => {
                return els.map(el => {
                    return el.querySelector('a').href
                })
            }) 
        }

        await page.close()
        resolve(dataItem)    
    } catch(e) {
        console.log("Error in scrape category: "+ e)
        reject()
    }
})

const scrapeDetail = (browser, url) => new Promise(async(resolve, reject) => {
    try {
        // new page
        let page = await browser.newPage()
        console.log('new page')
        // access url
        await page.goto(url)
        console.log('Access: '+ url)
        // load website
        await page.waitForSelector('#__nuxt')

        const detailData = {}

        const getName = await page.$eval('#productDetailV2 > section.block-detail-product > div.box-header > div.box-product-name', (el) => {
            return el.querySelector('h1')?.innerText
        })
        detailData.name = getName

        detailData.brand = getName.split(' ')[0]

        const images = await page.$$eval('section.block-detail-product > div.box-detail-product > div.box-detail-product__box-left > div.box-gallery > div.gallery-product-detail > div.gallery-slide > div.swiper-wrapper > div.swiper-slide', (els) => {
            return els.map(el => {
                return el.querySelector('img')?.src
            })
        })
        detailData.images = images

        const description = await page.$$eval('section.block-detail-product > div.block-content-product > div.block-content-product-right > div > div.cps-block-technicalInfo > ul > li', (els) => {
            return els.map(el => {
                return {
                    key: el.querySelector('p').innerText,
                    value: el.querySelector('div').innerText,
                }
            })
        })
        detailData.description = description

        const variants = await page.$$eval('#productDetailV2 > section.block-detail-product > div.box-detail-product > div.box-detail-product__box-center > div.box-product-variants > div.box-content > ul > li', (els) => {
            return els.map(el => {
                return {
                    image: el.querySelector('img')?.src,
                    color: el.querySelector('strong')?.innerText,
                    price: el.querySelector('span')?.innerText,
                }
            })
        })
        detailData.variants = variants

        const information = await page.$$eval('#productDetailV2 > section.block-detail-product > div.box-detail-product > div.box-detail-product__box-left > div.columns > div.column > div.box-warranty-info > div.box-content > div.item-warranty-info', (els) => {
            return els.map(el => {
                return el.querySelector('div.description').innerText
            })
        })
        detailData.information = information

        const highlights = await page.$$eval('#productDetailV2 > section.block-detail-product > div.block-content-product > div.block-content-product-left > div.cps-block-content > div.ksp-content > div > ul > li', (els) => {
            return els.map(el => {
                return el.innerText
            })
        })
        detailData.highlights = highlights

        const star = await page.$$eval('#productDetailV2 > section.block-detail-product > div.box-header > div.box-rating > div.icon', (els) => {
            let count = 0;
            for (var el of els) {
                count++
            }
            return count
        })
        detailData.star = star

        const version = await page.$$eval('#productDetailV2 > section.block-detail-product > div.box-detail-product > div.box-detail-product__box-center > div.box-linked > div.list-linked > a', (els) => {
            return els.map(el => {
                return {
                    data: el.querySelector('strong').innerText,
                    price: el.querySelector('span').innerText
                }
            })
        })
        detailData.version = version


        await page.close()
        resolve(detailData)
    } catch(e) {
        console.log("Error in scrape category: "+ e)
        reject()
    }
})

module.exports = {
    scrapeCategory,
    scrape,
    scrapeDetail,
}