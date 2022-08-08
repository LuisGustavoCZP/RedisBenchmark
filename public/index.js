const inputTestes = document.getElementById("input-total");
const postgresBtn = document.getElementById("postgres-btn");
const redisBtn = document.getElementById("redis-btn");

let tests = 1;
inputTestes.value = tests;

inputTestes.oninput = (e) => {
    tests = Number(inputTestes.value);
};

async function postgresTest ()
{
    const resp = await fetch(`/postgres?tests=${tests}`).then(resp => resp.text());
    console.log(resp);
}

async function redisTest ()
{
    const resp = await fetch(`/redis?tests=${tests}`).then(resp => resp.text());
    console.log(resp);
}

postgresBtn.onclick = postgresTest;
redisBtn.onclick = redisTest;