"use client";

import { useState, useRef, useEffect, useContext } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { Context } from "/app/providers";
import useAsyncEffect from "use-async-effect";

export const SearchInput = ({ label, alias, nFields, placeholder }) => {
  const ctx = useContext(Context);

  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(null);
  const [value, setValue] = useState(false);
  const [fieldColor, setFieldColor] = useState("default");
  const [valuePlaceholder, setValuePlaceholder] = useState("");

  const field = useRef(alias ? alias : label ?? "");
  const fieldTable = useRef(ctx.table ?? "");
  const timeoutID = useRef(0);

  const fieldRow = ctx.row;
  const fieldsNumber = nFields;

  const populate = async () => {
    let parts = await fetch(
      `https://parts.auger.org.ar/api/associated/${field.current}`,
    );

    parts = (await parts.json())?.data;

    if (Array.isArray(parts)) {
      for (const part of parts) {
        setItems((prevItems) => [
          ...prevItems,
          {
            label: `${part.Name}: ${part.ID}`,
            key: `${part.ID}:${part.Name}`,
          },
        ]);
      }
    }

    setIsOpen(true);
  };

  useEffect(() => {
    if (!ctx.valuesObject[fieldRow]) ctx.valuesObject[fieldRow] = {};

    if (placeholder) setValuePlaceholder(placeholder);
  }, []);

  return (
    <div className="lg:w-1/6 md:w-1/4 sm:w-1/2 animate__animated animate__fadeInDown">
      <Autocomplete
        color={fieldColor}
        isRequired
        defaultItems={items}
        label={field.current}
        placeholder={valuePlaceholder}
        onOpenChange={async (state, action) => isOpen ?? (await populate())}
        onSelectionChange={(key) => {
          let rowsValues = ctx.valuesObject[fieldRow];

          rowsValues[label] = parseInt(key?.split(":")[0]);

          console.log(
            `Filled ${Object.values(rowsValues).length} from ${nFields}`,
          );

          if (
            Object.values(rowsValues).length === fieldsNumber ||
            valuePlaceholder
          ) {
            clearTimeout(timeoutID.current);

            if (valuePlaceholder) rowsValues["Update"] = "true";

            timeoutID.current = setTimeout(async () => {
              const formData = new FormData();

              for (const key in rowsValues) {
                if (Object.hasOwnProperty.call(rowsValues, key)) {
                  let value = rowsValues[key];

                  formData.append(`${key}:${typeof value}:0`, value);
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
              field.current = "Parte ingresada!";
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
