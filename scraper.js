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
                const check = el.querySelectorAll('a')

                if (check.length > 1) {
                    return [
                        {
                            category: el.querySelectorAll('span')[0].innerText,
                            link: el.querySelectorAll('a')[0].href
                        },
                        {
                            category: el.querySelectorAll('span')[1].innerText,
                            link: el.querySelectorAll('a')[1].href
                        }
                    ]
                } else {
                    return {
                        category: el.querySelector('span').innerText,
                        link: el.querySelector('a').href
                    }
                }
            })

            return dataCategory
        })

        const data = []

        for (let i = 0; i < 8; i++) {
            if(dataCategory[i][0]) {
                if (i == 6) {
                    data.push(dataCategory[i][1])
                } else {
                    data.push(dataCategory[i][0])
                    data.push(dataCategory[i][1])
                }
            } else {
                data.push(dataCategory[i])
            }
        }

        await page.close()
        resolve(data)
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

const scrapeDetail = (browser, url, i) => new Promise(async(resolve, reject) => {
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

        switch(i) {
            case 0: 
                detailData.category = "smartphone"
                break;
            case 1: 
                detailData.category = "tablet"
                break;
            case 2: 
                detailData.category = "laptop"
                break;
            case 3: 
                detailData.category = "audio"
                break;
            case 4: 
                detailData.category = "watch"
                break;
            case 5: 
                detailData.category = "camera"
                break;
            case 6: 
                detailData.category = "appliances"
                break;
            case 7: 
                detailData.category = "smarthome"
                break;
            case 8: 
                detailData.category = "accessory"
                break;
            case 9: 
                detailData.category = "monitor"
                break;
            case 10: 
                detailData.category = "tivi"
                break;
        }

        if (i !== 3 && i !== 5 && i !== 6 && i !== 7 && i !== 8 && i !== 10) {
            const getPrice = await page.$eval('#trade-price-tabs > div.tpt-wrapper > div.tpt-boxs > div.has-text-centered', (el) => {
                return {
                    sale: el.querySelector('p.tpt---sale-price')?.innerText,
                    price: el.querySelector('p.tpt---price')?.innerText,
                }
            })
            detailData.price = getPrice
        } else {
            const getPrice2 = await page.$eval('#productDetailV2 > section.block-detail-product > div.box-detail-product > div.box-detail-product__box-center > div.block-box-price > div.box-info__box-price', (el) => {
                return {
                    sale: el.querySelector('p.product__price--show')?.innerText,
                    price: el.querySelector('p.product__price--through')?.innerText,
                }
            })
            detailData.price = getPrice2
        }
        
        const getIncentives = await page.$$eval('#productDetailV2 > section.block-detail-product > div.box-detail-product > div.box-detail-product__box-center > div.box-product-promotion > div.box-product-promotion-content > div', (els) => {
            return els.map(el => {
                return el.querySelector('a')?.innerHTML
            })
        })
        detailData.incentives = getIncentives

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
                return el.querySelector('div.description')?.innerText
            })
        })
        detailData.information = information

        const highlights = await page.$$eval('#productDetailV2 > section.block-detail-product > div.block-content-product > div.block-content-product-left > div.cps-block-content > div.ksp-content > div > ul > li', (els) => {
            return els.map(el => {
                return el?.innerText
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
                    data: el.querySelector('strong')?.innerText,
                    price: el.querySelector('span')?.innerText
                }
            })
        })
        detailData.version = version

        const getDescription = await page.$eval('#productDetailV2 > section.block-detail-product > div.block-content-product > div.block-content-product-right', (el) => {
            return el.innerHTML
        })
        detailData.description = getDescription

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