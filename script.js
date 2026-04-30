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

if (!localStorage.getItem("voters")) {
    localStorage.setItem("voters", JSON.stringify({}));
}

function generateVoteCode(party, nid) {
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    const timePart = Date.now().toString(36).toUpperCase();
    const partyCode = party.slice(0, 3).toUpperCase();
    const nidSuffix = nid.slice(-4).toUpperCase();

    return `${partyCode}-${timePart}-${nidSuffix}-${randomPart}`;
}

const form = document.getElementById("voteForm");
if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const selected = document.querySelector(
            "input[name='party']:checked",
        );
        const message = document.getElementById("message");
        const nidInput = document.getElementById("nidNumber");
        const fullNameInput = document.getElementById("fullName");
        const dobInput = document.getElementById("dob");
        const nationalityInput = document.getElementById("nationality");
        const locationInput = document.getElementById("location");

        if (!selected) {
            message.textContent = "Please select a party.";
            return;
        }

        const nid = nidInput.value.trim();
        if (!nid) {
            message.textContent = "Please enter your NID Number.";
            return;
        }

        const voters = JSON.parse(localStorage.getItem("voters"));
        if (voters[nid]) {
            message.textContent =
                "This NID has already voted. Duplicate voting is not allowed.";
            return;
        }

        const voteCode = generateVoteCode(selected.value, nid);
        voters[nid] = {
            code: voteCode,
            party: selected.value,
            fullName: fullNameInput.value.trim(),
            dob: dobInput.value,
            nationality: nationalityInput.value.trim(),
            location: locationInput.value.trim(),
            submittedAt: new Date().toISOString(),
        };

        let votes = JSON.parse(localStorage.getItem("votes"));
        votes[selected.value]++;
        localStorage.setItem("votes", JSON.stringify(votes));
        localStorage.setItem("voters", JSON.stringify(voters));

        message.textContent =
            `Vote submitted successfully! Your vote code is ${voteCode}`;
        form.reset();
    });

    const clearHistoryBtn = document.getElementById("clearHistoryBtn");
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener("click", function () {
            localStorage.setItem("voters", JSON.stringify({}));
            document.getElementById("message").textContent =
                "Voter history cleared successfully.";
        });
    }
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
