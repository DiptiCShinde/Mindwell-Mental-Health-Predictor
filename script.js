// Keep the API URL here if the FastAPI server moves to another address.
const API_BASE_URL = 'http://127.0.0.1:8000';
const form = document.querySelector('#prediction-form');
const submitButton = document.querySelector('#submit-button');
const errorMessage = document.querySelector('#error-message');
const connectionStatus = document.querySelector('#connection-status');
const resultPlaceholder = document.querySelector('#result-placeholder');
const resultContent = document.querySelector('#result-content');

function setConnection(online, message) {
  connectionStatus.classList.toggle('offline', !online);
  connectionStatus.lastElementChild.textContent = message;
}

async function checkServer() {
  try {
    const response = await fetch(`${API_BASE_URL}/`, { signal: AbortSignal.timeout(4000) });
    if (!response.ok) throw new Error('Server unavailable');
    setConnection(true, 'Prediction service is ready');
  } catch (_) {
    setConnection(false, 'Can’t reach the prediction service');
  }
}

function getInterpretation(score) {
  if (score >= 7) return 'Your estimate suggests a positive wellbeing snapshot. Keep making space for the habits that help you feel your best.';
  if (score >= 4) return 'Your estimate falls in a middle range. Small, steady changes to rest, movement, or screen time may be worth exploring.';
  return 'Your estimate suggests it may be helpful to check in with someone you trust or a qualified mental health professional.';
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  errorMessage.hidden = true;
  submitButton.disabled = true;
  submitButton.querySelector('span').textContent = 'Calculating…';

  const values = new FormData(form);
  const payload = {
    age: Number(values.get('age')),
    gender: values.get('gender'),
    country: values.get('country'),
    academic_level: values.get('academic_level'),
    most_used_platform: values.get('most_used_platform'),
    purpose_of_use: values.get('purpose_of_use'),
    avg_daily_usage_hours: Number(values.get('avg_daily_usage_hours')),
    daily_unlocks: Number(values.get('daily_unlocks')),
    study_hours: Number(values.get('study_hours')),
    physical_activity_hours: Number(values.get('physical_activity_hours')),
    sleep_hours_per_night: Number(values.get('sleep_hours_per_night')),
    stress_level: values.get('stress_level')
  };

  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const details = Array.isArray(data.detail) ? data.detail.map(item => `${item.loc?.at(-1) || 'Field'}: ${item.msg}`).join(' ') : data.detail;
      throw new Error(details || `The server returned ${response.status}.`);
    }
    const score = Number(data.predicted_mental_health_score);
    if (!Number.isFinite(score)) throw new Error('The server response did not include a valid score.');

    document.querySelector('#score-value').textContent = score.toFixed(2);
    document.querySelector('#score-fill').style.width = `${Math.max(0, Math.min(100, score * 10))}%`;
    document.querySelector('#score-message').textContent = getInterpretation(score);
    resultPlaceholder.hidden = true;
    resultContent.hidden = false;
    setConnection(true, 'Estimate generated successfully');
  } catch (error) {
    const isNetworkError = error instanceof TypeError || error.name === 'AbortError' || error.name === 'TimeoutError';
    errorMessage.textContent = isNetworkError
      ? 'We couldn’t connect to the prediction server. Check that it is running at http://127.0.0.1:8000 and try again.'
      : error.message;
    errorMessage.hidden = false;
    if (isNetworkError) setConnection(false, 'Can’t reach the prediction service');
  } finally {
    submitButton.disabled = false;
    submitButton.querySelector('span').textContent = 'Get my estimate';
  }
});

checkServer();
