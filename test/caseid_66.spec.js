const { test, expect } = require('@playwright/test');

test('caseid_66 - 스토어 프로젝트 상세 노출 확인', async ({ page,isMobile }) => {
  if (isMobile){
    await page.goto('store/main/COLLECTION_musthave');
    await page.locator('.TabsMobile_tabsWrapper__1vzEm [data-text="전체"]').click();
  
    // -----------------------------
    // 1. 스토어 홈 : 첫 번째 프로젝트 선택 후 상세 진입
    // -----------------------------
    await Promise.all([ //페이지 이동하여 API 로딩 대기
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.locator('.HomeHorizontalCard_container__QBqLW').first().click()
    ]);
    
    // 페이지 최하단으로 이동
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    const storyButton = await page.locator('[data-ga-label="스토리_더보기"]');
    if (await storyButton.count() > 0){ 
      await storyButton.click();
    }

    // .inner-contents 하위의 모든 <p> 태그 선택
    const paragraphs = page.locator('.inner-contents p');
    const count = await paragraphs.count();

    for (let i = 0; i < count; i++) {
    // 각 <p> 태그 내에 있는 <img> 태그의 개수를 확인
    const imgCount = await paragraphs.nth(i).locator('img style').count();
    // img 태그가 하나 이상 있어야 함을 확인
    await expect(imgCount).toBeGreaterThan(0);
    }
  }
});
