from pathlib import Path
root=Path(__file__).resolve().parents[1]/'Assets/404NoWayOut/Art/PortableOBJ'
def box(name,sx,sy,sz):
    v=[(-sx/2,0,-sz/2),(sx/2,0,-sz/2),(sx/2,sy,-sz/2),(-sx/2,sy,-sz/2),(-sx/2,0,sz/2),(sx/2,0,sz/2),(sx/2,sy,sz/2),(-sx/2,sy,sz/2)]
    f=[(1,2,3,4),(5,8,7,6),(1,5,6,2),(4,3,7,8),(1,4,8,5),(2,6,7,3)]
    p=['# 404 NO WAY OUT portable OBJ',f'o {name}']+[f'v {x} {y} {z}' for x,y,z in v]+[f'f {" ".join(map(str,a))}' for a in f]
    (root/(name+'.obj')).write_text('\n'.join(p)+'\n')
for args in [('NWO_Building_Block_A',20,30,20),('NWO_Building_Block_B',30,12,30),('NWO_Road_Segment',40,.2,8),('NWO_Sedan',5,1.4,2.1),('NWO_Boat',8,1.5,3),('NWO_Helicopter',5,2.2,3.2),('NWO_Humanoid_Placeholder',1.2,4,1.0),('NWO_Interior_Room',12,3,10)]: box(*args)
