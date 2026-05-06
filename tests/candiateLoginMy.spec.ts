import { test, expect } from '@playwright/test';


test('Login to the xpressjobs valid candiate account', async ({ page }) => {
  // 1. ARRANGE: Go to the site
  await page.goto('https://xpress.jobs/candidates/login');

  // 2. ACT: Log in
  await page.locator('[name="email"]').fill('asankagamage1998@gmail.com');
  await page.locator('[name="password"]').fill('gamage98@xj');
  await page.getByRole('button', { name: 'Login', exact: true }).click();

  await expect(page).toHaveURL('https://xpress.jobs/candidate/home');
});


//testing invalid email
test('Login fails with invalid email', async ({ page }) => {
  await page.goto('https://xpress.jobs/candidates/login');

  await page.locator('[name="email"]').fill('wrongemail@gmail.com');
  await page.locator('[name="password"]').fill('ValidPassword123');
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  //This automatically ignores SVG and focuses only on text.
  const alertMessage = (page.getByText('The email or password you entered is incorrect.'));  
  await expect(alertMessage).toBeVisible();

});

test('Login fails with invalid email format (missing @)', async ({ page }) => {
  await page.goto('https://xpress.jobs/candidates/login');

  await page.locator('[name="email"]').fill('wrongemail.com');
  await page.locator('[name="password"]').fill('ValidPassword123');
  await page.getByRole('button', { name: 'Login', exact: true }).click();

  await expect(page.getByText('Some of the required fields are missing.')).toBeVisible();
});

test('Login fails with invalid email format (missing domain)', async ({ page }) => {
  await page.goto('https://xpress.jobs/candidates/login');

  await page.locator('[name="email"]').fill('wrongemail@');
  await page.locator('[name="password"]').fill('ValidPassword123');
  await page.getByRole('button', { name: 'Login', exact: true }).click();

  await expect(page.getByText('Some of the required fields are missing.')).toBeVisible();
});

test('Login fails with unregistered email', async ({ page }) => {
  await page.goto('https://xpress.jobs/candidates/login');

  await page.locator('[name="email"]').fill('notregistered123@gmail.com');
  await page.locator('[name="password"]').fill('ValidPassword123');
  await page.getByRole('button', { name: 'Login', exact: true }).click();

  await expect(page.getByText('The email or password you entered is incorrect.')).toBeVisible();
});

test('Login fails when email is empty', async ({ page }) => {
  await page.goto('https://xpress.jobs/candidates/login');

  await page.locator('[name="password"]').fill('ValidPassword123');
  await page.getByRole('button', { name: 'Login', exact: true }).click();

  await expect(page.getByText('Some of the required fields are missing.')).toBeVisible();
});

test('Login trims email with spaces', async ({ page }) => {
  await page.goto('https://xpress.jobs/candidates/login');

  await page.locator('[name="email"]').fill(' asankagamage1998@gmail.com ');
  await page.locator('[name="password"]').fill('gamage98@xj');
  await page.getByRole('button', { name: 'Login', exact: true }).click();

  await expect(page.getByText('Some of the required fields are missing.')).toBeVisible();
});


test('Login with uppercase email should still fail if not registered', async ({ page }) => {
  await page.goto('https://xpress.jobs/candidates/login');

  await page.locator('[name="email"]').fill('ASANKAGAMAGE1998@GMAIL.COM');
  await page.locator('[name="password"]').fill('gamage98@xj');
  await page.getByRole('button', { name: 'Login', exact: true }).click();

 await expect(page).toHaveURL('https://xpress.jobs/candidate/home');
});

//invalid password
test('Login fails with invalid password' ,async ({page}) => {
  await page.goto('https://xpress.jobs/candidates/login');
  await page.locator('[name="email"]').fill('asankagamage1998@gmail.com');
  await page.locator('[name="password"]').fill('123');
  await page.getByRole('button', { name: 'Login', exact: true }).click();

  //This automatically ignores SVG and focuses only on text.
  const alertMessage = (page.getByText('The email or password you entered is incorrect.'));  
  await expect(alertMessage).toBeVisible();

});

//UI Testing

test('Check the availability of the login form title', async ({ page }) => {
  await page.goto('https://xpress.jobs/candidates/login');

  // await expect(page.locator('p', { hasText: 'Job Seeker Login' })).toHaveText('Job Seeker Login');
  //const subtTitle = page.locator('p', { hasText: 'Job Seeker Login' });
   const subtTitle = page.getByText('Job Seeker Login');
  // text check
  await expect(subtTitle).toHaveText('Job Seeker Login');

  // CSS checks
  await expect(subtTitle).toHaveCSS('font-size', '12.032px');
  await expect(subtTitle).toHaveCSS('font-weight', '700');
  await expect(subtTitle).toHaveCSS('color', 'rgb(11, 19, 43)');

});
