import { Miscue } from '@turtleshell/daedelium';
import { Either, map, mapLeft, fold } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';

type Props<T> = {
    data: Either<Miscue, T>;
    renderSuccess: (data: T) => JSX.Element;
    conditionalRender?: (data: T) => boolean;
    renderError?: (error: Miscue) => JSX.Element;
    onSuccess?: (data: T) => void;
    onError?: (error: Miscue) => void;
}

export default function Render<T>({
    data,
    renderSuccess,
    conditionalRender,
    renderError,
    onSuccess,
    onError
}: Props<T>) {
    return pipe(
        data,
        map(data => {
            if (onSuccess) {
                onSuccess(data);
            }
            
            if (conditionalRender && !conditionalRender(data)) {
                return null
            }

            return renderSuccess(data);
        }),
        mapLeft(error => {
            if (onError) {
                onError(error);
            }
            if (renderError) {
                return renderError(error);
            }
            return <div>Error</div>;
        }),
        fold(
            errorComponent => errorComponent,
            successComponent => successComponent
        )
    );
}