


document.addEventListener("DOMContentLoaded", () => {
	
    // Redirect if not logged in
    if (localStorage.getItem("loggedIn") !== "true") {
        window.location.href = "login.html";
    }
	
	
    let energyChart;
    const ctx = document.getElementById("energyChart").getContext("2d");
	let test = [];
	let testl = [-1];

	
    // Data for different appliances
    let graphData = {
        overview: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Electricity Usage (kWh)',
                    data: [6, 5, 8, 8, 5, 5, 40, 50, 60, 70, 75, 80],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    tension: 0.4
                },
                {
                    label: 'Gas Usage (kWh)',
                    data: [30, 40, 35, 50, 45, 60, 55, 65, 70, 75, 80, 85],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    tension: 0.4
                },
                {
                    label: 'Solar Energy (kWh)',
                    data: [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65],
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }
            ]
        },
        fridge: {
            labels: testl,
            datasets: [
                {
                    label: 'Fridge Usage (kWh)',
                    data: test,
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }
            ]
        },
        ac: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'AC Usage (kWh)',
                    data: [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105],
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }
            ]
        },
        washingMachine: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Washing Machine Usage (kWh)',
                    data: [15, 18, 20, 22, 25, 28, 30, 32, 35, 38, 40, 42],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }
            ]
        }
    };

    // Function to update the chart
    const updateChart = (data) => {
        if (energyChart) {
            energyChart.destroy(); // Destroy existing chart
        }

        energyChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: 'white' }
                    },
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: 'white' }
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: 'white' } }
                }
            }
        });
    };

    // Initialize with the overview graph
    updateChart(graphData.overview);
	
	let cGraph;
	const delay = ms => new Promise(res => setTimeout(res, ms));
	async function getDevices(){
	while (true) {
		const response = await fetch(`/devices`); // get devices
        if (!response.ok) {
            throw new Error('Failed to fetch devices');
        }
		//console.log(response.json());
		const devices = await response.json();
		
		// Display the devices
        devices.forEach(device => {
			console.log(device.name);
			let l = graphData.fridge.datasets[0].data.length;
			graphData.fridge.datasets[0].data.push(l);
			testl.push(l);
        });
	updateChart(graphData[cGraph]);	
		    // Event listeners for graph buttons
    document.querySelectorAll(".graphButton").forEach(button => {
        button.addEventListener("click", () => {
            const graphType = button.getAttribute("data-graph");
			cGraph = graphType;
            updateChart(graphData[graphType]);
        });
    });
	await delay(1000);
	}
}
	getDevices();

});
