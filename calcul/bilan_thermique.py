import numpy as np
from scipy.optimize import fsolve
SIG=5.67e-8
# ---------- donnees
tg,rg,ag = 0.81,0.08,0.11      # 44.2 extra-clair (deduit de TL 91 / g 0,84, EN 410)
tL,rL,aL = 0.82,0.08,0.10      # PMMA 3 mm clair (deduit de g 0,85)
lam_g,lam_pvb,lam_L,lam_a = 1.0,0.20,0.19,0.0271
e_g,e_pvb,e_L = 0.008,0.00076,0.003
R_g = e_g/lam_g+e_pvb/lam_pvb    # 0.0118
R_L = e_L/lam_L                  # 0.0158
eps_g,eps_L = 0.837,0.90
mu,rho,cp,g = 1.91e-5,1.127,1007.,9.81
H,W = 1.8,2.0

def solar(G,Gb,aLx=aL):
    """flux absorbes par couche (verre av., lenticulaire, verre arr.), inter-reflexions incluses"""
    t=[tg,1-rL-aLx,tg]; r=[rg,rL,rg]; a=[ag,aLx,ag]
    # inconnues F1,F2,F3 (vers l'arriere, apres couche k) ; B0,B1,B2 (vers l'avant, avant couche k)
    # F_k = t_k F_{k-1} + r_k B_k ; B_{k-1} = r_k F_{k-1} + t_k B_k ; F0=G ; B3=Gb
    A=np.zeros((6,6)); b=np.zeros(6)  # x=[F1,F2,F3,B0,B1,B2]
    F=lambda k:k-1; B=lambda k:3+k
    for k in (1,2,3):
        # F_k - t F_{k-1} - r B_k = 0
        A[k-1,F(k)]=1
        if k==1: b[k-1]+=t[0]*G
        else: A[k-1,F(k-1)]=-t[k-1]
        if k==3: b[k-1]+=r[2]*Gb
        else: A[k-1,B(k)]=-r[k-1]
        # B_{k-1} - r F_{k-1} - t B_k = 0
        A[2+k,B(k-1)]=1
        if k==1: b[2+k]+=r[0]*G
        else: A[2+k,F(k-1)]=-r[k-1]
        if k==3: b[2+k]+=t[2]*Gb
        else: A[2+k,B(k)]=-t[k-1]
    x=np.linalg.solve(A,b); Fv=[G,x[0],x[1],x[2]]; Bv=[x[3],x[4],x[5],Gb]
    return [a[k]*(Fv[k]+Bv[k+1]) for k in range(3)], Fv, Bv

def hce(v): return 4+4*v
def qrad_ext(Ts,Trad): return eps_g*SIG*(Ts**4-Trad**4)
def hr_gap(T1,T2,e1=eps_g,e2=eps_L): return SIG*(T1**2+T2**2)*(T1+T2)/(1/e1+1/e2-1)

def sandwich(G,Gb,Ta,v,d1=0.00015,d2=0.0001,aLx=aL,Trad=None):
    Ta+=273.15; Trad=Ta if Trad is None else Trad+273.15
    S,_,_=solar(G,Gb,aLx); h=hce(v)
    def f(x):
        Ts1,T1,TL,T2,Ts2=x
        Rf=R_g/2+1/(lam_a/d1+hr_gap(T1,TL))+R_L/2
        Rb=R_g/2+1/(lam_a/d2+hr_gap(T2,TL))+R_L/2
        qf=(TL-T1)/Rf; qb=(TL-T2)/Rb
        q1=(T1-Ts1)/(R_g/2); q2=(T2-Ts2)/(R_g/2)
        return [q1-h*(Ts1-Ta)-qrad_ext(Ts1,Trad), qf+S[0]-q1, S[1]-qf-qb, qb+S[2]-q2, q2-h*(Ts2-Ta)-qrad_ext(Ts2,Trad)]
    x=fsolve(f,[Ta+8]*5)
    return dict(S=S,Ts1=x[0]-273.15,T1=x[1]-273.15,TL=x[2]-273.15,T2=x[3]-273.15,Ts2=x[4]-273.15)

def ventile(G,Gb,Ta,v,b=0.010,phi_in=1.0,phi_out=1.0,dCp=0.0,closed=False,N=120,aLx=aL,Cd=0.6):
    Ta+=273.15; S,_,_=solar(G,Gb,aLx); h=hce(v)
    hch=7.54*lam_a/(2*b)
    dz=H/N
    def run(u):
        m=rho*abs(u)*b
        Ta1=Ta2=Ta; out=[]; dT=0; qv=0; x0=[Ta+8]*7
        for i in range(N):
            def f(x):
                Ts1,T1,Ti1,TL,Ti2,T2,Ts2=x   # Ti: face interne des verres ; TL: lenticulaire (isotherme, Bi<<1 a ces flux)
                q1=(T1-Ts1)/(R_g/2); q2=(T2-Ts2)/(R_g/2)
                qr1=hr_gap(TL,Ti1)*(TL-Ti1); qr2=hr_gap(TL,Ti2)*(TL-Ti2)
                if closed:
                    qc1=lam_a/b*(TL-Ti1); qc2=lam_a/b*(TL-Ti2)
                    return [q1-h*(Ts1-Ta)-qrad_ext(Ts1,Ta), (Ti1-T1)/(R_g/2)+S[0]-q1, qr1+qc1-(Ti1-T1)/(R_g/2),
                            S[1]-qr1-qc1-qr2-qc2, qr2+qc2-(Ti2-T2)/(R_g/2), (Ti2-T2)/(R_g/2)+S[2]-q2, q2-h*(Ts2-Ta)-qrad_ext(Ts2,Ta)]
                return [q1-h*(Ts1-Ta)-qrad_ext(Ts1,Ta), (Ti1-T1)/(R_g/2)+S[0]-q1, qr1-hch*(Ti1-Ta1)-(Ti1-T1)/(R_g/2),
                        S[1]-qr1-hch*(TL-Ta1)-qr2-hch*(TL-Ta2), qr2-hch*(Ti2-Ta2)-(Ti2-T2)/(R_g/2), (Ti2-T2)/(R_g/2)+S[2]-q2, q2-h*(Ts2-Ta)-qrad_ext(Ts2,Ta)]
            x=fsolve(f,x0); x0=x
            Ts1,T1,Ti1,TL,Ti2,T2,Ts2=x
            if not closed:
                n=2*hch*dz/(m*cp)
                Tw1=(Ti1+TL)/2; Tw2=(Ti2+TL)/2
                a1=Tw1+(Ta1-Tw1)*np.exp(-n); a2=Tw2+(Ta2-Tw2)*np.exp(-n)
                qv+=m*cp*((a1-Ta1)+(a2-Ta2)); dT+=((a1+Ta1)/2-Ta+(a2+Ta2)/2-Ta)/2*dz
                Ta1,Ta2=a1,a2
            out.append((TL-273.15,Ta1-273.15,Ti1-273.15,Ts1-273.15))
        return np.array(out),dT/H,qv/H
    if closed:
        o,_,_=run(0.1); return dict(TLmax=o[:,0].max(),TLmoy=o[:,0].mean(),u=0,qv=0,S=S)
    zeta=(1/(Cd*phi_in))**2+(1/(Cd*phi_out))**2
    u=0.2
    for it in range(80):
        o,dTm,qv=run(u)
        dp=rho*g*H*dTm/(Ta+dTm)+dCp*rho*v**2/2
        A=zeta*rho/2; Bc=12*mu*H/b**2
        un=(-Bc+np.sqrt(Bc*Bc+4*A*max(dp,1e-6)))/(2*A)
        if abs(un-u)<1e-4: break
        u=0.5*u+0.5*un
    return dict(TLmax=o[:,0].max(),TLmoy=o[:,0].mean(),TLbas=o[2,0],Tair_out=o[-1,1],u=u,qv=qv,S=S,dp=dp,
                debit=u*b*W*2*3600)

if __name__=="__main__":
    np.set_printoptions(precision=1,suppress=True)
    print("R_g",R_g,"R_L",R_L)
    for G,Gb in ((600,100),(800,100)):
        S,F,B=solar(G,Gb)
        print(f"\nG={G} Gb={Gb}: absorbe verre av {S[0]:.0f}, lenticulaire {S[1]:.0f}, verre arr {S[2]:.0f} W/m2 ; total {sum(S):.0f} W/m2 = {sum(S)*H*W:.0f} W ; transmis vers l'arriere {F[3]:.0f}, renvoye vers l'avant {B[0]:.0f}")
        for v in (0,2,4):
            s=sandwich(G,Gb,35,v); s1=sandwich(G,Gb,35,v,d1=0.001,d2=0.001)
            c=ventile(G,Gb,35,v,closed=True)
            a=ventile(G,Gb,35,v); b2=ventile(G,Gb,35,v,phi_in=0.2,phi_out=0.5); b3=ventile(G,Gb,35,v,phi_in=0.1,phi_out=0.5)
            w=ventile(G,Gb,35,v,phi_in=0.2,phi_out=0.5,dCp=0.3)
            print(f" v={v}: S1 sandwich TL={s['TL']:.1f} (verre ext {s['Ts1']:.1f}/{s['Ts2']:.1f}) ; jeu 1mm {s1['TL']:.1f} | lame 10 fermee {c['TLmax']:.1f} | S2 fentes pleines max {a['TLmax']:.1f} moy {a['TLmoy']:.1f} u={a['u']:.2f} | S2 petites entrees(20%) max {b2['TLmax']:.1f} moy {b2['TLmoy']:.1f} u={b2['u']:.3f} debit {b2['debit']:.0f} m3/h qv {b2['qv']:.0f} | 10% max {b3['TLmax']:.1f} u={b3['u']:.3f} | +vent dCp0.3: max {w['TLmax']:.1f} u={w['u']:.2f} debit {w['debit']:.0f}")
    print("\nSensibilite absorptance lenticulaire (salissure, jaunissement, film), G=800, v=0")
    for a_ in (0.06,0.10,0.20,0.40):
        s=sandwich(800,100,35,0,aLx=a_); c=ventile(800,100,35,0,phi_in=0.2,phi_out=0.5,aLx=a_)
        print(f"  aL={a_}: sandwich {s['TL']:.1f} ; ventile {c['TLmax']:.1f}")
