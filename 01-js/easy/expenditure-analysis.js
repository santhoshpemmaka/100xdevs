/*
  Implement a function `calculateTotalSpentByCategory` which takes a list of transactions as parameter
  and return a list of objects where each object is unique category-wise and has total price spent as its value.
  Transaction - an object like { itemName, category, price, timestamp }.
  Output - [{ category1 - total_amount_spent_on_category1 }, { category2 - total_amount_spent_on_category2 }]
*/

function calculateTotalSpentByCategory(transactions) {
    let resultList = [];
    transactions.forEach(element => {
        let checkIndex = resultList.findIndex(ele => ele.category == element.category);
        if ( checkIndex> -1) {
            resultList[checkIndex]["totalSpent"] += element.price;
        }
        else {
            let resultObject = {};
            resultObject["category"] = element.category;
            resultObject["totalSpent"] = element.price;
            resultList.push(resultObject);
        }
    });
    console.log(resultList);
  return resultList;
}

module.exports = calculateTotalSpentByCategory;
