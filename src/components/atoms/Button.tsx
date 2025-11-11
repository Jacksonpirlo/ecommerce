import { ButtonProps } from "@/dto/ButtonProps";
import Image from "next/image";

const Button = ({className, text, onClick, icon, children, disabled}: ButtonProps) => {
    return (
        <button 
            className={className} 
            onClick={onClick}
            disabled={disabled}
            type="submit"
        >
            <span className="flex items-center justify-center gap-2">
                {text} {children} {icon && (typeof icon === "string"
                    ? <Image src={icon} alt="" />
                    : <Image src={icon.src} alt="" width={icon.width} height={icon.height} />)}
            </span>
        </button>
    )
}

export default Button;