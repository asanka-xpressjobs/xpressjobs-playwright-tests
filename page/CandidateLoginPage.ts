import { Locator, Page } from '@playwright/test';

export class LoginPage {
  // Use 'readonly' and private access modifiers for safety
  private readonly page: Page;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('[name="email"]');
    this.passwordInput = page.locator('[name="password"]');
    this.loginButton = page.getByRole('button', { name: 'Login', exact: true });
  }

  async navigate(): Promise<void> {
    await this.page.goto('https://xpress.jobs/candidates/login');
  }

  async login(email: string | null, password: string | null): Promise<void> {
    if (email) await this.emailInput.fill(email);
    if (password) await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}