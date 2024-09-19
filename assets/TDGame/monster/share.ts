import { _decorator, ccenum, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export enum monster_id {
    default = 0,
    AdeptNecromancer,
    BestialLizardfolk,
    CorruptedTreant,
    DeftSorceress,
    EarthElemental,
    ExpertDruid,
    FireElemental,
    FlutteringPixie,
    GlowingWisp,
    GoblinArcher,
    GoblinFanatic,
    GoblinFighter,
    GoblinOccultist,
    GoblinWolfRider,
    GrizzledTreant,
    HalflingAssassin,
    HalflingBard,
    HalflingRanger,
    HalflingRogue,
    HalflingSlinger,
    IceGolem,
    IronGolem,
    LizardfolkArcher,
    LizardfolkGladiator,
    LizardfolkScout,
    LizardfolkSpearman,
    MagicalFairy,
    NovicePyromancer,
    VileWitch,
    WaterElemental,
    Max
}
ccenum(monster_id)

export const MonsterConfig:string[] = new Array(monster_id.Max);
MonsterConfig[monster_id.default] = "monster/monster";
MonsterConfig[monster_id.AdeptNecromancer] = "monster/items/adept necromancer/AdeptNecromancer";
MonsterConfig[monster_id.BestialLizardfolk] = "monster/items/bestial lizardfolk/BestialLizardfolk";
MonsterConfig[monster_id.CorruptedTreant] = "monster/items/corrupted treant/CorruptedTreant";
MonsterConfig[monster_id.DeftSorceress] = "monster/items/deft sorceress/DeftSorceress";
MonsterConfig[monster_id.EarthElemental] = "monster/items/earth elemental/EarthElemental";
MonsterConfig[monster_id.ExpertDruid] = "monster/items/expert druid/ExpertDruid";
MonsterConfig[monster_id.FireElemental] = "monster/items/fire elemental/FireElemental";
MonsterConfig[monster_id.FlutteringPixie] = "monster/items/fluttering pixie/FlutteringPixie";
MonsterConfig[monster_id.GlowingWisp] = "monster/items/glowing wisp/GlowingWisp";
MonsterConfig[monster_id.GoblinArcher] = "monster/items/goblin archer/GoblinArcher";
MonsterConfig[monster_id.GoblinFanatic] = "monster/items/goblin fanatic/GoblinFanatic";
MonsterConfig[monster_id.GoblinFighter] = "monster/items/goblin fighter/GoblinFighter";
MonsterConfig[monster_id.GoblinOccultist] = "monster/items/goblin occultist/GoblinOccultist";
MonsterConfig[monster_id.GoblinWolfRider] = "monster/items/goblin wolf rider/GoblinWolfRider";
MonsterConfig[monster_id.GrizzledTreant] = "monster/items/grizzled treant/GrizzledTreant";
MonsterConfig[monster_id.HalflingAssassin] = "monster/items/halfling assassin/HalflingAssassin";
MonsterConfig[monster_id.HalflingBard] = "monster/items/halfling bard/HalflingBard";
MonsterConfig[monster_id.HalflingRanger] = "monster/items/halfling ranger/HalflingRanger";
MonsterConfig[monster_id.HalflingRogue] = "monster/items/halfling rogue/HalflingRogue";
MonsterConfig[monster_id.HalflingSlinger] = "monster/items/halfling slinger/HalflingSlinger";
MonsterConfig[monster_id.IceGolem] = "monster/items/ice golem/IceGolem";
MonsterConfig[monster_id.IronGolem] = "monster/items/iron golem/IronGolem";
MonsterConfig[monster_id.LizardfolkArcher] = "monster/items/lizardfolk archer/LizardfolkArcher";
MonsterConfig[monster_id.LizardfolkGladiator] = "monster/items/lizardfolk gladiator/LizardfolkGladiator";
MonsterConfig[monster_id.LizardfolkScout] = "monster/items/lizardfolk scout/LizardfolkScout";
MonsterConfig[monster_id.LizardfolkSpearman] = "monster/items/lizardfolk spearman/LizardfolkSpearman";
MonsterConfig[monster_id.MagicalFairy] = "monster/items/magical fairy/MagicalFairy";
MonsterConfig[monster_id.NovicePyromancer] = "monster/items/novice pyromancer/NovicePyromancer";
MonsterConfig[monster_id.VileWitch] = "monster/items/vile witch/VileWitch";
MonsterConfig[monster_id.WaterElemental] = "monster/items/water elemental/WaterElemental";

export const MonsterBundleName = "TDGame"