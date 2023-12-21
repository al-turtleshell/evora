import { MiscueCode, get } from '@turtleshell/daedelium';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';

it('should return value', () => {
    const values = {
        key: 'value'
    };

    const result = get(values)('key');

    expect(result).toEqual(E.right('value'));
})

it('should return Miscue when value is undefined', () => {
    const values = {
        anotherKey: 'value'
    };

    pipe(
        get(values)('key'),
        E.mapLeft((e) => {
            expect(e.code).toEqual(MiscueCode.CANNOT_GET_ENV_VARIABLE)}
        ),
    )

})