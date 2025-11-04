import { labelProps } from "../../dto/form.types";

const Label = ({className, placeHolder, value}: labelProps) => {
    return(<><input placeholder={placeHolder} className={className} value={value} type="text" /></>)
}

export default Label;