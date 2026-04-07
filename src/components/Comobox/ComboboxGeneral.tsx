"use client";

import { useState } from "react";

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { Button } from "@/components/misUI/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/misUI/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/misUI/popover";

import { cn } from "@/lib/utils";

type props = {
  data: { value: string; label: string }[];
  placeholder?: string;
  valor?: string;
  onValueChange?: (value: string) => void;
};

export default function ComboboxGeneral({
  data,
  placeholder,
  valor,
  onValueChange,
}: props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(valor || "");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full max-w-xs justify-between"
          aria-label="Framework combobox"
        >
          {value
            ? data.find((dato) => dato.value === value)?.label
            : placeholder}
          <ChevronsUpDownIcon className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{placeholder}</CommandEmpty>
            <CommandGroup>
              {data.map((dato) => (
                <CommandItem
                  key={dato.value}
                  value={dato.value}
                  onSelect={(currentValue) => {
                    const newValue = currentValue === value ? "" : currentValue;
                    setValue(newValue);
                    setOpen(false);
                    onValueChange?.(newValue);
                  }}
                >
                  {dato.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto",
                      value === dato.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
