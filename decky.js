(function() {
    var slides = µ('section'),
        numSlides = slides.length,
        initCurrent = parseInt(window.location.hash.substr(1), 10) || 1,
        current = -1,
        currentSlide = slides[current-1];
        subSlide = 0,
        $body = µ("body");

    for (var i=0; i<slides.length; i++) {
        µ(slides[i]).attr({'id': i+1});
    }
    µ("body").delegate("section", "click", next);
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
                subSlides.css({'display': null});
            } else {
                n = n < 1 ? 1 : (n > numSlides ? numSlides : n);
                window.location.hash = "#"+n;
                µ('[data-subslide]', currentSlide).css({'display': 'none'});
                current = n;
                subSlide = 0;
            }
        }
        currentSlide = slides[current-1];
        µ('#slidenum')[0].innerHTML = current;
    }

    µ.on(window, "hashchange", function() {
        var newSlide = parseInt(window.location.hash.substr(1), 10);
        if (newSlide && newSlide != current) {
            goto(newSlide);
        }
    })
    µ.on(window, "resize", adjustSizing);

    function adjustSizing() {
        $body.css({"font-size": $body[0].offsetHeight/3 + "%"});
        window.location.hash = "#"+current;
    }
    adjustSizing();
    goto(initCurrent);
})();
