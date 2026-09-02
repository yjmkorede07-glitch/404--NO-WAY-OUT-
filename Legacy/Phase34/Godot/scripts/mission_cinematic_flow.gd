extends Node
class_name MissionCinematicFlow

signal cinematic_requested(kind, mission_id, beat_id)
signal gameplay_released(mission_id)

func begin_mission(mission_id: String, opening: String) -> void:
    cinematic_requested.emit("opening", mission_id, opening)

func in_mission(mission_id: String, beat_id: String) -> void:
    cinematic_requested.emit("in_mission", mission_id, beat_id)

func finish_mission(mission_id: String, ending: String) -> void:
    cinematic_requested.emit("post_mission", mission_id, ending)
    gameplay_released.emit(mission_id)
