extends Node

var accepted := false
var rank := "Cadet"
var active_incidents: Dictionary = {}

func set_acceptance(is_accepted: bool, new_rank: String = "Cadet") -> void:
    accepted = is_accepted
    rank = new_rank

func can_use(capability: String) -> bool:
    if not accepted:
        return false
    if capability == "plate_check":
        return rank in ["Officer", "Senior Officer"]
    if capability in ["vehicle_stop", "detain", "arrest", "citation", "request_fire", "request_tow", "scene_perimeter"]:
        return rank in ["Officer", "Senior Officer"]
    return capability in ["id_check", "dispatch_backup", "request_ambulance", "incident_report"]

func request_service(service: String, incident_id: String) -> Dictionary:
    if not accepted:
        return {"ok": false, "reason": "law_enforcement_acceptance_required"}
    if service not in ["police", "ambulance", "fire", "tow"]:
        return {"ok": false, "reason": "invalid_service"}
    active_incidents[incident_id] = {"service": service, "status": "requested"}
    return {"ok": true, "incident_id": incident_id, "service": service}
