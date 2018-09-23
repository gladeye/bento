import a from "m1/a";
import object from "lodash/fp/object";

console.log(a);
console.log("hello");

import("./a").then((a) => console.log(a));
