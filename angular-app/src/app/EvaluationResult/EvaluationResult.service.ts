import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import {BlueprintMaster, EvaluationResult} from '../org.usecase.printer';
import 'rxjs/Rx';

import { Designer, Enduser, Printer, RequestBlueprint, CancelRequest, QualityReport} from 'app/org.usecase.printer';

// Can be injected into a constructor
@Injectable()
export class EvaluationResultService {

    private NAMESPACE: string = 'org.usecase.printer.EvaluationResult';
    private DESIGNER: string = 'org.usecase.printer.Designer';
    private PRINTER: string = 'org.usecase.printer.Printer';
    private ENDUSER: string = 'org.usecase.printer.Enduser';
    private QUALITYREPORT: string = 'org.usecase.printer.QualityReport';

    constructor(private dataService: DataService<EvaluationResult>,
                private designerService: DataService<Designer>,
                private enduserService: DataService<Enduser>,
                private printerService: DataService<Printer>,
                private qualityReportService: DataService<QualityReport>) {
    };

    public getAll(): Observable<EvaluationResult[]> {
        return this.dataService.getAll(this.NAMESPACE);
    }

    public getAsset(id: any): Observable<EvaluationResult> {
        return this.dataService.getSingle(this.NAMESPACE, id);
    }

    public getAllDesigners(): Observable<Designer[]> {
        return this.designerService.getAll(this.DESIGNER);
    }

    public getDesigner(id: any): Observable<Designer> {
        return this.designerService.getSingle(this.DESIGNER, id);
    }

    public getAllEndusers(): Observable<Enduser[]> {
        return this.enduserService.getAll(this.ENDUSER);
    }

    public getAllPrinters(): Observable<Printer[]> {
        return this.printerService.getAll(this.PRINTER);
    }

    public updateEvaluationResult(id: any, itemToUpdate: any): Observable<EvaluationResult> {
        return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
    }

    public updateQualityReport(id: any, itemToUpdate: any): Observable<QualityReport> {
        return this.qualityReportService.update(this.NAMESPACE, id, itemToUpdate);
    }

    public returnEndUserPrivateKey() {
      return `-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: OpenPGP v2.0.8
Comment: https://sela.io/pgp/

xcaGBFtMZ4ABEADM4ZCp/WEkudPnF3/yYoT4/Jf3X6wSzSXVAehHzQSn3SWHjEGx
P7F+6OupIt9DMHkauAZsgxM9w6kUYxnAgMRK6g7SCFdl1cITEsVIBn2BQQo77ikX
quDgUm/jczfFNVsg/ii/vKmkNOVUNNjMBOgN40Fg5kN4dQqhhIFRT9xpouFfAOkx
u4a3L0PQZ0Rxb9OWCPENdtnQpL/lBiZdvU30atQ2dU3fEdnmE0iF/uXkYAfx7o5W
Q7pBdbldGBp+YwRGtD38m83c+1DpzxUokp0HYQ4p3H5UW+UJSH0vFBaH2ju5cQ06
HoELnKqMalSofWO55Xf8oQHYDwToJsZPc8vU6CBFmf2kMyoew0coKeAi3QY0eYQ7
Yni8y+b+GdCwdIcM+yferP8RNUmXp3kK3VtNH197ePW6ipMEJ/p1pszoug/91s9v
dr+ag2ZvL/9vyWu0WkYfQBXp8JGrQzH8JvQw+QH9Z2hKqn4Us577Rne7CxtdLDt0
+qFiVksh3YzIZr7+xOT2foJGzYNYL2Sk8iS6uOtqSvnkgWlDh0MO4/wn9HyVW8xU
pls+BF6Hxauib/cHTqVx1Lusc0fFz4WuRXfYlb/KbIM2PrzTIwHReF2QnaTHYOFn
qEvG0aaxUVdMZ5LV9keBFTZe+DICZSMmtyCp58T3CB1S7AtmYmvrvNs/9QARAQAB
/gkDCH/lpRVo/SRyYKe/Owm1ZpZ5q/MMlEgRZFrwhNkoYt8/05t5ZgbFDu4ru3wU
127VUd3plYW8ubjwmjgiNqrkqHPGn/v6D+YmJIIyjgSi5xOTXliiurnE8ElxpS8u
oxhTMqzSAycabG5P0lrTaveEYrYWVftsTY8e6kSoN+Spv/SzkENMEaNxQTj+83j+
dSB03CQMeW7F5vPALguyabMd1nWdC17zaoaxMTnZO+DOoTT4AgTu059bkgCp/Rak
+RkxeMMp7gAjgNMSPBh8cnSRzB/3wzBPl2CSdVOwaDFLHHjFS/yMbLntT30wHg1P
w8Lon0ZhMIO6X4I/0z82gBRdGZ27V4DktC98lRuXLt5LMW0kZJIdRrolw6DNH4nF
hAuM6R8EqUhEwsddo6H8b1RbK+MXAtc5Fcyl+0MBGLV54xehLKdimrPzXHE4a3ZD
iZW/QyeQmchFG7Dlt7bvpEOcf1vUNc87/atrvNa9G0w8Lvhe84rhr0YCwDw8g2iQ
8ZNvGIoHp/NfwBwj2Rqs5nheYlG23lFWkyomPT+sVF9+ZxHI/B+m1LtVbE7x+VCn
Ci0cP2MegnCrmXLdkYt4mTarL1K/+J9iRbaiigvRG72wGpkkWU4maWx8/s5STZFg
c4wMkav+r6EVSTD1DLunUvTdHFrqhVCEqxUynEDug06oJ/gNfn2lxhKDvfsd3mrf
mbop7C/kVWxVZMSR9ONNF3LEHZJOE2ogN+/4SKetQI9cbmixoOG+FQCyV0qz/fXa
l5vSX5h7LeVs90F5eHU8SUO3NcdM0UWYzY81WukKkdCq6x6C4N3nYcfqzT21EhGi
F78mr4AkBSYvbijTzZ0UweTrWgeg2hcehssBxpz6hpmG1znCTyHgwd/psur6Yx17
gL4+fatXToa18si2x/96vYK0wqK7+5a9zAFLwiOOxsFy0LhG3vJ8YR/dcrDRjp2C
KvpHtsPcSUdDvQu7kIILL6NwDa/a6IJlJgbUFXzZVSwcQp00zG9SRJOmeM9+D8uu
WIyauJ7QiHOf63KtE7vyT65IoeYSdoAVn06E7RTx2NtagvV1oVKTBj3cyVR2Nuad
LKkWu7yIpF9txciUh9Z+LN53FBbZ46IkdGJbK8RUutAOVkE5DZ3eU4s6eapKxA6l
Sn9o8TF9Vdpq7OlU9JZhB8KsGXCOLi/fBWQoxyVk4ZQE20GWTN44gpdyw0RxfGLV
Bj5Hi0Q46HcJ9MGH13aVp7t0ffXSdpbOT0m6GLscVoiJ8tTXElV2rSFUk3gtcQ5I
OX1jchCFX0Uo0bxNATXGFG0IpERZWHNM3iXXryujLz0kbhlLj+Ol7X95KFAfG253
Zz45uhm4gsHT7veZxcG+YvGL9aZMp97DroqofEW+uO2zmV2OkXxSziWMlmt4qkUF
+Ddd7fAvOh985e+7a7e/M+AP6uWfT7isVDmGP5nXgFBc2kaoSY6mqFGYLZEzXnFs
uRT/ajxQliUyOALz2t8zt0KuwWv2Uarm5FJ3OEIWSu0AECzqPObOuQ1GxNu0c/xw
NB6Muz7mecM2xmdYHSk9Z2CvItQeyAYoGSfWcrtf9h60O2zOUo2uB4PSy0euWDQg
oZbQ/f5BolFZgtfvT6u8lea+021H61oK/AzlXpSPVE5nbjLanyoWOdcQ8+FJcgiH
Vm9mW5Ek0xd20tWPFUNRjliqtrwS9Y4lqXHWVMT9LcsfZHa8uTUf6ywQKaxftXSv
GuBnU8aNEWSr3gphrnru+Vu5LKvXG1RoHNPJUaEWysL7FoUvSwSCe9PNCEVuZCBV
c2VywsFwBBMBCgAaBQJbTGeAAhsvAwsJBwMVCggCHgECF4ACGQEACgkQCB3b3+Sz
+BRHjBAAoATdW/Wfwh84M+01AXa2P2nAWyCqRmNiv6OC0jPfLDfpQ1FeVIKWwRN5
+hG8uj8pCbtVlA1vLcAJf+TfvMoUuFCR+vOxE7V1TTIaaX0NkGykOv53vL2nu1eL
ioXdorDLxL5yFtFBVdG1dXaR1EDmBrtbPix5JdyByrycKod+VOfzeEP6AgwJOrww
Bniv7+74pjQM+NSePar7vcjMRaYllMmTSxsRavNH4vbaqJRWwmOyRlGDmux8QAlQ
XZ7I+v+jZJqDOm3aieyCYB3Pi4dLbkIzuA//z7A3qW4yOcwNjzJt1sLjCfK0shb6
P2EZitIepuRkQuCMfaThVlKMIIr/jn0Esa9ZLuJpaBStIpQEsfvN1QMDsIGGA+8T
UV9ibuefLCmulpUf63ROVHiYccYeZZWdl0xc1QWknxB6IrrO2aUvriSiD3yXdroW
m+6LMPleauKX3wG2VoacwqOzjnugCO9IX023TqdHQfMaYDSEuz5MJLv+wh2V7Pvf
g7CMxkzOevB3AcyRaprdcF89Xs4yd0Cy9MHiod5hTrRb/jESDHuTUZI8AXvKJxmG
gPLCPcdjhuUaXnBF8vzruZvMh0xWAibQhM+m9EMAnFP7PklIz+DjjOpCuYy+mkUC
yYlk8XcSKazCWoffQ7G+6//LvlJtVBJKnPlOSs+bL3JLaMbspZXHwwYEW0xngAEI
AMFgV4dI7di8fLYuyQgr1YWs0gb+R8JAz2TlO8mMXVDsQmjTKTIlvY9WFVUV0YsC
P0+CbkRnYjTru/GftPW2wHe8rC7c677g0rE9+l4vEk1rKufzf2pZLlwuWYh6z4f+
PzypdW0ozrXPahtSbuz0eaN3drtLldBMOMW1ePHdOze7C+c0pokcf6TZf7SVI2U0
v4C9VGGhBdxtbC1zZWVsLiqycxb1jRdP2viKE8xyu/D1TqNb9XNMn/oU2YsxZzzH
hiHp6oUJZsroctD3vy+IkJDVGYHD7YtZbaaDTWJIPu5AoPeTC08Nrjgrvt7COOBL
Vq3p+rd6TpUM158k4q97aUcAEQEAAf4JAwiCNppAlv2AWWAcwl8Stq2cwJHodac6
yMnDNT/7w7HltTyIqlVgCTAfY+ltR3GR6HtJniP8zJIcfa/XKAlnVONaNPPWSc1t
AVzcWpRljrfLmbYNg6XLnfjHd0WGWycCUq9JL671qm8qBJgLOotGgErzVbsnGB9H
yy53qQVP+KwgamXOfQAPUMHqh4I0Otjk0mm6Gor5Tx6i2HEOkyaPkgMl2VuVka8S
c8iKMdId5JeVIz0kkts1vNWygGIKORXBsgdSOr8HuZJq7NAKoetHyh//Podmzlo2
dOurLz17wgBEblPXrIaKj0FirgbrLybfEluEo7J0HmaecVMdv7ZQdJIPdzZ3nKb1
mmlsCWoynr2k4doQwTo4gwK2N0cMGQ4u+2an0JVxwZPRsJr/YH1Io41b8BteYTWv
7UJn2WYeeDaMWMM73pnSk1LJ7yxvoJh56lugbYtzG1vCngrCIvFQYOhjwUDDgpAz
s171kZlGHBviGGTQuoijuraBY1JqNS4G1IrCB/9cRIzs7qGWY9rfUe+Ytb9Mvi2I
jepoBmpCN8NyLUuKW/4gotVXD6MJIVj8kt5j2/+8LXJ6cG3ap4h8NnFy/yU0UQ+S
DWArm0hDODvDnHVJNmmb+TGdme6S7pQyuMGnZ/PrgYt1sYLwkyKlVmUGkuMAqL9t
mxJy3IUWzV3RaHisakCuM5cLohhumq59NSCYhdP0VxirgQcBsMHZSuATd2LYpWwR
tb9sfjo+UynwyLjplFYFgCcX+9IpkNCVzbQuRBv3M/GMCFGnDLssLAFk1514DZ0e
bkZSp35xMK1PpDPnOgUZiRd3Kqr3lar5NoT8fmHznSig8N1lbowJnV2hk++805S9
11wm7LPaHKWuz5uLJh13r2o3y5Q2UkcKuJ554ekoLIK+9Q0ol0T/z1SgTVLpQCrC
woQEGAEKAA8FAltMZ4AFCQ8JnAACGy4BKQkQCB3b3+Sz+BTAXSAEGQEKAAYFAltM
Z4AACgkQK/uThYKWDmYawAf/Y7qEVmOpBN1sQSWTGgClokMU6AuOklCWVG1bpGdV
GYgsycuWN5FE5Veo2YML8KPh4BKOIQbjV+4Yh2WIpiy7igztle8wAL00SOaQvUmw
DnlmQ+wzNO+ALhA8Qb9FSJcDnI9p03Yn8s8/Su6E62t8KCSn4c0J+L6cnC4hiMg5
q0ZnhpzKT81E0LhPaNidVrMZqxlfh/1xadUb5lOMvbkmzZCh8SMSQYD8bk/b5uRv
aKKxFBxy3t3OrPklgVQBldLaWXPZZgTnNk5w0GkXkqpHu0jVDO0CXTw8b+NxKOmH
f6Vx2QKd/KPXFkSCBENCslniVrnB3KEVWME9cv64k4mATHDeD/4+1AwgY9a7nqHd
SdCTSLVMYoIJ7ntJN63iCghEJfU0tsf+0Hg4vR3LKVd/q+WA0E5sUlJ3QoH5zUIr
CUdY8BovrEawlcl4mJRpS8jPfdrX62pAILwubjbgDxo7SNExgz/WtZDKJ6FCK/XD
Gj+PDWGLPy16Cuae5jmG30nVDwfUtBeVP/NlTBi8FwLwfO+3ZNPS0MeOGtiXiE1M
FpH7ttVW4PfJH3iPxDCuvwF3NWpLngrknIh+vXKI4s4pRjd8hy2koo12z8ZzUpEB
JH1PqEPfPUJpbhvJ2LgM9H+ahPe92Lscft6eFzDu9TkCwR3OpO2whLX+Noz9vVdA
h/iitRCBtfi4kG7qlHmizh4pHVFG9K/0XNdPHkyX1OEUyuapABst0ymf//zN89pf
YVWkITgvG4BNUkDyMrMZL4FgauUjeQ5QfR7zv7j8LXt4dd9CD0Cy09yGT9AHya8M
NOgEaqua/w89KeIGxciiziiKWIcrkbf0V0KIBCB/11G7uG/plQid6LFKLmAN5+VC
lu3naj3SGyNivNEiP7NYnjiUqi3KK1RhU4ts0hj+xZamll/XWiAqtQERp8HQ1NYD
3Ldkwojs4LqsosdCs/0gfgzMW9pNZ65U+Xw9taKgiNCYbR7DxWbsJCFOaB/DoslL
VtZO+4+u7tD0VF86yJKJlKLGbDz/vMfDBgRbTGeAAQgAsLj8buj47Pea3OZiM1pn
jM4EP5ZAA/1XSxaaXnmWae7hyjlSwtC2zJ3big4ouozNLrFqs9OOHqSH+ErXlPCL
5/aDpeLovFgcOWlWCt/TR+86tZPXTRR12CL1/8KZACFkLkDT8cDS3WC1eHqT2ww5
mkLGxvCiyGCyz2ekSqPtaW1kTRbcMeApMYmnlJXZPipIbW2OmzaWfPC/y3oCy0EE
pVv4PKVUK7xeANg7CmPbcNiV5hY22T6380ulXWEdhJVTqiurplsjWEQy3/YgDyGA
uKBUnylGLZT7gPxW0zCD47TDhLiEK5ZIsb6q1peI/nHT6RkrOLf3EZCk4szZyGOp
qQARAQAB/gkDCOMwWGxhIIsvYFvxI/4qYLT4Q8XC78wPLBrENPESxPe0zXUeo5An
40nySpyhpMuyyxzkiR3EaFxx5d5iBFJeLgEcsFUuQ4mvsOTCa8MxJ6DJVY1vU1cM
/cizczXSFXu+v2DdmF5ski41AxFKfkOU4kgUHto2cvzDUi8DSXzpVS2d+nrPSjq7
7u1V87DqW9/4yINK0qRr9n6+1axmhXzjpoJZQ7uawMnow0nFpro7qwgWVjE5erHL
UCowljolb21dXFsgstu3JS8+KwKvcHwJ/7FysDoO8WKLrkbi47UaeW2gdTbFCNh/
hRK9eRc/ljRI81ocSfYXyjBRpodCtlVTrKRN7r84Ep/dWRkZhy92tcQKHlRAiKTk
RHduTx1ohdS2SFx7SAvvj0G7QnHDnkGqJWnF9/ZDr0EEh0+Bntoc9Rky4kWPx9Aw
MKXj580afZ41vi2ep1Zg839ESBMKXoTsRh2ir1Sb0pYMpHFrwARZ4782qM3uQUrD
1NF9OEaqvxQglRgTNA+HKxN8mhIVQrCHchNyMYjbhFBxTnBpypk4Vnjgv2vQl+SY
T43M+trD2EAXye5FE02EBKA758GVmb3+gFIINgDgNRQqOUkmcpYTKaHl0xE05l8D
D4u+uZ97N7Xt0Y6d9jdUk8XOQTJ02ov8cxVAs6cHt6+E3h6CqNHGYwwxa6ws/01Q
TmNmQ38mKOg8IqA4QMUigOzdqbeGiY+5q6kSGZkjsZgN2fmBGQIIuTMySfIRgOe+
4QWVau7ZC/iLg3ym7S/0A1eoxWOEft2OC2SmljtFLdqPXB7l8YngqcFtOBs1v9SF
foiTwsOg1LD0aK3uj5jxfNbuWi/6+yiSfzjVsKfOUy7fYLB/SW3UFKYkbYE8TCCF
SnxWsKT2bHGBoMTe0jjLJFs/6nA8MmK8gnWLOZiGk8LChAQYAQoADwUCW0xngAUJ
DwmcAAIbLgEpCRAIHdvf5LP4FMBdIAQZAQoABgUCW0xngAAKCRC9KcAjeT3Jwexn
CACEErwmQv/HXP7j2dqenzKmkmHIDSp+u7HZjOFE+hJSNis5NCaYDS7qb0qN4K/m
UkpptOpp7hDyr03u3dLxbxsSHrHO41gRL0J6awPXyNK5HFMiMPckNwU5pV0JnmfE
WGhj/vv/Yw/DnjN+WgcCt8TOXryE088+NJnK+32TDJncs2ozdC5LFJ66G74vVi4+
WpuWm7LJ0ZmlIdE06nenksd2c3oaqY9Sx6h08R/Wu5DzjYxFhcYnsL33Q3GKlzLa
EmZEdBDJqN4gWKLNz0chNWhkjVweJgtsleDPlGCuIzohYadQv/dyt6JhOOcRAeGC
HSueCj1Hnuatg5ZP1ywFeNTBq7wP+wdGU18Smabya3IOQrn1FXBFAG70K8uMiEcz
SlQz+6Yt2yx35R6RhUHZ9swzZsay/HSHoFe7EC/5pQxBlgjeKY4k09yOWYpIYVZ+
63yWOh4ogTnHlwKa4cPT1/O2n2dYiMNViObxbv3b82NsNVP+LzhGjyButZ0CqBUn
Bs29PdUlvbFfBfND3ITiVECOSkVzxIJvpmZe2g7D1JN2eBpvP64YEL+Kk6WJuju4
6/oLTqCA5pryXVS3B86c0a677Ep21BF6lacqPJ2CfmfSVPAwhomceDh3fc09e02M
AXNgxp0Dqqo8OVPZf5kAuBifE/jpwLrx2Uh4fFKXfCSGNoCgyXYiBHxDB05pJxb4
HFnUG1HOumvKpDcGij/ktWHm8fOnbluWr/YuUAZxGCqPfen5r1NdtPVUrWrUNkD5
IONHtR8uNo1b98A7fMv8/no69f9FcPtOl9YARVzTN69Vn7K7lL94R5+gmoTR889O
g2syaFMQ7TA73F4H1VwMTFeo2DMIoUtmaj06iyNM9aQWx5VkcEbBGJbJyUS9kAir
U6oXCTOSvrzVqE5BvkPoGvm/6Lt12kbg0AIe3mofxqjxuHvi1Bv+beYDwamVEFv6
UGBi7Q/0sfq5iyanu9msOcg63fiyS5BCvLQoM4mbQtjlWKky/Z2UINMQmClBOKom
h/sjaj4X
=h3aq
-----END PGP PRIVATE KEY BLOCK-----`;
    }
}
