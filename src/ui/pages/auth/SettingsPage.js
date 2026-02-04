import { expect, test } from '@playwright/test';

export class SettingsPage {
  constructor(page) {
    this.page = page;
    this.newPasswordField = page
      .getByPlaceholder('New Password')
      .or(page.locator('input[type="password"]').last());
    this.updateSettingsButton = page.getByRole('button', {
      name: 'Update Settings',
    });
  }

  async open() {
    await test.step(`Open Settings page`, async () => {
      await this.page.goto('/settings');
    });
  }

  async fillNewPasswordField(password) {
    await test.step(`Fill the 'New Password' field`, async () => {
      await this.newPasswordField.fill(password);
    });
  }

  async clickUpdateSettingsButton() {
    await test.step(`Click the 'Update Settings' button`, async () => {
      await this.updateSettingsButton.click();
    });
  }

  async updatePassword(newPassword) {
    await test.step(`Update password`, async () => {
      await this.fillNewPasswordField(newPassword);
      await this.clickUpdateSettingsButton();
    });
  }

  async assertSettingsPageIsVisible() {
    await test.step(`Assert Settings page is visible`, async () => {
      await expect(this.updateSettingsButton).toBeVisible();
    });
  }
}
