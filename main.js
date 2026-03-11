const fs = require("fs");

function helpertosecs(timeStr) {
    let [h, m, s] = timeStr.split(":").map(Number);
    return h*3600+m*60+s;
}

// Convert total seconds back to "h:mm:ss"
function helpertotime(totalSeconds) {
    const h = Math.floor(totalSeconds/3600);
    const m = Math.floor((totalSeconds%3600)/60);
    const s = totalSeconds%60;
    return `${h}:${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
}

// ============================================================
// Function 1: getShiftDuration(startTime, endTime)
// startTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// endTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// Returns: string formatted as h:mm:ss
// ============================================================
function getShiftDuration(startTime, endTime) {

    let start = new Date(`2026-03-06 ${startTime}`);
    let end = new Date(`2026-03-06 ${endTime}`);
    if (end < start){
         end.setDate(end.getDate()+1);}
const durationSec = Math.floor((end-start)/1000);
    return helpertotime(durationSec);
}

// ============================================================
// Function 2: getIdleTime(startTime, endTime)
// startTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// endTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// Returns: string formatted as h:mm:ss
// ============================================================
function getIdleTime(startTime, endTime) {

    const deliveryStart = new Date(`2026-03-06 8:00:00 AM`);
    const deliveryEnd = new Date(`2026-03-06 10:00:00 PM`);
    let start = new Date(`2026-03-06 ${startTime}`);
    let end = new Date(`2026-03-06 ${endTime}`);
    if (end < start) 
        end.setDate(end.getDate() + 1);

    let idleSec = 0;
    if (start < deliveryStart){
         idleSec += (deliveryStart - start)/1000;
    }
    if (end > deliveryEnd) {
        idleSec += (end - deliveryEnd)/1000;
    }
    return helpertotime(Math.floor(idleSec));
}



// ============================================================
// Function 3: getActiveTime(shiftDuration, idleTime)
// shiftDuration: (typeof string) formatted as h:mm:ss
// idleTime: (typeof string) formatted as h:mm:ss
// Returns: string formatted as h:mm:ss
// ============================================================
function getActiveTime(shiftDuration, idleTime) {
    const activeSecs = helpertosecs(shiftDuration)-helpertosecs(idleTime);
    return helpertotime(activeSecs);
}

// ============================================================
// Function 4: metQuota(date, activeTime)
// date: (typeof string) formatted as yyyy-mm-dd
// activeTime: (typeof string) formatted as h:mm:ss
// Returns: boolean
// ============================================================
function metQuota(date, activeTime) {
    let metquota;
    if (date >= "2025-04-10" && date <= "2025-04-30") {
        metquota = "6:00:00"; 
    } else {
        metquota = "8:24:00"; 
    }
return helpertosecs(activeTime)>=helpertosecs(metquota);
}

// ============================================================
// Function 5: addShiftRecord(textFile, shiftObj)
// textFile: (typeof string) path to shifts text file
// shiftObj: (typeof object) has driverID, driverName, date, startTime, endTime
// Returns: object with 10 properties or empty object {}
// ============================================================
function addShiftRecord(textFile, shiftObj) {
    // TODO: Implement this function
}

// ============================================================
// Function 6: setBonus(textFile, driverID, date, newValue)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// date: (typeof string) formatted as yyyy-mm-dd
// newValue: (typeof boolean)
// Returns: nothing (void)
// ============================================================
function setBonus(textFile, driverID, date, newValue) {
    // TODO: Implement this function
}

// ============================================================
// Function 7: countBonusPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof string) formatted as mm or m
// Returns: number (-1 if driverID not found)
// ============================================================
function countBonusPerMonth(textFile, driverID, month) {
    // TODO: Implement this function
}

// ============================================================
// Function 8: getTotalActiveHoursPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof number)
// Returns: string formatted as hhh:mm:ss
// ============================================================
function getTotalActiveHoursPerMonth(textFile, driverID, month) {
    // TODO: Implement this function
}

// ============================================================
// Function 9: getRequiredHoursPerMonth(textFile, rateFile, bonusCount, driverID, month)
// textFile: (typeof string) path to shifts text file
// rateFile: (typeof string) path to driver rates text file
// bonusCount: (typeof number) total bonuses for given driver per month
// driverID: (typeof string)
// month: (typeof number)
// Returns: string formatted as hhh:mm:ss
// ============================================================
function getRequiredHoursPerMonth(textFile, rateFile, bonusCount, driverID, month) {
    // TODO: Implement this function
}

// ============================================================
// Function 10: getNetPay(driverID, actualHours, requiredHours, rateFile)
// driverID: (typeof string)
// actualHours: (typeof string) formatted as hhh:mm:ss
// requiredHours: (typeof string) formatted as hhh:mm:ss
// rateFile: (typeof string) path to driver rates text file
// Returns: integer (net pay)
// ============================================================
function getNetPay(driverID, actualHours, requiredHours, rateFile) {
    // TODO: Implement this function
}
//test cases for first function get shift duration
console.log("first method test");
console.log(getShiftDuration("9:00:00 am", "5:00:01 pm"));  
console.log(getShiftDuration("7:30:00 am", "8:42:50 am"));  
//test cases for second function get idle time
console.log("second method test");
console.log(getIdleTime("8:00:00 am", "11:00:00 pm"));  
console.log(getIdleTime("6:00:01 am", "11:30:00 pm"));
// test cases for third function get active time
console.log("third method test");
console.log(getActiveTime("6:00:20", "3:00:01"));  
console.log(getActiveTime("8:30:00", "0:00:00"));  
console.log("fourth method test");

//test cases for fourth function get met quota
console.log(metQuota("2025-04-15", "6:50:00"));  
console.log(metQuota("2025-04-05", "7:42:59")); 
module.exports = {
    getShiftDuration,
    getIdleTime,
    getActiveTime,
    metQuota,
    addShiftRecord,
    setBonus,
    countBonusPerMonth,
    getTotalActiveHoursPerMonth,
    getRequiredHoursPerMonth,
    getNetPay
};
