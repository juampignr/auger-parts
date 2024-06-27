"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@nextui-org/input"

export const AutoInput = ({row,values,label,required,regex,nFields}) => {

    const fieldRow = row
    const fieldRegex = regex ?? /\w.*/i
    const fieldsNumber = nFields

    const rowsValues = values

    const isRequired = label === "Name" || required ? true : false
    
    const [isInvalid, setIsInvalid] = useState(false)
    const [fieldColor, setFieldColor] = useState("default")
    const [fieldLabel, setFieldLabel] = useState(label ?? "")


    return <div className="lg:w-1/6 md:w-1/4 sm:w-1/2 animate__animated animate__fadeInDown">
            <Input 
              color={fieldColor}
              isRequired={isRequired} 
              isInvalid={isInvalid}
              type="text" 
              label={`${fieldLabel}`} 
              onChange={(event) => {

                if(!fieldRegex.test(event.target.value)){

                  setIsInvalid(true)               
                }else{

                  if(!rowsValues.current[fieldRow])
                    rowsValues.current[fieldRow] = {}

                  rowsValues.current[fieldRow][fieldLabel] = event.target.value
                  console.log(Object.values(rowsValues.current[fieldRow]).length) 
                  
                  console.log(`Filled ${Object.values(rowsValues.current[fieldRow]).length} of ${fieldsNumber}`)

                  if(Object.values(rowsValues.current[fieldRow]).length === fieldsNumber){

                    setTimeout(()=>{
                      setFieldColor("success")
                      setFieldLabel("Parte ingresada!")
                    },10000)
                  }

                  setIsInvalid(false)
                }
            }}/>
          </div>
}