import { inputProps } from "../../dto/form.types";

const Input = ({className, placeHolder, value}: inputProps) => {
    return(<><input placeholder={placeHolder} className={className} value={value} type="text" /></>)
}

export default Input;