"use client"

import { Image } from "@nextui-org/image"
import { Select, SelectItem } from "@nextui-org/select"
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete"
import { Input } from "@nextui-org/input"
import { Divider } from "@nextui-org/divider"
import { useState,useRef,useEffect } from "react"
import { useAsyncEffect } from "use-async-effect"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { randomBytes } from "crypto"
import { SearchInput } from "/components/SearchInput"
import { AutoInput } from "/components/AutoInput"

import { fieldRegex } from "/json/fieldRegex.js"

import chalk  from "chalk"
import augerLogo from "/images/logo.jpg"

let show = (arg) => {

  switch(typeof arg){

      case "string":

          console.log(chalk.inverse(arg))
          break

      case "object":

          console.log(arg)
          break
      
      case "function":

          console.log(arg)
          break
      
      default:

          console.log(chalk.bold(arg))
          break
  }

}

let debug = (arg) => {

  switch(typeof arg){

      case "string":

          console.log(chalk.red.underline(arg))
          break

      case "object":

          console.log(arg)
          break

      case "function":

          console.log(arg)
          break
      
      default:

          console.log(chalk.red.underline(arg))
          break
  }

}

let warn = (arg) => {

  switch(typeof arg){

      case "string":

          console.log(chalk.bgRed.inverse(arg))
          break

      case "object":

          console.log(arg)
          break
      
      case "function":

          console.log(arg)
          break

      default:

          console.log(chalk.bgRed(arg))
          break
  }

}


export default function Home() {

  const [parts, setParts] = useState([])
  const [selectedPart, setSelectedPart] = useState(false)
  const [rawFields, setRawFields] = useState([])
  const [fields, setFields] = useState([])
  const [rows, setRows] = useState([])
  const [rowsCounter, setRowsCounter] = useState(0)

  const valuesObject = useRef({})
  const parentRef = useRef(false)

  function handleAddPart(event){

    setRowsCounter(element=> element+1)
    populateFields(rawFields)
  }

  async function handleSelection(event){

    const field = event.target.value
    
    let parts = await fetch(`http://127.0.0.1:3000/api/associated/${field}`)
    parts = (await parts.json())?.data 
  }

  function populateFields(metadata){

    const jsx = metadata?.map((element)=>{

      const regex = fieldRegex[element.data_type?.toUpperCase()]
      let isRequired = false

      if(!["Avail","inTime","UserID","ID"].includes(element.column_name)){

        if(element.associated_table){

          return <SearchInput row={rowsCounter} nFields={metadata.length-4} values={valuesObject} label={`${element.column_name}`}/>
                  
        }

        if(element.column_name === "Name")
          isRequired = true

        return <AutoInput row={rowsCounter} nFields={metadata.length-4} values={valuesObject} label={element.column_name} required={isRequired} regex={regex}/>

      }
    })


    show(jsx)

    if(!fields.length){

      setFields(jsx ?? [])

    }else{

      setFields(element => {

        return [...element,<Divider className="my-4" />,jsx]
      
      })
    }    
  }

  useAsyncEffect(async ()=>{

    let parts = await fetch("http://127.0.0.1:3000/api/parts/")
    parts = (await parts.json())?.data 

    if(parts)
      setParts(parts.map((element)=>{ return {"key":element,"label":element}}))
  },[])

  useAsyncEffect(async ()=>{

    if(selectedPart){

      let metadata = await fetch(`http://127.0.0.1:3000/api/table/${selectedPart}`)
      
      metadata = (await metadata.json())?.data
      
      valuesObject.current = {}
      setRowsCounter(0)
      setRawFields(metadata)
      setFields([])

      setRowsCounter(element=> element+1)
      populateFields(metadata)
    }

  },[selectedPart])

  return (
    <div className="w-full flex flex-col gap-4 items-center mt-6">
      <div className="max-w-lg text-center justify-center">
        <Image
        width={120}
        alt="Auger Logo"
        src={augerLogo.src}
        style={{marginTop:"-5rem"}}
        />
      </div>

      <div className="flex w-full flex-row flex-wrap gap-4 justify-center items-center">
        <Select
          items={parts}
          label="Partes"
          placeholder="Qué componente o parte desea agregar?"
          className="max-w-lg"
          onSelectionChange={(change)=>{ setSelectedPart(Array.from(change)[0])}}
        >
          {(parts) => <SelectItem>{parts.label}</SelectItem>}
        </Select>

        <FontAwesomeIcon icon={faPlus} className="text-3xl hover:animate-ping" onClick={handleAddPart}/>      
      </div>

      <div className="flex flex-row flex-wrap gap-2">
        {fields}
      </div>

    </div>
  );
}
