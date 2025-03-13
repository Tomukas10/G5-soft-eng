


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
            labels: [],
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
            labels: [],
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
            labels: [],
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
            labels: [],
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
            labels: [],
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
	async function getDevices(){
	while (true) {
		const response = await fetch(`/devices`); // get devices
        if (!response.ok) {
            throw new Error('Failed to fetch devices');
        }
		//console.log(response.json());
		const devices = await response.json();
		let l = graphData.overview.datasets[0].data.length; //to be implemented in DB
		graphData.overview.labels.push(l);
		graphData.overview.datasets[0].data.push(0);

		// Display the devices
        devices.forEach(device => {
			//eval("let test = graphData." + device.name.replace(/\s/g, '') + ".labels");
			//if (typeof test == "undefined"){
			//	eval("graphData." + device.name.replace(/\s/g, '') + ".labels = [];");
			//	eval("graphData." + device.name.replace(/\s/g, '') + ".datasets = [];");
			//	eval("graphData." + device.name.replace(/\s/g, '') + ".datasets.label = 'Power Usage (kWh)';");
			//	eval("graphData." + device.name.replace(/\s/g, '') + ".datasets.data = [];");
			//	eval("graphData." + device.name.replace(/\s/g, '') + ".datasets.backgroundColor = 'rgba(54, 162, 235, 0.2)';");
			//	eval("graphData." + device.name.replace(/\s/g, '') + ".datasets.borderColor = 'rgba(0, 162, 235, 1)';");
			//	eval("graphData." + device.name.replace(/\s/g, '') + ".datasets.borderWidth = 2;");
			//	eval("graphData." + device.name.replace(/\s/g, '') + ".datasets.tension = 0.4;");				
			//}
			try {
			let p = l * device.state * device.powerusage;
			//l = graphData.hoover.datasets[0].data.length * device.state * device.powerUsage;
			eval("graphData." + device.name.replace(/\s/g, '') + ".labels.push(l);"); //set labels
			eval("graphData." + device.name.replace(/\s/g, '') + ".datasets[0].data.push(p);"); //set data
			//graphData.oven.datasets[0].data.push(l);
			graphData.overview.datasets[0].data[graphData.overview.datasets[0].data.length - 1] += p;
	
			//graphData.oven.labels.push(l);
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
	getDevices();

});
