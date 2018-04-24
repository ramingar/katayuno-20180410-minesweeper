import test from 'tape';

// COMPONENTS ------------------------------------------------------------------

const Minesweeper = function ({width, height, initialMap = ''}) {

    const MINE_VALUE          = '*';
    const OUT_OF_BOUNDS_VALUE = '-';
    const BREAK_LINE          = '\n';

    const LAST_POSITION         = initialMap.length - 1;
    const LEFT_POSITION         = -1;
    const RIGHT_POSITION        = 1;
    const TOP_POSITION          = (width * -1);
    const BOTTOM_POSITION       = width;
    const TOP_LEFT_POSITION     = TOP_POSITION + LEFT_POSITION;
    const TOP_RIGHT_POSITION    = TOP_POSITION + RIGHT_POSITION;
    const BOTTOM_LEFT_POSITION  = BOTTOM_POSITION + LEFT_POSITION;
    const BOTTOM_RIGHT_POSITION = BOTTOM_POSITION + RIGHT_POSITION;

    const showMap = function () {
        const solveMinesweeper = (acc, currentValue, index) =>
            acc += isMine({value: currentValue}) ? MINE_VALUE : getSurroundingMines({position: index});

        return buildBoard(
            initialMap.split('').reduce(solveMinesweeper, '')
        );
    };

    const buildBoard = function (finalMap) {
        return finalMap.split('').reduce((acc, curr, index) =>
            acc += 0 < index && 0 === index % parseInt(width) ? BREAK_LINE + curr : curr, '');
    };

    const isMine = function ({value}) {
        return value === MINE_VALUE;
    };

    const getValue = function ({position}) {
        return initialMap.split('')[position];
    };

    const getRow = function ({position}) {
        return parseInt(position / width, 10);
    };

    const isTheSameRow = function ({currentPosition, positionToReach}) {
        const myRow              = getRow({position: currentPosition});
        const positionToReachRow = getRow({position: getIndex({currentPosition, positionToReach})});
        return myRow === positionToReachRow;
    };

    const isThePreviousRow = function ({currentPosition, positionToReach}) {
        const myRow              = getRow({position: currentPosition});
        const positionToReachRow = getRow({position: getIndex({currentPosition, positionToReach})});
        return -1 === positionToReachRow - myRow;
    };

    const isTheNextRow = function ({currentPosition, positionToReach}) {
        const myRow              = getRow({position: currentPosition});
        const positionToReachRow = getRow({position: getIndex({currentPosition, positionToReach})});
        return 1 === positionToReachRow - myRow;
    };

    const getIndex = function ({currentPosition, positionToReach}) {
        return currentPosition + positionToReach;
    };

    const getBeforeValue = function ({currentPosition, positionToReach}) {
        const beforeIndex = getIndex({currentPosition, positionToReach});
        return beforeIndex > -1 ? getValue({position: beforeIndex}) : OUT_OF_BOUNDS_VALUE;
    };

    const getAfterValue = function ({currentPosition, positionToReach}) {
        const afterIndex = getIndex({currentPosition, positionToReach});
        return afterIndex > LAST_POSITION ? OUT_OF_BOUNDS_VALUE : getValue({position: afterIndex});
    };

    const getLeftValue = function ({position = 0} = {}) {
        return isTheSameRow({currentPosition: position, positionToReach: LEFT_POSITION}) ?
            getBeforeValue({currentPosition: position, positionToReach: LEFT_POSITION}) : OUT_OF_BOUNDS_VALUE;
    };

    const getTopValue = function ({position = 0} = {}) {
        return getBeforeValue({currentPosition: position, positionToReach: TOP_POSITION})
    };

    const getTopLeftValue = function ({position = 0} = {}) {
        return isThePreviousRow({currentPosition: position, positionToReach: TOP_LEFT_POSITION}) ?
            getBeforeValue({currentPosition: position, positionToReach: TOP_LEFT_POSITION}) : OUT_OF_BOUNDS_VALUE;
    };

    const getTopRightValue = function ({position = 0} = {}) {
        return isThePreviousRow({currentPosition: position, positionToReach: TOP_RIGHT_POSITION}) ?
            getBeforeValue({currentPosition: position, positionToReach: TOP_RIGHT_POSITION}) : OUT_OF_BOUNDS_VALUE;
    };

    const getRightValue = function ({position = initialMap.length} = {}) {
        return isTheSameRow({currentPosition: position, positionToReach: RIGHT_POSITION}) ?
            getAfterValue({currentPosition: position, positionToReach: RIGHT_POSITION}) : OUT_OF_BOUNDS_VALUE;
    };

    const getBottomValue = function ({position = initialMap.length} = {}) {
        return getAfterValue({currentPosition: position, positionToReach: BOTTOM_POSITION});
    };

    const getBottomLeftValue = function ({position = initialMap.length} = {}) {
        return isTheNextRow({currentPosition: position, positionToReach: BOTTOM_LEFT_POSITION}) ?
            getAfterValue({currentPosition: position, positionToReach: BOTTOM_LEFT_POSITION}) : OUT_OF_BOUNDS_VALUE;
    };

    const getBottomRightValue = function ({position = initialMap.length} = {}) {
        return isTheNextRow({currentPosition: position, positionToReach: BOTTOM_RIGHT_POSITION}) ?
            getAfterValue({currentPosition: position, positionToReach: BOTTOM_RIGHT_POSITION}) : OUT_OF_BOUNDS_VALUE;
    };

    const getSurroundingMines = function ({position}) {
        const countMines = (acc, currentValue) => isMine({value: currentValue}) ? ++acc : acc;
        return [
            getTopLeftValue({position}),
            getTopValue({position}),
            getTopRightValue({position}),
            getLeftValue({position}),
            getRightValue({position}),
            getBottomLeftValue({position}),
            getBottomValue({position}),
            getBottomRightValue({position})
        ].reduce(countMines, 0);
    };

    return Object.freeze({
        showMap, getLeftValue, getRightValue, getTopValue, getBottomValue,
        getTopLeftValue, getTopRightValue, getBottomLeftValue, getBottomRightValue,
        getSurroundingMines
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
    const oneFieldMap = '0';
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

test('minesweeper with one mine and one warn', (assert) => {
    const expected    = '*1';
    const minesweeper = Minesweeper({width: 2, height: 1, initialMap: '*.'});

    const map = minesweeper.showMap();

    assert.equal(map, expected, 'Map must have one mine and maps warns how many mines there are');
    assert.end();
});

test('minesweeper with one mine, one warn and an empty field', (assert) => {
    const expected    = '*10';
    const minesweeper = Minesweeper({width: 3, height: 1, initialMap: '*..'});

    const map = minesweeper.showMap();

    assert.equal(map, expected, 'Map must have one mine and maps warns how many mines there are');
    assert.end();
});

test('minesweeper can return the LEFT field value of a given field', (assert) => {
    const minesweeper = Minesweeper({width: 3, height: 2, initialMap: '*.....'});

    const expectedValueSafe = '.';
    const actualValueSafe   = minesweeper.getLeftValue({position: 2});
    assert.deepEqual(actualValueSafe, expectedValueSafe, `Left field's value is a safe position`);

    const expectedValueMine = '*';
    const actualValueMine   = minesweeper.getLeftValue({position: 1});
    assert.deepEqual(actualValueMine, expectedValueMine, `Left field's value is a mine`);

    const expectedValueOutOfBounds = '-';
    const actualValueOutOfBounds   = minesweeper.getLeftValue({position: 0});
    assert.deepEqual(actualValueOutOfBounds, expectedValueOutOfBounds, `There is no field in the left position`);

    const expectedValueOutOfBoundsSecondRow = '-';
    const actualValueOutOfBoundsSecondRow   = minesweeper.getLeftValue({position: 3});
    assert.deepEqual(actualValueOutOfBoundsSecondRow, expectedValueOutOfBoundsSecondRow, `There is no field in the left position`);


    assert.end();
});

test('minesweeper can return the RIGHT field value of a given field', (assert) => {
    const minesweeper = Minesweeper({width: 3, height: 2, initialMap: '..*...'});

    const expectedValueSafe = '.';
    const actualValueSafe   = minesweeper.getRightValue({position: 0});
    assert.deepEqual(actualValueSafe, expectedValueSafe, `Right field's value is a safe position`);

    const expectedValueMine = '*';
    const actualValueMine   = minesweeper.getRightValue({position: 1});
    assert.deepEqual(actualValueMine, expectedValueMine, `Right field's value is a mine`);

    const expectedValueOutOfBounds = '-';
    const actualValueOutOfBounds   = minesweeper.getRightValue({position: 5});
    assert.deepEqual(actualValueOutOfBounds, expectedValueOutOfBounds, `There is no field in the right position`);

    const expectedValueOutOfBoundsFirstRow = '-';
    const actualValueOutOfBoundsFirstRow   = minesweeper.getRightValue({position: 2});
    assert.deepEqual(actualValueOutOfBoundsFirstRow, expectedValueOutOfBoundsFirstRow, `There is no field in the right position`);

    assert.end();
});

test('minesweeper can return the TOP field value of a given field', (assert) => {
    const minesweeper = Minesweeper({width: 3, height: 2, initialMap: '*.....'});

    const expectedValueSafe = '.';
    const actualValueSafe   = minesweeper.getTopValue({position: 4});
    assert.deepEqual(actualValueSafe, expectedValueSafe, `Top field's value is a safe position`);

    const expectedValueMine = '*';
    const actualValueMine   = minesweeper.getTopValue({position: 3});
    assert.deepEqual(actualValueMine, expectedValueMine, `Top field's value is a mine`);

    const expectedValueOutOfBounds = '-';
    const actualValueOutOfBounds   = minesweeper.getTopValue({position: 1});
    assert.deepEqual(actualValueOutOfBounds, expectedValueOutOfBounds, `There is no field in the top position`);


    assert.end();
});

test('minesweeper can return the BOTTOM field value of a given field', (assert) => {
    const minesweeper = Minesweeper({width: 3, height: 2, initialMap: '...*..'});

    const expectedValueSafe = '.';
    const actualValueSafe   = minesweeper.getBottomValue({position: 1});
    assert.deepEqual(actualValueSafe, expectedValueSafe, `Bottom field's value is a safe position`);

    const expectedValueMine = '*';
    const actualValueMine   = minesweeper.getBottomValue({position: 0});
    assert.deepEqual(actualValueMine, expectedValueMine, `Bottom field's value is a mine`);

    const expectedValueOutOfBounds = '-';
    const actualValueOutOfBounds   = minesweeper.getBottomValue({position: 5});
    assert.deepEqual(actualValueOutOfBounds, expectedValueOutOfBounds, `There is no field in the bottom position`);


    assert.end();
});

test('minesweeper can return the TOP-LEFT field value of a given field', (assert) => {
    const minesweeper = Minesweeper({width: 3, height: 2, initialMap: '*.....'});

    const expectedValueSafe = '.';
    const actualValueSafe   = minesweeper.getTopLeftValue({position: 5});
    assert.deepEqual(actualValueSafe, expectedValueSafe, `Top-left field's value is a safe position`);

    const expectedValueMine = '*';
    const actualValueMine   = minesweeper.getTopLeftValue({position: 4});
    assert.deepEqual(actualValueMine, expectedValueMine, `Top-left field's value is a mine`);

    const expectedValueOutOfBoundsSecondRow = '-';
    const actualValueOutOfBoundsSecondRow   = minesweeper.getTopLeftValue({position: 3});
    assert.deepEqual(actualValueOutOfBoundsSecondRow, expectedValueOutOfBoundsSecondRow, `There is no field in the top-left position`);

    const expectedValueOutOfBounds = '-';
    const actualValueOutOfBounds   = minesweeper.getTopLeftValue({position: 1});
    assert.deepEqual(actualValueOutOfBounds, expectedValueOutOfBounds, `There is no field in the top-left position because you are in the first row`);

    assert.end();
});

test('minesweeper can return the TOP-RIGHT field value of a given field', (assert) => {
    const minesweeper = Minesweeper({width: 3, height: 2, initialMap: '..*...'});

    const expectedValueSafe = '.';
    const actualValueSafe   = minesweeper.getTopRightValue({position: 3});
    assert.deepEqual(actualValueSafe, expectedValueSafe, `Top-right field's value is a safe position`);

    const expectedValueMine = '*';
    const actualValueMine   = minesweeper.getTopRightValue({position: 4});
    assert.deepEqual(actualValueMine, expectedValueMine, `Top-right field's value is a mine`);

    const expectedValueOutOfBoundsSecondRow = '-';
    const actualValueOutOfBoundsSecondRow   = minesweeper.getTopRightValue({position: 5});
    assert.deepEqual(actualValueOutOfBoundsSecondRow, expectedValueOutOfBoundsSecondRow, `There is no field in the top-right position`);

    const expectedValueOutOfBounds = '-';
    const actualValueOutOfBounds   = minesweeper.getTopRightValue({position: 1});
    assert.deepEqual(actualValueOutOfBounds, expectedValueOutOfBounds, `There is no field in the top-right position because you are in the firs row`);

    assert.end();
});

test('minesweeper can return the BOTTOM-LEFT field value of a given field', (assert) => {
    const minesweeper = Minesweeper({width: 3, height: 2, initialMap: '...*..'});

    const expectedValueSafe = '.';
    const actualValueSafe   = minesweeper.getBottomLeftValue({position: 2});
    assert.deepEqual(actualValueSafe, expectedValueSafe, `Bottom-left field's value is a safe position`);

    const expectedValueMine = '*';
    const actualValueMine   = minesweeper.getBottomLeftValue({position: 1});
    assert.deepEqual(actualValueMine, expectedValueMine, `Bottom-left field's value is a mine`);

    const expectedValueOutOfBoundsFirstRow = '-';
    const actualValueOutOfBoundsFirstRow   = minesweeper.getBottomLeftValue({position: 0});
    assert.deepEqual(actualValueOutOfBoundsFirstRow, expectedValueOutOfBoundsFirstRow, `There is no field in the bottom-left position`);

    const expectedValueOutOfBounds = '-';
    const actualValueOutOfBounds   = minesweeper.getBottomLeftValue({position: 5});
    assert.deepEqual(actualValueOutOfBounds, expectedValueOutOfBounds, `There is no field in the bottom-left position because you are in the last row`);

    assert.end();
});

test('minesweeper can return the BOTTOM-RIGHT field value of a given field', (assert) => {
    const minesweeper = Minesweeper({width: 3, height: 2, initialMap: '.....*'});

    const expectedValueSafe = '.';
    const actualValueSafe   = minesweeper.getBottomRightValue({position: 0});
    assert.deepEqual(actualValueSafe, expectedValueSafe, `Bottom-right field's value is a safe position`);

    const expectedValueMine = '*';
    const actualValueMine   = minesweeper.getBottomRightValue({position: 1});
    assert.deepEqual(actualValueMine, expectedValueMine, `Bottom-right field's value is a mine`);

    const expectedValueOutOfBoundsFirstRow = '-';
    const actualValueOutOfBoundsFirstRow   = minesweeper.getBottomRightValue({position: 2});
    assert.deepEqual(actualValueOutOfBoundsFirstRow, expectedValueOutOfBoundsFirstRow, `There is no field in the bottom-right position`);

    const expectedValueOutOfBounds = '-';
    const actualValueOutOfBounds   = minesweeper.getBottomRightValue({position: 5});
    assert.deepEqual(actualValueOutOfBounds, expectedValueOutOfBounds, `There is no field in the bottom-right position because you are in the last row`);


    assert.end();
});

test('minesweeper can return how many mines are in a field\'s surroundings', (assert) => {
    const minesweeper = Minesweeper({width: 4, height: 5, initialMap: '.*...**....****....*'});

    const expectedValuePosition0 = 2;
    const actualValuePosition0   = minesweeper.getSurroundingMines({position: 0});
    assert.deepEqual(actualValuePosition0, expectedValuePosition0, `Position 0 has 2 mines in its surroundings`);

    const expectedValuePosition3 = 1;
    const actualValuePosition3   = minesweeper.getSurroundingMines({position: 3});
    assert.deepEqual(actualValuePosition3, expectedValuePosition3, `Position 3 has 1 mines in its surroundings`);

    const expectedValuePosition10 = 5;
    const actualValuePosition10   = minesweeper.getSurroundingMines({position: 10});
    assert.deepEqual(actualValuePosition10, expectedValuePosition10, `Position 10 has 5 mines in its surroundings`);

    const expectedValuePosition15 = 3;
    const actualValuePosition15   = minesweeper.getSurroundingMines({position: 15});
    assert.deepEqual(actualValuePosition15, expectedValuePosition15, `Position 15 has 3 mines in its surroundings`);

    const expectedValuePosition16 = 2;
    const actualValuePosition16   = minesweeper.getSurroundingMines({position: 16});
    assert.deepEqual(actualValuePosition16, expectedValuePosition16, `Position 16 has 2 mines in its surroundings`);

    assert.end();
});

test('minesweeper can return how many mines are in a field\'s surroundings (no mines)', (assert) => {
    const minesweeper = Minesweeper({width: 2, height: 3, initialMap: '......'});

    const expectedValuePosition = 0;
    const actualValuePosition   = minesweeper.getSurroundingMines({position: 0});
    assert.deepEqual(actualValuePosition, expectedValuePosition, `No mines in the surroundings`);

    assert.end();
});

test('minesweeper can return the map solved', (assert) => {
    const minesweeper = Minesweeper({width: 4, height: 3, initialMap: '.*...**....****....*'});

    const expectedMap = '2*31\n2**2\n355*\n***3\n233*';
    const actualMap   = minesweeper.showMap();
    assert.deepEqual(actualMap, expectedMap, `Map is solved`);

    assert.end();
});
