const apiUrl =
  '?key=06943aaf8aaba510ca2f57007715568f&token=c1660f64700d855c385ca0843ef0b4a1';
const totalGoal = 10000;
const progressElement = document.getElementById('progress');
const indicatorElement = document.getElementById('indicator');
const totalElement = document.getElementById('total');
const progressbarIndicator = document.getElementById('progress-indicator');

let cacheDonations = {};

const formatToCurrency = (value) => {
  return Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value));
};

const setTextIntoElements = (request) => {
  const totalEarnings = Number(
    request?.stats?.earnings?.current_month.replace(',', '.') || 0
  );

  const progressPercentage = (totalEarnings / totalGoal) * 100;

  if (progressPercentage > 100) {
    progressElement.style.width = '100%';
    progressbarIndicator.style.left = '100%';
  } else {
    progressElement.style.width = `${progressPercentage}%`;
    progressbarIndicator.style.left = `${progressPercentage}%`;
  }

  indicatorElement.innerHTML = formatToCurrency(totalGoal);
  totalElement.innerHTML = formatToCurrency(totalEarnings);
};

const updateEarningsPosition = () => {
  const progressIndicator = document.getElementById('progress-indicator');
  const earningsContainer = document.getElementById('earningsContainer');
  const totalElement = document.getElementById('total');

  const percentLeft = parseFloat(progressIndicator.style.left);
  const remValue = -2.4 + (percentLeft * 29.8) / 100; // Convert percentage to rem (assuming 100% corresponds to 27.4rem)

  // 13.7 = Metade de 27.4 (100% do valor)
  if (remValue > 13.7) {
    totalElement.style.textAlign = 'end';
  }

  earningsContainer.style.marginLeft = remValue + 'rem';
};

const updateDonations = () => {
  fetch(`https://compaixao.app/give-api/stats/${apiUrl}`)
    .then((res) => res.json())
    .then((res) => {
      if (!_.isEqual(cacheDonations, res)) {
        cacheDonations = res;
        setTextIntoElements(res);
      } else {
        setTextIntoElements(cacheDonations);
      }
      updateEarningsPosition();
    })
    .catch((error) => console.error('Erro ao buscar dados da API:', error));
};

updateEarningsPosition();
updateDonations();
setInterval(updateDonations, 10000);
