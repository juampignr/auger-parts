"use client";

import { Image } from "@nextui-org/image";
import { Select, SelectItem } from "@nextui-org/select";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { Input } from "@nextui-org/input";
import { Divider } from "@nextui-org/divider";
import { useState, useRef, useEffect, createContext } from "react";
import { useAsyncEffect } from "use-async-effect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { randomBytes } from "crypto";
import { SearchInput } from "/components/SearchInput";
import { AutoInput } from "/components/AutoInput";
import { fieldRegex } from "/json/fieldRegex.js";
import { useMemo, useContext } from "react";
import { loadSlim } from "@tsparticles/slim";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { Context } from "/app/providers";
import chalk from "chalk";
import augerLogo from "/images/logo.jpg";

let show = (arg) => {
  switch (typeof arg) {
    case "string":
      console.log(chalk.inverse(arg));
      break;

    case "object":
      console.log(arg);
      break;

    case "function":
      console.log(arg);
      break;

    default:
      console.log(chalk.bold(arg));
      break;
  }
};

let debug = (arg) => {
  switch (typeof arg) {
    case "string":
      console.log(chalk.red.underline(arg));
      break;

    case "object":
      console.log(arg);
      break;

    case "function":
      console.log(arg);
      break;

    default:
      console.log(chalk.red.underline(arg));
      break;
  }
};

let warn = (arg) => {
  switch (typeof arg) {
    case "string":
      console.log(chalk.bgRed.inverse(arg));
      break;

    case "object":
      console.log(arg);
      break;

    case "function":
      console.log(arg);
      break;

    default:
      console.log(chalk.bgRed(arg));
      break;
  }
};

export default function Home() {
  const ctx = useContext(Context);

  let [selectedPart, setSelectedPart] = useState(false);
  let [rowCounter, setRowCounter] = useState(0);

  const [parts, setParts] = useState([]);
  const [rawFields, setRawFields] = useState([]);
  const [fields, setFields] = useState([]);
  const [rows, setRows] = useState([]);
  const [particlesInit, setParticlesInit] = useState(false);
  const parentRef = useRef(false);

  const particlesLoaded = (container) => {
    console.log(container);
  };

  const particleOptions = useMemo(
    () => ({
      background: {
        color: {
          value: "#000000", // Background color (black)
        },
      },
      fpsLimit: 60,
      interactivity: {
        detectsOn: "canvas",
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
          onHover: {
            enable: true,
            mode: "repulse",
          },
          resize: true,
        },
        modes: {
          bubble: {
            distance: 400,
            duration: 2,
            opacity: 0.8,
            size: 40,
          },
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 100,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: "#ffffff", // Star color (white)
        },
        links: {
          enable: false, // Disable links between particles
        },
        move: {
          direction: "none",
          enable: true,
          outMode: "out",
          random: false,
          speed: 0.2, // Speed of stars
          straight: false,
        },
        number: {
          density: {
            enable: true,
            value_area: 1000, // Increase density to make stars more crowded
          },
          value: 150, // Number of stars
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: "circle",
        },
        size: {
          random: true,
          value: 1,
        },
        fixed: {
          // Fixed positions for stars
          enable: true,
          zIndex: -1,
          particles: [
            { x: 100, y: 200 },
            { x: 300, y: 400 },
            { x: 500, y: 600 },
            { x: 700, y: 800 },
            { x: 900, y: 1000 },
          ],
        },
      },
      detectRetina: true,
    }),
    [],
  );
  //Particles end here
  function handleAddPart(event) {
    setRowCounter((element) => element + 1);
    ctx.row += 1;
    populateFields(rawFields);
  }

  async function handleSearchPart(event) {
    const id = ctx.valuesObject["1"]["ID"] ?? ctx.valuesObject["1"]["Name"];

    if (id) {
      let part = await fetch(
        `https://parts.auger.org.ar/api/part/${selectedPart}/${id}`,
      );

      part = (await parts.json())?.data;
      console.log(part);
    }
  }

  async function handleSelection(event) {
    const field = event.target.value;

    let parts = await fetch(
      `https://parts.auger.org.ar/api/associated/${field}`,
    );
    parts = (await parts.json())?.data;
  }

  function populateFields(metadata) {
    const jsx = metadata?.map((element) => {
      const columnTypeRegex =
        /(?<type>\w+)(?:\((?:(?<minimum>\d+),)?(?<maximum>\d+)\))?/i;

      const { type, minimum, maximum } = columnTypeRegex.exec(
        element.column_type,
      ).groups;

      let regex = fieldRegex[type?.toUpperCase()];

      regex = regex
        .replace("MINIMUM", minimum ?? 0)
        .replace("MAXIMUM", maximum ?? "");

      regex = new RegExp(regex);

      let isRequired = false;

      //Use automatic translation later
      const nameMap = new Map(Object.entries({ Avail: "Quantity" }));

      if (nameMap.has(element.column_name))
        element["column_alias"] = nameMap.get(element.column_name);

      if (element.associated_table) {
        return (
          <SearchInput
            table={selectedPart}
            row={rowCounter}
            nFields={metadata.length}
            label={`${element.column_name}`}
            alias={element.column_alias}
          />
        );
      }

      if (element.column_name === "Name") isRequired = true;

      return (
        <AutoInput
          table={selectedPart}
          row={rowCounter}
          nFields={metadata.length}
          label={element.column_name}
          alias={element.column_alias}
          required={isRequired}
          regex={regex}
        />
      );
    });

    if (!fields.length) {
      setFields(jsx ?? []);
    } else {
      setFields((element) => {
        return [...element, <Divider className="my-4 z-10" />, jsx];
      });
    }
  }

  useAsyncEffect(async () => {
    console.log(ctx);

    let parts = await fetch("https://parts.auger.org.ar/api/parts/");
    parts = (await parts.json())?.data;

    console.log(parts);
    if (parts)
      setParts(
        parts.map((element) => {
          return { key: element, label: element };
        }),
      );

    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setParticlesInit(true);
    });
  }, []);

  useAsyncEffect(async () => {
    console.log(selectedPart);

    if (selectedPart) {
      let metadata = await fetch(
        `https://parts.auger.org.ar/api/table/${selectedPart}`,
      );

      console.log(metadata);

      metadata = (await metadata.json())?.data;

      console.log(metadata);

      //valuesObject.current = {}
      //setrowCounter(0);
      setRowCounter(0);
      ctx.row = 0;
      setRawFields(metadata);
      //setFields([])

      setRowCounter((element) => element + 1);
      ctx.row += 1;
      populateFields(metadata);
    }
  }, [selectedPart]);

  return (
    <>
      {particlesInit ? (
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          options={particleOptions}
        />
      ) : (
        <></>
      )}

      <div className="w-full flex flex-col gap-4 items-center mt-6">
        <div className="max-w-lg text-center justify-center">
          <Image
            width={100}
            alt="Auger Logo"
            src={augerLogo.src}
            style={{ marginTop: "-5rem" }}
          />
        </div>

        <div className="flex w-full flex-row flex-wrap gap-4 justify-center items-center">
          <Select
            items={parts}
            label="Partes"
            placeholder="Qué componente o parte desea agregar?"
            className="max-w-lg"
            onSelectionChange={(change) => {
              console.log(Object.values(change)[0]);
              setSelectedPart(Object.values(change)[0]);
              ctx.table = Object.values(change)[0];
              console.log(selectedPart);
            }}
          >
            {(parts) => <SelectItem>{parts.label}</SelectItem>}
          </Select>

          <FontAwesomeIcon
            icon={faPlus}
            className="text-3xl hover:animate-ping z-10"
            onClick={handleAddPart}
          />
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="text-3xl hover:animate-ping z-10"
            onClick={handleSearchPart}
          />
        </div>

        <div className="flex flex-row flex-wrap gap-2">{fields}</div>
      </div>
    </>
  );
}
