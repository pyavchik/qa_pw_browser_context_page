import { test } from '../../_fixtures/fixtures';
import { ViewArticlePage } from '../../../src/ui/pages/article/ViewArticlePage';
import { HomePage } from '../../../src/ui/pages/HomePage';
import { createArticle } from '../../../src/ui/actions/articles/createArticle';
import { updateArticle } from '../../../src/ui/actions/articles/updateArticle';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';
import { generateNewArticleData } from '../../../src/common/testData/generateNewArticleData';
import { Logger } from '../../../src/common/logger/Logger';

const logger = new Logger('error');

test.describe('Multi-user: view, follow, unfollow, feed', () => {
  test(
    'User can view an article created by another user in the Global Feed',
    async ({
    page1,
    page2,
    user1,
    user2,
    articleWithoutTags,
  }) => {
    await signUpUser(page1, user1);
    await signUpUser(page2, user2);
    await createArticle(page1, articleWithoutTags);

    const homePage = new HomePage(page2);
    await homePage.open();
    await homePage.clickGlobalFeedTab();
    await homePage.assertArticleInFeed(articleWithoutTags.title);

    const viewArticlePage = new ViewArticlePage(page2);
    await viewArticlePage.open(articleWithoutTags.url);
    await viewArticlePage.assertArticleTitleIsVisible(articleWithoutTags.title);
    await viewArticlePage.assertArticleAuthorNameIsVisible(user1.username);
  });

  test('User can follow the article created by another user', async ({
    page1,
    page2,
    user1,
    user2,
    articleWithoutTags,
  }) => {
    await signUpUser(page1, user1);
    await signUpUser(page2, user2);
    await createArticle(page1, articleWithoutTags);

    const viewArticlePage = new ViewArticlePage(page2);
    await viewArticlePage.open(articleWithoutTags.url);
    await viewArticlePage.assertFollowButtonIsVisible();
    await viewArticlePage.clickFollowAuthor();
    await viewArticlePage.assertUnfollowButtonIsVisible();
  });

  test('User can unfollow the article created by another user', async ({
    page1,
    page2,
    user1,
    user2,
    articleWithoutTags,
  }) => {
    await signUpUser(page1, user1);
    await signUpUser(page2, user2);
    await createArticle(page1, articleWithoutTags);

    const viewArticlePage = new ViewArticlePage(page2);
    await viewArticlePage.open(articleWithoutTags.url);
    await viewArticlePage.clickFollowAuthor();
    await viewArticlePage.assertUnfollowButtonIsVisible();
    await viewArticlePage.clickUnfollowAuthor();
    await viewArticlePage.assertFollowButtonIsVisible();
  });

  test('User can view an article updated by another user', async ({
    page1,
    page2,
    user1,
    user2,
    articleWithoutTags,
  }) => {
    await signUpUser(page1, user1);
    await signUpUser(page2, user2);
    await createArticle(page1, articleWithoutTags);

    const updatedTitle = articleWithoutTags.title + ' updated';
    const updatedText = articleWithoutTags.text + ' Updated content.';
    const updatedArticle = await updateArticle(page1, articleWithoutTags, {
      title: updatedTitle,
      text: updatedText,
    });

    const viewArticlePage = new ViewArticlePage(page2);
    await viewArticlePage.open(updatedArticle.url);
    await viewArticlePage.assertArticleTitleIsVisible(updatedTitle);
    await viewArticlePage.assertArticleTextIsVisible(updatedText);
    await viewArticlePage.assertArticleAuthorNameIsVisible(user1.username);
  });

  test(
    'User can see other user\'s new articles in "Your Feed" after following',
    async ({
    page1,
    page2,
    user1,
    user2,
    articleWithoutTags,
  }) => {
    await signUpUser(page1, user1);
    await signUpUser(page2, user2);
    await createArticle(page1, articleWithoutTags);

    const viewArticlePage = new ViewArticlePage(page2);
    await viewArticlePage.open(articleWithoutTags.url);
    await viewArticlePage.clickFollowAuthor();

    const secondArticle = generateNewArticleData(logger, 0);
    await createArticle(page1, secondArticle);

    const homePage = new HomePage(page2);
    await homePage.open();
    await homePage.clickYourFeedTab();
    await homePage.assertArticleInFeed(articleWithoutTags.title);
    await homePage.assertArticleInFeed(secondArticle.title);
  });

  test(
    'User doesn\'t see other user\'s articles in "Your Feed" after unfollowing',
    async ({
    page1,
    page2,
    user1,
    user2,
    articleWithoutTags,
  }) => {
    await signUpUser(page1, user1);
    await signUpUser(page2, user2);
    await createArticle(page1, articleWithoutTags);

    const viewArticlePage = new ViewArticlePage(page2);
    await viewArticlePage.open(articleWithoutTags.url);
    await viewArticlePage.clickFollowAuthor();
    await viewArticlePage.clickUnfollowAuthor();

    const homePage = new HomePage(page2);
    await homePage.open();
    await homePage.clickYourFeedTab();
    await homePage.assertArticleNotInFeed(articleWithoutTags.title);
  });
});
