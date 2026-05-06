import { Locator, Page } from '@playwright/test';

export class RegisterPage {
  private readonly page: Page;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly confirmPasswordInput: Locator;
  private readonly homeTownInput: Locator;
  private readonly cvUpload: Locator;
  private readonly privacyCheckbox: Locator;
  private readonly registerButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Using placeholders or names based on common patterns in XpressJobs
    this.firstNameInput = page.locator('input[name = "Forename"]');
    this.lastNameInput = page.locator('input[name = "Surname"]');
    this.emailInput = page.locator('input[name = "Email"]'); // Shared name with login
    this.passwordInput = page.locator('input[name = "Password"]').first();
    this.confirmPasswordInput = page.locator('input[name = "ConfirmPassword"]');
    this.homeTownInput = page.locator('[name = "HomeTown"]');
    this.cvUpload = page.locator('input[type="file"]');
    // Targeting the "I agree" checkbox by label
    this.privacyCheckbox = page.locator('input[type="checkbox"]').first();
    this.registerButton = page.getByRole('button', {
      name: 'Register',
      exact: true,
    });
  }

  async selectGender(gender: 'Male' | 'Female'): Promise<void> {
    await this.page.getByLabel(gender, { exact: true }).check();
  }

  async uploadCV(filePath: string): Promise<void> {
    await this.cvUpload.setInputFiles(filePath);
  }

  async fillForm(details: any): Promise<void> {
    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);
    await this.emailInput.fill(details.email);
    await this.passwordInput.fill(details.password);
    await this.confirmPasswordInput.fill(details.ConfirmPassword);
    await this.homeTownInput.fill(details.homeTown);
    await this.selectGender(details.gender);
    await this.privacyCheckbox.check();
  }

  async clickRegister(): Promise<void> {
    await this.registerButton.click();
  }
}
