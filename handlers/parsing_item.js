import {getPageContent} from '../helpers/puppeteer'
const cherio = require('cheerio');

const URL = 'https://market.yandex.ru';

export async function getData(TEXT, proxy) {
    try {
        const pageContent = await getPageContent(URL, proxy, TEXT);
        const $ = cherio.load(pageContent);

        let arr = [];
        let arrPrice = {};

        let elements = $('.n-snippet-cell2');
        let elements_2 = $('.n-snippet-list');

        if (elements.length > 0) {
            $('.n-snippet-cell2').each((i, element) => {
                if (i < 11) {
                    const price = $($(element).find('.price')[0]).text().replace(/\D/, '')
                    const name = $(element).find('.n-snippet-cell2__title').text();
                    const new_url = $(element).find('.n-snippet-cell2__more-prices-link a').attr('href');

                    console.log(`${name} - ${price}`)

                    arr.push({name, price, new_url});
                }
            });
        } else {
            $('.n-snippet-card2').each((i, element) => {
                if (i < 11) {
                    const price = $($(element).find('.n-snippet-card2__price .price')[0]).text().replace(/\D/, '')
                    const name = $(element).find('.n-snippet-card2__title').text();
                    const new_url = $(element).find('.n-snippet-card2__more-prices-link a').attr('href');

                    console.log(`${name} - ${price}`)

                    arr.push({name, price, new_url});
                }
            });
        }

        for (let row of arr) {
            let url = row.new_url;
            if (url) url = URL+url;
            const pageContent = await getPageContent(url, proxy);
            const $ = cherio.load(pageContent);
            $('.n-snippet-card').each((i, element) => {
                let price = $(element).find('.snippet-card__info .price').text().replace(/\D/g, '');

                if (TEXT in arrPrice) {
                    arrPrice[TEXT].push({price});
                } else {
                    arrPrice[TEXT] = [{price}];
                }
            });
            break;
        }

        return {alg_1: arr, alg_2: arrPrice}

    } catch(e) {
        console.log('Ошибка !!!');
        console.log(e);
    }
}