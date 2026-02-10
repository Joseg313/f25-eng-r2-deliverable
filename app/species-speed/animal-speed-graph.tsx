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
      console.log(d)
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
    const margin = { top: 70, right: 150, bottom: 80, left: 100 };
    const width = Math.max(containerWidth, 800); // Minimum width of 800px
    const height = Math.max(containerHeight, 500); // Minimum height of 500px
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create the SVG element where D3 will draw the chart
    // https://github.com/d3/d3-selection
    const svg  = select(graphRef.current!)
      .append<SVGSVGElement>("svg")
      .attr("width", width)
      .attr("height", height)

    // Create a group element with margins applied
    const chart = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // TODO: Implement the rest of the graph
    // HINT: Look up the documentation at these links
    // https://github.com/d3/d3-scale#band-scales
    // https://github.com/d3/d3-scale#linear-scales
    // https://github.com/d3/d3-scale#ordinal-scales
    // https://github.com/d3/d3-axis

    // Sort animals by diet to group them together
    const sortedData = [...animalData].sort((a, b) => {
      const dietOrder = { 'Carnivore': 0, 'Herbivore': 1, 'Omnivore': 2 };
      return dietOrder[a.diet] - dietOrder[b.diet];
    });

    const x = scaleBand()
      //for animal names
      .range([0, innerWidth])
      .padding(0.5)
      .domain(sortedData.map(function (d) {return d.name;}));

    const y = scaleLinear()
      // for speeds
      .range([innerHeight, 0])
      .domain([0, max(animalData, function (d) { return d.speed; }) ?? 0])

    const color = scaleOrdinal<string>()
      // for coloring by diet
      .domain(['Carnivore', 'Herbivore', 'Omnivore'])
      .range(['#ef4444', '#22c55e', '#3b82f6'])

    // Add X axis
    chart.append('g')
      .attr("transform", `translate(0,${innerHeight})`)
      .call(axisBottom(x))
      .selectAll("text") 
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add X axis label
    chart.append("text")
      .attr("text-anchor", "middle")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 60)
      .text("Animal");

    // Add Y axis
    chart.append("g")
      .call(axisLeft(y));

    // Add Y axis label
    chart.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("y", -60)
      .attr("x", -innerHeight / 2)
      .text("Speed (km/h)");

    // Add bars
    chart.selectAll("mybar")
      .data(sortedData)
      .join("rect")
        .attr("x", d => x(d.name)!)
        .attr("y", d => y(d.speed))
        .attr("width", x.bandwidth())
        .attr("height", d => innerHeight - y(d.speed))
        .attr("fill", d => color(d.diet));

    //  legend
    const diets = ["Carnivore", "Herbivore", "Omnivore"];

    const legend = chart.append("g")
      .attr("transform", `translate(${innerWidth + 20}, 0)`);

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
      .style("fill", "white")
      .style("font-size", "14px")
      .text(diet);
    });
  }, [animalData]);

  // done TODO: Return the graph
  return (

    <div className="p-4 border rounded shadow-sm">
      <h2 className="text-xl font-bold mb-4">Animal Speeds</h2>
      <div ref={graphRef}></div>

    </div>
  );
}
