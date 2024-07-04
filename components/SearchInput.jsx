"use client";

import { useState, useRef, useEffect, useContext } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete"
import { Context } from "/app/page"
import useAsyncEffect from 'use-async-effect'

export const SearchInput = ({label,nFields}) => {
  
    const ctx = useContext(Context)

    const [items, setItems] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState(false)
    const [fieldColor, setFieldColor] = useState("default")
    
    const field = useRef(label ?? "")
    const fieldTable = useRef(ctx.table ?? "")
    const timeoutID = useRef(0)
    
    const fieldRow = ctx.row
    const fieldsNumber = nFields

    useEffect(()=>{

        ctx.valuesObject[fieldRow] = {}
    },[])

    useAsyncEffect(async ()=>{

        if(isOpen){

            let parts = await fetch(`http://127.0.0.1:3000/api/associated/${field.current}`)
            parts = (await parts.json())?.data 

            console.log("### ASSOCIATIVE DATA ###")
            console.log(parts)

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
            onSelectionChange={(key) => { 
                
                let rowsValues = ctx.valuesObject[fieldRow]
                
                rowsValues[field.current] = key

                console.log(ctx)

                if(Object.values(rowsValues).length === fieldsNumber){

                    clearTimeout(timeoutID.current)
                    
                    timeoutID.current = setTimeout(async ()=>{
                      
                        const formData = new FormData()
                          
                          for (const key in rowsValues) {
                              if (Object.hasOwnProperty.call(rowsValues, key)) {
                                  
                                formData.append(`${key}:${typeof rowsValues[key]}`, rowsValues[key])
                              }
                          }
                        
                        //Make Miguel responsible for all muahahaha
                        formData.append("UserID", 39)

                        const postResult = await fetch(`http://127.0.0.1:3000/api/table/${fieldTable.current}`,{
                            method: 'POST',
                            body: formData,
                        })

                      setFieldColor("success")
                      setFieldLabel("Parte ingresada!")
                    },10000)
                }
            }}
        >
            {(element) => <AutocompleteItem key={element.key}>{element.label}</AutocompleteItem>}
        </Autocomplete>
    </div>
  );
}