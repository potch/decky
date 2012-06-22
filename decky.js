var deck = (function() {
    var slides = µ('section'),
        numSlides = slides.length,
        initCurrent = parseInt(window.location.hash.substr(1), 10) || 1,
        current = -1,
        currentSlide = slides[current-1];
        subSlide = 0,
        listMode = false,
        doc = document,
        body = µ("body");

    for (var i=0; i<slides.length; i++) {
        µ(slides[i]).attr({'id': i+1});
    }
    body.delegate('click', 'section', next);
    µ("section a").on('click', function(e) {
        e.stopPropagation();
    });
    µ(document).on('keydown', function(e) {
        switch (e.which) {
            case 37:
            case 38:
                prev();
                e.preventDefault();
                break;
            case 32:
            case 39:
            case 40:
                next();
                e.preventDefault();
                break;
        }
    });

    function next() {
        goto(current+1);
    }

    function prev() {
        goto(current-1);
    }

    function goto(n) {
        if (n !== current) {
            subSlide++;
            var subSel = µ.fmt('[data-subslide="{0}"]', subSlide),
                subSlides = µ(subSel, currentSlide);
            if (n - current === 1 &&
                subSlides.length) {
                subSlides.css({'visibility': 'visible'});
            } else {
                n = n < 1 ? 1 : (n > numSlides ? numSlides : n);
                if (n == current) return;
                window.location.hash = "#"+n;
                µ('[data-subslide]', currentSlide).css({'visibility': 'hidden'});
                current = n;
                subSlide = 0;
                currentSlide = slides[current-1];
                for (var i=0; i<numSlides; i++) {
                    var s = slides[i];
                    if (i < current-1) {
                        slides[i].className = 'before';
                    } else if (i > current-1) {
                        slides[i].className = 'after';
                    } else {
                        slides[i].className = 'active';
                    }
                }
            }
        }
    }

    µ.on(window, "hashchange", function(e) {
        e.preventDefault();
        var newSlide = parseInt(window.location.hash.substr(1), 10);
        if (newSlide && newSlide != current) {
            goto(newSlide);
        }
    });
    µ.on(window, "resize", adjustSizing);
    function toggleFullScreen() {
        if (window.fullScreen) {
            body[0].mozCancelFullScreen();
        } else {
            body[0].mozRequestFullScreen();
        }
    }

    function toggleListView() {
        listMode = !listMode;
        body[0].className = listMode ? 'list' : '';
        adjustSizing();
    }

    window.addEventListener("load", function() {
        var menu = doc.createElement('menu'),
            item = doc.createElement('menuitem');
        µ(menu).attr({
            id: 'fsmenu',
            type: 'context'
        });
        µ(item).attr({ label: 'Fullscreen' })
               .on('click', toggleFullScreen);
        menu.appendChild(item);
        body[0].appendChild(menu);
        body.attr({contextmenu: 'fsmenu'});
    });

    function adjustSizing() {
        body.css({"font-size": slides[0].offsetHeight/3 + "%"});
        window.location.hash = "#"+current;
    }
    adjustSizing();
    goto(initCurrent);

    return {
        next: next,
        prev: prev,
        fullScreen: toggleFullScreen,
        list: toggleListView
    };
})();
