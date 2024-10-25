"use client";

import { useState, useRef, useEffect, useContext } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { Context } from "/app/providers";
import useAsyncEffect from "use-async-effect";

export const SearchInput = ({ label, alias, nFields, placeholder }) => {
  const ctx = useContext(Context);

  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const [value, setValue] = useState(false);
  const [fieldColor, setFieldColor] = useState("default");
  const [valuePlaceholder, setValuePlaceholder] = useState("");

  const field = useRef(alias ? alias : label ?? "");
  const fieldTable = useRef(ctx.table ?? "");
  const timeoutID = useRef(0);

  const fieldRow = ctx.row;
  const fieldsNumber = nFields;

  useEffect(() => {
    if (!ctx.valuesObject[fieldRow]) ctx.valuesObject[fieldRow] = {};

    if (placeholder) setValuePlaceholder(placeholder);
  }, []);

  useAsyncEffect(async () => {
    let parts = await fetch(
      `https://parts.auger.org.ar/api/associated/${field.current}`,
    );

    parts = (await parts.json())?.data;

    console.log(parts);
    for (const part of parts) {
      setItems((prevItems) => [
        ...prevItems,
        { label: part.Name, key: part.ID },
      ]);
    }
  }, [isOpen]);

  return (
    <div className="lg:w-1/6 md:w-1/4 sm:w-1/2 animate__animated animate__fadeInDown">
      <Autocomplete
        color={fieldColor}
        isRequired
        defaultItems={items}
        label={field.current}
        placeholder={valuePlaceholder ?? field.current}
        onOpenChange={(state, action) =>
          !isOpen ? setIsOpen(true) : setIsOpen(false)
        }
        onSelectionChange={(key) => {
          let rowsValues = ctx.valuesObject[fieldRow];

          rowsValues[label] = key;
          console.log(ctx);

          if (Object.values(rowsValues).length === fieldsNumber) {
            clearTimeout(timeoutID.current);

            timeoutID.current = setTimeout(async () => {
              const formData = new FormData();

              for (const key in rowsValues) {
                if (Object.hasOwnProperty.call(rowsValues, key)) {
                  let value = rowsValues[key];
                  let template = 0;

                  if (value.includes("#") && rowsValues["Avail"] > 1) {
                    template = 1;
                    console.log(`Template found on ${key}!: ${value}`);
                  }

                  formData.append(`${key}:${typeof value}:${template}`, value);
                }
              }

              //Make Miguel responsible for all muahahaha
              formData.append("UserID:string:0", 39);

              const postResult = await fetch(
                `https://parts.auger.org.ar/api/table/${fieldTable.current}`,
                {
                  method: "POST",
                  body: formData,
                },
              );

              setFieldColor("success");
              setFieldLabel("Parte ingresada!");
            }, 10000);
          }
        }}
      >
        {(element) => (
          <AutocompleteItem key={element.key}>{element.label}</AutocompleteItem>
        )}
      </Autocomplete>
    </div>
  );
};
