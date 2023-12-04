/*
  Write a function `isAnagram` which takes 2 parameters and returns true/false if those are anagrams or not.
  What's Anagram?
  - A word, phrase, or name formed by rearranging the letters of another, such as spar, formed from rasp.
*/

function isAnagram(str1, str2) {
    let strMap = new Map();
    let str1Map = new Map();
    for (let i = 0; i < str1.length; i++){
        let character = str1[i].toLowerCase();
        if (strMap.has(character)) {
            let count = strMap.get(character);
            strMap.set(character, count + 1);
        }
        else {
            strMap.set(character, 1);
        }
    }
    for (let i = 0; i < str2.length; i++){
        let character = str2[i].toLowerCase();
        if (str1Map.has(character)) {
            let count = str1Map.get(character);
            str1Map.set(character, count + 1);
        }
        else {
            str1Map.set(character, 1);
        }
    }
    if (str1Map.size != strMap.size) {
        return false;
    }
    strMap.forEach((value,key) => {
        if(strMap.get(key) != str1Map.get(key)){
          return false;
        }
    })
    return true;
}

module.exports = isAnagram;
