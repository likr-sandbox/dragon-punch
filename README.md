# Graph Drawing Boilerplate

## Usage

1. [Create Repository from this Template](https://github.com/likr-boilerplate/graph-drawing/generate)
1. Clone your repository
1. Run the following commands inside the repository folder

```shell-session
npm ci
npm run dev -- --open
```

## Drawing Your Data

Put your data in `public/data.json`.
[node_link_data](https://networkx.org/documentation/stable/reference/readwrite/generated/networkx.readwrite.json_graph.node_link_data.html) format of [NetworkX](https://networkx.org/documentation/stable/index.html) is supported.

The following Python code is an example of data generation using NetworkX.

```python
import json
import networkx as nx
from networkx.readwrite.json_graph import node_link_data
graph = nx.karate_club_graph()
json.dump(node_link_data(graph), open('data.json', 'w'))
```
