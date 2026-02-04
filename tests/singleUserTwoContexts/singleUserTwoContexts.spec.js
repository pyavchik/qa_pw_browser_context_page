import { test } from '../_fixtures/fixtures';
import { signUpUser } from '../../src/ui/actions/auth/signUpUser';
import { SignInPage } from '../../src/ui/pages/auth/SignInPage';
import { SettingsPage } from '../../src/ui/pages/auth/SettingsPage';
import { HomePage } from '../../src/ui/pages/HomePage';
import { ViewArticlePage } from '../../src/ui/pages/article/ViewArticlePage';
import { createArticle } from '../../src/ui/actions/articles/createArticle';
import { faker } from '@faker-js/faker';

let signInPage;
let homePage;
let settingsPage;

test.describe('Single user in two contexts', () => {
  test.beforeEach(async ({ page1, page2, user }) => {
    await signUpUser(page1, user);

    signInPage = new SignInPage(page2);
    homePage = new HomePage(page2);
    settingsPage = new SettingsPage(page1);
  });

  test('User can sign in with changed profile password', async ({
    user,
  }) => {
    const newPassword = faker.internet.password();
    await settingsPage.open();
    await settingsPage.updatePassword(newPassword);

    await signInPage.open();
    await signInPage.fillEmailField(user.email);
    await signInPage.fillPasswordField(newPassword);
    await signInPage.clickSignInButton();

    await homePage.assertYourFeedTabIsVisible();
  });

  test('User can see own article in "Global feed" when not logged in', async ({
    page1,
    page2,
    articleWithoutTags,
  }) => {
    await createArticle(page1, articleWithoutTags);

    await homePage.open();
    await page2.waitForLoadState('load');
    await homePage.clickGlobalFeedTab();

    const viewArticlePage = new ViewArticlePage(page2);
    await viewArticlePage.open(articleWithoutTags.url);
    await viewArticlePage.assertArticleTitleIsVisible(articleWithoutTags.title);
    await viewArticlePage.assertArticleTextIsVisible(articleWithoutTags.text);
  });
});
