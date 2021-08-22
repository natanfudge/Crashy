import {deflattenStyle, ElementProps} from "./Element";

export interface ImageProps extends ElementProps {
    alt: string;
    src: string | undefined;
}

export function Image(props: ImageProps) {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...deflattenStyle(props)}/>
}