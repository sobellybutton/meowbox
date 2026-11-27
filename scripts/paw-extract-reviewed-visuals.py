from pathlib import Path
from PIL import Image
import numpy as np
from scipy import ndimage
import json, hashlib, io, sys
ROOT=Path(sys.argv[1] if len(sys.argv)>1 else '.')
SRC='assets/visual/staging/2026-11-27-production-sources/'
DST='assets/visual/staging/2026-11-27-extracted/'
rows=json.loads((ROOT/(SRC+'manifest.json')).read_text())['assets']
lookup={Path(a['path']).stem:a for a in rows}
plan={}
ids=[1,0,2,3]
social=[[(300,11,418,259),(620,11,822,259),(998,13,1103,259)],[(305,279,441,531),(636,279,813,530),(987,284,1109,529)],[(296,547,425,789),(629,547,820,789),(1005,549,1111,789)],[(288,812,428,1072),(614,813,820,1072),(1001,812,1115,1072)]]
ritual=[[(273,12,470,277),(658,21,786,261),(1015,13,1186,261)],[(270,282,458,544),(659,289,793,531),(1012,283,1172,535)],[(271,547,475,809),(642,559,789,795),(1007,547,1169,800)],[(249,814,470,1075),(657,823,794,1066),(1009,816,1176,1069)]]
for name,boxes,kinds in [('original-four-social-poses',social,['wave','open-arms','celebrate']),('original-four-ritual-seated-poses',ritual,['seated','kneel-prayer','bow'])]:
 plan[name]=[(f'players/{id}/{kind}.webp',box) for id,row in zip(ids,boxes) for kind,box in zip(kinds,row)]
plan['resident-visitor-candidates']=[(f'residents/{name}.webp',box) for name,box in zip(['grandma-cooking','gossip-auntie','temple-keeper','fortune-teller','boba-keeper','arcade-keeper','office-worker','camera-tourist'],[(85,38,332,501),(413,15,685,503),(791,39,1018,501),(1086,32,1381,496),(82,550,344,1063),(418,546,698,1063),(795,551,988,1065),(1101,546,1367,1064)])]
plan['environment-props']=[(f'environment/{name}.webp',box) for name,box in [('wood-wall-lantern',(236,44,404,225)),('lantern-string',(732,34,1130,195)),('noren-indigo',(10,290,353,472)),('noren-coral',(371,291,704,469)),('noren-wisteria',(722,288,1044,467)),('chime-sakura',(1067,233,1171,491)),('chime-maple',(1199,235,1303,484)),('chime-paw',(1332,234,1435,484)),('prayer-string',(12,501,408,658)),('window-square',(514,879,643,1034)),('window-wide',(662,891,868,1013)),('window-round',(879,860,1053,1042)),('banner-indigo',(1078,838,1183,1070)),('banner-sakura',(1200,836,1304,1070)),('banner-maple',(1320,833,1428,1070))]]
records=[]
for source,items in plan.items():
 a=lookup[source]; raw=(ROOT/a['path']).read_bytes(); assert hashlib.sha256(raw).hexdigest()==a['sha256']
 im=Image.open(io.BytesIO(raw)); assert im.mode=='RGBA' and im.size==(1448,1086)
 for path,(x0,y0,x1,y1) in items:
  rect=(max(0,x0-3),max(0,y0-3),min(im.width,x1+3),min(im.height,y1+3))
  arr=np.array(im.crop(rect)); labels,n=ndimage.label(arr[:,:,3]>45);counts=np.bincount(labels.ravel());counts[0]=0
  assert counts.max()>1000
  mask=ndimage.binary_dilation(labels==counts.argmax(),iterations=3)
  arr[~mask,3]=0
  crop=Image.fromarray(arr,'RGBA'); bb=crop.getchannel('A').getbbox(); assert bb
  crop=crop.crop(bb); canvas=Image.new('RGBA',(crop.width+12,crop.height+12));canvas.paste(crop,(6,6))
  assert canvas.getchannel('A').getbbox()==(6,6,canvas.width-6,canvas.height-6)
  buf=io.BytesIO();canvas.save(buf,format='WEBP',lossless=True,method=6);data=buf.getvalue(); p=ROOT/(DST+path);p.parent.mkdir(parents=True,exist_ok=True)
  assert not p.exists() or p.read_bytes()==data, f'conflict {p}'
  p.write_bytes(data)
  records.append(dict(path=DST+path,source=a['path'],source_sha256=a['sha256'],crop=list(rect),width=canvas.width,height=canvas.height,sha256=hashlib.sha256(data).hexdigest(),status='extracted candidate; requires identity, anchors and rendered acceptance'))
assert len(records)==47
out=ROOT/(DST+'manifest.json');out.write_text(json.dumps({'version':1,'assets':records},indent=2)+'\n')
print('Extracted',len(records),'transparent assets')
