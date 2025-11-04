import { labelProps } from "../../dto/form.types";
import Input from "../atoms/Input";
import Label from "../atoms/Label";

const FormItems = ({className, text}: labelProps) => {
    return(
    <>
    <div>
        <Label className={className} text="" />
        <Input className={className} value="" placeHolder="" />
    </div>
    </>
    )
}

export default FormItems;