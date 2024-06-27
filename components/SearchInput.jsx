"use client";

import { useState, useRef, useEffect } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete"
import useAsyncEffect from 'use-async-effect'

export const SearchInput = ({row,values,label,nFields}) => {
  
    const [items, setItems] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState(false)
    const [fieldColor, setFieldColor] = useState("default")

    const rowsValues = values 

    const field = useRef(label ?? "")
    const fieldRow = row
    const fieldsNumber = nFields

    useAsyncEffect(async ()=>{

        if(isOpen){

            let parts = await fetch(`http://127.0.0.1:3000/api/associated/${field.current}`)
            parts = (await parts.json())?.data 

            for (const part of parts) {
                setItems((prevItems) => [...prevItems,{label:part.Name,key:part.ID}])
            }

        }

    },[isOpen])

  return (
    <div className="lg:w-1/6 md:w-1/4 sm:w-1/2 animate__animated animate__fadeInDown">
        <Autocomplete
            color={fieldColor}
            isRequired
            defaultItems={items}
            label={field.current}
            placeholder={field.current}
            onOpenChange={(state,action) => !isOpen ? setIsOpen(true) : isOpen}
            onInputChange={(value) => { 
                
                if(!rowsValues.current[fieldRow])
                    rowsValues.current[fieldRow] = {}

                rowsValues.current[fieldRow][field.current] = value

                if(Object.values(rowsValues.current[fieldRow]).length === fieldsNumber){

                    setTimeout(()=>{
                        setFieldColor("success")
                        field.current = "Listo!"
                    },10000)
                }
            }}
        >
            {(element) => <AutocompleteItem key={element.key}>{element.label}</AutocompleteItem>}
        </Autocomplete>
    </div>
  );
}