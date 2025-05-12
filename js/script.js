let analysisProcess = ""; // 분석 과정을 저장할 변수

function analyzePasswordForBruteForce() {
  const password = document.getElementById("password").value;
  const resultDiv = document.getElementById("result");
  const length = password.length;
  let possibleChars = "";
  if (/[a-z]/.test(password)) possibleChars += "abcdefghijklmnopqrstuvwxyz";
  if (/[A-Z]/.test(password)) possibleChars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (/[0-9]/.test(password)) possibleChars += "0123456789";
  if (/[^a-zA-Z0-9\s]/.test(password)) possibleChars += "!@#$%^&*()_+=-`~[]\{}|;':\",./<>?";

  const charSetSize = possibleChars.length;
  const possibleCombinations = Math.pow(charSetSize, length);
  const attemptsPerSecond = 100000; // 초당 10억 번 시도 (임의 설정)
  const timeToCrackSeconds = possibleCombinations / attemptsPerSecond;

  let message = "";
  let color = "";
  let timeDisplay = "";

  if (timeToCrackSeconds < 60) {
    timeDisplay = `${timeToCrackSeconds.toFixed(2)} 초`;
    message = "매우 위험";
    color = "red";
  } else if (timeToCrackSeconds < 3600) {
    timeDisplay = `${(timeToCrackSeconds / 60).toFixed(2)} 분`;
    message = "위험";
    color = "orange";
  } else if (timeToCrackSeconds < 86400) {
    timeDisplay = `${(timeToCrackSeconds / 3600).toFixed(2)} 시간`;
    message = "보통";
    color = "yellowgreen";
  } else if (timeToCrackSeconds < 31536000) {
    timeDisplay = `${(timeToCrackSeconds / 86400).toFixed(2)} 일`;
    message = "안전";
    color = "green";
  } else {
    timeDisplay = `${(timeToCrackSeconds / 31536000).toFixed(2)} 년 이상`;
    message = "매우 안전";
    color = "blue";
  }

  resultDiv.textContent = `예상 무차별 대입 시간: ${timeDisplay} (${message})`;
  resultDiv.style.color = color;

  // 분석 과정 기록 (순열과 조합 언급)
  analysisProcess = `
1. 입력된 비밀번호: ${password}
2. 비밀번호 길이: ${length}
3. 사용 가능한 문자 종류: ${possibleChars} (총 ${charSetSize}개)
4. 가능한 총 조합의 수 계산:
   - 비밀번호 각 자리에 올 수 있는 문자의 수는 ${charSetSize}개입니다.
   - 비밀번호의 길이가 ${length}이므로, **중복을 허용하는 순열** (또는 조합)의 총 개수는 ${charSetSize}의 ${length}제곱, 즉 ${possibleCombinations.toExponential(3)}입니다.
   - 이는 무차별 대입 공격 시 시도해야 할 최악의 경우의 수를 의미합니다.
5. 예상 무차별 대입 시도 속도: 초당 ${attemptsPerSecond.toLocaleString()} 회
6. 예상 소요 시간: ${timeDisplay}
   (${timeToCrackSeconds.toExponential(3)} 초)
7. 보안 강도 평가: ${message} (색상: ${color})
      `;
}

function openAnalysisDetails() {
  document.getElementById("analysisSteps").textContent = analysisProcess;
  document.getElementById("analysisDetails").style.display = "block";
}

function closeAnalysisDetails() {
  document.getElementById("analysisDetails").style.display = "none";
}

function openExplanation() {
  document.getElementById("explanation").style.display = "block";
}

function closeExplanation() {
  document.getElementById("explanation").style.display = "none";
}