// test/caseid_90.spec.js
const { test, expect } = require('@playwright/test');
const { server, storageState } = require('../playwright.config').projects[0].use;

// 대상 API와 UI 선택자 상수 선언
const targetAPI = '/api/friends/supporter/feeds';
const uiElementSelector = '.FeedCardList_list__2yOEy';

test('caseid_90 - API 및 UI 데이터 검증', async ({ page }) => {
  console.log("> caseid_90 < 테스트 시작");

  // 페이지 이동 전에 API 응답 감지 프로미스를 등록
  const apiResponsePromise = page.waitForResponse(resp =>
    new URL(resp.url()).pathname === targetAPI && resp.status() === 200,
    { timeout: 5000 }
  );

  // 로그인 상태가 유지된 페이지로 이동
  await page.goto(`https://${server}.wadiz.kr/web/feed/main`);
  await page.waitForLoadState('networkidle');
  console.log ('페이지 이동')

  // 미리 등록해둔 프로미스를 통해 대상 API 응답을 기다림
  const response = await apiResponsePromise;
  expect(response.status()).toBe(200);
  console.log('응답 확인 ')

  const responseData = await response.json();
  { timeout: 5000}

  // 응답 데이터에서 campaign.title을 가진 첫 번째 항목 선택
  const validItem = responseData?.data?.list.find(item => item?.campaign?.title);
  const expectedText = validItem?.campaign?.title;

  console.log(`📥 API 응답에서 찾은 첫 번째 title 값: ${expectedText}`);

  // UI에서 지정한 요소의 위치 찾기
  await page.locator(uiElementSelector).waitFor({ state: 'visible' });

  // `expectedText`가 포함된 요소를 찾기
  const matchingElements = await page.locator(`${uiElementSelector} >> text=${expectedText}`).all();

  if (matchingElements.length > 0) {
    for (let i = 0; i < matchingElements.length; i++) {
      const element = matchingElements[i];
      
      // 요소의 id와 name 속성 가져오기
      const elementId = await element.getAttribute('class') || '없음';

      console.log(`[UI 요소 속성] class: "${elementId}"`);
    }
  } else {
    console.log(`❌ [UI 요소 속성] '${expectedText}'을(를) 포함한 요소를 찾을 수 없음`);
  }
  // 검증: 해당 텍스트가 UI 내에 존재하는지 확인
  expect(matchingElements.length).toBeGreaterThan(0);

  if (matchingElements.length > 0) {
    console.log('> caseid_90 테스트 결과 : PASS <');
  } else {
    console.log('> caseid_90 테스트 결과 : FAIL <');
  }
});
