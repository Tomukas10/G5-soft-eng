document.addEventListener("DOMContentLoaded", () => {
	let user = 0;
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html"; // Redirect if not logged in
    }

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        user =  payload.id; // Contains { id, name, user_type }
    } catch (err) {
        console.error("Error decoding token:", err);
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
                    borderColor: 'rgba(175, 92, 192, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }
            ]
			
        },
        detail: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Bar Lights Electricity Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(053, 052, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 2,
                    tension: 0.4
                },
				{
                    label: 'Oven Electricity Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(245, 192, 192, 0.2)',
                    borderColor: 'rgba(245, 192, 192, 1)',
                    borderWidth: 2,
                    tension: 0.4
                },
                {
                    label: 'Washing Machine Electricity Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    tension: 0.4
                },
				{
                    label: 'Hoover Electricity Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(175, 192, 92, 0.2)',
                    borderColor: 'rgba(175, 192, 92, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }
            ]
        },
		overviewm: {
            labels: Array.from({length: 31}, (_, i) => i + 1),
            datasets: [
                {
                    label: 'Electricity Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(175, 92, 192, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }
            ]
			
        },
        detailm: {
            labels: Array.from({length: 31}, (_, i) => i + 1),
            datasets: [
                {
                    label: 'Bar Lights Electricity Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(053, 052, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 2,
                    tension: 0.4
                },
				{
                    label: 'Oven Electricity Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(245, 192, 192, 0.2)',
                    borderColor: 'rgba(245, 192, 192, 1)',
                    borderWidth: 2,
                    tension: 0.4
                },
                {
                    label: 'Washing Machine Electricity Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    tension: 0.4
                },
				{
                    label: 'Hoover Electricity Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(175, 192, 92, 0.2)',
                    borderColor: 'rgba(175, 192, 92, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }
            ]
        },
		overviewd: {
            labels: Array.from({length: 24}, (_, i) => i + 1),
            datasets: [
                {
                    label: 'Electricity Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(175, 92, 192, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }
            ]
			
        },
        detaild: {
            labels: Array.from({length: 24}, (_, i) => i + 1),
            datasets: [
                {
                    label: 'Bar Lights Electricity Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(053, 052, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 2,
                    tension: 0.4
                },
				{
                    label: 'Oven Electricity Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(245, 192, 192, 0.2)',
                    borderColor: 'rgba(245, 192, 192, 1)',
                    borderWidth: 2,
                    tension: 0.4
                },
                {
                    label: 'Washing Machine Electricity Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    tension: 0.4
                },
				{
                    label: 'Hoover Electricity Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(175, 192, 92, 0.2)',
                    borderColor: 'rgba(175, 192, 92, 1)',
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
		let response = await fetch(`/totPower/device/month/${userId}`); // get energy per devices for user
        if (!response.ok) {
            throw new Error('Failed to fetch energy');
        }
		let power = await response.json();
		
		// zero overview array
		graphData.overview.datasets[0].data = [0,0,0,0,0,0,0,0,0,0,0,0];
		
		// Display the energy data
        power.forEach(powerstat => {
			try {
			let month = powerstat.month;
			let power = powerstat.power;
			let name = powerstat.name;
			let id = powerstat.id;
			
			
			graphData.detail.datasets[id-1].data[month-1] = power;
			graphData.overview.datasets[0].data[month-1] += power;
			} 
			catch{
				//requested device has yet to be added.
			}
        });
		
		
		response = await fetch(`/totPower/device/day/${userId}`); // get energy per devices for user
        if (!response.ok) {
            throw new Error('Failed to fetch energy');
        }
		power = await response.json();
		
		// zero overview array
		graphData.overviewm.datasets[0].data = [0,0,0,0,0,0,0,0,0,0,0,0];
		
		// Display the energy data
        power.forEach(powerstat => {
			try {
			day = powerstat.day;
			power = powerstat.power;
			name = powerstat.name;
			id = powerstat.id;
			
			
			graphData.detailm.datasets[id-1].data[day-1] = power;
			graphData.overviewm.datasets[0].data[day-1] += power;
			} 
			catch{
				//requested device has yet to be added.
			}
        });
		
		
		response = await fetch(`/totPower/device/hour/${userId}`); // get energy per devices for user
        if (!response.ok) {
            throw new Error('Failed to fetch energy');
        }
		power = await response.json();
		
		// zero overview array
		graphData.overviewd.datasets[0].data = [0,0,0,0,0,0,0,0,0,0,0,0];
		
		// Display the energy data
        power.forEach(powerstat => {
			try {
			hour = powerstat.hour;
			power = powerstat.power;
			name = powerstat.name;
			id = powerstat.id;
			
			
			graphData.detaild.datasets[id-1].data[hour-1] = power;
			graphData.overviewd.datasets[0].data[hour-1] += power;
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
	await delay(60000); //delay function call (update graph once a minute)
	}
}
	getDevices(user);


});
