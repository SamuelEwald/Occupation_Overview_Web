///// GLOBAL VARIABLES /////
const apiRoot = "https://run.mocky.io/v3/"

//Grabbed from https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function NumberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function DifferenceBetweenTwoNumbers(firstNumber,secondNumber) {
    let x = firstNumber - secondNumber;
    x = (x / secondNumber * 100).toFixed(2);
    return x + "%";
}