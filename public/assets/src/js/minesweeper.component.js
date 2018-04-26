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
            {finalMap: initialMap.split('').reduce(solveMinesweeper, '')}
        );
    };

    const buildBoard = function ({finalMap}) {
        const putBreakLines = (acc, curr, index) =>
            acc += 0 < index && 0 === index % parseInt(width) ? BREAK_LINE + curr : curr;

        return finalMap.split('').reduce(putBreakLines, '');
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

export default Minesweeper;