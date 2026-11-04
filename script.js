const button_container = document.getElementById("buttons_div");
const other_runner_button = document.getElementById("other_runner_button");
const footer = document.getElementById("footer");
const runners_past_footer = document.getElementById("runners_past_footer");
const runners_past_label = document.getElementById("runners_past_label");
const runners_past_display = document.getElementById("runners_past_display");

var runners_past = 0;
var teams = {};
const keys = ["KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL"];

// ON CLICK ACTIONS

function onRunnerPassing(team) {
    if (team == "Other") {
        runners_past++;
        // Update displays
        updateMinimumScores();
        updateRunnersPastDisplay();
        return;
    }
    let place = ++runners_past;
    teams[team].runners_places.push(place);
    if (teams[team].runners_places.length <= 5) teams[team].score += place;
    // Update displays
    let spans = footer.querySelector("div." + team).querySelectorAll("span");
    spans.item(0).textContent = team + " (" + teams[team].score + "): ";
    spans.item(1).textContent = teams[team].runners_places.join(",");
    updateMinimumScores(team);
    updateRunnersPastDisplay();
    updateFooterColor();
    if (teams[team].runners_places.length >= 7) button_container.querySelector("button." + team).setAttribute("disabled", "true");
}

async function copyScores() {
    let scores_text = Object.keys(teams).reduce((result, team) => {
        let spans = footer.querySelector("." + team).querySelectorAll("span");
        return result + spans.item(0).textContent + spans.item(1).textContent + String.fromCharCode(10);
    }, "");
    try {
        await navigator.clipboard.writeText(scores_text);
    } catch (error) {
        console.error(error.message);
        alert(error.message);
    }
}

// UTILITY FUNCTIONS

function updateMinimumScores(last_runner) {
    Object.keys(teams).forEach((team) => {
        if (teams[team].runners_places.length >= 5) return;
        let display = footer.querySelector("div." + team).querySelector("span");
        // display.textContent = `${team} (${teams[team].score}` + (teams[team].runners_places.length > 0 ? "): " : ")");
        display.textContent = `${team} (`;
        if (teams[team].runners_places.length > 0) display.textContent += teams[team].score + ", ";
        teams[team].minimum_score = teams[team].score + (5 - teams[team].runners_places.length) * ((runners_past + 1) + (runners_past + (5 - teams[team].runners_places.length))) / 2;
        display.textContent += `≥${teams[team].minimum_score})`;
        if (teams[team].runners_places.length > 0) display.textContent += ": ";
    });
}

function updateRunnersPastDisplay() {
    if(runners_past == 1) runners_past_label.textContent = "Runners Past: ";
    runners_past_display.textContent = runners_past;
}

function updateFooterColor() {
    let winning_team = ["", 0];
    Object.keys(teams).forEach((team) => {
        if (teams[team].minimum_score != 0 && (winning_team[1] == 0 || teams[team].minimum_score < winning_team[1])) winning_team = [team, teams[team].minimum_score];
    });
    switch (winning_team[0]) {
        case "SHC":
            footer.style.backgroundColor = "rgba(0, 87, 61, 1)";
            footer.style.color = "white";
            break;
        case "SI":
            footer.style.backgroundColor = "rgba(167, 25, 48, 1)";
            footer.style.color = "white";
            break;
        case "SFHS":
            footer.style.backgroundColor = "rgba(94, 82, 67, 1)";
            footer.style.color = "white";
            break;
        case "BCP":
            footer.style.backgroundColor = "rgba(0, 47, 108, 1)";
            footer.style.color = "white";
            break;
        default:
            footer.style.backgroundColor = "transparent";
            footer.style.color = "black";
    }
}

function onKeyPress(e) {
    // Check if the space bar was pressed and trigger an "Other" button press
    if (e.code == "Space") {
        onRunnerPassing("Other");
        return;
    }

    // Check that the key is from the home row (A to L) and is not out of the range of the number of teams (eg. pressing F will do nothing if there are only 3 teams)
    if (!(keys.includes(e.code)) || keys.indexOf(e.code) + 1 > Object.keys(teams).length) return;
    // Make sure the team does not already have 7 runners and that the button is not already disabled
    if (Object.values(teams)[keys.indexOf(e.code)].runners_places.length >= 7 || button_container.querySelector("." + Object.keys(teams)[keys.indexOf(e.code)]).hasAttribute("disabled")) return;
    onRunnerPassing(Object.keys(teams)[keys.indexOf(e.code)]);
}

window.onload = () => {
    let teams_input;
    do teams_input = prompt("Enter the teams in this race, separated by commas:\n (The following teams will receive special coloring for the buttons: SHC, SI, SFHS, BCP)", "SHC,SI,SFHS");
    while (teams_input.length == 0);
    if (teams_input == null) return;

    let buttons = button_container.querySelectorAll("button");
    buttons.item(0).remove();
    buttons.item(1).remove();
    let footers = footer.querySelectorAll("div");
    footers.item(0).remove();
    footers.item(1).remove();

    teams_input.split(",").forEach((team) => {
        teams[team] = {
            score: 0,
            minimum_score: 0,
            runners_places: []
        };
        
        // Add the button
        let button = document.createElement("button");
        button.className = team;
        button.setAttribute("onclick", `onRunnerPassing("${team}")`);
        button.textContent = team;
        button_container.insertBefore(button, other_runner_button);

        // Add the footer
        let container = document.createElement("div");
        container.className = team;
        let label = document.createElement("span");
        label.className = "label";
        label.textContent = team;
        container.appendChild(label);
        let display = document.createElement("span");
        container.appendChild(display);
        footer.insertBefore(container, runners_past_footer);

    });
    // Add an event listener for the button
    document.addEventListener("keydown", onKeyPress)
}
