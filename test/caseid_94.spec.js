// test/caseid_94.spec.js
const { test, expect } = require('@playwright/test');
const { server, storageState } = require('../playwright.config').projects[0].use;

test('caseid_94 - 팔로우 버튼 클릭 및 API 응답 확인', async ({ page }) => {
  console.log("> caseid_94 < 테스트 시작");

  // 페이지 이동
  await page.goto(`https://${server}.wadiz.kr/web/feed/main`);
  await page.waitForLoadState('networkidle');

  // "팔로우" 버튼이 포함된 컨테이너 존재 확인
  const containerSelector = '.RecommendedFriendsSliderContainer_friendsContainer__MJ7w-';
  expect(await page.locator(containerSelector).isVisible()).toBeTruthy();

  // "팔로우" 버튼 선택 (컨테이너 내 첫 번째 버튼)
  const followButtonSelector = 'button:has-text("팔로우")';
  const followButton = page.locator(`${containerSelector} ${followButtonSelector}`).first();
  expect(await followButton.count()).toBeGreaterThan(0);

  console.log(`🔘 "팔로우" 버튼 클릭 중...`);

  // 버튼 클릭 후 호출될 API 감지 (대상 API)
  const targetAPI = '/web/social/ajaxFollow';
  const apiResponsePromise = page.waitForResponse(resp =>
    resp.url().includes(targetAPI),
    { timeout: 60000 }
  );

  // "팔로우" 버튼 클릭
  await followButton.click();

  // API 응답 대기
  const response = await apiResponsePromise;
  const status = response.status();
  console.log(`📥 API 응답 수신 완료! Status: ${response.status()}`);

  // 응답 데이터를 JSON 형식으로 파싱하여 로그에 출력
  const responseData = await response.json();
  console.log(`📄 API 응답 데이터:`, responseData?.data || "없음");

  //테스트 결과 출력
  if (status === 200){
    console.log ('> caseid_94 테스트 결과 : PASS <');
  } else {
    console.log('> caseid_94 테스트 결과 : FAIL <');
  }
});
