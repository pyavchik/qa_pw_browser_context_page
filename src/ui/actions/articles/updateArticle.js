import { test } from '@playwright/test';
import { CreateArticlePage } from '../../pages/article/CreateArticlePage';
import { ViewArticlePage } from '../../pages/article/ViewArticlePage';

function getSlugFromArticleUrl(url) {
  const pathname = new URL(url).pathname;
  const segments = pathname.split('/').filter(Boolean);
  return segments[segments.length - 1] || '';
}

export async function updateArticle(page, article, updatedFields) {
  const slug = getSlugFromArticleUrl(article.url);
  const updatedArticle = { ...article, ...updatedFields };

  await test.step(`Update article`, async () => {
    const createArticlePage = new CreateArticlePage(page);
    const viewArticlePage = new ViewArticlePage(page);

    await createArticlePage.page.goto(`/editor/${slug}`);
    await createArticlePage.submitUpdateArticleForm(updatedArticle);
    await viewArticlePage.assertArticleTitleIsVisible(updatedArticle.title);

    updatedArticle.url = viewArticlePage.url();
  });

  return updatedArticle;
}
