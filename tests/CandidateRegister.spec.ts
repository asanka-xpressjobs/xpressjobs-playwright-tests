import { test, expect } from '@playwright/test';
import { RegisterPage } from '../page/CandidateRegisterPage';
import { LoginPage } from '../page/CandidateLoginPage';
import path from 'path';

test.describe('Candidate Registration Tests', () => {
  let registerPage: RegisterPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    loginPage = new LoginPage(page);
    await loginPage.navigate();

    // Switch to the Register Tab shown in your image
    await page.locator('div').filter({ hasText: /^Register$/ }).click();
  });

  test('Verify that the candiadte can succesfully register ', async ({
    page,
  }) => {
    const userData = {
      firstName: 'testUser',
      lastName: 'test',
      email: `test_user_${Date.now()}@yopmail.com`, // Unique email
      password: 'StrongPassword123!',
      ConfirmPassword: 'StrongPassword123!',
      gender: 'Male' as const,
      homeTown: 'Colombo',
    };

    // 1. Fill Text and Selects
    await registerPage.fillForm(userData);

    // 2. Upload CV (Ensure you have a dummy PDF/DOCX in your project)
    const cvPath = path.resolve(__dirname, '../testData/sample-cv.pdf');
    await registerPage.uploadCV(cvPath);

    // 3. Submit
    await registerPage.clickRegister();

    // 4. Assert Success (Example: looking for a success message or redirect)
    // Update this based on the actual behavior after clicking Register
    await expect(page).toHaveURL(/.*candidate\/home/);
  });

  // --- 2. DATA-DRIVEN NEGATIVE TESTING ---
  const invalidRegistrationScenarios = [
    {
      name: 'Email missing @ symbol',
      email: 'wrongemail.com',
      pass: '123',
      error: 'required fields',
    },
    {
      name: 'Empty email field',
      email: '',
      pass: 'StrongPassword123!',
      error: 'required fields',
    },
    {
      name: 'Email missing domain',
      email: 'wrongemail',
      pass: '123',
      error: 'required fields',
    },
    {
      name: 'Passwords do not match',
      email: 'valid@yopmail.com',
      pass: '123',
      confirmPass: '456',
      error: 'match',
    },
  ];

  for (const scenario of invalidRegistrationScenarios) {
    test(`Register should fail for: ${scenario.name}`, async ({ page }) => {
      // Create a base valid object, then override the invalid parts
      const testData = {
        firstName: 'Validation',
        lastName: 'Test',
        email: scenario.email,
        password: scenario.pass,
        ConfirmPassword: scenario.confirmPass || scenario.pass, // Uses scenario confirmPass if provided
        gender: 'Male' as const,
        homeTown: 'Colombo',
      };

      await registerPage.fillForm(testData);
      const cvPath = path.resolve(__dirname, '../testData/sample-cv.pdf');
      await registerPage.uploadCV(cvPath);
      await registerPage.clickRegister();

      // Look for the alert we discussed earlier
      const alert = page
        .locator('div', { hasText: new RegExp(scenario.error, 'i') })
        .first();
      await expect(alert).toBeVisible();
    });
  }

  const requiredFieldScenarios = [
    {
      name: 'Missing First Name',
      fieldToEmpty: 'firstName',
      error: 'required fields',
    },
    {
      name: 'Missing Last Name',
      fieldToEmpty: 'lastName',
      error: 'required fields',
    },
    { name: 'Missing Email', fieldToEmpty: 'email', error: 'required fields' },
    {
      name: 'Missing Password',
      fieldToEmpty: 'password',
      error: 'required fields',
    },
    { name: 'Missing CV', fieldToEmpty: 'cv', error: 'required fields' },
  ];

  for (const scenario of requiredFieldScenarios) {
    test(`Validation Error: ${scenario.name}`, async ({ page }) => {
      // 1. Start with a complete valid dataset
      const testData = {
        firstName: 'Test',
        lastName: 'User',
        email: `valid_${Date.now()}@yopmail.com`,
        password: 'Password123!',
        ConfirmPassword: 'Password123!',
        gender: 'Male' as const,
        homeTown: 'Colombo',
      };

      // 2. Empty the specific field for this test case
      if (scenario.fieldToEmpty === 'firstName') testData.firstName = '';
      if (scenario.fieldToEmpty === 'lastName') testData.lastName = '';
      if (scenario.fieldToEmpty === 'email') testData.email = '';
      if (scenario.fieldToEmpty === 'password') {
        testData.password = '';
        testData.ConfirmPassword = '';
      }

      // 3. Fill the form
      await registerPage.fillForm(testData);

      // 4. Handle CV Upload: Only upload if the scenario is NOT testing a missing CV
      if (scenario.fieldToEmpty !== 'cv') {
        const cvPath = path.resolve(__dirname, '../testData/sample-cv.pdf');
        await registerPage.uploadCV(cvPath);
      }

      // 5. Submit
      await registerPage.clickRegister();

      // 6. Assert Alert visibility
      const alert = page.locator('div', { hasText: new RegExp(scenario.error, 'i') }).first();
      await expect(alert).toBeVisible();
    });
  }
});
