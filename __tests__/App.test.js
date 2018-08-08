import { hello } from './App';



describe('Testing the string with hello', () => {
    it('Should output hello', () => {
        expect(hello()).toBe('hello');

    });
});