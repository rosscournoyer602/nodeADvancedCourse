const puppeteer = require('puppeteer');

let browser, page;

beforeEach(async () => {
  browser = await puppeteer.launch({
    // headless: false
  });
  page = await browser.newPage();
  await page.goto('http://localhost:3000/');
});

afterEach(async () => {
  await browser.close();
});

test('See header logo text', async () => {
  const text = await page.$eval('a.brand-logo', el => el.innerHTML)
  expect(text).toEqual('Blogster');
});

test('Click login starts OAuth flow', async () => {
  await page.click('.right a');
  const url = await page.url();
  expect(url).toContain('https://accounts.google.com');
});

test('When signed in, shows logout button', async () => {
  const Buffer = require('safe-buffer').Buffer;
  const Keygrip = require('keygrip');
  const keys = require('../config/keys');
  const keygrip = new Keygrip([keys.cookieKey]);
  const sessionObject = {"passport":{"user":"5c87529f51f04fb865ca9e75"}};
  const sessionString = Buffer.from(JSON.stringify(sessionObject)).toString('base64');
  const sig = keygrip.sign('session=' + sessionString);
  await page.setCookie({ name: 'session', value: sessionString }, { name: 'session.sig', value: sig });
  await page.goto('http://localhost:3000/');
  await page.waitFor('a[href="/auth/logout"]');
  const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
  expect(text).toEqual('Logout');
})