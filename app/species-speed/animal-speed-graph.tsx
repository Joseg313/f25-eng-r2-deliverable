/* eslint-disable */
"use client";
import { useRef, useEffect, useState  } from "react";
import { select } from "d3-selection";
import { scaleBand, scaleLinear, scaleOrdinal } from "d3-scale";
import { max } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis"; // D3 is a JavaScript library for data visualization: https://d3js.org/
import { csv } from "d3-fetch";

// Example data: Only the first three rows are provided as an example
// Add more animals or change up the style as you desire

// Completed: Write this interface
interface AnimalDatum  {
  name: string;
  speed: number;
  diet: "Carnivore" | "Herbivore" | "Omnivore";
}


export default function AnimalSpeedGraph() {
  // useRef creates a reference to the div where D3 will draw the chart.
  // https://react.dev/reference/react/useRef
  const graphRef = useRef<HTMLDivElement>(null);

  const [animalData, setAnimalData] = useState<AnimalDatum[]>([]);

  // Done TODO: Load CSV data
  useEffect(() => {
    csv('/sample_animals.csv', function(d) {
      return {
        name: d.Animal,
        diet: d.Diet as AnimalDatum['diet'],
        speed: +d.AverageSpeed
      };
    })
    .then((d) => {
      console.log(animalData)
      setAnimalData(d as AnimalDatum[]);
    })
    .catch((err) => {
        console.error("Error loading CSV", err);
    });
  }, []);

  useEffect(() => {
    // Clear any previous SVG to avoid duplicates when React hot-reloads
    if (graphRef.current) {
      graphRef.current.innerHTML = "";
    }

    if (animalData.length === 0) return;

    // Set up chart dimensions and margins
    const containerWidth = graphRef.current?.clientWidth ?? 800;
    const containerHeight = graphRef.current?.clientHeight ?? 500;

    // Set up chart dimensions and margins
    const width = Math.max(containerWidth, 600); // Minimum width of 600px
    const height = Math.max(containerHeight, 400); // Minimum height of 400px
    const margin = { top: 70, right: 60, bottom: 80, left: 100 };

    // Create the SVG element where D3 will draw the chart
    // https://github.com/d3/d3-selection
    const svg  = select(graphRef.current!)
      .append<SVGSVGElement>("svg")
      .attr("width", width)
      .attr("height", height)

    // TODO: Implement the rest of the graph
    // HINT: Look up the documentation at these links
    // https://github.com/d3/d3-scale#band-scales
    // https://github.com/d3/d3-scale#linear-scales
    // https://github.com/d3/d3-scale#ordinal-scales
    // https://github.com/d3/d3-axis

    const x = scaleBand()
      //for animal names
      .range([0, width])
      .padding(0.1)
      .domain(animalData.map(function (d) {return d.name;}));

    const y = scaleLinear()
      // for speeds
      .range([height, 0])
      .domain([0, max(animalData, function (d) { return d.speed; })])

    const color = scaleOrdinal<string>()
      // for coloring by diet
      .domain(['Carnivore', 'Herbivore', 'Omnivore'])
      .range(['#ef4444', '#22c55e', '#3b82f6'])

    svg.append('g')
      .attr("transform", `translate(0,${height})`)
      .call(axisBottom(x))
      .selectAll("text") // Rotate labels if they overlap
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width / 2 + margin.left)
      .attr("y", height + margin.top + 15)
      .text("Animal");


    svg.append("g")
      .call(axisLeft(y));

    svg.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -height / 2 + margin.top)
      .text("Speed (km/h)");

    svg.selectAll("mybar")
      .data(animalData)
      .join("rect")
        .attr("x", d => x(d.name)!)
        .attr("y", d => y(d.speed))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.speed))
        .attr("fill", d => color(d.diet));


    const diets = ["Carnivore", "Herbivore", "Omnivore"];

    const legend = svg.append("g")
      .attr("transform", `translate(${width + 20}, 0)`); // Position to the right

    diets.forEach((diet, i) => {
      const legendRow = legend.append("g")
        .attr("transform", `translate(0, ${i * 25})`);

    legendRow.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", color(diet));


    legendRow.append("text")
        .attr("x", 20)
        .attr("y", 12)
        .style("font-size", "14px")
        .text(diet);
    });
  }, [animalData]);

  // TODO: Return the graph
  return (
    // Placeholder so that this compiles. Delete this below:
    <div>
      <h2 className="text-xl font-bold mb-4">Animal Speeds</h2>
      <div ref={graphRef}></div>

    </div>
  );
}
