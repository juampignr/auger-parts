"use client";

import { useState, useRef, useEffect, useContext } from "react";
import { Input } from "@nextui-org/input";
import { Context } from "/app/providers";

export const AutoInput = ({
  label,
  alias,
  required,
  regex,
  nFields,
  placeholder,
}) => {
  const ctx = useContext(Context);

  const fieldRow = ctx.row;
  const fieldRegex = regex ?? /\w.*/i;
  const fieldsNumber = nFields;

  const fieldTable = useRef(ctx.table);
  const timeoutID = useRef(0);

  useEffect(() => {
    if (!ctx.valuesObject[fieldRow]) ctx.valuesObject[fieldRow] = {};

    if (placeholder) setValuePlaceholder(placeholder);
  }, []);

  const isRequired = label === "Name" || required ? true : false;

  const [isInvalid, setIsInvalid] = useState(false);
  const [fieldColor, setFieldColor] = useState("default");

  const [fieldLabel, setFieldLabel] = useState(alias ? alias : label ?? "");
  const [valuePlaceholder, setValuePlaceholder] = useState(false);

  return (
    <div className="lg:w-1/6 md:w-1/4 sm:w-1/2 animate__animated animate__fadeInDown">
      <Input
        color={fieldColor}
        isRequired={isRequired}
        isInvalid={isInvalid}
        placeholder={valuePlaceholder}
        type="text"
        label={`${fieldLabel}`}
        onChange={(event) => {
          console.log(`Testing ${event.target.value} against ${regex}`);
          if (
            !event.target.value.includes(",") &&
            !fieldRegex.test(event.target.value)
          ) {
            setIsInvalid(true);
          } else {
            let rowsValues = ctx.valuesObject[fieldRow];

            rowsValues[label] = event.target.value;

            console.log(ctx);

            console.log(
              `Filled ${Object.values(rowsValues).length} out of ${fieldsNumber})`,
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
                    let template = 0;
                    console.log(rowsValues["Avail"]);
                    if (value.includes("#") && rowsValues["Avail"] > 1) {
                      template = 1;
                      console.log(`Template found on ${key}!: ${value}`);
                    }

                    formData.append(
                      `${key}:${typeof value}:${template}`,
                      value,
                    );
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

            setIsInvalid(false);
          }
        }}
      />
    </div>
  );
};
