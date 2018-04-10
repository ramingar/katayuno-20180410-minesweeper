import test from 'tape';

// COMPONENTS ------------------------------------------------------------------

const Minesweeper = function ({width, height, initialMap = ''}) {

    const MINE = '*';

    const showMap = function () {
        const resumeMap = initialMap.split('').reduce(buildMap, '');
        return resumeMap;
    };

    const buildMap = function (acc, field) {
        if (isMine(field)) {
            acc += MINE;
        } else {
            acc += '.';
        }
        return acc;
    };

    const isMine = function (field) {
        return field === MINE;
    };

    return Object.freeze({
        showMap
    });
};

// TESTS ------------------------------------------------------------------------

test('shows no map for no coordinates', (assert) => {
    const noMap       = '';
    const minesweeper = Minesweeper({width: 0, height: 0, initialMap: ''});

    const map = minesweeper.showMap();

    assert.equal(map, noMap, 'Shows no map');
    assert.end();
});

test('shows a map with one field', (assert) => {
    const oneFieldMap = '.';
    const minesweeper = Minesweeper({width: 1, height: 1, initialMap: '.'});

    const map = minesweeper.showMap();

    assert.equal(map, oneFieldMap, 'Shows a map with one field');
    assert.end();
});

test('minesweeper with a mine', (assert) => {
    const expected    = '*';
    const minesweeper = Minesweeper({width: 1, height: 1, initialMap: '*'});

    const map = minesweeper.showMap();

    assert.equal(map, expected, 'Map must have one mine');
    assert.end();
});
