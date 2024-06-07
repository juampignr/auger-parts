"use client"

import { Image } from "@nextui-org/image";
import { Select, SelectItem } from "@nextui-org/select";
import { useState,useEffect } from "react"
import { useAsyncEffect } from "use-async-effect"
import augerLogo from "/images/logo.jpg"

export default function Home() {


  const { setParts,parts } = useState([])

  useEffect(()=>{

    setParts([{"value":"1","text":"one"},{"value":"2","text":"two"}])
  },[])

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
      <Image
      width={150}
      alt="Auger Logo"
      src={augerLogo.src}
      style={{marginTop:"-5rem"}}
      />

      <Select 
        label="Select smth" 
        className="max-w-xs" 
      >

        {
          parts?.map(element => {
            <SelectItem key={element?.value}>{element?.text}</SelectItem>
          })
        }
         
      </Select>

      </div>
    </section>
  );
}
