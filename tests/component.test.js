import test from 'tape';

// COMPONENTS ------------------------------------------------------------------

const Minesweeper = function ({width, height, initialMap = ''}) {

    const MINE_VALUE          = '*';
    const SAFE_FIELD_VALUE    = '.';
    const OUT_OF_BOUNDS_VALUE = '-';

    let next_field = '.';

    const LAST_POSITION   = initialMap.length - 1;
    const LEFT_POSITION   = -1;
    const RIGHT_POSITION  = 1;
    const TOP_POSITION    = (width * -1);
    const BOTTOM_POSITION = width;

    const showMap = function () {
        return initialMap.split('').reduce(buildMap, '');
    };

    const buildMap = function (acc, field) {
        if (isMine(field)) {
            acc += manageMine();
        }
        else if (next_field === '1') {
            acc += manageWarn();
        }
        else {
            acc += '.';
        }

        return acc;
    };

    const manageMine = function () {
        next_field = '1';
        return MINE_VALUE;
    };

    const manageWarn = function () {
        next_field = '.';
        return '1';
    };

    const isMine = function (field) {
        return field === MINE_VALUE;
    };

    const safePositions = function ({map = initialMap, ...rest} = {}) {
        const addIndexIfSafePosition = (acc, value, index) => SAFE_FIELD_VALUE === value ? acc.concat(index) : acc;
        return Object.freeze({
            safePositions: map.split('').reduce(addIndexIfSafePosition, []),
            ...rest
        });
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

    const getRightValue = function ({position = initialMap.length} = {}) {
        return isTheSameRow({currentPosition: position, positionToReach: RIGHT_POSITION}) ?
            getAfterValue({currentPosition: position, positionToReach: RIGHT_POSITION}) : OUT_OF_BOUNDS_VALUE;
    };

    const getBottomPosition = function ({position = initialMap.length} = {}) {
        return getAfterValue({currentPosition: position, positionToReach: BOTTOM_POSITION});
    };

    return Object.freeze({
        showMap, safePositions, getLeftValue, getRightValue, getTopValue, getBottomPosition
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

test('minesweeper with one mine and one warn', (assert) => {
    const expected    = '*1';
    const minesweeper = Minesweeper({width: 2, height: 1, initialMap: '*.'});

    const map = minesweeper.showMap();

    assert.equal(map, expected, 'Map must have one mine and maps warns how many mines there are');
    assert.end();
});

test('minesweeper with one mine, one warn and an empty field', (assert) => {
    const expected    = '*1.';
    const minesweeper = Minesweeper({width: 3, height: 1, initialMap: '*..'});

    const map = minesweeper.showMap();

    assert.equal(map, expected, 'Map must have one mine and maps warns how many mines there are');
    assert.end();
});

test('minesweeper can return position of no mine fields', (assert) => {
    const expected    = [0, 3, 4];
    const minesweeper = Minesweeper({width: 5, height: 1, initialMap: '.**..'});

    const {safePositions} = minesweeper.safePositions();

    assert.deepEqual(safePositions, expected, 'We can know the position of the safe fields');
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
    const actualValueSafe   = minesweeper.getBottomPosition({position: 1});
    assert.deepEqual(actualValueSafe, expectedValueSafe, `Bottom field's value is a safe position`);

    const expectedValueMine = '*';
    const actualValueMine   = minesweeper.getBottomPosition({position: 0});
    assert.deepEqual(actualValueMine, expectedValueMine, `Bottom field's value is a mine`);

    const expectedValueOutOfBounds = '-';
    const actualValueOutOfBounds   = minesweeper.getBottomPosition({position: 5});
    assert.deepEqual(actualValueOutOfBounds, expectedValueOutOfBounds, `There is no field in the bottom position`);


    assert.end();
});
