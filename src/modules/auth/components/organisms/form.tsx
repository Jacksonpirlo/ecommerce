"use client";

import { FormItems } from "../../dto/form.types";
import Button from "@/components/atoms/Button";
import { Spinner } from "@heroui/react";
import { signIn } from "next-auth/react";
import { useState } from "react";

type InputProps = {
  name: string;
  placeHolder: string;
  value: string;
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

type FormProps = {
  fields: InputProps[];
  titleOfTheForm: string;
  onClick: () => void;
  btnText: React.ReactNode; // <-- Cambia aquí
  btnDisabled?: boolean;
  className?: string;
  placeholder?: string;
  value: string;
};

const Form = ({
  fields,
  titleOfTheForm,
  onClick,
  btnText,
  btnDisabled,
  className,
  isLogin = false,
}: FormProps & { isLogin?: boolean }) => {
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
        {fields?.map((field, idx) => (
          <input
            key={idx}
            name={field.name} // <-- ¡ESTO ES CLAVE!
            value={field.value}
            type={field.type}
            onChange={field.onChange}
            placeholder={field.placeHolder}
            className="mb-4 w-full px-3 py-2 border rounded"
            autoComplete="off"
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
