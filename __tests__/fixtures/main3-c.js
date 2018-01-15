import a from "m1/a";

console.log(a);
console.log("hello");

import("./a").then(a => console.log(a));
