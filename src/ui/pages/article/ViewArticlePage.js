import { test, expect } from '@playwright/test';

export class ViewArticlePage {
  constructor(page) {
    this.page = page;
    this.articleTitleHeader = page.getByRole('heading');
  }

  authorLinkInArticleHeader(username) {
    return this.page.getByRole('link', { name: username }).first();
  }

  get followAuthorButton() {
    return this.page.getByRole('button', { name: /Follow/ }).first();
  }

  get unfollowAuthorButton() {
    return this.page.getByRole('button', { name: /Unfollow/ }).first();
  }

  async clickFollowAuthor() {
    await test.step(`Click 'Follow' the article author`, async () => {
      await this.followAuthorButton.click();
    });
  }

  async clickUnfollowAuthor() {
    await test.step(`Click 'Unfollow' the article author`, async () => {
      await this.unfollowAuthorButton.click();
    });
  }

  async assertFollowButtonIsVisible() {
    await test.step(`Assert 'Follow' button is visible`, async () => {
      await expect(this.followAuthorButton).toBeVisible();
    });
  }

  async assertUnfollowButtonIsVisible() {
    await test.step(`Assert 'Unfollow' button is visible`, async () => {
      await expect(this.unfollowAuthorButton).toBeVisible();
    });
  }

  url() {
    return this.page.url();
  }

  async open(url) {
    await test.step(`Open 'View Article' page`, async () => {
      await this.page.goto(url);
    });
  }

  async assertArticleTitleIsVisible(title) {
    await test.step(`Assert the article has correct title`, async () => {
      await expect(this.articleTitleHeader).toContainText(title);
    });
  }

  async assertArticleTextIsVisible(text) {
    await test.step(`Assert the article has correct text`, async () => {
      await expect(this.page.getByText(text)).toBeVisible();
    });
  }

  async assertArticleAuthorNameIsVisible(username) {
    await test.step(
      `Assert the article has correct author username`,
      async () => {
        await expect(
          this.authorLinkInArticleHeader(username),
        ).toBeVisible();
      },
    );
  }
}
