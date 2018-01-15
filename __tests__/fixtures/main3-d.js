import a from "m1/a";
import $ from "jquery";

console.log(a);
console.log("hello");
console.log($);

import("./a").then(a => console.log(a));
