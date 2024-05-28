import { MetaMask, metaMaskFixtures, testWithSynpress } from "@synthetixio/synpress";
import { setTimeout } from "timers/promises";

import  basicSetup  from "../test/wallet-setup/basic.setup";

const test = testWithSynpress(metaMaskFixtures(basicSetup));

const { expect } = test;

test('Connect to your wallet', async ({ context, page, extensionId }) => {
  const metamask = new MetaMask(context, page, basicSetup.walletPassword, extensionId)

  await page.goto("/dashboard");

  await page.getByRole('button', { name: 'Connect wallet' }).click(); //missing "data-testid"

  await page.getByLabel('Connect and authenticate').getByRole('button', { name: 'Connect wallet' }).click(); //missing "data-testid"

  let retries = 30;
  while(!await page.getByText('Skip, I have a wallet').isVisible() && retries > 0) {
    retries--;
    setTimeout(100);
  }

  if(await page.getByText('Skip, I have a wallet').isVisible()){
    await page.getByText('Skip, I have a wallet').click();
  }

  await page.locator('wui-list-wallet', { hasText: 'MetaMask' }).click();

  await metamask.connectToDapp();

  await page.getByRole('button', { name: 'Accept and sign' }).click();

  // await page.pause();
  
  console.log(metamask.extensionId);
  
  await metamask.confirmSignature();

});
