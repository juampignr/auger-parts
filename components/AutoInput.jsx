"use client";

import { useState, useRef, useEffect, useContext } from "react";
import { Input } from "@nextui-org/input"
import { Context } from "/app/page"


export const AutoInput = ({label,required,regex,nFields}) => {

    const ctx = useContext(Context)

    const fieldRow = ctx.row
    const fieldRegex = regex ?? /\w.*/i
    const fieldsNumber = nFields

    const fieldTable = useRef(ctx.table)
    const timeoutID = useRef(0)

    useEffect(()=>{

        ctx.valuesObject[fieldRow] = {}
    },[])

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

                console.log(`Testing ${event.target.value} against ${regex}`)
                if(!fieldRegex.test(event.target.value)){

                  setIsInvalid(true)               
                }else{

                  let rowsValues = ctx.valuesObject[fieldRow]

                  rowsValues[fieldLabel] = event.target.value                  

                  console.log(ctx)

                  console.log(`Filled ${Object.values(rowsValues).length} out of ${fieldsNumber})`)
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

                  setIsInvalid(false)
                }
            }}/>
          </div>
}