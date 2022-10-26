import argparse
import csv
import json
import random
import networkx as nx
from networkx.readwrite.json_graph import node_link_data


EDGE_SAMPLING_RATIO = 0.1
IGNORE_SAME_LAYER_EDGE = True


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('input')
    parser.add_argument('output')
    args = parser.parse_args()

    graph = nx.Graph()
    for row in csv.DictReader(open(args.input)):
        if random.random() < EDGE_SAMPLING_RATIO:
            if IGNORE_SAME_LAYER_EDGE and row['HC_TIER'] == row['JC_TIER']:
                continue
            if row['HC_KG_CD'] not in graph.nodes:
                graph.add_node(
                    row['HC_KG_CD'],
                    tier=int(row['HC_TIER']),
                    dependantRatio=float(row['HC_DEPENDANT_RATIO']),
                )
            if row['JC_KG_CD'] not in graph.nodes:
                graph.add_node(
                    row['JC_KG_CD'],
                    tier=int(row['JC_TIER']),
                    dependantRatio=float(row['JC_DEPENDANT_RATIO']),
                )
            graph.add_edge(
                row['HC_KG_CD'],
                row['JC_KG_CD'],
                share=float(row['SHARE']),
                syoryukenWeight=float(
                    row['SYORYUKEN_WEIGHT']) if row['SYORYUKEN_WEIGHT'] else None,
            )
    components = max(nx.connected_components(graph), key=len)
    json.dump(node_link_data(graph.subgraph(components).copy()),
              open(args.output, 'w'))


if __name__ == '__main__':
    main()
