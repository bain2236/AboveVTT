import Track from './track.js';

/**
 * Adds in html elements for the track controls
 * @returns {HTMLInputElement}
 */
function track_controls(item){
    const controllerDiv = $("<div class='controls'/>")
    const play=$("<span id='play' class='material-icons'>play_arrow</span>");
    const loop=$("<span id='loop' class='material-icons'>loop</span>");
    const edit=$("<span id='edit' class='material-icons'>edit</span>");
    const remove=$("<span id='delete' class='material-icons'>delete_forever</span>");
    const volume = volumeSlider()
    $(loop).hide()
    $(volume).hide()
    $(loop).click(function (e) { 
        const track = $(this).parent().parent()
        e.preventDefault();
        console.log('loop track')
        if ($(track).hasClass("looping")){
            $(track).removeClass("looping")
        }
        else{
            $(track).addClass("looping")
        }
        
    });

    $(play).click(function (e) { 
        const track = $(this).parent().parent()
        e.preventDefault();
        console.log('play track')
        if ($(track).hasClass("playing-false")){
            $(this).text('pause');
            $(track).removeClass("playing-false")
            $(track).addClass("playing-true")
            $(edit).fadeOut("slow", function(){
                $(this).replaceWith(volume);
                $(volume).fadeIn("slow");
             });
             $(remove).fadeOut("slow", function(){
                $(this).replaceWith(loop);
                $(loop).fadeIn("slow");
             });
            // $(loop).show("fast")
            // $(controllerDiv).children().show("fast")
            // $(edit).hide("slow")
            // $(remove).hide("slow")
        }
        else {
            $(this).text('play_arrow');
            $(track).removeClass("playing-true")
            $(track).addClass("playing-false")
            $(track).removeClass("looping")
            // $(loop).hide("slow")
            // $(volume).hide("slow")
            // $(edit).show("fast")
            // $(remove).show("fast")
            $(volume).fadeOut("slow", function(){
                $(this).replaceWith(edit);
                $(edit).fadeIn("slow");
             });
             $(loop).fadeOut("slow", function(){
                $(this).replaceWith(remove);
                $(remove).fadeIn("slow");
             });
        }
    });
    
    // add all buttons to controller div
    $(controllerDiv).append(play)
    $(controllerDiv).append(edit)
    $(controllerDiv).append(remove)
    $(controllerDiv).append(volume)
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
        item.setAttribute("data-id", id);
        item.className += "playing-false"
        $(item).append($(`<div class='track-label'>${track.name}</div>`))
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
