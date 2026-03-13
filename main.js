//added .trim method to remove extra spaces
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
  const { driverID, driverName, date, startTime, endTime } = shiftObj;
 const content = fs.readFileSync(textFile, "utf8");
    const lines = content.split("\n").filter(line => line.trim() !== "");
    
    for (const line of lines) {
    const cols = line.split(",");
    if (cols[0].trim() === driverID && cols[2].trim() === date) {
        return {};
        }
    }
    const shiftDuration=getShiftDuration(startTime, endTime);
    const idleTime=getIdleTime(startTime, endTime);
    const activeTime=getActiveTime(shiftDuration, idleTime);
    const quota=metQuota(date, activeTime);
    const hasBonus=false;
const newRecord = `${driverID},${driverName},${date},${startTime},${endTime},${shiftDuration},${idleTime},${activeTime},${quota},${hasBonus}`;
    let lastIndex = -1;
    for (let i = 0; i < lines.length; i++) {
     if (lines[i].split(",")[0].trim() === driverID) {
        lastIndex = i;
        }
    }

    if (lastIndex===-1) {
     lines.push(newRecord);
    } else {
    lines.splice(lastIndex + 1, 0, newRecord);
    }
fs.writeFileSync(textFile, lines.join("\n") + "\n", "utf8");
    return {
        driverID,driverName,date,startTime,endTime,shiftDuration,idleTime,activeTime,metQuota:quota,hasBonus
    };

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
  let content = fs.readFileSync(textFile, "utf8");
    let lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {
        let cols = lines[i].split(",");
        if (cols[0].trim() === driverID && cols[2].trim() === date) {
            cols[9] = newValue.toString();
            lines[i] = cols.join(",");
        }
    }

    fs.writeFileSync(textFile, lines.join("\n"), "utf8");
}

// ============================================================
// Function 7: countBonusPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof string) formatted as mm or m
// Returns: number (-1 if driverID not found)
// ============================================================
function countBonusPerMonth(textFile, driverID, month) {
    let lines = fs.readFileSync(textFile, "utf8").split("\n").filter(l => l.trim() !== "");
    let targetMonth = parseInt(month, 10);
let driverExists = lines.some(l => l.split(",")[0].trim() === driverID);
    if (!driverExists) {
        return -1;
    }
     let count = 0;
    for (let line of lines) {
    let cols = line.split(",");
    let lineMonth = parseInt(cols[2].trim().split("-")[1], 10);
    if (cols[0].trim() === driverID && lineMonth === targetMonth && cols[9].trim() === "true") {
         count++;
        }
    }
    return count;
}

// ============================================================
// Function 8: getTotalActiveHoursPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof number)
// Returns: string formatted as hhh:mm:ss
// ============================================================
function getTotalActiveHoursPerMonth(textFile, driverID, month) {
    let lines = fs.readFileSync(textFile, "utf8").split("\n").filter(l => l.trim() !== "");
    let total = 0;

    for (let line of lines) {
    let cols = line.split(",");
    let lineMonth = parseInt(cols[2].trim().split("-")[1], 10);
     if (cols[0].trim() === driverID && lineMonth === month) {
         total += helpertosecs(cols[7].trim());
        }
    }
    return helpertotime(total);
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
   let rateLines = fs.readFileSync(rateFile, "utf8").split("\n").filter(l => l.trim() !== "");
    let dayOff = "";
    for (let line of rateLines) {
        let cols = line.split(",");
        if (cols[0].trim() === driverID) {
            dayOff = cols[1].trim();
            break;
        }
    }

    let dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let shiftLines = fs.readFileSync(textFile, "utf8").split("\n").filter(l => l.trim() !== "");
    let total = 0;

    for (let line of shiftLines) {
        let cols = line.split(",");
        let dateStr = cols[2].trim();
        let lineMonth = parseInt(dateStr.split("-")[1], 10);

        if (cols[0].trim() !== driverID || lineMonth !== month) continue;

        let dayName = dayNames[new Date(dateStr + "T00:00:00").getDay()];
        if (dayName === dayOff) continue;

        if (dateStr >= "2025-04-10" && dateStr <= "2025-04-30") {
            total += 6 * 3600;
        } else {
            total += (8 * 3600) + (24 * 60);
        }
    }
   total = Math.max(0, total - bonusCount * 2 * 3600);

    return helpertotime(total);
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
   let rateLines = fs.readFileSync(rateFile, "utf8").split("\n").filter(l => l.trim() !== "");
    let basePay = 0;
    let tier = 0;
    for (let line of rateLines) {
     let cols = line.split(",");
     if (cols[0].trim() === driverID) {
     basePay = parseInt(cols[2].trim(), 10);
     tier = parseInt(cols[3].trim(), 10);
        break; }
    }
    let actualSecs   = helpertosecs(actualHours);
    let requiredSecs = helpertosecs(requiredHours);

    if (actualSecs >= requiredSecs){
        return basePay;
    }
    let allowed = { 1: 50, 2: 20, 3: 10, 4: 3 };
    let allowedSecs = allowed[tier] * 3600;
    let missingSecs  = requiredSecs - actualSecs;
    let billableSecs = Math.max(0, missingSecs - allowedSecs);
    let billableHours = Math.floor(billableSecs / 3600); 

    if (billableHours === 0) return basePay;
let deductionPerHour = Math.floor(basePay / 185);

    return basePay - (billableHours * deductionPerHour);
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
//test cases for fourth function get met quota
console.log("fourth method test");
console.log(metQuota("2025-04-15", "6:50:00"));  
console.log(metQuota("2025-04-05", "7:42:59")); 
//test cases for fifth function add shift record
console.log("fifth method test");
console.log(addShiftRecord("./shifts.txt", { driverID: "D1001", driverName: "youssof mostafa", date: "2025-04-20", startTime: "6:32:26 am", endTime: "7:26:20 pm" }));
console.log(addShiftRecord("./shifts.txt", { driverID: "D1001", driverName: "youssof mostafa", date: "2025-04-20", startTime: "6:32:26 am", endTime: "7:26:20 pm" }));
//test cases for sixth function set bonus
console.log("sixth method test");
setBonus("./shifts.txt", "D1001", "2025-04-06", true);
setBonus("./shifts.txt", "D1001", "2025-04-06", false);
//test cases for seventh function count bonus per month
console.log("seventh method test");
console.log(countBonusPerMonth("./shifts.txt", "D1001", "04"));
console.log(countBonusPerMonth("./shifts.txt", "D1001", "4"));
//test cases for eighth function get total active hours per month
console.log("eighth method test");
console.log(getTotalActiveHoursPerMonth("./shifts.txt", "D1001", 4));
console.log(getTotalActiveHoursPerMonth("./shifts.txt", "D1002", 4));
//test cases for ninth function get required hours per month
console.log("ninth method test");
console.log(getRequiredHoursPerMonth("./shifts.txt", "./driverRates.txt", 1, "D1001", 4));
console.log(getRequiredHoursPerMonth("./shifts.txt", "./driverRates.txt", 0, "D1003", 4));
//test cases for tenth function get net pay
console.log("tenth method test");
console.log(getNetPay("D1001", "146:20:00", "168:00:00", "./driverRates.txt"));
console.log(getNetPay("D1001", "170:00:00", "168:00:00", "./driverRates.txt"));



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
