var simRunning = false;
var simNotPausing = true;
var notGettingTable = true;

function supportsImports() {
  return 'import' in document.createElement('link');
}

if (supportsImports()) {
    alert("Good");
    var link = document.querySelector('link[rel="import"]');
    var content = link.import;

    // Grab DOM from warning.html's document.
    var el = content.querySelector('.Hello');

    t1=getElementByID("fromFile");
    t1.innerHTML = el.cloneNode(true);

} else {
  alert("NO Good");
}

function pause(){
    if (simRunning)
    {
                           //[Pause, Run, Display]
        //myWorker.postMessage([1, 0, 0]); // Sending message as an array to the worker
        //console.log('Pause Message posted to worker');
        simNotPausing = false;
        alert("Pausing Simulation");
    }
}

function runSimulation(){
    if (!simRunning)
    {
        myWorker.postMessage([0, 1, 0]);
        console.log('Starting Simulation Message posted to worker');
        alert("Starting Simulation");
    }
}

function displayGrid(){
    // First get table then update display when data returns
    if (notGettingTable)
    {
        notGettingTable = false;
        myWorker.postMessage([0, 0, 1]);
        console.log('Data Request Message posted to worker');
    }
}

function updateArray(){
    var uAii;
    var uAjj;
    var uAkk;
    var min;
    var max;
    var maxMult;
    minVal = 9007199254740991; // min val
    maxVal = 0; // max val
    for(uAii = 0; uAii < ctRows; uAii++)
    {
        for(uAjj = 0; uAjj < ctCols; uAjj++)
        {
             table.cells[uAii*ctCols+uAjj].innerHTML = tableVal[uAii][uAjj];
             if (tableVal[uAii][uAjj] < minVal)
             {
                 minVal = tableVal[uAii][uAjj];
             }
             if (tableVal[uAii][uAjj] > maxVal)
             {
                 maxVal = tableVal[uAii][uAjj];
             }
             //console.log(uAii,uAjj,uAkk)
       }
    }
    maxMult = 255/(maxVal - minVal);
    for(uAii = 0; uAii < ctRows; uAii++)
    {
        for(uAjj = 0; uAjj < ctCols; uAjj++)
        {
            zz = Math.floor((tableVal[uAii][uAjj] - minVal)*maxMult);
            zz = (255 - zz).toString(16);
            if (zz.length == 1)
            {
                zz = "0" + zz;
            }
            zz = "#FFFF" + zz;
            table.cells[uAii*ctCols+uAjj].innerHTML = zz;
            table.cells[uAii*ctCols+uAjj].style.backgroundColor = zz;
            //table.cells[uAii*ctCols+uAjj].style.backgroundColor = "#FFFFFF";
        }
    }
}

var table = document.getElementById("animal_table");
var ctRows = document.getElementById("animal_table").rows.length;
var ctCols = document.getElementById("animal_table").rows[0].cells.length;
tableVal = new Array(ctRows);
for (ii=0; ii<ctRows; ii++)
{
    tableVal[ii] = new Array(ctCols);
}

try
{
    var wwVal = 1;
    if (window.Worker) // Check if Browser supports the Worker api.
    {
        wwVal += 1;
        var myWorker = new Worker('animalWorker.js');
    }
}
catch(e)
{
    console.log("Problem with window.Worker: ", wwVal);
}

// Send Row/Col info
myWorker.postMessage([0, 2, 0, ctRows, ctCols]);

myWorker.onmessage = function(msg) {
		console.log('Message received from worker');
        switch (msg.data[0])
        {
            case 0: // Pause
                if (msg.data[1] = "Success")
                {
                    alert("Simulation Paused");
                    simRunning = false;
                }
               break;
            case 1: // Run
                if (msg.data[1] = "Success")
                {
                    alert("Simulation Started");
                    simRunning = true;
                }
                break;
            case 2: // Display
                tableVal = msg.data[1];
                updateArray();
                notGettingTable = true;
                break;
            case 3: // Pausing
                if (simNotPausing)
                {
                    // Continue Running
                    myWorker.postMessage([0, 1, 0]);
                    //console.log('Starting Simulation Message posted to worker');
                }
            default:
        }
}; // myWorker.onmessage = function(msg)

    
 