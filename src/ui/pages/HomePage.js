import { expect, test } from '@playwright/test';

export class HomePage {
  constructor(page) {
    this.page = page;
    this.yourFeedTab = page.getByText('Your Feed');
    this.globalFeedTab = page.getByText('Global Feed');
    this.newArticleLink = page.getByRole('link', { name: 'New Article' });
  }

  async open() {
    await test.step(`Open Home page`, async () => {
      await this.page.goto('/');
    });
  }

  async clickNewArticleLink() {
    await test.step(`Click the 'New Article' link`, async () => {
      await this.newArticleLink.click();
    });
  }

  async clickYourFeedTab() {
    await test.step(`Click the 'Your Feed' tab`, async () => {
      await this.yourFeedTab.click();
    });
  }

  async clickGlobalFeedTab() {
    await test.step(`Click the 'Global Feed' tab`, async () => {
      await this.globalFeedTab.click();
    });
  }

  async assertYourFeedTabIsVisible() {
    await test.step(`Assert the 'Your Feed' tab is visible`, async () => {
      await expect(this.yourFeedTab).toBeVisible();
    });
  }

  async assertGlobalFeedTabIsVisible() {
    await test.step(`Assert the 'Global Feed' tab is visible`, async () => {
      await expect(this.globalFeedTab).toBeVisible();
    });
  }

  articleLinkInFeed(title) {
    return this.page.getByRole('link').filter({ hasText: title }).first();
  }

  async assertArticleInFeed(title) {
    await test.step(`Assert article '${title}' is visible in feed`,
      async () => {
      await expect(this.articleLinkInFeed(title)).toBeVisible(
        { timeout: 10000 },
      );
    });
  }

  async assertArticleNotInFeed(title) {
    await test.step(`Assert article '${title}' is not in feed`, async () => {
      await expect(this.articleLinkInFeed(title)).toBeHidden();
    });
  }
}
