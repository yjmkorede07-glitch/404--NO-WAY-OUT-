extends Node
var weather := "clear"
var district_heat := {}
var active_events := {}
func report_police_incident(district:String, severity:float):
    district_heat[district] = clamp(float(district_heat.get(district,0.0)) + severity,0.0,100.0)
func start_event(event_id:String,district:String):
    active_events[event_id] = {"district":district,"active":true}
func resolve_event(event_id:String):
    if active_events.has(event_id): active_events[event_id]["active"] = false
