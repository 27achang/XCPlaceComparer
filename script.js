const button_container = document.getElementById("buttons_div");
const other_runner_button = document.getElementById("other_runner_button");
const footer = document.getElementById("footer");
const SHC_team_place_display = document.getElementById("SHC_team_place_display");
const SHC_athelete_place_display = document.getElementById("SHC_athelete_place_display");
const SI_team_place_display = document.getElementById("SI_team_place_display");
const SI_athelete_place_display = document.getElementById("SI_athelete_place_display");
const runners_past_footer = document.getElementById("runners_past_footer");
const runners_past_label = document.getElementById("runners_past_label");
const runners_past_display = document.getElementById("runners_past_display");

var runners_past = 0;
var teams = {};
var SHC_score = 0;
var SHC_minimum_score = 0;
var SHC_runners_places = [];
var SI_score = 0;
var SI_minimum_score = 0;
var SI_runners_places = [];

// ON CLICK ACTIONS

function onSHCRunnerPassing() {
    let place = ++runners_past;
    SHC_runners_places.push(place);
    if (SHC_runners_places.length <= 5) SHC_score += place;
    // Update displays
    SHC_team_place_display.textContent = "SHC (" + SHC_score + "): ";
    SHC_athelete_place_display.textContent = SHC_runners_places.join(",");
    updateMinimumScores("SHC");
    updateRunnersPastDisplay();
    updateFooterColor();
}

function onSIRunnerPassing() {
    let place = ++runners_past;
    SI_runners_places.push(place);
    if (SI_runners_places.length <= 5) SI_score += place;
    // Update displays
    SI_team_place_display.textContent = "SI (" + SI_score + "): ";
    SI_athelete_place_display.textContent = SI_runners_places.join(",");
    updateMinimumScores("SI");
    updateRunnersPastDisplay();
    updateFooterColor();
}

function onOtherRunnerPassing() {
    runners_past++;
    // Update displays
    updateMinimumScores();
    updateRunnersPastDisplay();
}

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
    // if (SHC_runners_places.length < 5) {
    //     // If the most recent update/runner past was an SHC runner, it is irrelevant to update the minimum score.
    //     if (last_runner == "SHC") {
    //         SHC_team_place_display.textContent = "SHC (" + SHC_score + (SHC_runners_places.length > 0 ? "): " : ")");
    //     }
    //     // The minimum score is the current score plus the place of the next runner (best case scenario that the next runner is from SHC)
    //     else {
    //         SHC_minimum_score = SHC_score + (runners_past + 1);
    //         // Update the display. If no SHC runners have passed, don't add the colon and space after the closing parentheses.
    //         SHC_team_place_display.textContent = "SHC (≥" + SHC_minimum_score + (SHC_runners_places.length > 0 ? "): " : ")");
    //     }
    // }
    // if (SI_runners_places.length < 5) {
    //     if (last_runner == "SI") {
    //         SI_team_place_display.textContent = "SI (" + SI_score + (SI_runners_places.length > 0 ? "): " : ")");
    //     } else {
    //         SI_minimum_score = SI_score + (runners_past + 1);
    //         SI_team_place_display.textContent = "SI (≥" + SI_minimum_score + (SI_runners_places.length > 0 ? "): " : ")");
    //     }
    // }
}

function updateRunnersPastDisplay() {
    if(runners_past == 1) runners_past_label.textContent = "Runners Past: ";
    runners_past_display.textContent = runners_past;
}

function updateFooterColor() {
    if (SHC_score == 0 || SI_score == 0) return;
    if (SHC_score < SI_score) footer.style.backgroundColor = "rgba(0, 87, 61, 1)";
    else footer.style.backgroundColor = "rgba(167, 25, 48, 1)";
    footer.style.color = "white";
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
}
