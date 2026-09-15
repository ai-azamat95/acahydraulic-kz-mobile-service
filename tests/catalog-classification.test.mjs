import assert from 'node:assert/strict';
import test from 'node:test';
import { detectCategory } from '../scripts/catalog-classification.mjs';
test('part identity takes precedence over broad tags and compatible equipment',()=>{
 const cases=[
 ['Electric grass trimmer', ['Hydraulic Pump'],'other-parts'],
 ['Hydraulic Pump Harness for Hitachi ZX200',['Hydraulic Pump'],'electrical'],
 ['Hydraulic Pump Solenoid Valve for CAT',['Hydraulic Pump'],'electrical'],
 ['Hydraulic Pump Drive Shaft for Hitachi',['Hydraulic Pump'],'pump-parts'],
 ['K5V200 Hydraulic Pump Parts for Volvo',['Hydraulic Pump'],'pump-parts'],
 ['D7E Engine Cylinder Block for Deutz',['Hydraulic Pump'],'engine-fuel'],
 ['Hydraulic Motor Flow Control Valve w/Relief',['Hydraulic Motor'],'control-valves'],
 ['Fuel Injection Pump for D6D Engine',['Hydraulic Pump'],'engine-fuel'],
 ['K5V160DT Hydraulic Pump for SANY SY365H',[],'hydraulic-pumps'],
 ['TM60 Final Drive Travel Motor for EC360',['Hydraulic Motor'],'final-drives'],
 ['Seal Kit for Hydraulic Pump',['Hydraulic Pump'],'seals-filters'],
 ];
 for (const [title,tags,expected] of cases) assert.equal(detectCategory({title,tags}),expected,title);
});
