
const socket = io()

socket.on('tx', (count) => {
    console.log('The count has been updated from socket', count)
    var i;
    for (i = 0; i < count.locations.length; i++) {
        var table = document.getElementById("myTable");
        var row = table.insertRow(1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);
        var cell7 = row.insertCell(6);
        console.log(count.locations[i].Lon)
        cell1.innerHTML = "Day "+count.locations[i].Day+" time "+count.locations[i].Hours;
        cell2.innerHTML = count.locations[i].SensorID;
        cell3.innerHTML = count.locations[i].Day;
        cell4.innerHTML = count.locations[i].Hours;
        cell5.innerHTML = count.locations[i].Lon;
        cell6.innerHTML = count.locations[i].Lat;
        cell7.innerHTML = count.locations[i].FuelLevel;
    }


})
// var table = document.getElementById("myTable");
// document.querySelector('#increment').addEventListener('click', () => {
//     console.log('Clicked')
//     socket.emit('increment')
// })