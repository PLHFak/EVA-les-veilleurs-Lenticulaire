import numpy as np, pandas as pd, json, pvlib
import bilan_thermique as m2
df=pd.read_pickle('jour_juillet.pkl')
df=df[(df.index.hour>=5)&(df.index.hour<=22)].iloc[::3]   # pas de 30 min
h=df.index.hour+df.index.minute/60
Ta=28+7*np.cos(2*np.pi*(h-16.5)/24)
rows=[]
for (t,r),ta,hh in zip(df.iterrows(),Ta,h):
    G,Gb=r['terre'],r['mer']
    a0=m2.sandwich(G,Gb,ta,0)['TL']; a2=m2.sandwich(G,Gb,ta,2)['TL']
    b0=m2.ventile(G,Gb,ta,0,phi_in=0.2,phi_out=0.5,N=40)['TLmax']; b2=m2.ventile(G,Gb,ta,2,phi_in=0.2,phi_out=0.5,N=40)['TLmax']
    rows.append(dict(h=round(float(hh),2),terre=round(float(G)),mer=round(float(Gb)),air=round(float(ta),1),A0=round(float(a0),1),A2=round(float(a2),1),B0=round(float(b0),1),B2=round(float(b2),1),az=round(float(r['az'])),el=round(float(r['el']))))
d=pd.DataFrame(rows); print(d.to_string())
for k in ('A0','A2','B0','B2','terre','mer','air'):
    i=d[k].idxmax(); print(k,'max',d.loc[i,k],'a',d.loc[i,'h'],'air',d.loc[i,'air'],'terre',d.loc[i,'terre'],'mer',d.loc[i,'mer'])
json.dump(rows,open('day.json','w'))
# cas enveloppe ancien: 800 W/m2 & 35 -> rappel
print('septembre 820 W/m2, 25C:',m2.sandwich(820,60,25,0)['TL'],m2.ventile(820,60,25,0,phi_in=0.2,phi_out=0.5)['TLmax'])
# UV
try:
    sp=pvlib.spectrum.get_reference_spectra(standard='ASTM G173-03')
    g=sp['global']; wl=g.index.values
    tot=np.trapezoid(g.values,wl)
    f=lambda a,b: np.trapezoid(g.values[(wl>=a)&(wl<=b)],wl[(wl>=a)&(wl<=b)])
    print('G173 global total',tot,'UV 280-380',f(280,380),'380-400',f(380,400),'280-400',f(280,400),'400-420',f(400,420),'315-400',f(315,400),'280-315',f(280,315))
    print('fractions %',100*f(280,380)/tot,100*f(380,400)/tot,100*f(280,400)/tot)
except Exception as e: print('spectre indisponible',e)
