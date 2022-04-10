const NON_WORD = /[^0-9a-zа-яёA-ZА-ЯЁ]/gi;
const NON_NUMBERS = /[^0-9]/gi;

function validGroup(s: string) {
    if (typeof s != 'string') return '';
    return s.toUpperCase().replace(NON_WORD, '').slice(0, 6);
}

function validId(s: string) {
    if (typeof s != 'string') return '';
    return s.replace(NON_NUMBERS, '');
}

export { NON_WORD, NON_NUMBERS, validGroup, validId}