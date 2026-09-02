extends Node
class_name InteractionManager

signal interaction_started(actor_id, interaction_id)
signal interaction_completed(actor_id, interaction_id, result)

var active := {}

func can_interact(actor_id: String, target: Dictionary) -> bool:
    if target.get("disabled", false): return false
    var distance := float(target.get("distance", 0.0))
    return distance <= float(target.get("max_distance", 3.0))

func begin(actor_id: String, target: Dictionary) -> Dictionary:
    var id := String(target.get("interaction_id", "unknown"))
    if not can_interact(actor_id, target):
        return {"ok": false, "reason": "out_of_range"}
    active[actor_id] = {"id": id, "target": target}
    interaction_started.emit(actor_id, id)
    return {"ok": true, "interaction_id": id}

func complete(actor_id: String, result: Dictionary = {}) -> Dictionary:
    if not active.has(actor_id): return {"ok": false, "reason": "no_active_interaction"}
    var item = active[actor_id]
    active.erase(actor_id)
    interaction_completed.emit(actor_id, item.id, result)
    return {"ok": true, "interaction_id": item.id, "result": result}

func cancel(actor_id: String) -> void:
    active.erase(actor_id)

func get_available_interactions(context: Dictionary) -> Array:
    var result := []
    for target in context.get("targets", []):
        if can_interact(String(context.get("actor_id", "")), target):
            result.append(target)
    return result
