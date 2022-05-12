// import file
const { format_date } = require('../utils/helpers');

// test 
test('format_date() returns a date string', () => {
    const date = new Date('2022-05-12 16:12:03');
    expect(format_date(date)).toBe('5/12/2022');
});