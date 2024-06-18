// Variable for making and manipulating Senators Table
const senatorsData = document.getElementById('senatorsData');
// Variable for storing fetched senators.json data
let fetchedData;
// Function to add cells to rows of the Senator Table
const addCell = function (Row, CellData) {
    const senatorCell = document.createElement('td');
    senatorCell.textContent = CellData;
    Row.appendChild(senatorCell);
};

// Variables for filtering by Party/State/Rank
let globalPartyType;
let globalStateType;
let globalRankType;

// Variables for counting party members
let republicanCount = 0;
let democratCount = 0;
let independentCount = 0;

// Function to change display of row to expand or collapse when clicked
function collapsibleEvent() {
    const coll = document.querySelectorAll(".collapsible");
    let i;
    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            this.classList.toggle("active");
            const content = this.nextElementSibling.querySelector(".content");
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }
}

// Fetching Data from .json file
fetch('senators.json')
    .then(response => response.json())
    .then(data => {
        fetchedData = data


        // Checks if fetched data exists, if senator object exists, if data.objects is an array and contains at least 1 senator
        if(!(data && data.objects && Array.isArray(data.objects) && data.objects.length > 0)) {
            console.error('JSON file does not contain Senators');
            alert('JSON file does not contain Senators')
            return;
        }

        // Counting amount of senators in 'Republican', 'Democrat' and 'Independent'
        data.objects.forEach(senator => {
            if (senator.party === 'Republican') {
                republicanCount += 1;
            } else if (senator.party === 'Democrat') {
                democratCount += 1;
            } else if (senator.party === 'Independent') {
                independentCount += 1;
            }
        });

        // Sorting the Senators by party

        data.objects.sort(function (a, b) {
            if (a.senator_rank < b.senator_rank) {
                return -1;
            } else {
                return 1;
            }
        }).sort(function (a, b) {
            if (a.state < b.state) {
                return -1;
            } else {
                return 1;
            }
        }).sort(function (a, b) {
            if (a.party < b.party) {
                return -1;
            } else {
                return 1;
            }
        });
        
        // Displaying the party count using Template literals to insert into the 'countDisplay' <div>
        const countDisplay = document.getElementById('countDisplay');
        countDisplay.innerHTML = `
        <h2 class = "reptext"> Republicans:  </h2> <h2> &ensp; ${republicanCount} &ensp;</h2> <br><br>
        <h2 class = "demtext"> Democrats:  </h2> <h2> &ensp; ${democratCount} &ensp;</h2> <br><br>
        <h2 class = "indtext"> Independents:  </h2> <h2> &ensp; ${independentCount} </h2>
        `;


        // Displaying leadership roles using Template literals to insert into the 'LeadershipTitles' <div>
        // In the .json file, it iterates through each Senator and if leadership_title is not null 
        // then it adds a <p> element with their title and name
        const LeadershipTitles = document.getElementById('LeadershipTitles');
        data.objects.forEach(senator => {
            if (senator.leadership_title !== null) {
                const leadershipInfo = document.createElement('p');
                    if (senator.party === 'Republican') {
                        leadershipInfo.innerHTML = ` ${senator.leadership_title}: ${senator.person.firstname} ${senator.person.lastname} <p class="reptext">(${senator.party})</p>`;
                        LeadershipTitles.appendChild(leadershipInfo);
                    } else if (senator.party === 'Democrat') {
                        leadershipInfo.innerHTML = ` ${senator.leadership_title}: ${senator.person.firstname} ${senator.person.lastname} <p class="demtext">(${senator.party})</p>`;
                        LeadershipTitles.appendChild(leadershipInfo);
                    } else if (senator.party === 'Independent') {
                        leadershipInfo.innerHTML = ` ${senator.leadership_title}: ${senator.person.firstname} ${senator.person.lastname} <p class="indtext">(${senator.party})</p>`;
                        LeadershipTitles.appendChild(leadershipInfo);
                    }
                }
            });

        // Goes through each Senator and creates a table row ( <tr> ) in the 'senatorsData' table with all relevant data
        data.objects.forEach(senator => {
            const SenatorsRow = document.createElement('tr');
            if (senator.party === 'Republican') {
                SenatorsRow.classList.add('Republican');
            } else if (senator.party === 'Independent') {
                SenatorsRow.classList.add('Independent');
            }
            else {
                SenatorsRow.classList.add("Democrat");
            }
            SenatorsRow.classList.add("collapsible");
            addCell(SenatorsRow, senator.person.firstname + ' ' + senator.person.lastname);
            addCell(SenatorsRow, senator.party);
            addCell(SenatorsRow, senator.state);
            addCell(SenatorsRow, senator.person.gender);
            addCell(SenatorsRow, senator.senator_rank);
            senatorsData.appendChild(SenatorsRow);

            // Adding expandable details for each senator for when user clicks on the table row
            const expandabletr = document.createElement('tr');
            const expandabletd = document.createElement('td');
            expandabletd.setAttribute('colspan', 5);
            const expandablediv = document.createElement('div');
            expandablediv.setAttribute('class', 'content');
            expandablediv.setAttribute('style', 'display: none; white-space: pre; font-size: 0.8em');   
            let youtubeId = senator.person.youtubeid ? `@${senator.person.youtubeid}` : 'Not applicable';
            let twitterid = senator.person.twitterid ? `@${senator.person.twitterid}` : 'Not applicable';
            let extradetails = document.createTextNode(`Office: ${senator.extra.office} \n Date of Birth: ${senator.person.birthday} \n Start Date: ${senator.startdate} \n Twitter ID: ${twitterid} \n Youtube ID: ${youtubeId} \n Website: `);
            let link = document.createElement('a');
            link.href = senator.website;
            link.textContent = senator.website;
            link.target = '_blank';
            expandablediv.appendChild(extradetails);
            expandablediv.appendChild(link);
            expandabletd.appendChild(expandablediv);
            expandabletr.appendChild(expandabletd);
            senatorsData.appendChild(expandabletr);
        })

        // Creating options for 'State' Drop down Button
    
            let statelist = [];
            data.objects.forEach(senator => {
                if (!statelist.includes(senator.state)) {
                    const selectElement = document.getElementById('states');
                    const option = document.createElement('option');
                    option.value = senator.state;
                    option.text = senator.state;
                    selectElement.appendChild(option);
                    statelist.push(senator.state);
                }
            });
        // Calls function that goes through the rows with 'collapsible' class 
        // and enables it to expand or collapse when click event is triggered 
        collapsibleEvent();
    })
    // Error handling .json file can't be located
    .catch(err => console.error('Error fetching data:', err) + alert("Error fetching data"));

// Function that is called when a party is filtered in the table by the user
function filterParty(partyType) {
    globalPartyType = partyType;
    doAllFiltering();
}
// Function that is called when a specific state is filtered in the table by the user
function filterState(stateType) {
    globalStateType = stateType;
    doAllFiltering();
}
// Function that is called when the Junior/Senior rank is filtered in the table by the user
function filterRank(rankType) {
    globalRankType = rankType;
    doAllFiltering();
}
// Filtering function that removes all rows from table
function doAllFiltering() {
    //Removes rows from the table
    for (let i = senatorsData.children.length - 1; i >= 1; i--) {
        senatorsData.removeChild(senatorsData.children[i]);
    }
    // Goes through each senator and returns true if 
    // the ''globalPartyType'' variable is the same as their party or 'Show All is clicked'
    fetchedData.objects.filter(function (senator) {
        if (senator.party == globalPartyType || globalPartyType == null || globalPartyType == 'Show All') {
            return true;
        } else {
            return false;
        }
    })
        // Goes through each senator and returns true if 
        // the ''globalStateType'' variable is the same as their state or 'Show All is clicked'
        .filter(function (senator) {
            if (senator.state == globalStateType || globalStateType == null || globalStateType == 'Show All') {
                return true;
            } else {
                return false;
            }
        })
        // Goes through each senator and returns true if 
        // the ''globalRankType'' variable is the same as their rank or 'Show All is clicked'
        .filter(function (senator) {
            if (senator.senator_rank == globalRankType || globalRankType == null || globalRankType == 'Show All') {
                return true;
            } else {
                return false;
            }
        })
        // Creates a new row from the Senators that returned 'true' from filter(s) 
        // Reuses previous code
        .forEach(function (senator) {
            let SenatorsRow = document.createElement('tr');
            if (senator.party === 'Republican') {
                SenatorsRow.classList.add('Republican');
            } else if (senator.party === 'Independent') {
                SenatorsRow.classList.add('Independent');
            }
            else if (senator.party === 'Democrat') {
                SenatorsRow.classList.add("Democrat");
            }

            SenatorsRow.classList.add("collapsible");
            addCell(SenatorsRow, senator.person.firstname + ' ' + senator.person.lastname);
            addCell(SenatorsRow, senator.party);
            addCell(SenatorsRow, senator.state);
            addCell(SenatorsRow, senator.person.gender);
            addCell(SenatorsRow, senator.senator_rank);
            senatorsData.appendChild(SenatorsRow);

            // Adding expandable details for each filtered senator
            const expandabletr = document.createElement('tr')
            const expandabletd = document.createElement('td')
            expandabletd.setAttribute('colspan', 5)
            const expandablediv = document.createElement('div')
            expandablediv.setAttribute('class', 'content')
            expandablediv.setAttribute('style', 'display: none; white-space: pre; font-size: 0.8em')
            let youtubeId = senator.person.youtubeid ? `@${senator.person.youtubeid}` : 'Not applicable';
            let twitterid = senator.person.twitterid ? `@${senator.person.twitterid}` : 'Not applicable';
            let extradetails = document.createTextNode(`Office: ${senator.extra.office} \n Date of Birth: ${senator.person.birthday} \n Start Date: ${senator.startdate} \n Twitter ID: ${twitterid} \n Youtube ID: ${youtubeId} \n Website: `);
            let link = document.createElement('a');
            link.href = senator.website;
            link.textContent = senator.website;
            link.target = '_blank';
            expandablediv.appendChild(extradetails);
            expandablediv.appendChild(link);
            expandabletd.appendChild(expandablediv);
            expandabletr.appendChild(expandabletd);
            senatorsData.appendChild(expandabletr);
        });
    collapsibleEvent();
}
