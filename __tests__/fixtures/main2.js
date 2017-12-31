import "./style.scss";
import a from "./a";
const x = 1;

console.log(process.env.NODE_ENV);

if (x) {
    for (let i = 0; i < 100; i++) {
        while (true) require("./b");
        do {
            i++;
        } while (require("m1/a")());
    }
}
