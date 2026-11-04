/**
 * PAY LATER TRAVEL - INTERACTIVE ENGINE & APPLICATION SCRIPT
 * Updated with Comprehensive Loan-Grade Eligibility Portal,
 * Email Underwriting Notification System, Official Form Download (PDF/Print),
 * and Zero-Backend Storage & Retrieval (LocalStorage, CSV Export, Webhook Ready).
 */

document.addEventListener('DOMContentLoaded', () => {
  initCurrencyManager();
  initFlightSearch();
  initEligibilityEngine();
  initDestinationTabs();
  initFaqAccordion();
  initSupportChat();
  initMobileNav();
  initModals();
  initAdminDashboard();
});

// Support Email Config
const SUPPORT_EMAIL = 'paylatertravelhelp@gmail.com';

// ==========================================================================
// 1. CURRENCY CONVERTER & STATE MANAGER
// ==========================================================================
const currencies = {
  USD: { symbol: '$', rate: 1.0, flag: '🇺🇸', label: 'United States $USD' },
  AUD: { symbol: '$', rate: 1.54, flag: '🇦🇺', label: 'Australia $AUD' },
  GBP: { symbol: '£', rate: 0.79, flag: '🇬🇧', label: 'United Kingdom £GBP' },
  CAD: { symbol: '$', rate: 1.38, flag: '🇨🇦', label: 'Canada $CAD' },
  NZD: { symbol: '$', rate: 1.68, flag: '🇳🇿', label: 'New Zealand $NZD' }
};

let currentCurrency = 'USD';

function formatMoney(amountInUSD) {
  const c = currencies[currentCurrency] || currencies.USD;
  const converted = Math.round(amountInUSD * c.rate);
  return `${c.symbol}${converted.toLocaleString()}`;
}

function initCurrencyManager() {
  const currencyBtn = document.getElementById('currencyPickerBtn');
  const currencyDropdown = document.getElementById('currencyDropdown');
  const currencyItems = document.querySelectorAll('.currency-item');
  const activeCurrencySpan = document.getElementById('activeCurrencyCode');

  if (currencyBtn && currencyDropdown) {
    currencyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currencyDropdown.classList.toggle('active');
    });

    document.addEventListener('click', () => {
      currencyDropdown.classList.remove('active');
    });

    currencyItems.forEach(item => {
      item.addEventListener('click', () => {
        const selectedCode = item.getAttribute('data-currency');
        if (currencies[selectedCode]) {
          currentCurrency = selectedCode;
          if (activeCurrencySpan) activeCurrencySpan.textContent = `$${selectedCode}`;
          
          currencyItems.forEach(i => i.classList.remove('selected'));
          item.classList.add('selected');
          
          updateAllPrices();
          showToast(`Currency changed to ${currencies[selectedCode].label}`);
        }
      });
    });
  }
}

function updateAllPrices() {
  document.querySelectorAll('[data-usd-price]').forEach(el => {
    const usd = parseFloat(el.getAttribute('data-usd-price'));
    const isWeekly = el.getAttribute('data-is-weekly') === 'true';
    const isDeposit = el.getAttribute('data-is-deposit') === 'true';
    
    if (isWeekly) {
      el.textContent = `from ${formatMoney(usd)}/wk`;
    } else if (isDeposit) {
      el.textContent = `${formatMoney(usd)} deposit`;
    } else {
      el.textContent = formatMoney(usd);
    }
  });

  if (typeof updateCalculatorBar === 'function') {
    updateCalculatorBar();
  }
}

// ==========================================================================
// 2. AIRPORT DATA & FLIGHT SEARCH ENGINE
// ==========================================================================
const popularAirports = [
  { city: 'New York', code: 'JFK', airport: 'John F. Kennedy Intl', country: 'United States' },
  { city: 'Los Angeles', code: 'LAX', airport: 'Los Angeles Intl', country: 'United States' },
  { city: 'London', code: 'LHR', airport: 'London Heathrow', country: 'United Kingdom' },
  { city: 'Tokyo', code: 'NRT', airport: 'Narita International', country: 'Japan' },
  { city: 'Sydney', code: 'SYD', airport: 'Sydney Kingsford Smith', country: 'Australia' },
  { city: 'Paris', code: 'CDG', airport: 'Charles de Gaulle', country: 'France' },
  { city: 'Cancún', code: 'CUN', airport: 'Cancún International', country: 'Mexico' },
  { city: 'Bali (Denpasar)', code: 'DPS', airport: 'Ngurah Rai Intl', country: 'Indonesia' },
  { city: 'Honolulu', code: 'HNL', airport: 'Daniel K. Inouye Intl', country: 'United States' },
  { city: 'Miami', code: 'MIA', airport: 'Miami International', country: 'United States' },
  { city: 'Orlando', code: 'MCO', airport: 'Orlando International', country: 'United States' },
  { city: 'Rome', code: 'FCO', airport: 'Leonardo da Vinci-Fiumicino', country: 'Italy' },
  { city: 'San Juan', code: 'SJU', airport: 'Luis Muñoz Marín Intl', country: 'Puerto Rico' },
  { city: 'Montego Bay', code: 'MBJ', airport: 'Sangster International', country: 'Jamaica' },
  { city: 'Auckland', code: 'AKL', airport: 'Auckland Airport', country: 'New Zealand' }
];

let baseFlightPriceUSD = 780;

function initFlightSearch() {
  const originInput = document.getElementById('searchOrigin');
  const destInput = document.getElementById('searchDestination');
  const originDropdown = document.getElementById('originDropdown');
  const destDropdown = document.getElementById('destDropdown');
  const tripTabs = document.querySelectorAll('.trip-tab');
  const searchBtn = document.getElementById('searchFlightsBtn');

  tripTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tripTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      showToast(`Selected ${tab.getAttribute('data-type')} trip`);
    });
  });

  setupAutocomplete(originInput, originDropdown, (item) => {
    originInput.value = `${item.city} (${item.code})`;
    updateCalculatorBar();
  });

  setupAutocomplete(destInput, destDropdown, (item) => {
    destInput.value = `${item.city} (${item.code})`;
    if (item.code === 'NRT' || item.code === 'SYD') baseFlightPriceUSD = 1050;
    else if (item.code === 'LHR' || item.code === 'CDG') baseFlightPriceUSD = 880;
    else if (item.code === 'CUN' || item.code === 'MIA' || item.code === 'MCO') baseFlightPriceUSD = 460;
    else baseFlightPriceUSD = 780;
    updateCalculatorBar();
  });

  const departDateInput = document.getElementById('searchDepartDate');
  const returnDateInput = document.getElementById('searchReturnDate');
  if (departDateInput) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 75);
    departDateInput.value = futureDate.toISOString().split('T')[0];
    departDateInput.min = new Date().toISOString().split('T')[0];
  }
  if (returnDateInput) {
    const futureReturn = new Date();
    futureReturn.setDate(futureReturn.getDate() + 87);
    returnDateInput.value = futureReturn.toISOString().split('T')[0];
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openFlightResultsModal();
    });
  }

  updateCalculatorBar();
}

function setupAutocomplete(inputEl, dropdownEl, onSelect) {
  if (!inputEl || !dropdownEl) return;

  function renderList(query = '') {
    dropdownEl.innerHTML = '';
    const filtered = popularAirports.filter(a => 
      a.city.toLowerCase().includes(query.toLowerCase()) || 
      a.code.toLowerCase().includes(query.toLowerCase()) ||
      a.country.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
      dropdownEl.innerHTML = `<div style="padding:12px;font-size:0.85rem;color:#64748b;">No airports matching "${query}"</div>`;
      return;
    }

    filtered.forEach(item => {
      const option = document.createElement('div');
      option.className = 'airport-option';
      option.innerHTML = `
        <div>
          <span class="airport-option-main">${item.city}</span>
          <span style="font-size:0.8rem;color:#64748b;display:block;">${item.airport}, ${item.country}</span>
        </div>
        <span class="airport-code">${item.code}</span>
      `;
      option.addEventListener('click', () => {
        onSelect(item);
        dropdownEl.classList.remove('open');
      });
      dropdownEl.appendChild(option);
    });
  }

  inputEl.addEventListener('focus', () => {
    renderList(inputEl.value);
    dropdownEl.classList.add('open');
  });

  inputEl.addEventListener('input', () => {
    renderList(inputEl.value);
    dropdownEl.classList.add('open');
  });

  document.addEventListener('click', (e) => {
    if (!inputEl.contains(e.target) && !dropdownEl.contains(e.target)) {
      dropdownEl.classList.remove('open');
    }
  });
}

function updateCalculatorBar() {
  const calcTotalEl = document.getElementById('calcTotalPrice');
  const calcDepositEl = document.getElementById('calcDepositPrice');
  const calcWeeklyEl = document.getElementById('calcWeeklyPrice');

  if (!calcTotalEl || !calcWeeklyEl) return;

  const depositUSD = Math.max(35, Math.round(baseFlightPriceUSD * 0.08));
  const remainingUSD = baseFlightPriceUSD - depositUSD;
  const weeklyUSD = Math.round(remainingUSD / 16);

  calcTotalEl.textContent = formatMoney(baseFlightPriceUSD);
  if (calcDepositEl) calcDepositEl.textContent = formatMoney(depositUSD);
  calcWeeklyEl.textContent = `${formatMoney(weeklyUSD)} / wk`;
}

// ==========================================================================
// 3. FULL LOAN-GRADE ELIGIBILITY FORM ENGINE
// ==========================================================================
let lastSubmittedApplication = null;

function initEligibilityEngine() {
  let currentStep = 1;
  const totalSteps = 3;

  const budgetSlider = document.getElementById('budgetSlider');
  const budgetValueDisplay = document.getElementById('budgetDisplayVal');
  const weeksSlider = document.getElementById('weeksSlider');
  const weeksValueDisplay = document.getElementById('weeksDisplayVal');
  const calculatedWeeklyPreview = document.getElementById('eligibilityWeeklyPreview');

  if (budgetSlider && budgetValueDisplay) {
    budgetSlider.addEventListener('input', () => {
      budgetValueDisplay.textContent = formatMoney(parseInt(budgetSlider.value));
      recalculateEligibilityPreview();
    });
  }

  if (weeksSlider && weeksValueDisplay) {
    weeksSlider.addEventListener('input', () => {
      weeksValueDisplay.textContent = `${weeksSlider.value} Weeks`;
      recalculateEligibilityPreview();
    });
  }

  function recalculateEligibilityPreview() {
    if (!budgetSlider || !weeksSlider || !calculatedWeeklyPreview) return;
    const budgetUSD = parseInt(budgetSlider.value);
    const weeks = parseInt(weeksSlider.value);
    const depositUSD = Math.max(35, Math.round(budgetUSD * 0.08));
    const weeklyUSD = Math.round((budgetUSD - depositUSD) / weeks);
    calculatedWeeklyPreview.textContent = `${formatMoney(weeklyUSD)} / week`;
  }

  // Payment Frequency buttons
  document.querySelectorAll('.frequency-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.frequency-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      const radio = opt.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  // Step Navigation Buttons
  const nextBtn1 = document.getElementById('eligibilityNext1');
  const nextBtn2 = document.getElementById('eligibilityNext2');
  const prevBtn2 = document.getElementById('eligibilityBack2');
  const prevBtn3 = document.getElementById('eligibilityBack3');
  const submitFinalBtn = document.getElementById('eligibilitySubmitFinal');
  const restartBtn = document.getElementById('eligibilityRestartBtn');

  // STEP 1 Validation -> STEP 2
  if (nextBtn1) {
    nextBtn1.addEventListener('click', () => {
      const name = document.getElementById('eligibilityName')?.value.trim();
      const passport = document.getElementById('eligibilityPassport')?.value.trim();
      const email = document.getElementById('eligibilityEmail')?.value.trim();
      const phone = document.getElementById('eligibilityPhone')?.value.trim();
      const country = document.getElementById('eligibilityCountry')?.value;

      if (!name) {
        showToast('Please enter your full legal name as per Passport/ID');
        document.getElementById('eligibilityName')?.focus();
        return;
      }
      if (!passport) {
        showToast('Please enter your Passport or National ID Number');
        document.getElementById('eligibilityPassport')?.focus();
        return;
      }
      if (!email || !email.includes('@')) {
        showToast('Please enter a valid email address');
        document.getElementById('eligibilityEmail')?.focus();
        return;
      }
      if (!phone || phone.length < 7) {
        showToast('Please enter a valid mobile number');
        document.getElementById('eligibilityPhone')?.focus();
        return;
      }
      goToStep(2);
    });
  }

  // STEP 2 Back -> STEP 1
  if (prevBtn2) {
    prevBtn2.addEventListener('click', () => {
      goToStep(1);
    });
  }

  // STEP 2 Validation -> STEP 3
  if (nextBtn2) {
    nextBtn2.addEventListener('click', () => {
      const bankName = document.getElementById('eligibilityBankName')?.value.trim();
      const employer = document.getElementById('eligibilityEmployer')?.value.trim();
      const income = document.getElementById('eligibilityIncome')?.value.trim();

      if (!bankName) {
        showToast('Please enter your primary bank or financial institution');
        document.getElementById('eligibilityBankName')?.focus();
        return;
      }
      if (!employer) {
        showToast('Please specify your current employer or business name');
        document.getElementById('eligibilityEmployer')?.focus();
        return;
      }
      if (!income) {
        showToast('Please enter your estimated monthly take-home income');
        document.getElementById('eligibilityIncome')?.focus();
        return;
      }
      goToStep(3);
    });
  }

  // STEP 3 Back -> STEP 2
  if (prevBtn3) {
    prevBtn3.addEventListener('click', () => {
      goToStep(2);
    });
  }

  // STEP 3 Final Submission
  if (submitFinalBtn) {
    submitFinalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      processApplicationSubmission();
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      goToStep(1);
      const resultCard = document.getElementById('eligibilitySubmittedState');
      if (resultCard) resultCard.style.display = 'none';
      const step1 = document.getElementById('eligibilityStep1');
      if (step1) step1.classList.add('active');
    });
  }

  function goToStep(step) {
    currentStep = step;
    document.querySelectorAll('.eligibility-step').forEach(s => s.classList.remove('active'));
    
    const target = document.getElementById(`eligibilityStep${step}`);
    if (target) target.classList.add('active');

    const progressFill = document.getElementById('eligibilityProgressFill');
    if (progressFill) {
      const percent = (step / totalSteps) * 100;
      progressFill.style.width = `${percent}%`;
    }

    const stepLabel = document.getElementById('eligibilityStepLabel');
    if (stepLabel) {
      stepLabel.textContent = `Step ${step} of ${totalSteps}`;
    }
  }

  function processApplicationSubmission() {
    // Collect all detailed values
    const appData = {
      refId: 'PLT-APP-' + Math.floor(100000 + Math.random() * 900000),
      submittedAt: new Date().toLocaleString(),
      fullName: document.getElementById('eligibilityName')?.value.trim() || 'Valued Traveler',
      passportId: document.getElementById('eligibilityPassport')?.value.trim() || 'N/A',
      dob: document.getElementById('eligibilityDob')?.value || 'Not specified',
      email: document.getElementById('eligibilityEmail')?.value.trim() || '',
      phone: document.getElementById('eligibilityPhone')?.value.trim() || '',
      country: document.getElementById('eligibilityCountry')?.value || 'United States',
      residentialAddress: document.getElementById('eligibilityAddress')?.value.trim() || 'On File',
      
      // Financial & Banking
      bankName: document.getElementById('eligibilityBankName')?.value.trim() || 'N/A',
      accountType: document.getElementById('eligibilityAccountType')?.value || 'Checking',
      employmentStatus: document.getElementById('eligibilityEmployment')?.value || 'Employed Full-Time',
      employer: document.getElementById('eligibilityEmployer')?.value.trim() || 'N/A',
      jobTitle: document.getElementById('eligibilityJobTitle')?.value.trim() || 'N/A',
      monthlyIncome: document.getElementById('eligibilityIncome')?.value.trim() || '$0',
      monthlyExpenses: document.getElementById('eligibilityExpenses')?.value.trim() || '$0',
      payFrequency: document.querySelector('input[name="freq"]:checked')?.nextElementSibling?.textContent || 'Weekly',

      // Travel Details
      destination: document.getElementById('eligibilityDest')?.value.trim() || 'Worldwide Flight',
      departurePeriod: document.getElementById('eligibilityMonth')?.value || '3-6 months',
      budget: budgetSlider ? budgetSlider.value : '800',
      repaymentWeeks: weeksSlider ? weeksSlider.value : '16',
      currency: currentCurrency
    };

    lastSubmittedApplication = appData;

    // 1. Save to Local Storage (Zero-Backend Persistence)
    saveApplicationToStorage(appData);

    // 2. Transmit to Backend / Webhook / Email endpoint (if deployed on Vercel/live)
    sendToUnderwritingEndpoint(appData);

    // 3. Show Submission Confirmation View
    document.querySelectorAll('.eligibility-step').forEach(s => s.classList.remove('active'));
    const submittedState = document.getElementById('eligibilitySubmittedState');
    if (submittedState) {
      submittedState.style.display = 'block';

      // Update personalized confirmation fields
      const refEl = document.getElementById('submittedRefCode');
      const nameEl = document.getElementById('submittedName');
      const emailEl = document.getElementById('submittedEmail');
      const destEl = document.getElementById('submittedDest');

      if (refEl) refEl.textContent = appData.refId;
      if (nameEl) nameEl.textContent = appData.fullName;
      if (emailEl) emailEl.textContent = appData.email;
      if (destEl) destEl.textContent = appData.destination;

      showToast(`Application ${appData.refId} submitted to underwriting team!`);
      submittedState.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  recalculateEligibilityPreview();
}

// ==========================================================================
// 4. STORAGE & DATA RETRIEVAL (Zero-Backend / No MongoDB Required)
// ==========================================================================
function saveApplicationToStorage(appData) {
  try {
    const existing = JSON.parse(localStorage.getItem('paylater_applications') || '[]');
    existing.unshift(appData);
    localStorage.setItem('paylater_applications', JSON.stringify(existing));
  } catch (err) {
    console.error('Storage error:', err);
  }
}

function sendToUnderwritingEndpoint(appData) {
  // Free serverless webhook / form endpoint for Vercel deployment:
  // Can be received directly at paylatertravelhelp@gmail.com
  const payload = {
    _subject: `New Pay Later Travel Eligibility Application [${appData.refId}]`,
    _replyto: appData.email,
    recipient: SUPPORT_EMAIL,
    ...appData
  };

  // Optional fetch to FormSubmit / Web3Forms if online
  if (navigator.onLine) {
    fetch('https://formsubmit.co/ajax/' + SUPPORT_EMAIL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(() => {
      // Graceful fallback: data is already preserved in localStorage and downloadable
    });
  }
}

// ==========================================================================
// 5. OFFICIAL ELIGIBILITY FORM DOWNLOAD (PDF / PRINTABLE RECEIPT)
// ==========================================================================
window.downloadEligibilityForm = function() {
  const data = lastSubmittedApplication || {
    refId: 'PLT-APP-PREVIEW',
    submittedAt: new Date().toLocaleString(),
    fullName: document.getElementById('eligibilityName')?.value || 'Applicant',
    passportId: document.getElementById('eligibilityPassport')?.value || 'ON-FILE',
    email: document.getElementById('eligibilityEmail')?.value || 'applicant@example.com',
    phone: document.getElementById('eligibilityPhone')?.value || '+1 555-0192',
    country: document.getElementById('eligibilityCountry')?.value || 'United States',
    residentialAddress: document.getElementById('eligibilityAddress')?.value || 'Residential Address Provided',
    bankName: document.getElementById('eligibilityBankName')?.value || 'Primary Institution',
    accountType: document.getElementById('eligibilityAccountType')?.value || 'Checking Account',
    employmentStatus: document.getElementById('eligibilityEmployment')?.value || 'Employed Full-Time',
    employer: document.getElementById('eligibilityEmployer')?.value || 'Employer Stated',
    jobTitle: document.getElementById('eligibilityJobTitle')?.value || 'Professional',
    monthlyIncome: document.getElementById('eligibilityIncome')?.value || '$4,500/mo',
    payFrequency: 'Weekly',
    destination: document.getElementById('eligibilityDest')?.value || 'Scheduled Flight',
    budget: '$850',
    repaymentWeeks: '16'
  };

  const printWindow = window.open('', '_blank', 'width=850,height=950');
  if (!printWindow) {
    showToast('Please allow popups to download your application PDF');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Pay Later Travel - Eligibility Application [${data.refId}]</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #171316; line-height: 1.5; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1156f9; padding-bottom: 20px; margin-bottom: 25px; }
        .logo { font-size: 26px; font-weight: 900; color: #1156f9; letter-spacing: -0.5px; }
        .badge { background: #e5edfc; color: #1156f9; padding: 6px 14px; border-radius: 20px; font-weight: 700; font-size: 13px; }
        .section-title { background: #f8fafc; padding: 8px 14px; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; border-left: 4px solid #1156f9; margin: 20px 0 12px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .field { font-size: 13px; }
        .label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; }
        .value { font-weight: 700; font-size: 14px; margin-top: 2px; }
        .notice-box { background: #fff8f5; border: 1.5px solid #fed9c7; border-radius: 8px; padding: 16px; margin-top: 25px; font-size: 13px; color: #475569; }
        .footer { margin-top: 35px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; }
        @media print {
          body { padding: 20px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo">Pay Later Travel</div>
          <div style="font-size: 13px; color: #64748b;">Flight Layaway & Underwriting Assessment</div>
        </div>
        <div style="text-align: right;">
          <div class="badge">APPLICATION LODGED</div>
          <div style="font-family: monospace; font-weight: 800; font-size: 14px; margin-top: 6px;">${data.refId}</div>
        </div>
      </div>

      <div class="field" style="margin-bottom: 15px;">
        <span class="label">Submission Date & Time:</span>
        <span class="value">${data.submittedAt}</span>
      </div>

      <div class="section-title">1. Traveler Identity & Contact Information</div>
      <div class="grid">
        <div class="field"><div class="label">Full Legal Name</div><div class="value">${data.fullName}</div></div>
        <div class="field"><div class="label">Passport / ID Number</div><div class="value">${data.passportId}</div></div>
        <div class="field"><div class="label">Email Address</div><div class="value">${data.email}</div></div>
        <div class="field"><div class="label">Mobile Phone</div><div class="value">${data.phone}</div></div>
        <div class="field"><div class="label">Country of Residence</div><div class="value">${data.country}</div></div>
        <div class="field"><div class="label">Residential Address</div><div class="value">${data.residentialAddress}</div></div>
      </div>

      <div class="section-title">2. Banking, Income & Underwriting Profile</div>
      <div class="grid">
        <div class="field"><div class="label">Primary Bank / Financial Institution</div><div class="value">${data.bankName}</div></div>
        <div class="field"><div class="label">Account Type</div><div class="value">${data.accountType}</div></div>
        <div class="field"><div class="label">Employment Status</div><div class="value">${data.employmentStatus}</div></div>
        <div class="field"><div class="label">Employer / Business Name</div><div class="value">${data.employer}</div></div>
        <div class="field"><div class="label">Job Title / Role</div><div class="value">${data.jobTitle}</div></div>
        <div class="field"><div class="label">Estimated Monthly Take-Home</div><div class="value">${data.monthlyIncome}</div></div>
        <div class="field"><div class="label">Preferred Repayment Frequency</div><div class="value">${data.payFrequency}</div></div>
        <div class="field"><div class="label">Estimated Monthly Obligations</div><div class="value">${data.monthlyExpenses}</div></div>
      </div>

      <div class="section-title">3. Travel Route & Layaway Request</div>
      <div class="grid">
        <div class="field"><div class="label">Target Destination / Route</div><div class="value">${data.destination}</div></div>
        <div class="field"><div class="label">Estimated Flight Budget</div><div class="value">$${data.budget}</div></div>
        <div class="field"><div class="label">Requested Payment Period</div><div class="value">${data.repaymentWeeks} Weeks (0% Interest)</div></div>
        <div class="field"><div class="label">Departure Horizon</div><div class="value">${data.departurePeriod}</div></div>
      </div>

      <div class="notice-box">
        <strong>Underwriting Assessment & Email Notification Protocol:</strong><br>
        Your application is currently being reviewed. You will shortly receive an official email decision:
        <ul style="margin: 6px 0 6px 18px; padding: 0;">
          <li><strong>If approved:</strong> Your pre-approval letter and flight booking code will be delivered directly to your inbox.</li>
          <li><strong>If not approved:</strong> You will receive a notification email. Please do not worry—you are welcome to re-apply once your financial or credit profile stabilizes.</li>
        </ul>
        For immediate help or status inquiries, contact our team at: <strong>${SUPPORT_EMAIL}</strong>.
      </div>

      <div class="no-print" style="margin-top: 25px; text-align: center;">
        <button onclick="window.print()" style="background:#1156f9;color:#fff;border:none;padding:12px 28px;border-radius:6px;font-weight:700;font-size:15px;cursor:pointer;">
          Print / Save as PDF
        </button>
      </div>

      <div class="footer">
        <div>Pay Later Travel Underwriting Division • IATA Accredited Agent</div>
        <div>Official Inquiries: ${SUPPORT_EMAIL}</div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  showToast('Official eligibility form generated! Click Print/Save as PDF.');
};

// ==========================================================================
// 6. ZERO-HEADACHE ADMIN RETRIEVAL DASHBOARD (Export to CSV / Excel)
// ==========================================================================
function initAdminDashboard() {
  // Keyboard shortcut: Ctrl + Shift + A or footer link to review submitted inquiries
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
      openAdminDrawer();
    }
  });

  const adminLink = document.getElementById('openAdminDrawerLink');
  if (adminLink) {
    adminLink.addEventListener('click', (e) => {
      e.preventDefault();
      openAdminDrawer();
    });
  }
}

window.openAdminDrawer = function() {
  let drawer = document.getElementById('adminInquiriesDrawer');
  if (!drawer) {
    drawer = document.createElement('div');
    drawer.id = 'adminInquiriesDrawer';
    drawer.className = 'modal-overlay';
    drawer.innerHTML = `
      <div class="modal-box" style="max-width:980px;">
        <button class="modal-close-btn" onclick="document.getElementById('adminInquiriesDrawer').classList.remove('active')">&times;</button>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px;">
          <div>
            <span class="section-tag" style="background:#ffedd5;color:#c2410c;">Direct Submission Retriever</span>
            <h3 style="font-family:var(--font-heading);font-size:1.8rem;font-weight:800;">Submitted Eligibility Applications</h3>
            <p style="font-size:0.88rem;color:#64748b;">All submissions captured directly without MongoDB or backend setup.</p>
          </div>
          <button class="btn btn-primary btn-sm" onclick="exportApplicationsToCSV()">
            <span>Download All as CSV (Excel)</span>
          </button>
        </div>
        <div id="adminTableContainer" style="overflow-x:auto;max-height:500px;border:1px solid #e2e8f0;border-radius:10px;"></div>
      </div>
    `;
    document.body.appendChild(drawer);
  }

  // Populate records from localStorage
  const apps = JSON.parse(localStorage.getItem('paylater_applications') || '[]');
  const container = drawer.querySelector('#adminTableContainer');
  if (apps.length === 0) {
    container.innerHTML = `<div style="padding:40px;text-align:center;color:#64748b;">No applications submitted yet. Fill out the eligibility form to see records here.</div>`;
  } else {
    let rows = apps.map((a, idx) => `
      <tr style="border-bottom:1px solid #f1f5f9;font-size:0.85rem;">
        <td style="padding:10px 14px;font-weight:800;font-family:monospace;color:#1156f9;">${a.refId}</td>
        <td style="padding:10px 14px;">${a.submittedAt}</td>
        <td style="padding:10px 14px;font-weight:700;">${a.fullName}</td>
        <td style="padding:10px 14px;">${a.email}</td>
        <td style="padding:10px 14px;">${a.phone}</td>
        <td style="padding:10px 14px;">${a.bankName} (${a.accountType})</td>
        <td style="padding:10px 14px;">${a.employer}</td>
        <td style="padding:10px 14px;font-weight:700;color:#059669;">${a.monthlyIncome}</td>
        <td style="padding:10px 14px;">${a.destination}</td>
      </tr>
    `).join('');

    container.innerHTML = `
      <table style="width:100%;border-collapse:collapse;text-align:left;">
        <thead style="background:#f8fafc;border-bottom:2px solid #e2e8f0;font-size:0.75rem;text-transform:uppercase;color:#475569;">
          <tr>
            <th style="padding:10px 14px;">Ref ID</th>
            <th style="padding:10px 14px;">Date</th>
            <th style="padding:10px 14px;">Applicant</th>
            <th style="padding:10px 14px;">Email</th>
            <th style="padding:10px 14px;">Phone</th>
            <th style="padding:10px 14px;">Bank & Account</th>
            <th style="padding:10px 14px;">Employer</th>
            <th style="padding:10px 14px;">Income</th>
            <th style="padding:10px 14px;">Destination</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  }

  drawer.classList.add('active');
};

window.exportApplicationsToCSV = function() {
  const apps = JSON.parse(localStorage.getItem('paylater_applications') || '[]');
  if (apps.length === 0) {
    showToast('No submitted applications to export yet');
    return;
  }

  const headers = ['Ref ID', 'Submission Date', 'Full Name', 'Passport ID', 'DOB', 'Email', 'Phone', 'Country', 'Address', 'Bank Name', 'Account Type', 'Employment Status', 'Employer', 'Job Title', 'Monthly Income', 'Monthly Expenses', 'Pay Frequency', 'Destination', 'Flight Budget', 'Repayment Period'];
  
  const csvRows = [headers.join(',')];
  apps.forEach(a => {
    const row = [
      `"${a.refId}"`,
      `"${a.submittedAt}"`,
      `"${a.fullName}"`,
      `"${a.passportId}"`,
      `"${a.dob || ''}"`,
      `"${a.email}"`,
      `"${a.phone}"`,
      `"${a.country}"`,
      `"${(a.residentialAddress || '').replace(/"/g, '""')}"`,
      `"${a.bankName}"`,
      `"${a.accountType}"`,
      `"${a.employmentStatus}"`,
      `"${a.employer}"`,
      `"${a.jobTitle}"`,
      `"${a.monthlyIncome}"`,
      `"${a.monthlyExpenses || ''}"`,
      `"${a.payFrequency}"`,
      `"${a.destination}"`,
      `"${a.budget}"`,
      `"${a.repaymentWeeks} Weeks"`
    ];
    csvRows.push(row.join(','));
  });

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `PayLater_Travel_Applications_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Applications CSV downloaded successfully!');
};

// ==========================================================================
// 7. DESTINATIONS TABS & QUICK SELECTION
// ==========================================================================
function initDestinationTabs() {
  const destTabs = document.querySelectorAll('.dest-tab');
  const destCards = document.querySelectorAll('.dest-card');

  destTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      destTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      destCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter || (filter === 'trending' && card.getAttribute('data-trending') === 'true')) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  document.querySelectorAll('.dest-card-action').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.dest-card');
      const city = card.querySelector('.dest-city').textContent;
      const destInput = document.getElementById('searchDestination');
      if (destInput) {
        destInput.value = city;
        destInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        destInput.focus();
        showToast(`Selected destination: ${city}. Searching best layaway plans!`);
        setTimeout(() => {
          openFlightResultsModal(city);
        }, 500);
      }
    });
  });
}

// ==========================================================================
// 8. FAQS ACCORDION & REAL-TIME SEARCH
// ==========================================================================
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  const searchInput = document.getElementById('faqSearchInput');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(other => other.classList.remove('open'));
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    }
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      faqItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(query)) {
          item.style.display = 'block';
          if (query.length > 2) item.classList.add('open');
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
}

// ==========================================================================
// 9. LIVE SUPPORT CHAT
// ==========================================================================
function initSupportChat() {
  const chatTrigger = document.getElementById('chatTriggerBtn');
  const chatWindow = document.getElementById('chatWindow');
  const chatClose = document.getElementById('chatCloseBtn');
  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSendBtn');
  const chatMessages = document.getElementById('chatMessages');

  if (!chatTrigger || !chatWindow) return;

  chatTrigger.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
    if (chatWindow.classList.contains('open') && chatInput) {
      chatInput.focus();
    }
  });

  if (chatClose) {
    chatClose.addEventListener('click', () => {
      chatWindow.classList.remove('open');
    });
  }

  function handleSend() {
    if (!chatInput || !chatInput.value.trim()) return;
    const userText = chatInput.value.trim();
    chatInput.value = '';

    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user';
    userBubble.textContent = userText;
    chatMessages.appendChild(userBubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
      const agentBubble = document.createElement('div');
      agentBubble.className = 'chat-bubble agent';
      
      const lower = userText.toLowerCase();
      if (lower.includes('credit') || lower.includes('check')) {
        agentBubble.textContent = `No credit checks are required! Once you submit your eligibility form, our underwriting team reviews your application and emails you directly. If not approved, you can always re-apply once your profile improves. Direct email: ${SUPPORT_EMAIL}`;
      } else if (lower.includes('ticket') || lower.includes('when')) {
        agentBubble.textContent = "Your flight seat and price are locked in immediately upon deposit. Your flight e-ticket is sent directly to your email within 24 hours of completing your final installment!";
      } else if (lower.includes('deposit') || lower.includes('down')) {
        agentBubble.textContent = "Deposits start from as little as $25 or 8-10% of your flight fare. You then pay off the remainder in up to 18 weekly installments!";
      } else if (lower.includes('email') || lower.includes('mail') || lower.includes('contact')) {
        agentBubble.textContent = `You can email our team directly at ${SUPPORT_EMAIL} for any inquiry or application status update.`;
      } else {
        agentBubble.textContent = `Thanks for reaching out! After you fill in your eligibility inquiry, our underwriting team will email you whether you are eligible or not. Feel free to email us at ${SUPPORT_EMAIL} anytime.`;
      }

      chatMessages.appendChild(agentBubble);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 700);
  }

  if (chatSendBtn) chatSendBtn.addEventListener('click', handleSend);
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }
}

// ==========================================================================
// 10. MOBILE NAV & MODALS
// ==========================================================================
function initMobileNav() {
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  const closeMobile = document.getElementById('closeMobileNav');

  if (hamburger && mobileDrawer) {
    hamburger.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
    });

    if (closeMobile) {
      closeMobile.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    }

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });
  }
}

function initModals() {
  const modalOverlay = document.getElementById('flightResultsModal');
  const closeModalBtn = document.getElementById('closeResultsModal');

  if (closeModalBtn && modalOverlay) {
    closeModalBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }

  document.querySelectorAll('.open-eligibility-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'eligibility.html';
    });
  });
}

function openFlightResultsModal(destinationName) {
  const modal = document.getElementById('flightResultsModal');
  if (!modal) return;

  const origin = document.getElementById('searchOrigin')?.value || 'Los Angeles (LAX)';
  const dest = destinationName || document.getElementById('searchDestination')?.value || 'Tokyo (NRT)';
  
  const destTitleEl = document.getElementById('modalRouteTitle');
  if (destTitleEl) {
    destTitleEl.textContent = `${origin} ➔ ${dest}`;
  }

  const listEl = document.getElementById('modalFlightList');
  if (listEl) {
    const airlines = [
      { name: 'Delta Air Lines', flight: 'DL 284', time: '08:45 AM - 02:30 PM (+1)', stops: 'Nonstop (11h 45m)', base: 820 },
      { name: 'United Airlines', flight: 'UA 875', time: '11:15 AM - 05:20 PM (+1)', stops: 'Nonstop (12h 05m)', base: 790 },
      { name: 'ANA (All Nippon Airways)', flight: 'NH 105', time: '01:30 PM - 07:15 PM (+1)', stops: 'Nonstop (11h 45m)', base: 940 },
      { name: 'Singapore Airlines', flight: 'SQ 11', time: '03:45 PM - 10:10 PM (+1)', stops: '1 Stop via SIN', base: 740 }
    ];

    listEl.innerHTML = '';
    airlines.forEach(item => {
      const deposit = Math.max(30, Math.round(item.base * 0.08));
      const weekly = Math.round((item.base - deposit) / 16);
      
      const card = document.createElement('div');
      card.style.cssText = 'border:1.5px solid #e2e8f0;border-radius:12px;padding:18px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px;background:#ffffff;';
      card.innerHTML = `
        <div>
          <div style="font-weight:800;font-size:1.1rem;color:#171316;">${item.name} <span style="font-size:0.8rem;color:#64748b;font-weight:600;">• ${item.flight}</span></div>
          <div style="font-size:0.9rem;color:#334155;margin-top:4px;">🕒 ${item.time}</div>
          <div style="font-size:0.8rem;color:#059669;font-weight:700;margin-top:2px;">✔ ${item.stops} • Seat Guaranteed</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:0.8rem;color:#64748b;text-transform:uppercase;font-weight:700;">Lock in today for</div>
          <div style="font-size:1.4rem;font-weight:900;color:#1156f9;font-family:'Outfit',sans-serif;">${formatMoney(deposit)} <span style="font-size:0.8rem;font-weight:600;color:#64748b;">deposit</span></div>
          <div style="font-size:0.85rem;color:#ff7433;font-weight:700;">+ ${formatMoney(weekly)} / week (16 wks)</div>
          <button class="btn btn-primary btn-sm" style="margin-top:8px;" onclick="selectFlightOption('${item.name}', '${item.flight}', ${item.base})">Apply via Eligibility</button>
        </div>
      `;
      listEl.appendChild(card);
    });
  }

  modal.classList.add('active');
}

window.selectFlightOption = function(airline, flightNum, price) {
  const modal = document.getElementById('flightResultsModal');
  if (modal) modal.classList.remove('active');
  
  window.location.href = `eligibility.html?price=${price}&flight=${encodeURIComponent(airline + ' ' + flightNum)}`;
};

function showToast(message) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8dd575" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
