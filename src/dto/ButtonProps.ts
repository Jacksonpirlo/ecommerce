import { StaticImageData } from "next/image";
import { JSX, ReactNode } from "react";

export interface ButtonProps {
    className: string;
    text: string | ReactNode;
    onClick?: () => void;
    children?: JSX.Element;
    icon?: StaticImageData | string;
    disabled?: boolean;
}