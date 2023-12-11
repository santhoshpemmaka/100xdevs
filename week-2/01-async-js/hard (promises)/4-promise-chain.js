/*
 * Write 3 different functions that return promises that resolve after t1, t2, and t3 seconds respectively.
 * Write a function that sequentially calls all 3 of these functions in order.
 * Return a promise chain which return the time in milliseconds it takes to complete the entire operation.
 * Compare it with the results from 3-promise-all.js
 */

function wait1(t) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res();
        }, t);
    })
}

function wait2(t) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res();
        }, t);
    })
}

function wait3(t) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res();
        }, t);
    })
}

async function calculateTime(t1, t2, t3) {
    let start = new Date().getTime();
    let p1 = wait1(t1);
    let p2 = wait2(t2);
    let p3 = wait3(t3);
    let promiseArray = [p1, p2, p3];
    await Promise.all(promiseArray);
    let end = new Date().getTime();
    return (end - start) * 1000;
}

module.exports = calculateTime;
