document.addEventListener("DOMContentLoaded", () => {
	
    // Redirect if not logged in
    if (localStorage.getItem("loggedIn") !== "true") {
        window.location.href = "login.html";
    }
	
	
    let energyChart;
    const ctx = document.getElementById("energyChart").getContext("2d");

	
    // Data for different appliances
    let graphData = {
        overview: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Electricity Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }
            ]
        },
        barlight: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Fridge Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }
            ]
        },
        hoover: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'AC Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }
            ]
        },
        washingmachine: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Washing Machine Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }
            ]
        },
		oven: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Oven Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(0, 162, 235, 1)',
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
	
	let cGraph = null;
	//simple delay function to repeat the request every 1000ms
	const delay = ms => new Promise(res => setTimeout(res, ms));
	async function getDevices(userId){
	while (true) {
		const response = await fetch(`/totPower/device/month/${userId}`); // get energy per devices for user
        if (!response.ok) {
            throw new Error('Failed to fetch energy');
        }
		//console.log(response.json());
		const power = await response.json();


		// Display the energy data
        power.forEach(powerstat => {
			try {
			let month = powerstat.month;
			let power = powerstat.power;
			let name = powerstat.name;
			let id = powerstat.id;

			eval("graphData." + name.replace(/\s/g, '') + ".datasets[0].data[" + month.replace(/\s/g, '') + "] = " + power + ";"); //set data

			//graphData.overview.datasets[id].data[graphData.overview.datasets[0].data.length - 1] += p;
	
			} 
			catch{
				//requested device has yet to be added.
			}
        });

	if( cGraph == null) {
		updateChart(graphData.overview);
	}
	else{
		updateChart(graphData[cGraph]);
	}
		    // Event listeners for graph buttons
    document.querySelectorAll(".graphButton").forEach(button => {
        button.addEventListener("click", () => {
            const graphType = button.getAttribute("data-graph");
			cGraph = graphType;
            updateChart(graphData[cGraph]);
        });
    });
	await delay(1000); //delay function call
	}
}
	getDevices(2);

});
