import heapq
import math
from typing import Dict, List, Literal, Optional, Tuple

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="Smart Emergency Grid Route Optimization", version="0.1.0")

class Coordinate(BaseModel):
    lat: float
    lng: float

class Node(BaseModel):
    id: str
    lat: float
    lng: float
    traffic_signal_id: Optional[str] = None

class Edge(BaseModel):
    from_: str = Field(..., alias="from")
    to: str
    road_segment: Optional[str] = None
    distance_m: float = Field(..., gt=0)
    traffic_weight: float = Field(1.0, gt=0)
    traffic_signal_id: Optional[str] = None

class Graph(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

class RouteRequest(BaseModel):
    start: Coordinate
    end: Coordinate
    graph: Graph
    algorithm: Literal["dijkstra", "astar"] = "astar"
    average_speed_kmph: float = Field(42.0, gt=1)

class Waypoint(BaseModel):
    node_id: str
    lat: float
    lng: float
    cumulative_eta_seconds: int

class RouteResponse(BaseModel):
    algorithm: str
    start_node_id: str
    end_node_id: str
    total_eta_seconds: int
    total_distance_m: float
    path: List[Waypoint]
    traffic_signal_ids: List[str]

@app.get("/health")
def health():
    return {"status": "UP", "service": "route-optimization"}

def haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    r = 6371.0088
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng/2)**2
    return r * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

def nearest_node(coord: Coordinate, nodes: Dict[str, Node]) -> str:
    return min(nodes.values(), key=lambda n: haversine_km(coord.lat, coord.lng, n.lat, n.lng)).id

def adjacency(edges: List[Edge]) -> Dict[str, List[Edge]]:
    adj: Dict[str, List[Edge]] = {}
    for e in edges:
        adj.setdefault(e.from_, []).append(e)
    return adj

def edge_seconds(edge: Edge, avg_speed_kmph: float) -> float:
    return (edge.distance_m / 1000.0) / avg_speed_kmph * 3600.0 * edge.traffic_weight

def shortest_path(req: RouteRequest) -> Tuple[List[str], Dict[str, float], Dict[Tuple[str, str], Edge]]:
    nodes = {n.id: n for n in req.graph.nodes}
    adj = adjacency(req.graph.edges)
    start_id = nearest_node(req.start, nodes)
    end_id = nearest_node(req.end, nodes)
    came_from: Dict[str, str] = {}
    dist: Dict[str, float] = {start_id: 0.0}
    edge_lookup: Dict[Tuple[str, str], Edge] = {}
    queue: List[Tuple[float, str]] = [(0.0, start_id)]

    def heuristic(node_id: str) -> float:
        if req.algorithm == "dijkstra":
            return 0.0
        node = nodes[node_id]
        target = nodes[end_id]
        return (haversine_km(node.lat, node.lng, target.lat, target.lng) / req.average_speed_kmph) * 3600.0

    visited = set()
    while queue:
        _, current = heapq.heappop(queue)
        if current in visited:
            continue
        visited.add(current)
        if current == end_id:
            break
        for edge in adj.get(current, []):
            new_cost = dist[current] + edge_seconds(edge, req.average_speed_kmph)
            if edge.to not in dist or new_cost < dist[edge.to]:
                dist[edge.to] = new_cost
                came_from[edge.to] = current
                edge_lookup[(current, edge.to)] = edge
                heapq.heappush(queue, (new_cost + heuristic(edge.to), edge.to))

    if end_id not in dist:
        raise HTTPException(status_code=400, detail="No route found between nearest start/end nodes")

    path = [end_id]
    while path[-1] != start_id:
        path.append(came_from[path[-1]])
    path.reverse()
    return path, dist, edge_lookup

@app.post("/optimize/route", response_model=RouteResponse)
def optimize_route(req: RouteRequest):
    nodes = {n.id: n for n in req.graph.nodes}
    start_id = nearest_node(req.start, nodes)
    end_id = nearest_node(req.end, nodes)
    path_ids, dist, edge_lookup = shortest_path(req)

    waypoints: List[Waypoint] = []
    signal_ids: List[str] = []
    total_distance = 0.0
    cumulative = 0.0
    for i, node_id in enumerate(path_ids):
        if i > 0:
            edge = edge_lookup[(path_ids[i - 1], node_id)]
            cumulative += edge_seconds(edge, req.average_speed_kmph)
            total_distance += edge.distance_m
            if edge.traffic_signal_id:
                signal_ids.append(edge.traffic_signal_id)
        node = nodes[node_id]
        if node.traffic_signal_id:
            signal_ids.append(node.traffic_signal_id)
        waypoints.append(Waypoint(
            node_id=node.id,
            lat=node.lat,
            lng=node.lng,
            cumulative_eta_seconds=round(cumulative)
        ))

    dedup_signals = list(dict.fromkeys(signal_ids))
    return RouteResponse(
        algorithm=req.algorithm,
        start_node_id=start_id,
        end_node_id=end_id,
        total_eta_seconds=round(dist[end_id]),
        total_distance_m=round(total_distance, 1),
        path=waypoints,
        traffic_signal_ids=dedup_signals,
    )
