import { FormItems } from "../../dto/form.types";
import FormItem from "../molecule/formItems";
import Button from "@/components/atoms/Button";
import { Spinner } from "@heroui/react";

import { signIn } from "next-auth/react";
import { useState } from "react";

const Form = ({
  fields,
  titleOfTheForm,
  onClick,
  className,
  btnText,
  isLogin = false,
  btnDisabled = false,
}: FormItems & { isLogin?: boolean }) => {
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    await signIn("google");
  };
  return (
    <div className={`flex flex-col justify-center items-center gap-7 text-black ${className}`}>
      <h1 className="font-extrabold text-2xl text-center m-2 text-green-700">
        {titleOfTheForm}
      </h1>

      <form
        className="flex flex-col justify-center items-center gap-7 text-black"
        onSubmit={(e) => {
          e.preventDefault();
          if (onClick) {
            onClick();
          }
        }}
      >
        {fields?.map((formItem: any, index: any) => (
          <FormItem
            key={index}
            placeHolder={formItem.placeHolder}
            value={formItem.value}
            text=""
            className="w-[300px] border-0 border-b border-gray-300 focus:border-green-500 focus:ring-0 outline-none"
            type={formItem.type}
            onChange={formItem.onChange}
          />
        ))}

        <Button 
          className="flex items-center justify-center gap-2 px-4 py-2 w-[300px] text-white border bg-green-700 rounded-md hover:bg-green-400 transition disabled:opacity-50 disabled:cursor-not-allowed" 
          text={btnText}
          disabled={btnDisabled}
        />

        {isLogin && (
          <>
            <div className="flex items-center w-[300px] my-2">
              <div className="grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500 text-sm">o</span>
              <div className="grow border-t border-gray-300"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="flex items-center justify-center gap-2 px-4 py-2 w-[300px] bg-white text-green-700 border border-green-700 rounded-md hover:bg-green-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <Spinner size="sm" color="success" />
              ) : (
                <span>Iniciar con Google</span>
              )}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default Form;
