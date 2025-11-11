import { labelProps } from "../../dto/form.types";

const Label = ({className, text}: labelProps) => {
    return(<><label htmlFor="" className={className}>{text}</label></>)
}

export default Label;