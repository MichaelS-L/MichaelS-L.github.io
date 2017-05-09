onmessage = function(msg) {
    console.log('aM:Message received from main script: 0:' +
        msg.data[0] + "; 1:" + msg.data[1] + "; 2:" + msg.data[2]);
  
    if (msg.data[2] == 1)
    {
        // Return table values
        postMessage([2,tableValW])
    }
    else if (msg.data[0] == 1)
    {
        // Pause Simulation
        var omI = 0
        simRunning = false;
        postMessage([0, "Success"]);
    }
    else if (msg.data[1] == 1)
    {
        // Run Simulation
        if (!simRunning)
        {
            postMessage([1, "Success"]);
        }
        runSimulation();      
    }
    else if (msg.data[1] == 2)
    {
        // Receive Row/Col
        console.log("Received Row:" + msg.data[3] + "; Col:" + msg.data[4]);
        if (ctRows == 0)
        {
            ctRows = msg.data[3];
            ctCols = msg.data[4];

            tableValW = new Array(ctRows);
            for (ii=0; ii<ctRows; ii++)
            {
                tableValW[ii] = new Array(ctCols);
                for (jj=0; jj<ctCols; jj++)
                {
                    tableValW[ii][jj] = 0;
                }
            }
            tableValW[0][0] = 1;
        }
    }
    else
    {
        console.log("Should not have made it to here")
    }
}

function runSimulation(){
    simRunning = true;

    for (ii=0; ii<10000; ii++)
    {
        ran = Math.floor(Math.random() * 8)
        switch(ran)
        {
            case 0:
                if (row == 0)
                {
                    continue;
                }
                row -= 1;
                break;
            case 1:
                if (row == 0)
                {
                    continue;
                }
                if (col == 9)
                {
                    continue;
                }
                row -= 1;
                col += 1;
                break;
            case 2:
                if (col == 9)
                {
                    continue;
                }
                col += 1;
                break;
            case 3:
                if (row == 9)
                {
                    continue;
                }
                if (col == 9)
                {
                    continue;
                }
                row += 1;
                col += 1;
                break;
            case 4:
                if (row == 9)
                {
                    continue;
                }
                row += 1;
                break;
            case 5:
                if (row == 9)
                {
                    continue;
                }
                if (col == 0)
                {
                    continue;
                }
                row += 1;
                col -= 1;
                break;
            case 6:
                if (col == 0)
                {
                    continue;
                }
                col -= 1;
                break;
            case 7:
                if (row == 0)
                {
                    continue;
                }
                if (col == 0)
                {
                    continue;
                }
                row -= 1;
                col -= 1;
                break;
            default:
                console.log("Should not have made it here: row="+row+"; col="+col+"; ran="+ran);
        }
        tableValW[row][col] += 1;
    }
    postMessage([3,0])
} // function runSimulation()

var ctRows = 0;
var ctCols = 0;

var row = 0;
var col = 0;
simRunning = false;
