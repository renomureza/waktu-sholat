// const result = new Date("1/1/2021");

console.log(new Date(new Date("1/1/2021").setUTCHours(0, 0, 0, 0)));
console.log(new Date(new Date("1/1/2021").setHours(24, 0, 0, 0)));
console.log(new Date("1/1/2021"));
console.log(new Date("1/1/2021").toLocaleString());
