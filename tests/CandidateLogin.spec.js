import { test, expect } from '@playwright/test';
import { LoginPage } from '../page/CandidateLoginPage';

test.describe('Candidate Login Tests', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('Successful login with valid credentials', async ({ page }) => {
    // Accessing environment variables
    const email = process.env.VALID_EMAIL ?? 'fallback@example.com';
    const password = process.env.VALID_PASSWORD ?? 'defaultPass123';

    await loginPage.login(email, password);
    await expect(page).toHaveURL(/.*candidate\/home/);
  });

  // Data-Driven Negative Testing
  const invalidScenarios = [
    {
      name: 'Invalid Email',
      user: 'wrong@test.com',
      pass: '123',
      error: 'incorrect',
    },
    {
      name: 'Email missing @ symbol',
      user: 'wrongemail.com',
      pass: '123',
      error: 'required fields',
    },
    {
      name: 'Empty email and password fields',
      user: '',
      pass: '',
      error: 'required fields',
    },
    {
      name: 'Email missing domain',
      user: 'wrongemail',
      pass: '123',
      error: 'required fields',
    },
    {
      name: 'Email missing service name',
      user: 'wrong@.com',
      pass: '123',
      error: 'required fields',
    },
    {
      name: 'Email missing top-level domain',
      user: 'wrong@',
      pass: '123',
      error: 'required fields',
    },
  ];

  for (const scenario of invalidScenarios) {
    test(`Login should fail for: ${scenario.name}`, async ({ page }) => {
      await loginPage.login(scenario.user, scenario.pass);
      // Using a regex 'i' for case-insensitive matching
      await expect(
        page.getByText(scenario.error, { exact: false })
      ).toBeVisible();
    });
  }
});
