import { buffer, json } from "node:stream/consumers";

const a = JSON.parse(
    Buffer.from("eyJpZCI6IjY4MGRkNjFiMDAxMTNhMDQxOWYwIiwic2VjcmV0IjoiMTI4M2NjNzZhMTM1MGI4MDYyODlhNGRiZDFkMWY5YmVhMWQ0OTQ2OTkzMGQ0YmMxMjA1MmIzZTU1NDg4MWZjNTU0MmQ3MjlhYjliYTgyMjIwYzc1NGIwNTJmOGI5YTdmYTk1MjFiNzVmNWRiNDM0MTBkMDMyMDc2MzQ4ZmU5NjFhYWZlZDEzNTczZDA3Yjc4NjU2YTU5OWE2N2FiMGU3ZWRmMWIzMDJhZGFmY2EyNGRmMjM1ODM0YWMzYWQwYmQ2ZDk4ZTA3ZmQxZGNjNzhiZjk1MTgxODZiMGRjNWUxMmRiNzAxN2NlOGQ1YTM5NzI5Zjg0MjVlZjViZmViZWQ0NSJ9", "base64url").toString()
);

console.log(a);
// a.expiry = 1766987280;

// console.log(a);

// const newA = Buffer.from(JSON.stringify(a)).toString('base64url');
// console.log(newA)