1. PC / Mobile 구분하여 작성하기
    예시) test('NNN', async ({ isMobile }) => {
        if (isMobile) {
2. Branch명 : feature/$Caseid$
3. config 파일에 baseURL 변수 사용하기
4. 테스트 계정은 branch 생성 후 globalSetup에 계정 변경 후 테스트 실행