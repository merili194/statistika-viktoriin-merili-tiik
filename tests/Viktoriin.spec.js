import { test, expect } from '@playwright/test'

test('avab rakenduse ja kuvab stardivaate', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('.stat-logo')).toBeVisible()
  await expect(page.locator('.start-title')).toContainText('Viktoriin')

  const startBtn = page.getByTestId('start-btn')
  await expect(startBtn).toBeVisible()
  await expect(startBtn).toContainText('Alusta')
})

test('saab küsimusele vastata ja näeb tagasisidet', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('start-btn').click()

  const kysimus = page.getByTestId('kysimus')
  await expect(kysimus).toBeVisible()

  const variantA = page.getByTestId('variant-a')
  await expect(variantA).toBeVisible()
  await variantA.click()
  await expect(variantA).toHaveClass(/valitud/)

  await page.getByTestId('kinnita-btn').click()

  const tagasiside = page.getByTestId('tagasiside')
  await expect(tagasiside).toBeVisible()
  const tekst = await tagasiside.textContent()
  expect(tekst).toMatch(/Õige|Vale/)
})

test('punktisumma suureneb õige vastuse korral', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('start-btn').click()

  const skoorEl = page.getByTestId('skoor')
  await expect(skoorEl).toBeVisible()
  await expect(skoorEl).toContainText('0')

  await page.getByTestId('variant-b').click()
  await page.getByTestId('kinnita-btn').click()

  await expect(page.getByTestId('tagasiside')).toContainText('Õige')

  await page.getByTestId('edasi-btn').click()
  await expect(skoorEl).toContainText('1')
})

test('vale vastuse korral kuvatakse veateade ja õige vastus', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('start-btn').click()

  await page.getByTestId('variant-a').click()
  await page.getByTestId('kinnita-btn').click()

  const tagasiside = page.getByTestId('tagasiside')
  await expect(tagasiside).toBeVisible()
  await expect(tagasiside).toContainText('Vale')

  await expect(page.getByTestId('variant-a')).toHaveClass(/vale/)

  await expect(page.getByTestId('variant-b')).toHaveClass(/oige/)

  // Skoor ei muutu
  await page.getByTestId('edasi-btn').click()
  await expect(page.getByTestId('skoor')).toContainText('0')
})

test('viktoriini lõpus kuvatakse tulemused tabelina', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('start-btn').click()

  const KYSIMUSTE_ARV = 6
  const vastused = ['a', 'b', 'c', 'd', 'a', 'b']

  for (let i = 0; i < KYSIMUSTE_ARV; i++) {
    const variant = page.getByTestId(`variant-${vastused[i]}`)
    await expect(variant).toBeVisible()
    await variant.click()
    await page.getByTestId('kinnita-btn').click()
    await expect(page.getByTestId('edasi-btn')).toBeVisible()
    await page.getByTestId('edasi-btn').click()
  }

  await expect(page.getByTestId('lopptulemus')).toBeVisible()
  await expect(page.getByTestId('tabel')).toBeVisible()

  const read = page.getByTestId('tabel').locator('tbody tr')
  await expect(read).toHaveCount(KYSIMUSTE_ARV)

  for (let i = 0; i < KYSIMUSTE_ARV; i++) {
    const badge = read.nth(i).locator('.badge')
    await expect(badge).toBeVisible()
    expect(await badge.textContent()).toMatch(/Õige|Vale/)
  }
})

test('saab uuesti alustada pärast viktoriini lõppu', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('start-btn').click()

  for (let i = 0; i < 6; i++) {
    await page.getByTestId('variant-a').click()
    await page.getByTestId('kinnita-btn').click()
    await expect(page.getByTestId('edasi-btn')).toBeVisible()
    await page.getByTestId('edasi-btn').click()
  }

  await expect(page.getByTestId('uuesti-btn')).toBeVisible()
  await page.getByTestId('uuesti-btn').click()

  await expect(page.getByTestId('skoor')).toContainText('0')
  await expect(page.getByTestId('kysimus')).toBeVisible()
})