import { ReactNode } from "react";

export interface labelProps {
    text: string;
    className: string;
}

export interface inputProps {
    placeHolder?: string;
    text?: string;
    value: string;
    label?: string
    type?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}
export interface FormItems {
    titleOfTheForm: string;
    onClick?: ()=> void;
    fields: inputProps[];
    className: string;
    btnText: ReactNode;
    placeholder: string;
    value: string;
    btnDisabled?: boolean;
}