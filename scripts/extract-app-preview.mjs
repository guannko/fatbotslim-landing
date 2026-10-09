// Render a read-only snapshot of the actual HomeScreen with fictional fixture data.
// Does not import the app's API client, run effects, connect to services or edit app files.
import {createRequire} from 'node:module';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
const appRoot=process.argv[2];
if(!appRoot)throw new Error('Pass the existing FatBotSlim app directory.');
const requireApp=createRequire(path.join(appRoot,'package.json'));
const babel=requireApp('@babel/core'),React=requireApp('react'),RN=requireApp('react-native-web');
const {renderToStaticMarkup}=requireApp('react-dom/server');
const plugins=[[requireApp('@babel/plugin-transform-typescript'),{isTSX:true,allExtensions:true}],[requireApp('@babel/plugin-transform-react-jsx'),{runtime:'automatic'}],requireApp('@babel/plugin-transform-modules-commonjs')];
function evaluate(source,filename,dependencies){const result=babel.transformSync(source,{filename,configFile:false,babelrc:false,plugins});const module={exports:{}};new Function('require','module','exports',result.code)(name=>{if(Object.hasOwn(dependencies,name))return dependencies[name];if(name==='react/jsx-runtime')return requireApp(name);throw new Error(`Unexpected dependency: ${name}`);},module,module.exports);return module.exports;}
const native={...RN,Dimensions:{get:()=>({width:390,height:844,scale:1,fontScale:1})}};
const theme=evaluate(await readFile(path.join(appRoot,'constants/theme.ts'),'utf8'),'theme.ts',{'react-native':native});
const {translations}=evaluate(await readFile(path.join(appRoot,'constants/i18n.ts'),'utf8'),'i18n.ts',{});
const source=await readFile(path.join(appRoot,'app/tabs/index.tsx'),'utf8');
const sourceHash=createHash('sha256').update(source).digest('hex');
const fixture=[{id:'demo-breakfast',meal_category:'breakfast',meal_name:'Breakfast example',calories:420,protein:22,fat:14,carbs:50},{id:'demo-lunch',meal_category:'lunch',meal_name:'Lunch example',calories:610,protein:40,fat:22,carbs:63},{id:'demo-snack',meal_category:'snack',meal_name:'Snack example',calories:180,protein:9,fat:6,carbs:23}];
let fixtureUsed=false;
const react={...React,useState:initial=>{if(Array.isArray(initial)&&!fixtureUsed){fixtureUsed=true;return React.useState(fixture);}return React.useState(initial);}};
const fail=()=>{throw new Error('Network and persistence are forbidden in app UI extraction.');};
globalThis.fetch=fail;
const {default:Home}=evaluate(source,'Home.tsx',{'react':react,'react-native':native,'react-native-safe-area-context':{SafeAreaView:RN.View},'expo-router':{useRouter:()=>({push:fail})},'expo-status-bar':{StatusBar:()=>null},'@react-navigation/core':{useFocusEffect:()=>{}},'expo-notifications':{},'@react-native-async-storage/async-storage':{},'../../constants/theme':theme,'../../lib/LanguageContext':{useLang:()=>({t:key=>translations.en[key]||key})},'../../lib/UserContext':{useUser:()=>({session:{user:{id:'fictional-preview'}},client:{language:'en',name:'Alex',calories_target:2000,protein_target:120,fat_target:65,carbs_target:230},loading:false})},'../../lib/supabase':{getLogRange:fail,getTodayWater:fail,addWater:fail,WATER_GOAL_ML:2000},'../../lib/cache':{cacheGet:fail,cacheSet:fail,cacheKey:fail,TTL:{}}});
const markup=renderToStaticMarkup(React.createElement(Home));
const styles=RN.StyleSheet.getSheet().textContent;
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="390" height="844" viewBox="0 0 390 844"><title>Current app HomeScreen, web-rendered with fictional demo data</title><foreignObject width="390" height="844"><div xmlns="http://www.w3.org/1999/xhtml" style="width:390px;height:844px;overflow:hidden;background:#070B12"><style>${styles}</style>${markup}</div></foreignObject></svg>`;
if(/https?:\/\//.test(markup))throw new Error('Unexpected remote URL in generated markup.');
await writeFile('site/assets/app-home-preview.svg',svg);
await writeFile('site/assets/app-home-preview.provenance.json',JSON.stringify({source:'FatBotSlim/app/tabs/index.tsx',sourceHash,render:'React Native Web server rendering; effects not run; no services connected',data:'Fictional Alex account and illustrative meal totals; not nutritional advice',capturedAt:new Date().toISOString()},null,2));
console.log('Extracted actual HomeScreen to app-home-preview.svg; source app unchanged.');
