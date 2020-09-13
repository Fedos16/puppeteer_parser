import puppeteer from 'puppeteer'

export const LAUNCH_PUPPETEER_OPTS = {
    args: [
        '--window-size=1920x1080'
    ]
};

export const PAGE_PUPPETEER_OPTS = {
    networkIdle2Timeout: 5000,
    waitUntil: 'networkidle2',
    timeout: 3000000
};

export async function getPageContent(url, proxy, text) {
    try {

        /**
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu'
         */
        /* `--proxy-server=${proxy.ip}:${proxy.port}` */
        const browser = await puppeteer.launch({
            headless: false,
            args : [
                '--window-size=1920,1080',
            ]
        });
        const page = await browser.newPage(PAGE_PUPPETEER_OPTS);
        await page.setViewport({width: 1920, height: 1080});

        await page.authenticate({username: proxy.user, password: proxy.pass});
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36');

        //let url = 'https://api.ipify.org/';
        await page.goto(url);
        if (text) {
            await page.type('input[id=header-search]', text);
            await page.keyboard.press('Enter');
        }
        await page.waitForNavigation();

        //await page.screenshot({path: 'example.png'});

        const content = await page.content();
        browser.close();

        console.log('Браузер закрыт');

        return content;

    } catch (e) {
        throw e
    }
}