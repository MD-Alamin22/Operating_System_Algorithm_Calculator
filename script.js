document.getElementById('load-algorithm').addEventListener('click', function () {
    const algorithm = document.getElementById('algorithm-selector').value;
    const formContainer = document.getElementById('algorithm-form');
    const resultContainer = document.getElementById('algorithm-result');

    formContainer.innerHTML = ''; // Clear previous content
    resultContainer.innerHTML = ''; // Clear previous results

    // Load the appropriate form based on the selected algorithm
    if (algorithm === 'fcfs') {
        loadFCFSForm(formContainer, resultContainer); // FCFS for process scheduling
    } else if (algorithm === 'priority-non-preemptive') {
        loadPriorityForm(formContainer, resultContainer, false);
    } else if (algorithm === 'priority-preemptive') {
        loadPriorityForm(formContainer, resultContainer, true);
    } else if (algorithm === 'sjf-non-preemptive') {
        loadSJFForm(formContainer, resultContainer, false);
    } else if (algorithm === 'sjf-preemptive') {
        loadSJFForm(formContainer, resultContainer, true);
    } else if (algorithm === 'round-robin') {
        loadRoundRobinForm(formContainer, resultContainer);
    } else if (algorithm === 'bankers') {
        loadBankersForm(formContainer, resultContainer);
    } else if (algorithm === 'sstf') {
        loadDiskSchedulingForm(formContainer, resultContainer, 'sstf');
    } else if (algorithm === 'fcfs-disk') {
        loadDiskSchedulingForm(formContainer, resultContainer, 'fcfs-disk'); // FCFS for disk scheduling
    } else if (algorithm === 'scan') {
        loadDiskSchedulingForm(formContainer, resultContainer, 'scan');
    } else if (algorithm === 'cscan') {
        loadDiskSchedulingForm(formContainer, resultContainer, 'cscan');
    } else if (algorithm === 'look') {
        loadDiskSchedulingForm(formContainer, resultContainer, 'look');
    } else if (algorithm === 'clook') {
        loadDiskSchedulingForm(formContainer, resultContainer, 'clook');
    } else if (algorithm === 'fifo' || algorithm === 'lru' || algorithm === 'optimam') {
        loadPageReplacementForm(formContainer, resultContainer, algorithm);
    } else if (algorithm === 'best' || algorithm === 'worst' || algorithm === 'first') {
        loadMemoryAllocationForm(formContainer, resultContainer, algorithm);
    }
});




// Function to load the FCFS (First-Come-First-Serve) form
function loadFCFSForm(formContainer, resultContainer) {
    formContainer.innerHTML = `
        <h3>FCFS (First-Come-First-Serve)</h3>
        <form id="fcfs-form">
            <label for="processes">Enter number of processes:</label>
            <input type="number" id="processes" min="1" required>
            <button type="submit">Calculate</button>
        </form>
    `;

    document.getElementById('fcfs-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const numProcesses = parseInt(document.getElementById('processes').value);
        loadProcessDetailsForm(numProcesses, resultContainer, calculateFCFS);
    });
}

// Function to load a form for process details (arrival time, burst time, etc.)
function loadProcessDetailsForm(numProcesses, resultContainer, calculateFunction) {
    let formHTML = `<h3>Enter Process Details</h3><form id="process-details-form">`;
    for (let i = 1; i <= numProcesses; i++) {
        formHTML += `
            <h4>Process ${i}</h4>
            <label for="arrival-time-${i}">Arrival Time:</label>
            <input type="number" id="arrival-time-${i}" required>
            <label for="burst-time-${i}">Burst Time:</label>
            <input type="number" id="burst-time-${i}" required>
        `;
    }
    formHTML += `<button type="submit">Calculate</button></form>`;
    resultContainer.innerHTML = formHTML;

    document.getElementById('process-details-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const processes = [];
        for (let i = 1; i <= numProcesses; i++) {
            processes.push({
                id: i,
                arrivalTime: parseInt(document.getElementById(`arrival-time-${i}`).value),
                burstTime: parseInt(document.getElementById(`burst-time-${i}`).value),
            });
        }
        calculateFunction(processes, resultContainer);
    });
}

// Function to calculate FCFS
function calculateFCFS(processes, resultContainer) {
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime); // Sort by arrival time
    let currentTime = 0;
    let waitingTime = 0;
    let turnaroundTime = 0;
    let resultHTML = `<h3>FCFS Results</h3><table border="1"><tr><th>Process</th><th>Arrival Time</th><th>Burst Time</th><th>Waiting Time</th><th>Turnaround Time</th></tr>`;

    processes.forEach(process => {
        if (currentTime < process.arrivalTime) {
            currentTime = process.arrivalTime;
        }
        const waiting = currentTime - process.arrivalTime;
        const turnaround = waiting + process.burstTime;
        waitingTime += waiting;
        turnaroundTime += turnaround;
        currentTime += process.burstTime;

        resultHTML += `<tr><td>P${process.id}</td><td>${process.arrivalTime}</td><td>${process.burstTime}</td><td>${waiting}</td><td>${turnaround}</td></tr>`;
    });

    resultHTML += `</table>`;
    resultHTML += `<p>Average Waiting Time: ${(waitingTime / processes.length).toFixed(2)}</p>`;
    resultHTML += `<p>Average Turnaround Time: ${(turnaroundTime / processes.length).toFixed(2)}</p>`;
    resultContainer.innerHTML = resultHTML;
}

// Function to load the Priority Scheduling form
function loadPriorityForm(formContainer, resultContainer, isPreemptive) {
    formContainer.innerHTML = `
        <h3>Priority Scheduling (${isPreemptive ? 'Preemptive' : 'Non-Preemptive'})</h3>
        <form id="priority-form">
            <label for="processes">Enter number of processes:</label>
            <input type="number" id="processes" min="1" required>
            <button type="submit">Calculate</button>
        </form>
    `;

    document.getElementById('priority-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const numProcesses = parseInt(document.getElementById('processes').value);
        loadProcessDetailsWithPriorityForm(numProcesses, resultContainer, isPreemptive, calculatePriority);
    });
}

// Function to load a form for process details with priority
function loadProcessDetailsWithPriorityForm(numProcesses, resultContainer, isPreemptive, calculateFunction) {
    let formHTML = `<h3>Enter Process Details</h3><form id="process-details-form">`;
    for (let i = 1; i <= numProcesses; i++) {
        formHTML += `
            <h4>Process ${i}</h4>
            <label for="arrival-time-${i}">Arrival Time:</label>
            <input type="number" id="arrival-time-${i}" required>
            <label for="burst-time-${i}">Burst Time:</label>
            <input type="number" id="burst-time-${i}" required>
            <label for="priority-${i}">Priority:</label>
            <input type="number" id="priority-${i}" required>
        `;
    }
    formHTML += `<button type="submit">Calculate</button></form>`;
    resultContainer.innerHTML = formHTML;

    document.getElementById('process-details-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const processes = [];
        for (let i = 1; i <= numProcesses; i++) {
            processes.push({
                id: i,
                arrivalTime: parseInt(document.getElementById(`arrival-time-${i}`).value),
                burstTime: parseInt(document.getElementById(`burst-time-${i}`).value),
                priority: parseInt(document.getElementById(`priority-${i}`).value),
            });
        }
        calculateFunction(processes, resultContainer, isPreemptive);
    });
}

// Function to calculate Priority Scheduling
function calculatePriority(processes, resultContainer, isPreemptive) {
    // Sort processes by arrival time
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    let currentTime = 0;
    let waitingTime = 0;
    let turnaroundTime = 0;
    let resultHTML = `<h3>Priority Scheduling Results (${isPreemptive ? 'Preemptive' : 'Non-Preemptive'})</h3><table border="1"><tr><th>Process</th><th>Arrival Time</th><th>Burst Time</th><th>Priority</th><th>Waiting Time</th><th>Turnaround Time</th></tr>`;

    // Create a copy of the processes array to avoid modifying the original
    let remainingProcesses = processes.map(p => ({ ...p, remainingTime: p.burstTime }));

    while (remainingProcesses.length > 0) {
        // Find the process with the highest priority (lowest priority number) that has arrived
        let nextProcess = remainingProcesses
            .filter(p => p.arrivalTime <= currentTime)
            .sort((a, b) => a.priority - b.priority)[0];

        if (!nextProcess) {
            // If no process is available, increment time
            currentTime++;
            continue;
        }

        // For Non-Preemptive: Execute the entire burst time
        if (!isPreemptive) {
            const waiting = currentTime - nextProcess.arrivalTime;
            const turnaround = waiting + nextProcess.burstTime;
            waitingTime += waiting;
            turnaroundTime += turnaround;
            currentTime += nextProcess.burstTime;

            resultHTML += `<tr><td>P${nextProcess.id}</td><td>${nextProcess.arrivalTime}</td><td>${nextProcess.burstTime}</td><td>${nextProcess.priority}</td><td>${waiting}</td><td>${turnaround}</td></tr>`;

            // Remove the completed process
            remainingProcesses = remainingProcesses.filter(p => p.id !== nextProcess.id);
        }
        // For Preemptive: Execute one unit of time
        else {
            nextProcess.remainingTime--;
            currentTime++;

            if (nextProcess.remainingTime === 0) {
                const waiting = currentTime - nextProcess.arrivalTime - nextProcess.burstTime;
                const turnaround = waiting + nextProcess.burstTime;
                waitingTime += waiting;
                turnaroundTime += turnaround;

                resultHTML += `<tr><td>P${nextProcess.id}</td><td>${nextProcess.arrivalTime}</td><td>${nextProcess.burstTime}</td><td>${nextProcess.priority}</td><td>${waiting}</td><td>${turnaround}</td></tr>`;

                // Remove the completed process
                remainingProcesses = remainingProcesses.filter(p => p.id !== nextProcess.id);
            }
        }
    }

    resultHTML += `</table>`;
    resultHTML += `<p>Average Waiting Time: ${(waitingTime / processes.length).toFixed(2)}</p>`;
    resultHTML += `<p>Average Turnaround Time: ${(turnaroundTime / processes.length).toFixed(2)}</p>`;
    resultContainer.innerHTML = resultHTML;
}
// Function to Load SJF Form
function loadSJFForm(formContainer, resultContainer, isPreemptive) {
    formContainer.innerHTML = `
        <h3>SJF Scheduling (${isPreemptive ? 'Preemptive' : 'Non-Preemptive'})</h3>
        <form id="sjf-form">
            <label for="processes">Enter number of processes:</label>
            <input type="number" id="processes" min="1" required>
            <button type="submit">Calculate</button>
        </form>
    `;

    document.getElementById('sjf-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const numProcesses = parseInt(document.getElementById('processes').value);
        loadProcessDetailsForm(numProcesses, resultContainer, (processes, resultContainer) => {
            calculateSJF(processes, resultContainer, isPreemptive);
        });
    });
}
//Function to Calculate SJF
function calculateSJF(processes, resultContainer, isPreemptive) {
    // Sort processes by arrival time
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    let currentTime = 0;
    let waitingTime = 0;
    let turnaroundTime = 0;
    let resultHTML = `<h3>SJF Results (${isPreemptive ? 'Preemptive' : 'Non-Preemptive'})</h3><table border="1"><tr><th>Process</th><th>Arrival Time</th><th>Burst Time</th><th>Waiting Time</th><th>Turnaround Time</th></tr>`;

    // Create a copy of the processes array to avoid modifying the original
    let remainingProcesses = processes.map(p => ({ ...p, remainingTime: p.burstTime }));

    while (remainingProcesses.length > 0) {
        // Find the process with the shortest remaining time that has arrived
        let nextProcess = remainingProcesses
            .filter(p => p.arrivalTime <= currentTime)
            .sort((a, b) => a.remainingTime - b.remainingTime)[0];

        if (!nextProcess) {
            // If no process is available, increment time
            currentTime++;
            continue;
        }

        // For Non-Preemptive: Execute the entire burst time
        if (!isPreemptive) {
            const waiting = currentTime - nextProcess.arrivalTime;
            const turnaround = waiting + nextProcess.burstTime;
            waitingTime += waiting;
            turnaroundTime += turnaround;
            currentTime += nextProcess.burstTime;

            resultHTML += `<tr><td>P${nextProcess.id}</td><td>${nextProcess.arrivalTime}</td><td>${nextProcess.burstTime}</td><td>${waiting}</td><td>${turnaround}</td></tr>`;

            // Remove the completed process
            remainingProcesses = remainingProcesses.filter(p => p.id !== nextProcess.id);
        }
        // For Preemptive: Execute one unit of time
        else {
            nextProcess.remainingTime--;
            currentTime++;

            if (nextProcess.remainingTime === 0) {
                const waiting = currentTime - nextProcess.arrivalTime - nextProcess.burstTime;
                const turnaround = waiting + nextProcess.burstTime;
                waitingTime += waiting;
                turnaroundTime += turnaround;

                resultHTML += `<tr><td>P${nextProcess.id}</td><td>${nextProcess.arrivalTime}</td><td>${nextProcess.burstTime}</td><td>${waiting}</td><td>${turnaround}</td></tr>`;

                // Remove the completed process
                remainingProcesses = remainingProcesses.filter(p => p.id !== nextProcess.id);
            }
        }
    }

    resultHTML += `</table>`;
    resultHTML += `<p>Average Waiting Time: ${(waitingTime / processes.length).toFixed(2)}</p>`;
    resultHTML += `<p>Average Turnaround Time: ${(turnaroundTime / processes.length).toFixed(2)}</p>`;
    resultContainer.innerHTML = resultHTML;
}
//Function to Load Round Robin Form
function loadRoundRobinForm(formContainer, resultContainer) {
    formContainer.innerHTML = `
        <h3>Round Robin Scheduling</h3>
        <form id="round-robin-form">
            <label for="processes">Enter number of processes:</label>
            <input type="number" id="processes" min="1" required>
            <label for="time-quantum">Time Quantum:</label>
            <input type="number" id="time-quantum" min="1" required>
            <button type="submit">Calculate</button>
        </form>
    `;

    document.getElementById('round-robin-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const numProcesses = parseInt(document.getElementById('processes').value);
        const timeQuantum = parseInt(document.getElementById('time-quantum').value);
        loadProcessDetailsForm(numProcesses, resultContainer, (processes, resultContainer) => {
            calculateRoundRobin(processes, resultContainer, timeQuantum);
        });
    });
}
//Function to Calculate Round Robin
function calculateRoundRobin(processes, resultContainer, timeQuantum) {
    // Sort processes by arrival time
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    let currentTime = 0;
    let waitingTime = 0;
    let turnaroundTime = 0;
    let resultHTML = `<h3>Round Robin Results</h3><table border="1"><tr><th>Process</th><th>Arrival Time</th><th>Burst Time</th><th>Waiting Time</th><th>Turnaround Time</th></tr>`;

    // Create a copy of the processes array to avoid modifying the original
    let remainingProcesses = processes.map(p => ({ ...p, remainingTime: p.burstTime }));

    while (remainingProcesses.length > 0) {
        for (let i = 0; i < remainingProcesses.length; i++) {
            const process = remainingProcesses[i];
            if (process.arrivalTime > currentTime) continue;

            const executionTime = Math.min(process.remainingTime, timeQuantum);
            process.remainingTime -= executionTime;
            currentTime += executionTime;

            if (process.remainingTime === 0) {
                const waiting = currentTime - process.arrivalTime - process.burstTime;
                const turnaround = waiting + process.burstTime;
                waitingTime += waiting;
                turnaroundTime += turnaround;

                resultHTML += `<tr><td>P${process.id}</td><td>${process.arrivalTime}</td><td>${process.burstTime}</td><td>${waiting}</td><td>${turnaround}</td></tr>`;

                // Remove the completed process
                remainingProcesses.splice(i, 1);
                i--; // Adjust index after removal
            }
        }
    }

    resultHTML += `</table>`;
    resultHTML += `<p>Average Waiting Time: ${(waitingTime / processes.length).toFixed(2)}</p>`;
    resultHTML += `<p>Average Turnaround Time: ${(turnaroundTime / processes.length).toFixed(2)}</p>`;
    resultContainer.innerHTML = resultHTML;
}







//Function to Load Banker's Algorithm Form
function loadBankersForm(formContainer, resultContainer) {
    formContainer.innerHTML = `
        <h3>Banker's Algorithm</h3>
        <form id="bankers-form">
            <label for="num-processes">Number of Processes:</label>
            <input type="number" id="num-processes" min="1" required>
            <label for="num-resources">Number of Resources:</label>
            <input type="number" id="num-resources" min="1" required>
            <button type="submit">Next</button>
        </form>
    `;

    document.getElementById('bankers-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const numProcesses = parseInt(document.getElementById('num-processes').value);
        const numResources = parseInt(document.getElementById('num-resources').value);
        loadBankersDetailsForm(numProcesses, numResources, resultContainer);
    });
}
//Function to Load Banker's Algorithm Details Form
function loadBankersDetailsForm(numProcesses, numResources, resultContainer) {
    let formHTML = `<h3>Enter Banker's Algorithm Details</h3><form id="bankers-details-form">`;

    // Input for Available Resources
    formHTML += `<h4>Available Resources</h4>`;
    for (let i = 0; i < numResources; i++) {
        formHTML += `
            <label for="available-${i}">Resource ${i + 1}:</label>
            <input type="number" id="available-${i}" min="0" required>
        `;
    }

    // Input for Maximum Demand Matrix
    formHTML += `<h4>Maximum Demand Matrix</h4>`;
    for (let i = 0; i < numProcesses; i++) {
        formHTML += `<h5>Process ${i + 1}</h5>`;
        for (let j = 0; j < numResources; j++) {
            formHTML += `
                <label for="max-demand-${i}-${j}">Resource ${j + 1}:</label>
                <input type="number" id="max-demand-${i}-${j}" min="0" required>
            `;
        }
    }

    // Input for Allocated Resources Matrix
    formHTML += `<h4>Allocated Resources Matrix</h4>`;
    for (let i = 0; i < numProcesses; i++) {
        formHTML += `<h5>Process ${i + 1}</h5>`;
        for (let j = 0; j < numResources; j++) {
            formHTML += `
                <label for="allocated-${i}-${j}">Resource ${j + 1}:</label>
                <input type="number" id="allocated-${i}-${j}" min="0" required>
            `;
        }
    }

    formHTML += `<button type="submit">Calculate</button></form>`;
    resultContainer.innerHTML = formHTML;

    document.getElementById('bankers-details-form').addEventListener('submit', function (e) {
        e.preventDefault();

        // Collect Available Resources
        const available = [];
        for (let i = 0; i < numResources; i++) {
            available.push(parseInt(document.getElementById(`available-${i}`).value));
        }

        // Collect Maximum Demand Matrix
        const maxDemand = [];
        for (let i = 0; i < numProcesses; i++) {
            const processDemand = [];
            for (let j = 0; j < numResources; j++) {
                processDemand.push(parseInt(document.getElementById(`max-demand-${i}-${j}`).value));
            }
            maxDemand.push(processDemand);
        }

        // Collect Allocated Resources Matrix
        const allocated = [];
        for (let i = 0; i < numProcesses; i++) {
            const processAllocated = [];
            for (let j = 0; j < numResources; j++) {
                processAllocated.push(parseInt(document.getElementById(`allocated-${i}-${j}`).value));
            }
            allocated.push(processAllocated);
        }

        // Calculate and Display Results
        const result = bankersAlgorithm(available, maxDemand, allocated, numProcesses, numResources);
        displayBankersResult(resultContainer, result);
    });
}
//Function to Implement Banker's Algorithm
function bankersAlgorithm(available, maxDemand, allocated, numProcesses, numResources) {
    // Calculate Need Matrix
    const need = [];
    for (let i = 0; i < numProcesses; i++) {
        const processNeed = [];
        for (let j = 0; j < numResources; j++) {
            processNeed.push(maxDemand[i][j] - allocated[i][j]);
        }
        need.push(processNeed);
    }

    // Initialize Work and Finish arrays
    const work = [...available];
    const finish = new Array(numProcesses).fill(false);
    const safeSequence = [];

    // Find a safe sequence
    while (true) {
        let found = false;
        for (let i = 0; i < numProcesses; i++) {
            if (!finish[i] && need[i].every((val, j) => val <= work[j])) {
                // Process can be executed
                for (let j = 0; j < numResources; j++) {
                    work[j] += allocated[i][j];
                }
                safeSequence.push(i);
                finish[i] = true;
                found = true;
            }
        }

        if (!found) break; // No more processes can be executed
    }

    // Check if all processes are finished
    const isSafe = finish.every(val => val);

    return {
        isSafe,
        safeSequence: isSafe ? safeSequence : null,
        need,
    };
}
//Function to Display Banker's Algorithm Results
function displayBankersResult(resultContainer, result) {
    let resultHTML = `<h3>Banker's Algorithm Results</h3>`;

    if (result.isSafe) {
        resultHTML += `<p>The system is in a <strong>safe state</strong>.</p>`;
        resultHTML += `<p>Safe Sequence: ${result.safeSequence.map(p => `P${p + 1}`).join(' -> ')}</p>`;
    } else {
        resultHTML += `<p>The system is in an <strong>unsafe state</strong> (deadlock possible).</p>`;
    }

    // Display Need Matrix
    resultHTML += `<h4>Need Matrix</h4><table border="1"><tr><th>Process</th>`;
    for (let j = 0; j < result.need[0].length; j++) {
        resultHTML += `<th>Resource ${j + 1}</th>`;
    }
    resultHTML += `</tr>`;
    for (let i = 0; i < result.need.length; i++) {
        resultHTML += `<tr><td>P${i + 1}</td>`;
        for (let j = 0; j < result.need[i].length; j++) {
            resultHTML += `<td>${result.need[i][j]}</td>`;
        }
        resultHTML += `</tr>`;
    }
    resultHTML += `</table>`;

    resultContainer.innerHTML = resultHTML;
}







// Function to load the Disk Scheduling form
function loadDiskSchedulingForm(formContainer, resultContainer, algorithm) {
    formContainer.innerHTML = `
        <h3>${algorithm.toUpperCase()} Disk Scheduling</h3>
        <form id="disk-scheduling-form">
            <label for="requests">Enter the number of disk requests:</label>
            <input type="number" id="requests" min="1" required>
            <label for="initial-position">Initial Head Position:</label>
            <input type="number" id="initial-position" min="0" required>
            <label for="disk-size">Disk Size (Max Cylinder):</label>
            <input type="number" id="disk-size" min="1" required>
            <button type="submit">Calculate</button>
        </form>
    `;

    document.getElementById('disk-scheduling-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const numRequests = parseInt(document.getElementById('requests').value);
        const initialPosition = parseInt(document.getElementById('initial-position').value);
        const diskSize = parseInt(document.getElementById('disk-size').value);
        loadDiskRequestsForm(numRequests, initialPosition, diskSize, resultContainer, algorithm);
    });
}

// Function to load the disk requests form
function loadDiskRequestsForm(numRequests, initialPosition, diskSize, resultContainer, algorithm) {
    let formHTML = `<h3>Enter Disk Requests</h3><form id="disk-requests-form">`;
    for (let i = 1; i <= numRequests; i++) {
        formHTML += `
            <label for="request-${i}">Request ${i}:</label>
            <input type="number" id="request-${i}" min="0" max="${diskSize}" required>
        `;
    }
    formHTML += `<button type="submit">Calculate</button></form>`;
    resultContainer.innerHTML = formHTML;

    document.getElementById('disk-requests-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const requests = [];
        for (let i = 1; i <= numRequests; i++) {
            requests.push(parseInt(document.getElementById(`request-${i}`).value));
        }
        calculateDiskScheduling(requests, initialPosition, diskSize, resultContainer, algorithm);
    });
}

// Function to calculate Disk Scheduling
function calculateDiskScheduling(requests, initialPosition, diskSize, resultContainer, algorithm) {
    let resultHTML = `<h3>${algorithm.toUpperCase()} Disk Scheduling Results</h3>`;
    let totalSeekTime = 0;
    let sequence = [];

    switch (algorithm) {
        case 'fcfs-disk':
            sequence = fcfsDiskScheduling(requests, initialPosition);
            totalSeekTime = calculateSeekTime(sequence, initialPosition);
            break;
        case 'sstf':
            sequence = sstfDiskScheduling(requests, initialPosition);
            totalSeekTime = calculateSeekTime(sequence, initialPosition);
            break;
        case 'scan':
            sequence = scanDiskScheduling(requests, initialPosition, diskSize);
            totalSeekTime = calculateSeekTime(sequence, initialPosition);
            break;
        case 'cscan':
            sequence = cscanDiskScheduling(requests, initialPosition, diskSize);
            totalSeekTime = calculateSeekTime(sequence, initialPosition);
            break;
        case 'look':
            sequence = lookDiskScheduling(requests, initialPosition);
            totalSeekTime = calculateSeekTime(sequence, initialPosition);
            break;
        case 'clook':
            sequence = clookDiskScheduling(requests, initialPosition);
            totalSeekTime = calculateSeekTime(sequence, initialPosition);
            break;
        default:
            resultHTML += `<p>Invalid algorithm selected.</p>`;
            resultContainer.innerHTML = resultHTML;
            return;
    }

    resultHTML += `<p>Sequence: ${sequence.join(' -> ')}</p>`;
    resultHTML += `<p>Total Seek Time: ${totalSeekTime}</p>`;
    resultContainer.innerHTML = resultHTML;
}

// FCFS Disk Scheduling Algorithm
function fcfsDiskScheduling(requests, initialPosition) {
    return [initialPosition, ...requests];
}

// SSTF Disk Scheduling Algorithm
function sstfDiskScheduling(requests, initialPosition) {
    let sequence = [initialPosition];
    let remainingRequests = [...requests];

    while (remainingRequests.length > 0) {
        let closestRequest = remainingRequests.reduce((prev, curr) =>
            Math.abs(curr - sequence[sequence.length - 1]) < Math.abs(prev - sequence[sequence.length - 1]) ? curr : prev
        );
        sequence.push(closestRequest);
        remainingRequests = remainingRequests.filter(req => req !== closestRequest);
    }

    return sequence;
}

// SCAN Disk Scheduling Algorithm
function scanDiskScheduling(requests, initialPosition, diskSize) {
    let sequence = [initialPosition];
    let remainingRequests = [...requests];

    // Sort requests
    remainingRequests.sort((a, b) => a - b);

    // Move towards the end
    for (let i = initialPosition; i <= diskSize; i++) {
        if (remainingRequests.includes(i)) {
            sequence.push(i);
            remainingRequests = remainingRequests.filter(req => req !== i);
        }
    }
    sequence.push(diskSize); // Reach the end

    // Move towards the start
    for (let i = diskSize - 1; i >= 0; i--) {
        if (remainingRequests.includes(i)) {
            sequence.push(i);
            remainingRequests = remainingRequests.filter(req => req !== i);
        }
    }

    return sequence;
}

// CSCAN Disk Scheduling Algorithm
function cscanDiskScheduling(requests, initialPosition, diskSize) {
    let sequence = [initialPosition];
    let remainingRequests = [...requests];

    // Sort requests
    remainingRequests.sort((a, b) => a - b);

    // Move towards the end
    for (let i = initialPosition; i <= diskSize; i++) {
        if (remainingRequests.includes(i)) {
            sequence.push(i);
            remainingRequests = remainingRequests.filter(req => req !== i);
        }
    }
    sequence.push(diskSize); // Reach the end
    sequence.push(0); // Jump to the start

    // Move towards the end again
    for (let i = 0; i <= diskSize; i++) {
        if (remainingRequests.includes(i)) {
            sequence.push(i);
            remainingRequests = remainingRequests.filter(req => req !== i);
        }
    }

    return sequence;
}

// LOOK Disk Scheduling Algorithm
function lookDiskScheduling(requests, initialPosition) {
    let sequence = [initialPosition];
    let remainingRequests = [...requests];

    // Sort requests
    remainingRequests.sort((a, b) => a - b);

    // Move towards the highest request
    for (let i = initialPosition; i <= Math.max(...remainingRequests); i++) {
        if (remainingRequests.includes(i)) {
            sequence.push(i);
            remainingRequests = remainingRequests.filter(req => req !== i);
        }
    }

    // Move towards the lowest request
    for (let i = Math.max(...remainingRequests); i >= Math.min(...remainingRequests); i--) {
        if (remainingRequests.includes(i)) {
            sequence.push(i);
            remainingRequests = remainingRequests.filter(req => req !== i);
        }
    }

    return sequence;
}

// C-LOOK Disk Scheduling Algorithm
function clookDiskScheduling(requests, initialPosition) {
    let sequence = [initialPosition];
    let remainingRequests = [...requests];

    // Sort requests
    remainingRequests.sort((a, b) => a - b);

    // Move towards the highest request
    for (let i = initialPosition; i <= Math.max(...remainingRequests); i++) {
        if (remainingRequests.includes(i)) {
            sequence.push(i);
            remainingRequests = remainingRequests.filter(req => req !== i);
        }
    }

    // Jump to the lowest request
    sequence.push(Math.min(...remainingRequests));

    // Move towards the highest request again
    for (let i = Math.min(...remainingRequests); i <= Math.max(...remainingRequests); i++) {
        if (remainingRequests.includes(i)) {
            sequence.push(i);
            remainingRequests = remainingRequests.filter(req => req !== i);
        }
    }

    return sequence;
}

// Function to calculate seek time
function calculateSeekTime(sequence, initialPosition) {
    let seekTime = 0;
    for (let i = 1; i < sequence.length; i++) {
        seekTime += Math.abs(sequence[i] - sequence[i - 1]);
    }
    return seekTime;
}







// page replacement algorithm
// Function to load the Page Replacement form
function loadPageReplacementForm(formContainer, resultContainer, algorithm) {
    formContainer.innerHTML = `
        <h3>${algorithm.toUpperCase()} Page Replacement Algorithm</h3>
        <form id="page-replacement-form">
            <label for="num-frames">Number of Frames:</label>
            <input type="number" id="num-frames" min="1" required>
            <label for="reference-string">Reference String (comma-separated):</label>
            <input type="text" id="reference-string" required>
            <button type="submit">Calculate</button>
        </form>
    `;

    document.getElementById('page-replacement-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const numFrames = parseInt(document.getElementById('num-frames').value);
        const referenceString = document.getElementById('reference-string').value
            .split(',')
            .map(num => parseInt(num.trim()));
        calculatePageReplacement(algorithm, numFrames, referenceString, resultContainer);
    });
}

// Function to calculate Page Replacement
function calculatePageReplacement(algorithm, numFrames, referenceString, resultContainer) {
    let resultHTML = `<h3>${algorithm.toUpperCase()} Page Replacement Results</h3>`;
    let pageFaults = 0;
    let frames = [];
    let details = [];

    switch (algorithm) {
        case 'fifo':
            pageFaults = fifoPageReplacement(numFrames, referenceString, details);
            break;
        case 'lru':
            pageFaults = lruPageReplacement(numFrames, referenceString, details);
            break;
        case 'optimam':
            pageFaults = optimalPageReplacement(numFrames, referenceString, details);
            break;
        default:
            resultHTML += `<p>Invalid algorithm selected.</p>`;
            resultContainer.innerHTML = resultHTML;
            return;
    }

    // Display the results
    resultHTML += `<p>Total Page Faults: ${pageFaults}</p>`;
    resultHTML += `<h4>Step-by-Step Details:</h4><table border="1"><tr><th>Step</th><th>Reference</th><th>Frames</th><th>Page Fault</th></tr>`;
    details.forEach((step, index) => {
        resultHTML += `<tr><td>${index + 1}</td><td>${step.reference}</td><td>${step.frames.join(', ')}</td><td>${step.pageFault ? 'Yes' : 'No'}</td></tr>`;
    });
    resultHTML += `</table>`;

    resultContainer.innerHTML = resultHTML;
}

// FIFO Page Replacement Algorithm
function fifoPageReplacement(numFrames, referenceString, details) {
    let frames = [];
    let pageFaults = 0;
    let queue = []; // To keep track of the order of pages in frames

    referenceString.forEach((page, index) => {
        if (!frames.includes(page)) {
            if (frames.length < numFrames) {
                frames.push(page);
                queue.push(page);
            } else {
                const replacedPage = queue.shift(); // Remove the oldest page
                const replacedIndex = frames.indexOf(replacedPage);
                frames[replacedIndex] = page; // Replace the oldest page
                queue.push(page); // Add the new page to the queue
            }
            pageFaults++;
            details.push({ reference: page, frames: [...frames], pageFault: true });
        } else {
            details.push({ reference: page, frames: [...frames], pageFault: false });
        }
    });

    return pageFaults;
}

// LRU Page Replacement Algorithm
function lruPageReplacement(numFrames, referenceString, details) {
    let frames = [];
    let pageFaults = 0;
    let lastUsed = new Map(); // To track the last used time of each page

    referenceString.forEach((page, index) => {
        if (!frames.includes(page)) {
            if (frames.length < numFrames) {
                frames.push(page);
            } else {
                // Find the least recently used page
                let lruPage = frames[0];
                let lruTime = lastUsed.get(lruPage) || 0;
                frames.forEach(frame => {
                    if ((lastUsed.get(frame) || 0) < lruTime) {
                        lruPage = frame;
                        lruTime = lastUsed.get(frame);
                    }
                });
                const replacedIndex = frames.indexOf(lruPage);
                frames[replacedIndex] = page; // Replace the least recently used page
            }
            pageFaults++;
            details.push({ reference: page, frames: [...frames], pageFault: true });
        } else {
            details.push({ reference: page, frames: [...frames], pageFault: false });
        }
        lastUsed.set(page, index); // Update the last used time of the page
    });

    return pageFaults;
}

// Optimal Page Replacement Algorithm
function optimalPageReplacement(numFrames, referenceString, details) {
    let frames = [];
    let pageFaults = 0;

    referenceString.forEach((page, index) => {
        if (!frames.includes(page)) {
            if (frames.length < numFrames) {
                frames.push(page);
            } else {
                // Find the page that will not be used for the longest time
                let farthest = -1;
                let replaceIndex = 0;
                frames.forEach((frame, frameIndex) => {
                    let nextUse = referenceString.slice(index + 1).indexOf(frame);
                    if (nextUse === -1) {
                        replaceIndex = frameIndex;
                        return;
                    }
                    if (nextUse > farthest) {
                        farthest = nextUse;
                        replaceIndex = frameIndex;
                    }
                });
                frames[replaceIndex] = page; // Replace the optimal page
            }
            pageFaults++;
            details.push({ reference: page, frames: [...frames], pageFault: true });
        } else {
            details.push({ reference: page, frames: [...frames], pageFault: false });
        }
    });

    return pageFaults;
}


