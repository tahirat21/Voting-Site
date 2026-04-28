if (!localStorage.getItem("votes")) {
    localStorage.setItem(
        "votes",
        JSON.stringify({
            National: 712,
            United: 689,
            Covered: 722,
        }),
    );
}

const form = document.getElementById("voteForm");
if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const selected = document.querySelector(
            "input[name='party']:checked",
        );
        const message = document.getElementById("message");

        if (!selected) {
            message.textContent = "Please select a party.";
            return;
        }

        let votes = JSON.parse(localStorage.getItem("votes"));
        votes[selected.value]++;
        localStorage.setItem("votes", JSON.stringify(votes));

        message.textContent = "Vote submitted successfully!";
    });
}

const canvas = document.getElementById("chart");
if (canvas) {
    const ctx = canvas.getContext("2d");
    const votes = JSON.parse(localStorage.getItem("votes"));

    const values = Object.values(votes);
    const labels = Object.keys(votes);
    const total = values.reduce((a, b) => a + b, 0);

    const colors = ["#6ab7b2", "#4fa29c", "#9ad1cc"];

    let startAngle = 0;

    values.forEach((val, i) => {
        const sliceAngle = (val / total) * 2 * Math.PI;

        ctx.beginPath();
        ctx.moveTo(200, 150);
        ctx.arc(200, 150, 100, startAngle, startAngle + sliceAngle);
        ctx.closePath();

        ctx.fillStyle = colors[i];
        ctx.fill();

        startAngle += sliceAngle;
    });

    ctx.beginPath();
    ctx.arc(200, 150, 55, 0, 2 * Math.PI);
    ctx.fillStyle = "#f4f7f6";
    ctx.fill();

    ctx.fillStyle = "#2f3e46";
    ctx.font = "bold 16px Segoe UI";
    ctx.textAlign = "center";
    ctx.fillText("Total Votes", 200, 145);
    ctx.font = "bold 18px Segoe UI";
    ctx.fillText(total, 200, 165);

    labels.forEach((label, i) => {
        const y = 300 + i * 30;

        ctx.fillStyle = colors[i];
        ctx.fillRect(110, y - 10, 14, 14);

        const percent = ((values[i] / total) * 100).toFixed(1);
        ctx.fillStyle = "#2f3e46";
        ctx.font = "bold 14px Segoe UI";
        ctx.textAlign = "left";
        ctx.fillText(`${label} Party`, 135, y);

        ctx.font = "13px Segoe UI";
        ctx.fillText(`${percent}% (${values[i]} votes)`, 135, y + 15);
    });

    const max = Math.max(...values);
    let winner = labels[values.indexOf(max)];
    document.getElementById("winner").textContent =
        `Leading: ${winner} Party`;
}
