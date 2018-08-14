import { removeSName } from '../src/js/filterNames';

describe('Testing the function which removes names starting with the letter S', () => {
    it('should remove all names starting with S', () => {
        const names = ['Scott', 'Simmon', 'Courtney'];
        expect(removeSName(names)).toContain('Courtney');
        expect(removeSName(names)).not.toContain('Simmon');
    });

    it('should account for case', () => {
        const names = ['scott', 'Simmon', 'kim'];
        expect(removeSName(names)).toContain('kim');
        expect(removeSName(names)).not.toContain('scott');
        expect(removeSName(names)).not.toContain('Simmon');

    });

    it('should not remove other names', () => {
        const names = ['siri', 'Simmon', 'kim', 'welsh'];
        expect(removeSName(names)).toContain('kim');
        expect(removeSName(names)).toContain('welsh');
    });
});