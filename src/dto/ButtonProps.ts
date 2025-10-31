import { StaticImageData } from "next/image";
import { JSX } from "react";

export interface ButtonProps {
    className: string;
    text: string;
    onClick: () => void;
    children?: JSX.Element;
    icon?: StaticImageData | string
}