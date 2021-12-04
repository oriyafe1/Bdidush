const UNARY_ACTIONS = {
    NOT: '⨼',
};

export const UNARY_ACTIONS_STRING = Object.values(UNARY_ACTIONS).join('');

const BINARY_ACTIONS = {
    OR: '∨',
    AND: '∧',
    XOR: '⨁',
    IMPLICATION: '⟶',
    EQUIVALENCE: '⟷',
    NAND: '↑',
    NOR: '↓',
};

const BINARY_ACTIONS_STRING = Object.values(BINARY_ACTIONS).join('');

const ACTIONS = { ...UNARY_ACTIONS, ...BINARY_ACTIONS };

const ACTIONS_STRING = Object.values(ACTIONS).join('');

const ACTION_PRIORITIES = {
    [ACTIONS.NOT]: 0,
    [ACTIONS.AND]: 1,
    [ACTIONS.OR]: 2,
    [ACTIONS.IMPLICATION]: 3,
    [ACTIONS.XOR]: 4,
    [ACTIONS.EQUIVALENCE]: 4,
    [ACTIONS.NOR]: 5,
    [ACTIONS.NAND]: 5,
};

const OPEN_PARENTHESES = '(';
const CLOSE_PARENTHESES = ')';
const ALLOWED_PARAGRAPHS = 'pqrs';

export const allowedCharacters =
    ALLOWED_PARAGRAPHS + ACTIONS_STRING + OPEN_PARENTHESES + CLOSE_PARENTHESES;

const actionToFunc = {
    [ACTIONS.NOT]: a => !a,
    [ACTIONS.OR]: (a, b) => a || b,
    [ACTIONS.AND]: (a, b) => a && b,
    [ACTIONS.XOR]: (a, b) => (a ? !b : b),
    [ACTIONS.IMPLICATION]: (a, b) => !a || b,
    [ACTIONS.EQUIVALENCE]: (a, b) => (a ? b : !b),
    [ACTIONS.NAND]: (a, b) => !(a && b),
    [ACTIONS.NOR]: (a, b) => !(a || b),
};

export const POS_RESULT_KEY = 'result';

export const isOnlyAllowedChars = (str = '') =>
    [...str].reduce(
        (isAllowed, currChar) =>
            isAllowed && allowedCharacters.includes(currChar),
        true
    );

const getActionsOutOfParentheses = (paragraph = '') => {
    const parenthesesIndexes = [];
    const actionsOutOfParentheses = [];

    for (let charIndex = 0; charIndex < paragraph.length; charIndex++) {
        const char = paragraph[charIndex];
        if (char === OPEN_PARENTHESES) {
            parenthesesIndexes.push(charIndex);
        } else if (char === CLOSE_PARENTHESES) {
            if (!parenthesesIndexes.length)
                throw Error('Your pasuk is invalid');

            parenthesesIndexes.pop();
        } else if (
            !parenthesesIndexes.length &&
            BINARY_ACTIONS_STRING.includes(char)
        ) {
            actionsOutOfParentheses.push(charIndex);
        }
    }

    return actionsOutOfParentheses;
};

const findLastAction = (paragraph = '') => {
    const actionsOutOfParentheses = getActionsOutOfParentheses(paragraph);

    actionsOutOfParentheses.sort(
        (action1Index, action2Index) =>
            ACTION_PRIORITIES[paragraph[action2Index]] -
            ACTION_PRIORITIES[paragraph[action1Index]]
    );

    return actionsOutOfParentheses.length ? actionsOutOfParentheses[0] : -1;
};

const getPosParagraphs = pos =>
    Object.keys(pos).filter(key => key !== POS_RESULT_KEY);

const mergePossibilites = (
    posArr1 = [],
    posArr2 = [],
    mergeAction = (_a, _b) => {}
) => {
    const mergedPosArr = [];

    posArr1.forEach((currPos1 = {}) => {
        const pos1Pars = getPosParagraphs(currPos1);

        posArr2.forEach((currPos2 = {}) => {
            const pos2Pars = getPosParagraphs(currPos2);
            const newPos = { ...currPos1 };
            let parValueMismatch = false;

            for (
                let pos2ParIndex = 0;
                pos2ParIndex < pos2Pars.length && !parValueMismatch;
                pos2ParIndex++
            ) {
                const currPos2Par = pos2Pars[pos2ParIndex];

                parValueMismatch =
                    pos1Pars.includes(currPos2Par) &&
                    currPos1[currPos2Par] !== currPos2[currPos2Par];
                newPos[currPos2Par] = currPos2[currPos2Par];
            }

            if (!parValueMismatch) {
                newPos[POS_RESULT_KEY] = mergeAction(
                    currPos1[POS_RESULT_KEY],
                    currPos2[POS_RESULT_KEY]
                );

                mergedPosArr.push(newPos);
            }
        });
    });

    return mergedPosArr;
};

export const calcPossibilities = (paragraph = '') => {
    if (paragraph.length === 1) {
        if (!ALLOWED_PARAGRAPHS.includes(paragraph)) {
            throw new Error(
                `ur dumb how dafuq is ${paragraph} supposed to represent a pargraph. Out of here with this BS`
            );
        }

        return [
            { [paragraph]: false, [POS_RESULT_KEY]: false },
            { [paragraph]: true, [POS_RESULT_KEY]: true },
        ];
    }

    const lastActionIndex = findLastAction(paragraph);

    if (lastActionIndex === -1) {
        return calcPossibilities(paragraph.substring(1, paragraph.length - 1));
    } else {
        return mergePossibilites(
            calcPossibilities(paragraph.substring(0, lastActionIndex)),
            calcPossibilities(
                paragraph.substring(lastActionIndex + 1, paragraph.length)
            ),
            actionToFunc[paragraph[lastActionIndex]]
        );
    }
};
