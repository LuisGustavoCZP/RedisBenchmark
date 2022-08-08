const express = require("express");
const Redis = require("ioredis");
const { Pool } = require('pg')
const app = express();
require('dotenv').config();
const {PORT:port, POSTGRES_CONNECTION_STRING:pgstring} = process.env;

const db = new Pool({connectionString:pgstring});
const redis = new Redis();

async function cachingRedis ()
{
    await redis.ltrim("users", 0, 0);
    const resp = await db.query('SELECT * FROM users');
    for(const r of resp.rows)
    {
        const id = `user:${r.id}`;
        await redis.lpush("users", JSON.stringify(r));
        //await redis.hset(id, r);
    };
}
cachingRedis ();

let resReq = null;
let mode = "";
let initTime = 0;
let total = 0;
let count = 0;

function testeFinish ()
{
    const f = performance.now() - initTime;
    const s = `Performance of ${mode}(${total/1000}K) = ${f}ms`;
    mode = '';
    total = 0;
    count = 0;
    initTime = 0;
    //console.log(s);
    resReq.send(s);
}

function testeComputing ()
{
    count++;
    if(count == total) testeFinish ();
}

app.get ("/postgres", (req, res) =>
{
    resReq = res;
    mode = "Postgres";
    total = Number(req.query.tests);
    for(let i = 0; i < total; i++)
    {
        db.query('SELECT * FROM users').then(testeComputing);
    }
    initTime = performance.now();
});

app.get ("/redis", (req, res) =>
{
    resReq = res;
    mode = "Redis";
    total = Number(req.query.tests);
    for(let i = 0; i < total; i++)
    {
        redis.lrange("users", 0, -1).then(testeComputing);
    }
    initTime = performance.now();
});

app.get ("/", async (req, res) =>
{
    res.sendFile(__dirname+"/public/index.html");   
});

app.get ("/static/index.js", async (req, res) =>
{
    res.sendFile(__dirname+"/public/index.js");
});

app.get ("/static/style.css", async (req, res) =>
{
    res.sendFile(__dirname+"/public/style.css");
});

app.listen(port, () => {console.log(`Server started at http://localhost:${port}`)});