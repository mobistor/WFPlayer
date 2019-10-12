var $open = document.querySelector('.open');
var $download = document.querySelector('.download');

var art = new Artplayer({
    container: '.artplayer',
    // url: 'https://zhw2590582.github.io/assets-cdn/video/your-name.mp4',
    url: './your-name.mp4',
    autoSize: true,
    loop: true,
    moreVideoAttr: {
        crossOrigin: 'anonymous',
    },
});

var wf = new WFPlayer({
    container: '.waveform',
    cors: true,
});

art.on('ready', function() {
    wf.load(art.template.$video);
});

art.on('seek', function() {
    wf.seek(art.currentTime);
});

$open.addEventListener('change', function() {
    var file = $open.files[0];
    if (file) {
        var $video = document.createElement('video');
        var canPlayType = $video.canPlayType(file.type);
        if (canPlayType === 'maybe' || canPlayType === 'probably') {
            var url = URL.createObjectURL(file);
            art.player.switchUrl(url, file.name).then(() => {
                wf.destroy();
                wf = new WFPlayer({
                    container: '.waveform',
                    cors: true,
                });
                wf.load(art.template.$video);
            });
        } else {
            alert('This file format is not supported');
        }
    }
});

$download.addEventListener('click', function() {
    wf.exportImage();
});

Array.from(document.querySelectorAll('.color-picker')).forEach(function($el) {
    var name = $el.getAttribute('name');
    var pickr = Pickr.create({
        el: $el,
        theme: 'classic',
        swatches: [
            'rgba(244, 67, 54, 1)',
            'rgba(233, 30, 99, 0.95)',
            'rgba(156, 39, 176, 0.9)',
            'rgba(103, 58, 183, 0.85)',
            'rgba(63, 81, 181, 0.8)',
            'rgba(33, 150, 243, 0.75)',
            'rgba(3, 169, 244, 0.7)',
            'rgba(0, 188, 212, 0.7)',
            'rgba(0, 150, 136, 0.75)',
            'rgba(76, 175, 80, 0.8)',
            'rgba(139, 195, 74, 0.85)',
            'rgba(205, 220, 57, 0.9)',
            'rgba(255, 235, 59, 0.95)',
            'rgba(255, 193, 7, 1)',
        ],
        components: {
            preview: true,
            opacity: true,
            hue: true,
            interaction: {
                hex: true,
                rgba: true,
                input: true,
                clear: true,
                save: true,
            },
        },
    });
    pickr
        .on('save', function(color) {
            wf.setOptions({
                [name]: color.toRGBA().toString(),
            });
            pickr.hide();
        })
        .on('change', function(color) {
            wf.setOptions({
                [name]: color.toRGBA().toString(),
            });
        });
});
