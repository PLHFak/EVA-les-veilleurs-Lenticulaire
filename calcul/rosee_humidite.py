import numpy as np
from scipy.optimize import brentq
SIG=5.67e-8; eps=0.837
def psat(T): return 611.2*np.exp(17.62*T/(243.12+T))     # Pa, T en C (Magnus, OMM)
def Td(T,RH):
    g=np.log(RH)+17.62*T/(243.12+T); return 243.12*g/(17.62-g)
def rho_v(T,RH): return RH*psat(T)/(461.5*(T+273.15))*1000  # g/m3
def eps_sky(Tdp): return 0.711+0.56*Tdp/100+0.73*(Tdp/100)**2  # Berdahl & Martin 1984, ciel clair
def Ts_night(Ta,RH,v,Fsky=0.5):
    TaK=Ta+273.15; Tsky=TaK*eps_sky(Td(Ta,RH))**0.25
    h=4+4*v
    f=lambda Ts: h*(TaK-Ts)+eps*SIG*(1-Fsky)*(TaK**4-Ts**4)-eps*SIG*Fsky*(Ts**4-Tsky**4)
    return brentq(f,TaK-30,TaK)-273.15, Tsky-273.15
print("Point de rosee (Magnus):")
for T,RH in ((35,0.4),(35,0.5),(25,0.7),(15,0.8),(15,0.9),(10,0.85),(5,0.9),(20,0.5)):
    print(f"  T={T} RH={RH:.0%}: psat={psat(T):.0f} Pa, Td={Td(T,RH):.1f} C, rho_v={rho_v(T,RH):.1f} g/m3")
print("\nNuit claire: refroidissement de la surface du verre sous l'air (K) et HR seuil de rosee")
for Ta in (15,5):
    for v in (0,0.5,1,2,3,4,6):
        ts,tsky=Ts_night(Ta,0.85,v)
        dep=Ta-ts
        # HR seuil: Td(Ta,RH)=ts
        rh=brentq(lambda r: Td(Ta,r)-Ts_night(Ta,r,v)[0],0.3,0.9999)
        print(f"  Ta={Ta} v={v}: Tciel={tsky:.1f}, Ts={ts:.1f} (-{dep:.1f} K) ; rosee si HR > {rh:.0%}")
# ---------- humidite dans la cavite etanche
A=3.6; mL=A*0.003*1190
print("\nmasse PMMA",mL,"kg ; eau a 0,6% :",mL*6,"g ; a 1,2% :",mL*12,"g ; a 2,1% :",mL*21,"g")
Vfilm=A*(0.00015+0.0001)*1000; Vcadre=7.6*0.008*0.004*1000+1.0
V=Vfilm+Vcadre
print("volume d'air films",Vfilm,"L ; cadre ~",Vcadre,"L ; total",V,"L ; eau vapeur a 20C/50%:",V/1000*rho_v(20,0.5),"g")
print("tamis 3A necessaire (18,5%) pour 77 g:",77/0.185,"g ; pour 20 g/an x 10 ans:",200/0.185)
# permeation joint
per=7.6; hj=0.004; dj=0.010; Aj=per*hj
pv_test=0.9*psat(23); pv_site=0.82*psat(11)
print("aire joint",Aj,"m2 ; pv essai",pv_test,"site",pv_site,"ratio",pv_site/pv_test)
for nom,lo,hi in (("PIB/butyl",1,1.5),("polyurethane",3,4),("polysulfure",4,10),("silicone",15,25)):
    f=lambda m: m*Aj*(0.002/dj)*(pv_site/pv_test)*365
    cap=500*0.185
    print(f"  {nom}: {f(lo):.1f}-{f(hi):.1f} g/an ; 500 g de tamis ({cap:.0f} g d'eau) -> {cap/f(hi):.0f}-{cap/f(lo):.0f} ans")
# respiration
for dT in (15,25):
    dV=V*dT/293
    print(f"respiration dT={dT}K: {dV:.2f} L/cycle -> {dV/1000*rho_v(15,0.82)*365:.2f} g/an (air 15C/82%: {rho_v(15,0.82):.1f} g/m3)")
V2=A*0.020*1000
print("lame 2x10 mm: volume",V2,"L ; respiration 25K:",V2*25/293,"L/cycle ->",V2*25/293/1000*rho_v(15,0.82)*365,"g/an ; surpression si rigide:",101325*25/293,"Pa ->",101325*25/293*A/1000,"kN sur le vitrage")
# temps de sechage par les bords a travers le film
Dv=2.5e-5; d=0.00015; cs_air=rho_v(20,1)/1000   # kg/m3 par unite d'activite
cap_pmma=0.003*1190*0.021                      # kg/m2 par unite d'activite (lineaire jusqu'a 2,1%)
Rf=cap_pmma/(d*cs_air); L=0.9
print("facteur de retard",Rf,"; tau = 4 L^2 R /(pi^2 D) =",4*L*L*Rf/(np.pi**2*Dv)/3.15e7,"ans")
# sechage a travers l'epaisseur (etuvage)
for T,D in ((23,5e-13),(60,5e-12)):
    print(f"sechage a coeur (plaque 3 mm, 2 faces) a {T}C: tau = e^2/(pi^2 D) = {0.003**2/(np.pi**2*D)/3600:.0f} h")
# dilatation
for dT in (25,30,-30):
    print(f"dT={dT}: PMMA {2000*70e-6*dT:.1f} mm, verre {2000*9e-6*dT:.2f} mm, differentiel {2000*61e-6*dT:.1f} mm sur 2 m")
print("depression hiver (assemblage 20C -> -10C), cavite etanche rigide:",101325*30/293,"Pa")
# choc froid
print("choc froid: PMMA 45C activite 0,5 -> pv",0.5*psat(45),"Pa, Td",Td(45,0.5)," ; activite 0,1 -> Td",Td(45,0.1))
# vent a 2 m
for v10 in (2,3,4.8,7.1): print("v10",v10,"-> v(2m) =",v10*(2/10)**0.14)
# sel
for q in (10,30):
    V_an=q*8760; 
    for c in (10,50): print(f"debit {q} m3/h -> {V_an:.0f} m3/an ; sel a {c} ug/m3: {V_an*c*1e-6:.2f} g/an traversant")
# inertie
C=mL*1470+2*A*0.008*2500*720
print("C kJ/K",C/1000,"tau (v=0, h~9.5/face)",C/(2*9.5*A)/60,"min ; v=4:",C/(2*25.5*A)/60)
