let analysisProcess = ""; // 분석 과정을 저장할 전역 변수

function analyzePasswordForBruteForce() {
    const password = document.getElementById("password").value;
    const resultDiv = document.getElementById("result");
    
    if (!password) {
        resultDiv.textContent = "비밀번호를 입력하면 분석이 시작됩니다.";
        resultDiv.style.color = "#333";
        analysisProcess = "비밀번호가 입력되지 않았습니다.";
        return;
    }

    const length = password.length;
    let possibleChars = "";
    
    // 사용된 문자군 판별
    if (/[a-z]/.test(password)) possibleChars += "abcdefghijklmnopqrstuvwxyz";
    if (/[A-Z]/.test(password)) possibleChars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (/[0-9]/.test(password)) possibleChars += "0123456789";
    if (/[^a-zA-Z0-9\s]/.test(password)) possibleChars += "!@#$%^&*()_+=-`~[]\\{}|;':\",./<>?";

    const charSetSize = possibleChars.length || 1; // 0으로 나누기 방지
    
    // 중복 순열 공식: N^L (N: 문자 종류 수, L: 길이)
    const possibleCombinations = Math.pow(charSetSize, length);
    
    // 초당 시도 횟수 (현실적인 고성능 공격자 기준: 초당 1000만 회 설정)
    const attemptsPerSecond = 10000000; 
    const timeToCrackSeconds = possibleCombinations / attemptsPerSecond;

    let message = "";
    let color = "";
    let timeDisplay = "";

    // 시간 단위 변환 로직
    if (timeToCrackSeconds < 1) {
        timeDisplay = "즉시 (1초 미만)";
        message = "매우 위험";
        color = "#e74c3c"; // Red
    } else if (timeToCrackSeconds < 60) {
        timeDisplay = `${timeToCrackSeconds.toFixed(2)} 초`;
        message = "매우 위험";
        color = "#e74c3c";
    } else if (timeToCrackSeconds < 3600) {
        timeDisplay = `${(timeToCrackSeconds / 60).toFixed(2)} 분`;
        message = "위험";
        color = "#e67e22"; // Orange
    } else if (timeToCrackSeconds < 86400) {
        timeDisplay = `${(timeToCrackSeconds / 3600).toFixed(2)} 시간`;
        message = "보통";
        color = "#f1c40f"; // Yellow
    } else if (timeToCrackSeconds < 31536000) {
        timeDisplay = `${(timeToCrackSeconds / 86400).toFixed(2)} 일`;
        message = "안전";
        color = "#2ecc71"; // Green
    } else {
        const years = timeToCrackSeconds / 31536000;
        timeDisplay = years > 1e6 ? "백만 년 이상" : `${years.toLocaleString(undefined, {maximumFractionDigits:0})} 년 이상`;
        message = "매우 안전";
        color = "#3498db"; // Blue
    }

    // 분석 과정 텍스트를 실시간으로 업데이트
    const stepsArea = document.getElementById("analysisSteps");
    if (stepsArea) {
        stepsArea.textContent = analysisProcess;
    }

    // 결과 화면 출력
    resultDiv.textContent = `예상 무차별 대입 시간: ${timeDisplay} (${message})`;
    resultDiv.style.color = color;

    // 분석 과정 기록 (분석 과정 버튼 클릭 시 보여줄 텍스트)
    analysisProcess = `[분석 결과 데이터]
-------------------------------------------
1. 입력 비밀번호: ${"*".repeat(length)} (보안을 위해 마스킹)
2. 비밀번호 길이: ${length} 자리
3. 감지된 문자 집합 크기 (N): ${charSetSize}
   (포함: ${getCharSetDescription(password)})
4. 총 조합의 수 (N^L): ${possibleCombinations.toExponential(3)} 개
   - 이는 중복 순열의 원리에 따른 가능한 모든 경우의 수입니다.
5. 공격 시뮬레이션 속도: 초당 ${attemptsPerSecond.toExponential(0)}회 시도
6. 최종 계산된 시간: ${timeToCrackSeconds.toExponential(3)} 초
-------------------------------------------
결과 평가: 이 비밀번호는 공격자가 모든 조합을 시도할 때 
약 ${timeDisplay}이(가) 소요되는 '${message}' 수준의 보안성을 가집니다.
※해당 분석은 초당 1000만회의 대입을 가정하고 계산한 결과입니다. 공격자 측 성능에 따라 달라질 수 있습니다.※`;
}

// 문자 집합 종류를 한글로 설명해주는 보조 함수
function getCharSetDescription(pw) {
    let sets = [];
    if (/[a-z]/.test(pw)) sets.push("소문자");
    if (/[A-Z]/.test(pw)) sets.push("대문자");
    if (/[0-9]/.test(pw)) sets.push("숫자");
    if (/[^a-zA-Z0-9\s]/.test(pw)) sets.push("특수문자");
    return sets.join(", ") || "없음";
}

/* 팝업 제어 함수 */

// 1. 모든 모달을 닫는 공통 함수
function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = "none";
    });
}

// 2. 분석 과정 팝업 열기
function openAnalysisDetails() {
    // 다른 창이 열려있다면 모두 닫기
    closeAllModals();

    if (!analysisProcess) analyzePasswordForBruteForce();
    document.getElementById("analysisSteps").textContent = analysisProcess;
    document.getElementById("analysisDetails").style.display = "block";
}

// 3. 분석 설명 팝업 열기
function openExplanation() {
    // 다른 창이 열려있다면 모두 닫기
    closeAllModals();

    document.getElementById("explanation").style.display = "block";
}

// 4. 각각의 닫기 함수 (HTML의 onclick에 대응)
function closeAnalysisDetails() {
    document.getElementById("analysisDetails").style.display = "none";
}

function closeExplanation() {
    document.getElementById("explanation").style.display = "none";
}

// 5. 배경 클릭 시 팝업 닫기 (이 기능도 모든 모달에 적용)
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        closeAllModals();
    }
}

// 모달 배경 클릭 시 닫기 기능
window.onclick = function(event) {
    const detailModal = document.getElementById("analysisDetails");
    const explanationModal = document.getElementById("explanation");
    if (event.target === detailModal) detailModal.style.display = "none";
    if (event.target === explanationModal) explanationModal.style.display = "none";
}
