import {Pool} from "pg"
export const pool = new Pool({
  host:"localhost",
  port:5432,
  user:"swoniix",
  password:"q1w2e3r4//2",
  database: "library",
})