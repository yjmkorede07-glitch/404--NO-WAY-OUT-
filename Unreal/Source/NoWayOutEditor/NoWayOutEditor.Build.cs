using UnrealBuildTool;
public class NoWayOutEditor : ModuleRules
{
    public NoWayOutEditor(ReadOnlyTargetRules Target) : base(Target)
    {
        PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;
        PublicDependencyModuleNames.AddRange(new string[] { "Core", "CoreUObject", "Engine", "NoWayOut" });
        PrivateDependencyModuleNames.AddRange(new string[] { "AssetRegistry", "Json", "JsonUtilities", "UnrealEd" });
    }
}
