const { chromium, expect } = require('@playwright/test');

module.exports = async (config) => {

  // 환경 변수 MOBILE이 "true"면 Mobile 환경, 아니면 PC 환경으로 실행
  const isMobile = process.env.MOBILE === 'true' ;

  // config.projects 배열에서 해당 환경의 설정을 찾습니다.
  const projectName = isMobile ? 'Mobile' : 'PC';
  console.log(projectName);
  const projectConfig = config.projects.find(project => project.name === projectName);
  if (!projectConfig) {
    throw new Error(`프로젝트 ${projectName} 설정을 찾을 수 없습니다.`);
  }
  const baseURL = projectConfig.use.baseURL;
  
  // 환경에 맞게 브라우저 컨텍스트 옵션 설정
  let contextOptions = {};
  if (isMobile) {
    contextOptions = {
      viewport: projectConfig.use.viewport,
      isMobile: projectConfig.use.isMobile,
      deviceScaleFactor: projectConfig.use.deviceScaleFactor,
      userAgent: projectConfig.use.userAgent,
      launchOptions: projectConfig.use.launchOptions,
    };
  } else {
    contextOptions = {
      viewport: projectConfig.use.viewport
    };
  }

  const browser = await chromium.launch({ headless: true, slowMo: 100 });
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();

  // baseURL과 결합하여 '/main' 페이지로 이동
  await page.goto(`${baseURL}mywadiz/supporter`);
  
  // 쿠폰 모달 닫기
  if (await page.isVisible('.DefaultBanner_inner__2ikD2')) {
    await page.click('.DefaultBanner_cancelIcon__1cQhn');
  }
    
  // 로그인 로직 수행
  await page.click('.MyWadizSupporterProfileCard_userName__3c32o');
  await page.click('.AuthForm_expandButton__2MaEa');

  await page.waitForSelector('#email', { state: 'visible', timeout: 10000 }); // 요소가 보일 때까지 최대 10초 기다림
  await page.fill('#email', 'hoyul.lee+1@wadiz.kr'); // branch 생성 후 개인 계정으로 변경하여 사용
  await page.fill('#password', 'wadiz12!@'); // 동일
  await page.click('[data-test-id="loginSubmitButton"]');

  // 브레이즈 모달 닫기
  if (await page.isVisible('.swiper-slide-active')){
    await page.click('.inAppBtnClose');
  }

  // 로그인 후 사용자 아바타가 보이는지 확인
  await expect(page.locator('.MyWadizSupporterProfileCard_detailProfile__3Qn6t')).toBeVisible();

  // 로그인 상태 저장 (모든 테스트에서 재사용)
  await context.storageState({ path: 'storageState.json' });
  console.log("로그인 및 로그인 상태 저장 완료");
  await browser.close();
};