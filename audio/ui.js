import Track from './track.js';

/**
 * Adds in html elements for the track controls
 * @returns {HTMLInputElement}
 */
function track_controls(item){
    //play button
    const controllerDiv = $("<div class='controls'/>")
    const play=$("<span class='material-icons'>play_arrow</span>");
    $(play).click(function (e) { 
        // work on the li instead of teh button
        const track = $(this).parent().parent()
        e.preventDefault();
        console.log('play track')
        if ($(track).hasClass("playing-false")){
            $(this).text('pause');
            $(track).removeClass("playing-false")
            $(track).addClass("playing-true")
        }
        else {
            $(this).text('play_arrow');
            $(track).removeClass("playing-true")
            $(track).addClass("playing-false")
        }
    });
    // loop button
    const loop=$("<span class='material-icons'>loop</span>");
    $(loop).click(function (e) { 
        e.preventDefault();
        console.log('loop track')
        
    });
    // add all buttons to controller div
    $(controllerDiv).append(play)
    $(controllerDiv).append(loop)
    $(controllerDiv).hide()
    // show controls on hover of track item
    $(item).hover(function () {
            $(controllerDiv).show()
        }, function () {
            $(controllerDiv).hide()
        }
    );
    $(item).append(controllerDiv);
}

const trackList = document.createElement("ul");
Track.library.onchange((e) => {
    trackList.innerHTML = "";
    trackList.id = 'track-list';
    e.target.map().forEach((track, id) => {
        const item = document.createElement("li");
        item.textContent = track.name;
        item.setAttribute("data-id", id);
        item.className += "playing-false"
        track_controls(item)
        trackList.append(item);
    });
});

/**
 * Creates a generic volume slider element
 * @returns {HTMLInputElement}
 */
function volumeSlider() {
    const volumeSlider = document.createElement("input");
    volumeSlider.type = "range";
    volumeSlider.min = 0;
    volumeSlider.max = 1;
    volumeSlider.step = .01;
    volumeSlider.classList.add('volume-control')

    return volumeSlider
}

function init_trackLibrary() {
    const header = document.createElement("h3");
    header.textContent = "Track Library";

    const importCSV = document.createElement('button');
    importCSV.textContent = "Import CSV";
    importCSV.onclick = () => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".csv";
        fileInput.onchange = (e) => {
            const reader = new FileReader();
            reader.readAsText(e.target.files[0]);
            reader.onload = () => {
                Track.library.importCSV(reader.result);
            };
            reader.onerror = () => {
                throw reader.error
            };
        };
        fileInput.click();
    };

    Track.library.dispatchEvent(new Event('onchange'));
    $("#sounds-panel .sidebar-panel-body").append(header, importCSV, trackList);
}


export default function init_ui() {
    init_trackLibrary();
}
