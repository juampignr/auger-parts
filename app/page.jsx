"use client"

import { Image } from "@nextui-org/image";
import { Select, SelectItem } from "@nextui-org/select";
import { useState,useEffect } from "react"
import { useAsyncEffect } from "use-async-effect"
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

  useAsyncEffect(async ()=>{

    let parts = await fetch("http://127.0.0.1:3000/api/parts/")
    parts = (await parts.json()).data

    setParts(parts.map((element)=>{ return {"key":element,"label":element}}))
  },[])

  useAsyncEffect(async ()=>{

    console.log(selectedPart)

  },[selectedPart])

  function handleSelection(change){
    
    show(Array.from(change)[0])
  }

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

      <Select
        items={parts}
        label="Partes"
        placeholder="Qué componente o parte desea agregar?"
        className="max-w-lg"
        onSelectionChange={handleSelection}
      >
        {(parts) => <SelectItem>{parts.label}</SelectItem>}
      </Select>
    </div>
  );
}
