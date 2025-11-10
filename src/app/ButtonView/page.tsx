'use client';

import Button from "@/components/atoms/ButtonT";

export default function Demo() {
  const handleClick = () => alert('Clicked!');
  return <Button label="Click me" onClick={handleClick} />;
}