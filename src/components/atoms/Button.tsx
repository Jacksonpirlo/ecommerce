import { ButtonProps } from "@/dto/ButtonProps";
import Image from "next/image";

const Button = ({className, text, onClick, icon,children}: ButtonProps) => {
    return (
        <button className={className} onClick={onClick}>
            <>
                {text} {children} {icon && (typeof icon === "string"
                    ? <Image src={icon} alt="" />
                    : <Image src={icon.src} alt="" width={icon.width} height={icon.height} />)}
            </>
        </button>
    )
}

export default Button;