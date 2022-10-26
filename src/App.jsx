import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import * as d3 from "d3";

async function getData() {
  const response = await fetch("data.json");
  return response.json();
}

function layoutGraph(data) {
  const nodes = data.nodes.map((node) => ({ ...node }));
  const links = data.links.map((link) => ({ ...link }));
  const forceNode = d3.forceManyBody().strength(-100);
  const forceLink = d3
    .forceLink(links)
    .id((node) => node.id)
    .distance(() => 100);

  const simulation = d3
    .forceSimulation(nodes)
    .force("link", forceLink)
    .force("charge", forceNode)
    .force("center", d3.forceCenter(0, 0))
    .tick(300)
    .stop();

  const color = d3.scaleOrdinal(d3.schemeCategory10);
  for (const node of nodes) {
    node.color = color(node.group);
  }

  return { nodes, links };
}

function Node({ node }) {
  return (
    <g transform={`translate(${node.x},${node.y})`}>
      <circle fill={node.color} r="3" />
      <text textAnchor="middle" dominantBaseline="central" fontSize="8">
        {node.name}
      </text>
    </g>
  );
}

function Link({ link }) {
  const path = d3.path();
  path.moveTo(link.source.x, link.source.y);
  path.lineTo(link.target.x, link.target.y);
  return (
    <g>
      <path d={path} fill="none" stroke="#ccc" />
    </g>
  );
}

function NodeLinkDiagram({ width, height }) {
  const { data } = useQuery(["data"], getData);

  const drawing = useMemo(() => {
    return layoutGraph(data);
  }, [data]);

  return (
    <svg width={width} height={height} className="node-link-diagram">
      <g transform={`translate(${width / 2},${height / 2})`}>
        <g>
          {drawing.links.map((link, i) => {
            return <Link key={i} link={link} />;
          })}
        </g>
        <g>
          {drawing.nodes.map((node, i) => {
            return <Node key={i} node={node} />;
          })}
        </g>
      </g>
    </svg>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
});

export default function App() {
  const containerRef = useRef();
  const [size, setSize] = useState({ width: 300, height: 150 });
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      setSize({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
    });
    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="container">
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<p>loading</p>}>
          <NodeLinkDiagram width={size.width} height={size.height} />
        </Suspense>
      </QueryClientProvider>
    </div>
  );
}
