///// GLOBAL VARIABLES /////
const apiRoot = "https://run.mocky.io/v3/"

//Grabbed from https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function NumberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function PercentageDifferenceBetweenTwoNumbers(firstNumber,secondNumber,digits) {
    try{
        let x = firstNumber - secondNumber;
        x = (x / secondNumber * 100).toFixed(digits);
        return parseFloat(x);
    }catch(error){
        console.log(error);
        
    }
    
}