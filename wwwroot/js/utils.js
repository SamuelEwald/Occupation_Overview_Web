///// GLOBAL VARIABLES /////
const apiRoot = "https://run.mocky.io/v3/";

///// HELPER FUNCTIONS /////
//Grabbed from https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function NumberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Takes two numbers and a digit, returns the percentage difference between the first and second number
// with decimal places determined by the digit param
function PercentageDifferenceBetweenTwoNumbers(
  firstNumber,
  secondNumber,
  digits
) {
  try {
    let x = firstNumber - secondNumber;
    x = ((x / secondNumber) * 100).toFixed(digits);
    return parseFloat(x);
  } catch (error) {
    console.log(error);
  }
}

//Formats a percentage with the appropriate positive or negative sign
function FormatPercentageValueSign(value) {
  return value > 0 ? "+" + value + "%" : "-" + value + "%";
}

//Simply formats an hourly rate of pay
function FormatHourly(item) {
  return "$" + item + "/hr";
}

// Takes in an array of sequential ordered numbers and returns an array of percentages
// that the numbers have changed
function GetArrayPercentChanged(valueArray) {
  var newArray = [];
  for (var i = 0; i < valueArray.length; i++) {
    if (newArray.length == 0) {
      newArray.push(valueArray[0]);
    } else {
      newArray.push(
        PercentageDifferenceBetweenTwoNumbers(
          valueArray[i],
          valueArray[i - 1],
          2
        )
      );
    }
  }
  newArray[0] = 0; //Set the new formatted array's first number to 0, it is our baseline number.
  return newArray;
}
