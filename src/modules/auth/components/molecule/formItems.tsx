type FormItemProps = {
  placeHolder: string;
  value: string;
  text?: string;
  className?: string;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const FormItem = ({ placeHolder, value, text, className, type = "text", onChange }: FormItemProps) => {
  return (
    <div className="flex flex-col w-full items-center">
      {text && <label className="mb-2 text-sm font-medium text-gray-700">{text}</label>}
      <input
        type={type}
        placeholder={placeHolder}
        value={value}
        onChange={onChange}
        className={`w-[300px] border-0 border-b border-gray-300 focus:border-green-500 focus:ring-0 outline-none ${className}`}
      />
    </div>
  );
};

export default FormItem;
