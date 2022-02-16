import { json } from "d3-fetch";
import data from "./arw.json";
import * as params from "@params";
import ARWMap from "./map";

json("https://data.chnm.org/ahcb/states/1926-07-04/")
  .then((us) => {
    const map = new ARWMap(params.id, data, us);
    map.draw();
  })
  .catch((e) => console.log(e));
