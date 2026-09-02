extends Node
signal minute_changed(day:int, hour:int, minute:int)
const REAL_SECONDS_PER_GAME_MINUTE := 5.0 / 60.0
var day := 1
var hour := 8
var minute := 0
var accumulator := 0.0
func _process(delta):
    accumulator += delta
    while accumulator >= REAL_SECONDS_PER_GAME_MINUTE:
        accumulator -= REAL_SECONDS_PER_GAME_MINUTE
        minute += 1
        if minute >= 60: minute = 0; hour += 1
        if hour >= 24: hour = 0; day += 1
        minute_changed.emit(day, hour, minute)
