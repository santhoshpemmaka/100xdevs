/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.
*/

function isPalindrome(str) {
    let start = 0;
    let end = str.length - 1;
    while (start <= end) {
        if (str[start] == " ") {
            start++;
            break;
        }
        if (str[end] == " ") {
            end--;
            break;
        }
        if (str[start].toLowerCase() != str[end].toLowerCase()) {
            return false;
        }
        start++;
        end--;
    }
  return true;
}

module.exports = isPalindrome;
