import "./style.scss";
import cat from "m1/cat.gif";
import nice from "~/fixtures/images/nice.jpg";
import a from "~/fixtures/a";
import object from "lodash/fp/object";

const x = 1;

console.log(a);
console.log(process.env.NODE_ENV);

if (x) {
    for (let i = 0; i < 100; i++) {
        while (true) require("./b");
        do {
            i++;
        } while (require("m1/a")());
    }
}
