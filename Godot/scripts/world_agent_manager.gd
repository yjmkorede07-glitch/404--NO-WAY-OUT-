extends Node
## Phase 32 runtime coordinator. Keeps simulation rules deterministic and cheap enough for a solo/mobile-oriented build.

var district_budgets: Dictionary = {}
var active_agents: Dictionary = {}
var active_events: Dictionary = {}
var police_incidents: Dictionary = {}
var business_states: Dictionary = {}

func configure(budgets: Dictionary) -> void:
    district_budgets = budgets

func should_spawn_agent(district: String, agent_type: String, distance_m: float, protected: bool = false) -> bool:
    if protected or distance_m > 900.0:
        return false
    if not district_budgets.has(district):
        return false
    var bucket: Dictionary = district_budgets[district]
    var limit := int(bucket.get("pedestrians", 0)) if agent_type == "pedestrian" else int(bucket.get("vehicles", 0))
    return _count_agents(district, agent_type) < limit

func register_agent(agent_id: String, district: String, agent_type: String, active_mission_actor: bool = false) -> void:
    active_agents[agent_id] = {"district": district, "type": agent_type, "mission_actor": active_mission_actor}

func unregister_agent(agent_id: String) -> void:
    if active_agents.has(agent_id):
        active_agents.erase(agent_id)

func register_police_incident(incident_id: String, district: String, severity: int) -> void:
    police_incidents[incident_id] = {"district": district, "severity": severity, "state": "dispatch"}

func advance_police(incident_id: String, state: String) -> void:
    if police_incidents.has(incident_id):
        police_incidents[incident_id]["state"] = state

func set_business_state(business_id: String, state: String, heat: float = 0.0) -> void:
    business_states[business_id] = {"state": state, "heat": clamp(heat, 0.0, 100.0)}

func start_dynamic_event(event_id: String, district: String, family: String) -> bool:
    if active_events.has(event_id):
        return false
    active_events[event_id] = {"district": district, "family": family, "active": true}
    return true

func resolve_dynamic_event(event_id: String) -> void:
    if active_events.has(event_id):
        active_events[event_id]["active"] = false

func _count_agents(district: String, agent_type: String) -> int:
    var count := 0
    for item in active_agents.values():
        if item["district"] == district and item["type"] == agent_type:
            count += 1
    return count
