const fetchAnalytics = async () => {
  const shortcode = new URLSearchParams(window.location.search).get('shortcode');
  const granularity = document.getElementById('dataGranularity').value || 'day'; // Use selected granularity, default to 'day'
  const graphType = document.getElementById('graphType').value; // Get the selected graph type

  // Correct route to get analytics
  const response = await fetch(`https://adityakumar.site/analytics/${shortcode}/clicks/${granularity}`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });

  if (response.ok) {
    const data = await response.json();
    renderGraphs(data, graphType);
  } else {
    console.error('Error fetching analytics data');
  }
};

const renderGraphs = (data, graphType) => {
  // Log for debugging
  console.log('Rendering graphs with data:', data);

  const lineCtx = document.getElementById('lineGraph').getContext('2d');
  const barCtx = document.getElementById('barGraph').getContext('2d');
  const labels = data.labels; // Should be an array of labels (e.g., dates)
  const values = data.values; // Should be an array of values (e.g., number of clicks)

  const graphOptions = {
    scales: {
      y: { beginAtZero: true }
    }
  };

  // Clear previous charts if they exist
  if (window.lineChart) {
    window.lineChart.destroy();
  }
  if (window.barChart) {
    window.barChart.destroy();
  }

  // Hide both graphs initially
  document.getElementById('lineGraph').style.display = 'none';
  document.getElementById('barGraph').style.display = 'none';

  // Render Line Graph if selected
  if (graphType === 'line') {
    window.lineChart = new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Number of Clicks',
          data: values,
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          fill: false,
          tension: 0.1
        }]
      },
      options: graphOptions
    });
    document.getElementById('lineGraph').style.display = 'block'; // Show line graph
  }

  // Render Bar Graph if selected
  if (graphType === 'bar') {
    window.barChart = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Number of Clicks',
          data: values,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: graphOptions
    });
    document.getElementById('barGraph').style.display = 'block'; // Show bar graph
  }
};

// Ensure the function runs on button click
document.getElementById('fetchButton').addEventListener('click', fetchAnalytics);

// Optionally, you can call fetchAnalytics on page load
window.onload = function () {
  fetchAnalytics();
};
