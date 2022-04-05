const NON_WORD = /[^0-9a-zа-яёA-ZА-ЯЁ]/gi;

function validGroup(s: string) {
    if (typeof s != 'string') return '';
    return s.toUpperCase().replace(NON_WORD, '').slice(0, 6);
}

export { NON_WORD, validGroup }