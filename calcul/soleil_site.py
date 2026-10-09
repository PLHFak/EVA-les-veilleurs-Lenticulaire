import numpy as np, pandas as pd, pvlib, json
lat,lon=51.17357,2.78028
# axe de la cote : Nieuwpoort (51.155,2.72) -> Ostende (51.237,2.915)
dlat=(51.237-51.155)*111.2; dlon=(2.915-2.72)*111.32*np.cos(np.radians(51.2))
axe=np.degrees(np.arctan2(dlon,dlat)); print("axe de la digue (azimut)",axe, "normales: mer",axe+270,"terre",axe+90)
az_mer=(axe+270)%360; az_terre=(axe+90)%360
loc=pvlib.location.Location(lat,lon,tz='Europe/Brussels',altitude=8)
def day(date,albedo=0.25,tl=3.0):
    t=pd.date_range(date+' 04:00',date+' 23:00',freq='10min',tz='Europe/Brussels')
    sp=loc.get_solarposition(t)
    cs=loc.get_clearsky(t,model='ineichen',linke_turbidity=tl)
    out={}
    for nom,az in (('mer',az_mer),('terre',az_terre)):
        irr=pvlib.irradiance.get_total_irradiance(90,az,sp['apparent_zenith'],sp['azimuth'],cs['dni'],cs['ghi'],cs['dhi'],albedo=albedo,model='haydavies',dni_extra=pvlib.irradiance.get_extra_radiation(t))
        out[nom]=irr['poa_global'].fillna(0)
        out[nom+'_dir']=irr['poa_direct'].fillna(0)
    df=pd.DataFrame(out); df['el']=sp['apparent_elevation']; df['az']=sp['azimuth']; df['ghi']=cs['ghi']
    return df
for d in ('2026-06-21','2026-07-20','2026-08-10','2026-04-15','2026-09-15','2026-12-21'):
    df=day(d)
    for f in ('mer','terre'):
        i=df[f].idxmax(); print(d,f,'max %.0f W/m2 a %s (direct %.0f, hauteur %.0f, azimut %.0f) ; energie jour %.2f kWh/m2'%(df[f].max(),i.strftime('%H:%M'),df.loc[i,f+'_dir'],df.loc[i,'el'],df.loc[i,'az'],df[f].sum()/6/1000))
# annuel ciel clair
tot={'mer':0,'terre':0,'ghi':0}
for d in pd.date_range('2026-01-01','2026-12-31',freq='5D'):
    df=day(d.strftime('%Y-%m-%d'))
    for k in tot: tot[k]+=df[k].sum()/6/1000*5
print("annuel ciel clair kWh/m2:",tot)
df=day('2026-07-20'); df.to_pickle('jour_juillet.pkl')
