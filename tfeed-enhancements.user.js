// ==UserScript==
// @name         TFeed Enhancements
// @namespace    https://f1.tfeed.net
// @version      0.1
// @description  Enhancements for f1.tfeed.net
// @author       Dave Allie <dave@daveallie.com>
// @match        https://f1.tfeed.net/*
// @icon         https://f1.tfeed.net/favicon.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const nickIds = Array(20).fill(null).map((x, i) => (i + 1).toString().padStart(2, '0')).map((id) => `#i_${id}_nick`);
    let positions;
    let backgroundResetTimeouts = {};

    function getPositions() {
        return Object.fromEntries(nickIds.map((nickId, i) => [$(nickId).text(), i + 1]));
    }

    function onPositionChange() {
        const newPositions = getPositions();

        Object.entries(newPositions).forEach(([driver, position]) => {
            if (position < positions[driver] || position > positions[driver]) {
                const $el = $(`#stats_d_${position.toString().padStart(2, '0')}`);
                $el.css('background-color', position < positions[driver] ? 'lightgreen' : 'coral');

                if (backgroundResetTimeouts[driver]) {
                    clearTimeout(backgroundResetTimeouts[driver]);
                }
                backgroundResetTimeouts[driver] = setTimeout(() => $el.css('background-color', ''), 3000);
            }
        });

        positions = newPositions;
    }

    // Wait for driver list to be initialised before attaching mutation observers
    const interval = setInterval(() => {
        if (!$(nickIds[0]).text()) {
            return;
        }

        clearInterval(interval);
        positions = getPositions();

        const positionChangeObserver = new MutationObserver(onPositionChange);
        nickIds.forEach((nickId) => {
            positionChangeObserver.observe($(nickId)[0], { childList: true });
        });
    }, 500);
})();
